"use server"

import { cookies } from "next/headers"
import { mockUser } from "./mock-data"
import { mockAdminUser, ADMIN_CREDENTIALS } from "./admin-mock-data"
import { checkRateLimit, resetRateLimit, logSecurityEvent } from "./security"
import { loginSchema, signUpSchema, sanitizeEmail } from "./validation"

const SESSION_COOKIE_NAME = "remitswift_session"
const ADMIN_SESSION_COOKIE_NAME = "remitswift_admin_session"

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

    await new Promise((resolve) => setTimeout(resolve, 500))

    const isValidEmail = validatedData.email === mockUser.email
    const isValidPassword = validatedData.password === "demo123" // In production, use: await verifyPassword(password, mockUser.passwordHash)

    if (isValidEmail && isValidPassword) {
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE_NAME, mockUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      })

      resetRateLimit(`login:${sanitizeEmail(validatedData.email)}`)

      logSecurityEvent({
        userId: mockUser.id,
        action: "user_login",
        success: true,
        metadata: { email: sanitizeEmail(validatedData.email) },
      })

      return { success: true }
    }

    logSecurityEvent({
      action: "login_failed",
      success: false,
      metadata: { email: sanitizeEmail(validatedData.email) },
    })

    return { success: false, error: "Invalid email or password" }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { success: false, error: "Invalid input data" }
  }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (sessionCookie) {
    logSecurityEvent({
      userId: sessionCookie.value,
      action: "user_logout",
      success: true,
    })
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return null
  }

  return mockUser
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

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (validatedData.email === mockUser.email) {
      return { success: false, error: "Email already registered" }
    }

    // const passwordHash = await hashPassword(validatedData.password)

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, "new-user-id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    })

    logSecurityEvent({
      action: "user_signup",
      success: true,
      metadata: { email: sanitizeEmail(validatedData.email) },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Signup error:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "Invalid input data" }
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.has(SESSION_COOKIE_NAME)
}

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

    await new Promise((resolve) => setTimeout(resolve, 500))

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
    console.error("[v0] Admin login error:", error)
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

  if (!sessionCookie) {
    return null
  }

  const adminId = sessionCookie.value
  const { getAdminById } = await import("./admin-mock-data")
  return getAdminById(adminId)
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
