import { auth } from "@/auth"

// Her admin server action'ının ve route handler'ının başında çağrılır.
export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Yetkisiz erişim")
  return session
}
