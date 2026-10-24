import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"]
  }
  interface User {
    pwdAt?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    pwdAt?: number
  }
}
