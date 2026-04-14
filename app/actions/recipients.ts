"use server"

import {
  createMockRecipient,
  updateMockRecipient,
  deleteMockRecipient,
  toggleMockFavorite,
  getMockRecipients,
} from "@/lib/mock-data"

export async function createRecipient(formData: {
  userId: string
  firstName: string
  lastName: string
  country: string
  payoutMethod: "bank_transfer" | "mobile_money" | "cash_pickup" | "wallet"
  phone?: string
  email?: string
  city?: string
  bankName?: string
  bankAccountNumber?: string
  bankCode?: string
  swiftCode?: string
  iban?: string
  mobileMoneyProvider?: string
  mobileMoneyNumber?: string
  pickupLocation?: string
}) {
  return await createMockRecipient(formData)
}

export async function updateRecipient(
  recipientId: string,
  formData: {
    firstName: string
    lastName: string
    phone?: string
    email?: string
    city?: string
    bankName?: string
    bankAccountNumber?: string
    bankCode?: string
    swiftCode?: string
    iban?: string
    mobileMoneyProvider?: string
    mobileMoneyNumber?: string
    pickupLocation?: string
  },
) {
  return await updateMockRecipient(recipientId, formData)
}

export async function deleteRecipient(recipientId: string) {
  await deleteMockRecipient(recipientId)
}

export async function toggleFavorite(recipientId: string, isFavorite: boolean) {
  return await toggleMockFavorite(recipientId, isFavorite)
}

export async function getAllRecipients(userId: string) {
  return await getMockRecipients(userId)
}
