"use server"

import { createClient } from "./supabase/server"
import { checkRateLimit, resetRateLimit, logSecurityEvent } from "./security"
import { loginSchema, signUpSchema, sanitizeEmail } from "./validation"

// ─── User Auth ────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = loginSchema.parse({ email, password })

    const rateLimit = checkRateLimit(`login:${sanitizeEmail(validatedData.email)}`, 5, 15 * 60 * 1000)
    if (!rateLimit.allowed) {
      const waitMinutes = Math.ceil((rateLimit.resetAt - Date.now()) / 60000)
      logSecurityEvent({
        action: "login_rate_limited",
        success: false,
        metadata: { email: sanitizeEmail(validatedData.email) },
      })
      return { success: false, error: `Too many attempts. Try again in ${waitMinutes} minutes.` }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      logSecurityEvent({
        action: "login_failed",
        success: false,
        metadata: { email: sanitizeEmail(validatedData.email) },
      })
      return { success: false, error: "Invalid email or password" }
    }

    resetRateLimit(`login:${sanitizeEmail(validatedData.email)}`)

    logSecurityEvent({
      action: "user_login",
      success: true,
      metadata: { email: sanitizeEmail(validatedData.email) },
    })

    return { success: true }
  } catch (error) {
    console.error("[auth] Login error:", error)
    return { success: false, error: "Invalid input data" }
  }
}

export async function logout(): Promise<void> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    logSecurityEvent({
      userId: user.id,
      action: "user_logout",
      success: true,
    })
  }

  await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) return null

  // Fetch the full user profile from your users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  return profile ?? null
}

export async function getUser() {
  return getCurrentUser()
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = signUpSchema.parse({ email, password, fullName, phone })

    const rateLimit = checkRateLimit(`signup:${sanitizeEmail(validatedData.email)}`, 3, 60 * 60 * 1000)
    if (!rateLimit.allowed) {
      return { success: false, error: "Too many signup attempts. Try again later." }
    }

    const supabase = await createClient()

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
          phone: validatedData.phone,
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (data.user) {
      // Create profile row in users table
      const nameParts = validatedData.fullName.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ") || ""

      await supabase.from("users").insert({
        id: data.user.id,
        email: validatedData.email,
        phone: validatedData.phone,
        first_name: firstName,
        last_name: lastName,
      })
    }

    logSecurityEvent({
      action: "user_signup",
      success: true,
      metadata: { email: sanitizeEmail(validatedData.email) },
    })

    return { success: true }
  } catch (error) {
    console.error("[auth] Signup error:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Invalid input data" }
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────
// Admin still uses hardcoded credentials for now (no admin_users table yet).
// Replace with Supabase admin_users table when ready.

import { mockAdminUser, ADMIN_CREDENTIALS } from "./admin-mock-data"
import { cookies } from "next/headers"

const ADMIN_SESSION_COOKIE_NAME = "remitswift_admin_session"

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const validatedData = loginSchema.parse({ email, password })

    const rateLimit = checkRateLimit(`admin_login:${sanitizeEmail(validatedData.email)}`, 3, 30 * 60 * 1000)
    if (!rateLimit.allowed) {
      logSecurityEvent({
        action: "admin_login_rate_limited",
        success: false,
        metadata: { email: sanitizeEmail(validatedData.email) },
      })
      return { success: false, error: "Too many admin login attempts. Contact support." }
    }

    const isValidEmail = validatedData.email === ADMIN_CREDENTIALS.email
    const isValidPassword = validatedData.password === ADMIN_CREDENTIALS.password

    if (isValidEmail && isValidPassword) {
      const cookieStore = await cookies()
      cookieStore.set(ADMIN_SESSION_COOKIE_NAME, mockAdminUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      resetRateLimit(`admin_login:${sanitizeEmail(validatedData.email)}`)

      logSecurityEvent({
        userId: mockAdminUser.id,
        action: "admin_login",
        success: true,
        metadata: { email: sanitizeEmail(validatedData.email), role: mockAdminUser.role },
      })

      return { success: true }
    }

    logSecurityEvent({
      action: "admin_login_failed",
      success: false,
      metadata: { email: sanitizeEmail(validatedData.email) },
    })

    return { success: false, error: "Invalid admin credentials" }
  } catch (error) {
    console.error("[auth] Admin login error:", error)
    return { success: false, error: "Invalid input data" }
  }
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)

  if (sessionCookie) {
    logSecurityEvent({
      userId: sessionCookie.value,
      action: "admin_logout",
      success: true,
    })
  }

  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME)
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)

  if (!sessionCookie) return null

  const { getAdminById } = await import("./admin-mock-data")
  return getAdminById(sessionCookie.value)
}

export async function getAdminUser() {
  return getCurrentAdmin()
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(ADMIN_SESSION_COOKIE_NAME)
}

export async function hasAdminPermission(permission: string): Promise<boolean> {
  const admin = await getCurrentAdmin()
  if (!admin) return false
  return admin.permissions?.includes(permission) || false
}