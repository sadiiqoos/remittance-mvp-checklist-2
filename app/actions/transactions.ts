"use server"

import {
  getMockTransactions,
  getMockTransaction,
  getMockTransactionStatusHistory,
  getMockRecipient,
} from "@/lib/mock-data"

export async function getTransactions(userId: string) {
  const transactions = await getMockTransactions(userId)

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
          payout_method: recipient.payout_method,
        },
      }
    }),
  )

  return transactionsWithRecipients
}

export async function getTransactionById(transactionId: string) {
  const transaction = await getMockTransaction(transactionId)
  const recipient = await getMockRecipient(transaction.recipient_id)

  return {
    ...transaction,
    recipients: {
      id: recipient.id,
      first_name: recipient.first_name,
      last_name: recipient.last_name,
      country: recipient.country,
      city: recipient.city,
      payout_method: recipient.payout_method,
      phone: recipient.phone_number,
      mobile_money_provider: recipient.mobile_money_provider,
      mobile_money_number: recipient.mobile_money_number,
      bank_name: recipient.bank_name,
      bank_account_number: recipient.bank_account_number,
    },
  }
}

export async function getTransactionStatusHistory(transactionId: string) {
  return await getMockTransactionStatusHistory(transactionId)
}
