import * as crypto from "crypto"

// Encryption key management
const ENCRYPTION_ALGORITHM = "aes-256-gcm"
const ENCRYPTION_KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

// Get encryption key from environment or generate for development
function getEncryptionKey(): Buffer {
  const key = process.env.DATABASE_ENCRYPTION_KEY
  if (!key) {
    // In development, use a derived key (NEVER do this in production)
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_ENCRYPTION_KEY must be set in production")
    }
    return crypto.scryptSync("dev-key-do-not-use-in-production", "salt", ENCRYPTION_KEY_LENGTH)
  }
  return Buffer.from(key, "base64")
}

// Encrypt sensitive data before storing in database
export function encryptField(plaintext: string): string {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv)

  let encrypted = cipher.update(plaintext, "utf8", "base64")
  encrypted += cipher.final("base64")

  const authTag = cipher.getAuthTag()

  // Combine iv + authTag + encrypted data
  const combined = Buffer.concat([iv, authTag, Buffer.from(encrypted, "base64")])
  return combined.toString("base64")
}

// Decrypt sensitive data when reading from database
export function decryptField(encrypted: string): string {
  const key = getEncryptionKey()
  const combined = Buffer.from(encrypted, "base64")

  // Extract iv, authTag, and encrypted data
  const iv = combined.subarray(0, IV_LENGTH)
  const authTag = combined.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH)
  const encryptedData = combined.subarray(IV_LENGTH + AUTH_TAG_LENGTH)

  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedData.toString("base64"), "base64", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

// Hash sensitive data for searching (one-way)
export function hashForSearch(data: string): string {
  return crypto.createHash("sha256").update(data.toLowerCase()).digest("hex")
}

// Data masking for display purposes
export function maskBankAccount(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber
  return "*".repeat(accountNumber.length - 4) + accountNumber.slice(-4)
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (local.length <= 2) return email
  return local.slice(0, 2) + "*".repeat(local.length - 2) + "@" + domain
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone
  return phone.slice(0, 3) + "*".repeat(phone.length - 6) + phone.slice(-3)
}

// Secure data deletion (overwrite before delete)
export async function secureDelete(tableName: string, recordId: string): Promise<void> {
  // In a real implementation, this would:
  // 1. Overwrite sensitive fields with random data
  // 2. Wait for database to flush to disk
  // 3. Then actually delete the record
  // This ensures data cannot be recovered from disk
  console.log(`Securely deleting ${tableName} record ${recordId}`)
}

// Database connection security
export interface SecureConnectionOptions {
  ssl: boolean
  sslMode: "require" | "verify-ca" | "verify-full"
  connectionTimeout: number
  maxConnections: number
  idleTimeout: number
}

export const SECURE_DB_CONFIG: SecureConnectionOptions = {
  ssl: process.env.NODE_ENV === "production",
  sslMode: "verify-full",
  connectionTimeout: 10000, // 10 seconds
  maxConnections: 20,
  idleTimeout: 30000, // 30 seconds
}

// SQL injection prevention helpers
export function sanitizeTableName(tableName: string): string {
  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error("Invalid table name")
  }
  return tableName
}

export function sanitizeColumnName(columnName: string): string {
  // Only allow alphanumeric and underscore
  if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
    throw new Error("Invalid column name")
  }
  return columnName
}

// Parameterized query builder
export function buildSafeQuery(baseQuery: string, params: Record<string, any>): { query: string; values: any[] } {
  let paramIndex = 1
  const values: any[] = []
  const keys = Object.keys(params)

  let query = baseQuery
  keys.forEach((key) => {
    query = query.replace(new RegExp(`:${key}\\b`, "g"), `$${paramIndex}`)
    values.push(params[key])
    paramIndex++
  })

  return { query, values }
}

// Rate limiting for database operations
const dbOperationLimits = new Map<string, { count: number; resetAt: number }>()

export function checkDatabaseRateLimit(userId: string, operation: string, maxOps: number, windowMs: number): boolean {
  const key = `${userId}:${operation}`
  const now = Date.now()
  const limit = dbOperationLimits.get(key)

  if (!limit || now > limit.resetAt) {
    dbOperationLimits.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (limit.count >= maxOps) {
    return false
  }

  limit.count++
  return true
}

// Audit log for database operations
export interface DatabaseAuditLog {
  userId: string
  operation: "SELECT" | "INSERT" | "UPDATE" | "DELETE"
  tableName: string
  recordId?: string
  success: boolean
  timestamp: Date
  ipAddress?: string
}

export async function logDatabaseOperation(log: DatabaseAuditLog): Promise<void> {
  // In a real implementation, this would write to an audit_logs table
  console.log("[DB Audit]", {
    ...log,
    timestamp: log.timestamp.toISOString(),
  })
}
