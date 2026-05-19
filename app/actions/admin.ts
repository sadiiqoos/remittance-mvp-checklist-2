"use server"

import { createClient } from "@supabase/supabase-js"

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getAdminUsers() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[admin] getAdminUsers error:", error)
    return []
  }
  return data
}

export async function getAdminTransactions() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("transactions")
    .select(`*, users(email, first_name, last_name), recipients(first_name, last_name, country)`)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("[admin] getAdminTransactions error:", error)
    return []
  }
  return data
}

export async function updateAdminTransactionStatus(transactionId: string, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("transactions")
    .update({ status })
    .eq("id", transactionId)
  return { success: !error, error: error?.message }
}

export async function updateAdminUserStatus(userId: string, status: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from("users")
    .update({ account_status: status })
    .eq("id", userId)
  return { success: !error, error: error?.message }
}
