import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"

// Yalnızca iyimser kontrol: imzalı oturum çerezi var mı?
// Asıl yetki kontrolü sayfalarda ve server action'larda auth() ile yapılır.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
    secureCookie: request.nextUrl.protocol === "https:",
  })
  const isLoginPage = pathname === "/admin"

  let response: NextResponse
  if (!token && !isLoginPage) {
    response = NextResponse.redirect(new URL("/admin", request.url))
  } else if (token && isLoginPage) {
    response = NextResponse.redirect(new URL("/admin/dashboard", request.url))
  } else {
    response = NextResponse.next()
  }

  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("Cache-Control", "no-store")
  return response
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
