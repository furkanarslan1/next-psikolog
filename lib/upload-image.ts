import { getUploadSignatureAction } from "@/app/admin/(panel)/posts/actions"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

// Görseli Cloudinary'ye imzalı olarak doğrudan tarayıcıdan yükler.
// onProgress: 0-100 arası yüzde (imza alınırken 0).
export async function uploadImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Yalnızca JPG, PNG veya WebP yüklenebilir")
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Görsel en fazla 5 MB olabilir")
  }

  onProgress?.(0)
  const signed = await getUploadSignatureAction()
  if (!("cloudName" in signed)) throw new Error(signed.error)

  const body = new FormData()
  body.append("file", file)
  body.append("api_key", signed.apiKey)
  body.append("timestamp", String(signed.timestamp))
  body.append("signature", signed.signature)
  body.append("folder", signed.folder)

  return new Promise<string>((resolve, reject) => {
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
        const data = JSON.parse(request.responseText) as { secure_url: string }
        onProgress?.(100)
        resolve(data.secure_url)
      } else {
        reject(new Error("Görsel yüklenemedi"))
      }
    }
    request.onerror = () => reject(new Error("Görsel yüklenemedi"))
    request.send(body)
  })
}
