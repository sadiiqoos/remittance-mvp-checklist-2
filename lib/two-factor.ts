import * as crypto from "crypto"

export interface TwoFactorSecret {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface TwoFactorVerification {
  userId: string
  isEnabled: boolean
  secret?: string
  backupCodes?: string[]
}

// Generate a base32 secret for TOTP
function generateBase32Secret(): string {
  const buffer = crypto.randomBytes(20)
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""

  for (let i = 0; i < buffer.length; i++) {
    secret += base32Chars[buffer[i] % 32]
  }

  return secret
}

// Generate backup codes
function generateBackupCodes(count = 10): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase()
    codes.push(code)
  }
  return codes
}

// Generate TOTP token
function generateTOTP(secret: string, timeStep = 30): string {
  const time = Math.floor(Date.now() / 1000)
  const counter = Math.floor(time / timeStep)

  // Convert base32 secret to buffer
  const secretBuffer = Buffer.from(secret, "base64")

  // Create counter buffer
  const counterBuffer = Buffer.alloc(8)
  counterBuffer.writeBigInt64BE(BigInt(counter))

  // Generate HMAC
  const hmac = crypto.createHmac("sha1", secretBuffer)
  hmac.update(counterBuffer)
  const hash = hmac.digest()

  // Dynamic truncation
  const offset = hash[hash.length - 1] & 0x0f
  const code =
    (((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff)) %
    1000000

  return code.toString().padStart(6, "0")
}

// Verify TOTP token
export function verifyTOTP(secret: string, token: string, window = 1): boolean {
  // Check current time and adjacent time windows
  for (let i = -window; i <= window; i++) {
    const time = Math.floor(Date.now() / 1000) + i * 30
    const counter = Math.floor(time / 30)

    const secretBuffer = Buffer.from(secret, "base64")
    const counterBuffer = Buffer.alloc(8)
    counterBuffer.writeBigInt64BE(BigInt(counter))

    const hmac = crypto.createHmac("sha1", secretBuffer)
    hmac.update(counterBuffer)
    const hash = hmac.digest()

    const offset = hash[hash.length - 1] & 0x0f
    const code =
      (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) %
      1000000

    if (code.toString().padStart(6, "0") === token) {
      return true
    }
  }

  return false
}

// Generate 2FA setup
export async function generate2FASecret(email: string): Promise<TwoFactorSecret> {
  const secret = generateBase32Secret()
  const backupCodes = generateBackupCodes()

  // Generate QR code data URL
  const issuer = "RemitSwift"
  const otpauthUrl = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`

  // In a real app, you'd use a QR code library here
  // For now, we'll return the URL that can be used with any QR generator
  const qrCode = otpauthUrl

  return {
    secret,
    qrCode,
    backupCodes,
  }
}

// Verify 2FA token
export async function verify2FAToken(
  secret: string,
  token: string,
  backupCodes?: string[],
): Promise<{ valid: boolean; usedBackupCode?: string }> {
  // First check if it's a TOTP token
  if (verifyTOTP(secret, token)) {
    return { valid: true }
  }

  // Check if it's a backup code
  if (backupCodes && backupCodes.includes(token.toUpperCase())) {
    return { valid: true, usedBackupCode: token.toUpperCase() }
  }

  return { valid: false }
}

// Hash backup codes for storage
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  const hashedCodes = await Promise.all(codes.map((code) => crypto.createHash("sha256").update(code).digest("hex")))
  return hashedCodes
}

// Verify backup code against hash
export async function verifyBackupCode(code: string, hashedCodes: string[]): Promise<boolean> {
  const codeHash = crypto.createHash("sha256").update(code.toUpperCase()).digest("hex")
  return hashedCodes.includes(codeHash)
}
