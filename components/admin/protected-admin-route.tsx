"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/admin/check-auth")
        if (!response.ok) {
          router.push("/admin/login")
        }
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [router])

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
