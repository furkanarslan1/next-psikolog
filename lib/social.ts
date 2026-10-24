// "@erenarslan", "erenarslan" veya profil adresi -> yalnızca kullanıcı adı. Geçersizse null.
const HANDLE = /^[A-Za-z0-9._]{1,30}$/

function parseHandle(input: string, hosts: string[]) {
  let value = input.trim()
  if (value === "") return null

  if (/^(https?:\/\/|www\.)/i.test(value) || hosts.some((h) => value.toLowerCase().startsWith(h))) {
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
      const host = url.hostname.replace(/^www\./, "").toLowerCase()
      if (!hosts.includes(host)) return null
      value = url.pathname.split("/").filter(Boolean)[0] ?? ""
    } catch {
      return null
    }
  }
  value = value.replace(/^@/, "")
  return HANDLE.test(value) ? value : null
}

export const parseInstagram = (input: string) => parseHandle(input, ["instagram.com"])
export const parseX = (input: string) => parseHandle(input, ["x.com", "twitter.com"])

export const instagramUrl = (handle: string) => `https://www.instagram.com/${handle}`
export const xUrl = (handle: string) => `https://x.com/${handle}`
