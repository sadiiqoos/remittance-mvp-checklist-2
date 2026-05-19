"use server"

import { createClient } from "@/lib/supabase/server"
import { transferSchema } from "@/lib/validation"
import { logSecurityEvent } from "@/lib/security"
import { getCurrentUser } from "@/lib/auth"

export async function getCorridors() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("corridors")
    .select("*")
    .eq("is_active", true)
    .order("destination_country")

  if (error) {
    console.error("[transfer] getCorridors error:", error)
    return []
  }
  return data
}

export async function getExchangeRate(sourceCurrency: string, destinationCurrency: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("exchange_rates")
    .select("*")
    .eq("source_currency", sourceCurrency)
    .eq("destination_currency", destinationCurrency)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("[transfer] getExchangeRate error:", error)
    return null
  }
  return data
}

export async function getRecipients(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipients")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[transfer] getRecipients error:", error)
    return []
  }
  return data
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

    if (validatedData.sourceAmount > (currentUser.daily_limit_sek ?? 50000)) {
      return { success: false, error: "Amount exceeds daily limit" }
    }

    const supabase = await createClient()

    const { data: transaction, error } = await supabase
      .from("transactions")
      .insert({
        user_id: validatedData.userId,
        recipient_id: validatedData.recipientId,
        reference_number: `REF-${Date.now()}`,
        source_amount: validatedData.sourceAmount,
        source_currency: "SEK",
        destination_amount: validatedData.destinationAmount,
        destination_currency: validatedData.destinationCurrency,
        exchange_rate: validatedData.exchangeRate,
        transfer_fee: validatedData.transferFee,
        total_deducted_sek: validatedData.totalDeducted,
        corridor: validatedData.corridor,
        payout_method: validatedData.payoutMethod,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[transfer] createTransaction error:", error)
      return { success: false, error: "Failed to create transaction" }
    }

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
    console.error("[transfer] Transaction error:", error)
    logSecurityEvent({
      action: "transaction_failed",
      success: false,
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    })
    return { success: false, error: "Transaction validation failed" }
  }
}

export async function getDemoUser() {
  return await getCurrentUser()
}