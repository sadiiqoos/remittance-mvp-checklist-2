"use server"

import { createClient } from "@/lib/supabase/server"

export async function getWalletBalance(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("users")
    .select("wallet_balance_sek")
    .eq("id", userId)
    .single()

  if (error) {
    console.error("[wallet] getWalletBalance error:", error)
    return 0
  }
  return data.wallet_balance_sek ?? 0
}

export async function getMonthlyStats(userId: string) {
  const supabase = await createClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data, error } = await supabase
    .from("transactions")
    .select("source_amount, status")
    .eq("user_id", userId)
    .gte("created_at", startOfMonth)
    .in("status", ["completed", "processing", "pending"])

  if (error) {
    console.error("[wallet] getMonthlyStats error:", error)
    return { totalSent: 0, transactionCount: 0 }
  }

  const totalSent = data.reduce((sum, txn) => sum + (txn.source_amount ?? 0), 0)
  const transactionCount = data.length

  return { totalSent, transactionCount }
}

export async function getRecentTransactions(userId: string, limit = 5) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("transactions")
    .select(`
      *,
      recipients (
        id,
        first_name,
        last_name,
        country
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("[wallet] getRecentTransactions error:", error)
    return []
  }

  return data
}