import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"

// Kullanıcı bulunamasa bile bcrypt çalışsın ki yanıt süresi e-postanın
// kayıtlı olup olmadığını belli etmesin.
const DUMMY_HASH =
  "$2b$12$9/r.gUYQupdBsb/waFQKqen/IKi59Z40.ojXMmAGC5vW3FypRVD26"

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const email = parsed.data.email.toLowerCase()
        const admin = await db.admin.findUnique({ where: { email } })
        const valid = await bcrypt.compare(
          parsed.data.password,
          admin?.passwordHash ?? DUMMY_HASH
        )
        if (!admin || !valid) return null

        return {
          id: admin.id,
          email: admin.email,
          pwdAt: admin.passwordChangedAt.getTime(),
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        // giriş anı: şifre zaman damgasını token'a yaz
        token.sub = user.id
        token.pwdAt = user.pwdAt
        return token
      }

      // sonraki her auth() çağrısı: şifre değiştiyse oturumu düşür
      // (yalnızca admin sayfaları/action'ları auth() çağırır, ziyaretçiler değil)
      const admin = token.sub
        ? await db.admin.findUnique({
            where: { id: token.sub },
            select: { passwordChangedAt: true },
          })
        : null
      if (!admin || admin.passwordChangedAt.getTime() !== token.pwdAt) {
        return null
      }
      return token
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      return session
    },
  },
})
