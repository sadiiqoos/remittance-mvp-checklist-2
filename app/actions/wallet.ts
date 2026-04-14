"use server"

import { getMockUser, getMockMonthlyStats, getMockRecentTransactions, getMockRecipient } from "@/lib/mock-data"

export async function getWalletBalance(userId: string) {
  const user = await getMockUser()
  return user.wallet_balance_sek
}

export async function getMonthlyStats(userId: string) {
  return await getMockMonthlyStats(userId)
}

export async function getRecentTransactions(userId: string, limit = 5) {
  const transactions = await getMockRecentTransactions(userId, limit)

  // Attach recipient data to each transaction
  const transactionsWithRecipients = await Promise.all(
    transactions.map(async (txn) => {
      const recipient = await getMockRecipient(txn.recipient_id)
      return {
        ...txn,
        recipients: {
          id: recipient.id,
          first_name: recipient.first_name,
          last_name: recipient.last_name,
          country: recipient.country,
        },
      }
    }),
  )

  return transactionsWithRecipients
}
