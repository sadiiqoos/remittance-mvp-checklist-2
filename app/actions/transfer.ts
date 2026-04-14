"use server"

import {
  getMockCorridors,
  getMockExchangeRate,
  getMockRecipients,
  getMockUser,
  createMockTransaction,
} from "@/lib/mock-data"
import { transferSchema } from "@/lib/validation"
import { logSecurityEvent } from "@/lib/security"
import { getCurrentUser } from "@/lib/auth"

export async function getCorridors() {
  return await getMockCorridors()
}

export async function getExchangeRate(sourceCurrency: string, destinationCurrency: string) {
  return await getMockExchangeRate(sourceCurrency, destinationCurrency)
}

export async function getRecipients(userId: string) {
  return await getMockRecipients(userId)
}

export async function createTransaction(formData: {
  userId: string
  recipientId: string
  sourceAmount: number
  destinationAmount: number
  destinationCurrency: string
  exchangeRate: number
  transferFee: number
  totalDeducted: number
  corridor: string
  payoutMethod: string
}) {
  try {
    const validatedData = transferSchema.parse(formData)

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.id !== validatedData.userId) {
      logSecurityEvent({
        action: "unauthorized_transaction_attempt",
        success: false,
        metadata: { attemptedUserId: validatedData.userId },
      })
      throw new Error("Unauthorized transaction attempt")
    }

    if (validatedData.sourceAmount > currentUser.daily_limit_sek) {
      return { success: false, error: "Amount exceeds daily limit" }
    }

    const transaction = await createMockTransaction(validatedData)

    logSecurityEvent({
      userId: currentUser.id,
      action: "transaction_created",
      success: true,
      metadata: {
        transactionId: transaction.id,
        amount: validatedData.sourceAmount,
        currency: validatedData.destinationCurrency,
      },
    })

    return { success: true, transaction }
  } catch (error) {
    console.error("[v0] Transaction error:", error)
    logSecurityEvent({
      action: "transaction_failed",
      success: false,
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    })
    return { success: false, error: "Transaction validation failed" }
  }
}

export async function getDemoUser() {
  return await getMockUser()
}
