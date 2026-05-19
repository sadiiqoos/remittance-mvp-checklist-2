"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"
import type { Recipient } from "@/lib/types"

export async function addRecipient(data: {
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  country: string
  payout_method: Recipient["payout_method"]
  bank_name: string | null
  bank_account_number: string | null
  swift_code: string | null
  mobile_money_provider: string | null
  mobile_money_number: string | null
  pickup_location: string | null
}): Promise<{ success: boolean; recipient?: Recipient; error?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user) return { success: false, error: "Not authenticated" }

    const supabase = await createClient()
    const { data: recipient, error } = await supabase
      .from("recipients")
      .insert({
        user_id: user.id,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        email: data.email,
        country: data.country,
        city: null,
        payout_method: data.payout_method,
        bank_name: data.bank_name,
        bank_account_number: data.bank_account_number,
        bank_code: null,
        swift_code: data.swift_code,
        iban: null,
        mobile_money_provider: data.mobile_money_provider,
        mobile_money_number: data.mobile_money_number,
        pickup_location: data.pickup_location,
        is_favorite: false,
      })
      .select()
      .single()

    if (error) {
      console.error("[recipients] addRecipient error:", error)
      return { success: false, error: "Failed to save recipient" }
    }

    return { success: true, recipient }
  } catch (err) {
    console.error("[recipients] addRecipient error:", err)
    return { success: false, error: "Something went wrong" }
  }
}

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
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipients")
    .insert({
      user_id: user.id,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone ?? null,
      email: formData.email ?? null,
      country: formData.country,
      city: formData.city ?? null,
      payout_method: formData.payoutMethod,
      bank_name: formData.bankName ?? null,
      bank_account_number: formData.bankAccountNumber ?? null,
      bank_code: formData.bankCode ?? null,
      swift_code: formData.swiftCode ?? null,
      iban: formData.iban ?? null,
      mobile_money_provider: formData.mobileMoneyProvider ?? null,
      mobile_money_number: formData.mobileMoneyNumber ?? null,
      pickup_location: formData.pickupLocation ?? null,
      is_favorite: false,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
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
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipients")
    .update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone ?? null,
      email: formData.email ?? null,
      city: formData.city ?? null,
      bank_name: formData.bankName ?? null,
      bank_account_number: formData.bankAccountNumber ?? null,
      bank_code: formData.bankCode ?? null,
      swift_code: formData.swiftCode ?? null,
      iban: formData.iban ?? null,
      mobile_money_provider: formData.mobileMoneyProvider ?? null,
      mobile_money_number: formData.mobileMoneyNumber ?? null,
      pickup_location: formData.pickupLocation ?? null,
    })
    .eq("id", recipientId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteRecipient(recipientId: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const supabase = await createClient()
  const { error } = await supabase
    .from("recipients")
    .delete()
    .eq("id", recipientId)
    .eq("user_id", user.id)

  if (error) throw new Error(error.message)
}

export async function toggleFavorite(recipientId: string, isFavorite: boolean) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Not authenticated")

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipients")
    .update({ is_favorite: isFavorite })
    .eq("id", recipientId)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getAllRecipients(userId: string): Promise<Recipient[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("recipients")
    .select("*")
    .eq("user_id", userId)
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[recipients] getAllRecipients error:", error)
    return []
  }
  return data
}
