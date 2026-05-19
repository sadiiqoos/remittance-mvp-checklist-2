"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import { logSecurityEvent } from "@/lib/security"
import { transactionMonitor } from "@/lib/transaction-monitoring"
import type { Transaction } from "@/types/transaction"

export async function createTransfer(formData: FormData) {
  try {
    const recipientId = formData.get("recipientId") as string
    const sourceAmount = formData.get("sourceAmount") as string
    const corridor = formData.get("corridor") as string
    const payoutMethod = formData.get("payoutMethod") as string

    if (!recipientId || !sourceAmount || !corridor || !payoutMethod) {
      return { success: false, error: "Missing required fields" }
    }

    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const supabase = await createClient()

    // Get corridor data from Supabase
    const { data: corridorData, error: corridorError } = await supabase
      .from("corridors")
      .select("*")
      .eq("name", corridor)
      .eq("is_active", true)
      .single()

    if (corridorError || !corridorData) {
      return { success: false, error: "Invalid corridor selected" }
    }

    // Get exchange rate from Supabase
    const { data: rateData, error: rateError } = await supabase
      .from("exchange_rates")
      .select("*")
      .eq("source_currency", "SEK")
      .eq("destination_currency", corridorData.destination_currency)
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .single()

    if (rateError || !rateData) {
      return { success: false, error: "Exchange rate not available" }
    }

    // Get user's transaction history for AML monitoring
    const { data: history } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    const parsedAmount = parseFloat(sourceAmount)
    const destinationAmount = parsedAmount * rateData.rate
    const transferFee = corridorData.base_fee_sek ?? 0
    const totalCost = parsedAmount + transferFee

    // Build transaction object for monitoring
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      user_id: user.id,
      recipient_id: recipientId,
      reference_number: `REF${Date.now()}`,
      source_amount: parsedAmount,
      source_currency: "SEK",
      destination_amount: destinationAmount,
      destination_currency: corridorData.destination_currency,
      exchange_rate: rateData.rate,
      exchange_rate_provider: rateData.provider ?? "internal",
      transfer_fee: transferFee,
      fx_margin: 0,
      total_deducted_sek: totalCost,
      status: "pending",
      corridor,
      payout_method: payoutMethod,
      partner_name: corridorData.partner_name ?? "internal",
      aml_check_status: "pending",
      aml_check_provider: "internal",
      sanctions_check_status: "pending",
      initiated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: null,
      failed_at: null,
      failure_reason: null,
      notes: null,
      partner_transaction_id: null,
    }

    // Run AML/transaction monitoring
    const monitoringResult = await transactionMonitor.monitorTransaction(
      newTransaction,
      user,
      history ?? []
    )

    if (!monitoringResult.allowed) {
      logSecurityEvent({
        userId: user.id,
        action: "transaction_blocked",
        success: false,
        metadata: {
          transactionId: newTransaction.id,
          riskScore: monitoringResult.riskScore,
          reasons: monitoringResult.alerts.map((a) => a.reason),
        },
      })
      return {
        success: false,
        error: "Transaction blocked by security system. Please contact support.",
      }
    }

    // Set AML status based on monitoring result
    const amlStatus = monitoringResult.requiresReview ? "flagged" : "passed"
    const sanctionsStatus = monitoringResult.requiresReview ? "pending" : "passed"
    const txStatus = monitoringResult.requiresReview ? "pending" : "processing"
    const notes = monitoringResult.requiresReview ? "Flagged for manual review" : null

    // Save transaction to Supabase
    const { data: savedTransaction, error: insertError } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        recipient_id: recipientId,
        source_amount: parsedAmount,
        source_currency: "SEK",
        destination_amount: destinationAmount,
        destination_currency: corridorData.destination_currency,
        exchange_rate: rateData.rate,
        transfer_fee: transferFee,
        total_deducted: totalCost,
        corridor,
        payout_method: payoutMethod,
        status: txStatus,
        aml_check_status: amlStatus,
        sanctions_check_status: sanctionsStatus,
        notes,
      })
      .select()
      .single()

    if (insertError) {
      console.error("[transaction] Insert error:", insertError)
      return { success: false, error: "Failed to save transaction" }
    }

    logSecurityEvent({
      userId: user.id,
      action: "transaction_created",
      success: true,
      metadata: {
        transactionId: savedTransaction.id,
        amount: parsedAmount,
        currency: corridorData.destination_currency,
      },
    })

    return { success: true, transactionId: savedTransaction.id }
  } catch (error) {
    console.error("[transaction] Transfer error:", error)
    logSecurityEvent({
      action: "transaction_failed",
      success: false,
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    })
    return { success: false, error: "Failed to create transfer" }
  }
}

export async function getTransactions(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*, recipients(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[transaction] getTransactions error:", error)
    return []
  }
  return data
}

export async function getTransactionById(transactionId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("transactions")
    .select("*, recipients(*)")
    .eq("id", transactionId)
    .single()

  if (error) {
    console.error("[transaction] getTransactionById error:", error)
    return null
  }
  return data
}