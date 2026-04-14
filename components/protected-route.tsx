import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export async function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return <>{children}</>
}
