import { transactionMonitor } from "@/lib/transaction-monitoring"
import { validateTransferSchema } from "@/lib/validation"
import { getCurrentUser } from "@/lib/user"
import { getMockTransactions } from "@/lib/transactions"
import type { Transaction } from "@/types/transaction"
import { logSecurityEvent } from "@/lib/security"
import { getExchangeRate } from "@/lib/exchange-rate"
import { getCorridorData } from "@/lib/corridor"

export async function createTransfer(formData: FormData) {
  "use server"

  try {
    const recipientId = formData.get("recipientId") as string
    const sourceAmount = formData.get("sourceAmount") as string
    const corridor = formData.get("corridor") as string
    const payoutMethod = formData.get("payoutMethod") as string

    const validatedData = validateTransferSchema.parse({
      recipientId,
      sourceAmount: Number.parseFloat(sourceAmount),
      corridor,
      payoutMethod,
    })

    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get user's transaction history
    const history = await getMockTransactions(user.id)

    // Get exchange rate and corridor data
    const rate = await getExchangeRate(validatedData.corridor)
    const corridorData = await getCorridorData(validatedData.corridor)
    const destinationAmount = validatedData.sourceAmount * rate.rate
    const totalCost = destinationAmount + corridorData.base_fee_sek

    // Create transaction object for monitoring
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      user_id: user.id,
      recipient_id: validatedData.recipientId,
      reference_number: `REF${Date.now()}`,
      source_amount: validatedData.sourceAmount,
      source_currency: "SEK",
      destination_amount: destinationAmount,
      destination_currency: rate.destination_currency,
      exchange_rate: rate.rate,
      exchange_rate_provider: rate.provider,
      transfer_fee: corridorData.base_fee_sek,
      fx_margin: 0,
      total_deducted_sek: totalCost,
      status: "pending",
      corridor: validatedData.corridor,
      payout_method: validatedData.payoutMethod,
      partner_name: "mock-partner",
      aml_check_status: "pending",
      aml_check_provider: "mock-aml-provider",
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

    const monitoringResult = await transactionMonitor.monitorTransaction(newTransaction, user, history)

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

    // Update transaction status based on monitoring
    if (monitoringResult.requiresReview) {
      newTransaction.status = "pending"
      newTransaction.aml_check_status = "flagged"
      newTransaction.notes = "Flagged for manual review"
    } else {
      newTransaction.aml_check_status = "passed"
      newTransaction.sanctions_check_status = "passed"
    }

    // ... existing code to create transaction ...

    return { success: true, transactionId: newTransaction.id }
  } catch (error) {
    console.error("[v0] Transfer error:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Failed to create transfer" }
  }
}
