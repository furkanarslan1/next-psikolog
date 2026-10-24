import { v2 as cloudinary } from "cloudinary"

export const UPLOAD_FOLDER = "psikolog-blog"

// Tarayıcıdan doğrudan Cloudinary'ye imzalı yükleme için imza üretir.
// Kimlik bilgileri CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
// değişkeninden SDK tarafından okunur.
export function createUploadSignature() {
  const { cloud_name, api_key, api_secret } = cloudinary.config()
  if (!cloud_name || !api_key || !api_secret) return null

  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: UPLOAD_FOLDER },
    api_secret
  )
  return {
    cloudName: cloud_name,
    apiKey: api_key,
    timestamp,
    signature,
    folder: UPLOAD_FOLDER,
  }
}
