import { v2 as cloudinary } from "cloudinary"

import { UPLOAD_FOLDER } from "@/lib/cloudinary-url"

// Gelen dönüşüm: Cloudinary yalnızca küçültülmüş sürümü saklar, büyük orijinal tutulmaz.
const INCOMING_TRANSFORMATION = "c_limit,w_2000,h_2000"
const ALLOWED_FORMATS = "jpg,png,webp"

// Tarayıcıdan doğrudan Cloudinary'ye imzalı yükleme için imza üretir.
// Kimlik bilgileri CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// değişkeninden SDK tarafından okunur.
export function createUploadSignature() {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  if (!cloud_name || !api_key || !api_secret) return null

  const timestamp = Math.round(Date.now() / 1000)
  // İmzaya giren her parametre istekte de aynen gönderilmek zorundadır.
  const params = {
    timestamp,
    folder: UPLOAD_FOLDER,
    allowed_formats: ALLOWED_FORMATS,
    transformation: INCOMING_TRANSFORMATION,
  }
  return {
    cloudName: cloud_name,
    apiKey: api_key,
    signature: cloudinary.utils.api_sign_request(params, api_secret),
    ...params,
  }
}

const PUBLIC_ID_PREFIX = `${UPLOAD_FOLDER}/`

// Yalnızca kendi klasörümüzdeki görseller silinebilir.
export async function deleteCloudinaryAssets(publicIds: string[]) {
  const ids = publicIds.filter((id) => id.startsWith(PUBLIC_ID_PREFIX))
  for (let index = 0; index < ids.length; index += 100) {
    await cloudinary.api.delete_resources(ids.slice(index, index + 100), {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    })
  }
  return ids.length
}

export async function listCloudinaryAssets() {
  const assets: { publicId: string; createdAt: Date }[] = []
  let cursor: string | undefined

  do {
    const page = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      prefix: PUBLIC_ID_PREFIX,
      max_results: 500,
      next_cursor: cursor,
    })
    for (const resource of page.resources as {
      public_id: string
      created_at: string
    }[]) {
      assets.push({
        publicId: resource.public_id,
        createdAt: new Date(resource.created_at),
      })
    }
    cursor = page.next_cursor
  } while (cursor)

  return assets
}

export async function cloudinaryAssetExists(publicId: string) {
  try {
    await cloudinary.api.resource(publicId, { resource_type: "image" })
    return true
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "error" in error &&
      (error as { error?: { http_code?: number } }).error?.http_code === 404
    ) {
      return false
    }
    throw error
  }
}
