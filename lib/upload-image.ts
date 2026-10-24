import { getUploadSignatureAction } from "@/app/admin/(panel)/posts/actions"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_INPUT_SIZE = 15 * 1024 * 1024
const MAX_DIMENSION = 2000
const WEBP_QUALITY = 0.85

export type UploadedImage = { url: string; width: number; height: number }

// Yüklemeden önce görseli küçültür ve WebP'ye çevirir: telefon fotoğrafı
// birkaç MB'tan yüzlerce KB'a düşer, yükleme hızlanır, depolama küçülür.
async function shrink(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
    )
    // küçülmediyse veya dönüşüm başarısızsa orijinal kullanılır
    if (!blob || (scale === 1 && blob.size >= file.size)) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", {
      type: "image/webp",
    })
  } catch {
    return file
  }
}

// Görseli Cloudinary'ye imzalı olarak doğrudan tarayıcıdan yükler.
// onProgress: 0-100 arası yüzde (hazırlık ve imza alınırken 0).
export async function uploadImage(
  original: File,
  onProgress?: (percent: number) => void
): Promise<UploadedImage> {
  if (!ALLOWED_TYPES.includes(original.type)) {
    throw new Error("Yalnızca JPG, PNG veya WebP yüklenebilir")
  }
  if (original.size > MAX_INPUT_SIZE) {
    throw new Error("Görsel en fazla 15 MB olabilir")
  }

  onProgress?.(0)
  const [file, signed] = await Promise.all([
    shrink(original),
    getUploadSignatureAction(),
  ])
  if (!("cloudName" in signed)) throw new Error(signed.error)

  const body = new FormData()
  body.append("file", file)
  body.append("api_key", signed.apiKey)
  body.append("timestamp", String(signed.timestamp))
  body.append("signature", signed.signature)
  body.append("folder", signed.folder)
  body.append("allowed_formats", signed.allowed_formats)
  body.append("transformation", signed.transformation)

  return new Promise<UploadedImage>((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`
    )
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100))
      }
    }
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        const data = JSON.parse(request.responseText) as {
          secure_url: string
          width: number
          height: number
        }
        onProgress?.(100)
        resolve({ url: data.secure_url, width: data.width, height: data.height })
      } else {
        reject(new Error("Görsel yüklenemedi"))
      }
    }
    request.onerror = () => reject(new Error("Görsel yüklenemedi"))
    request.send(body)
  })
}
