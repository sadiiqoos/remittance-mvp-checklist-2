import bcrypt from "bcryptjs"

const SALT_ROUNDS = 12

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  identifier: string,
  maxAttempts = 5,
  windowMs: number = 15 * 60 * 1000,
): { allowed: boolean; remainingAttempts: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(identifier)

  if (!entry || now > entry.resetAt) {
    // Create new entry
    const resetAt = now + windowMs
    rateLimitStore.set(identifier, { count: 1, resetAt })
    return { allowed: true, remainingAttempts: maxAttempts - 1, resetAt }
  }

  if (entry.count >= maxAttempts) {
    return { allowed: false, remainingAttempts: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remainingAttempts: maxAttempts - entry.count, resetAt: entry.resetAt }
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

interface AuditLog {
  timestamp: string
  userId?: string
  action: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  metadata?: Record<string, any>
}

const auditLogs: AuditLog[] = []

export function logSecurityEvent(log: Omit<AuditLog, "timestamp">): void {
  const entry: AuditLog = {
    ...log,
    timestamp: new Date().toISOString(),
  }
  auditLogs.push(entry)

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("[SECURITY AUDIT]", entry)
  }

  // In production, send to monitoring service
  // Example: sendToMonitoring(entry)
}

export function getAuditLogs(limit = 100): AuditLog[] {
  return auditLogs.slice(-limit)
}

export function generateSecureToken(): string {
  const array = new Uint8Array(32)
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    // Fallback for Node.js
    const nodeCrypto = require("crypto")
    const buffer = nodeCrypto.randomBytes(32)
    for (let i = 0; i < 32; i++) {
      array[i] = buffer[i]
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function generateCSRFToken(): string {
  return generateSecureToken().substring(0, 32)
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>'"]/g, "") // Remove potential XSS chars
    .replace(/(\b)(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)(\b)/gi, "") // Remove SQL keywords
    .trim()
    .substring(0, 10000)
}

export function validateSession(sessionId: string | undefined): boolean {
  if (!sessionId) return false
  // Check if session ID format is valid (UUID or hex token)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const tokenPattern = /^[a-zA-Z0-9-_]+$/
  return uuidPattern.test(sessionId) || (tokenPattern.test(sessionId) && sessionId.length >= 16)
}

export function getRateLimitKey(identifier: string, ip?: string): string {
  return ip ? `${identifier}:${ip}` : identifier
}

export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com https://vercel.live; frame-src 'self' https://vercel.live; form-action 'self'; base-uri 'self';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
}
