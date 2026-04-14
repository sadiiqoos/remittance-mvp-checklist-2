"use server"

import { getMockUser } from "@/lib/mock-data"
import type { User } from "@/lib/types"

export async function getCurrentUser(): Promise<User> {
  return await getMockUser()
}

export async function updateKYCStatus(status: "pending" | "approved" | "rejected"): Promise<User> {
  const user = await getMockUser()
  user.kyc_status = status
  user.updated_at = new Date().toISOString()

  if (status === "approved") {
    user.kyc_verified_at = new Date().toISOString()
  }

  return user
}

export async function uploadKYCDocument(documentType: string, file: string): Promise<{ success: boolean }> {
  // Mock document upload
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}
