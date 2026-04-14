import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(1, "Password is required"),
})

export const signUpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email too long")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name too long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Invalid name format"),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    .max(20, "Phone number too long"),
})

export const transferSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  recipientId: z.string().uuid("Invalid recipient ID"),
  sourceAmount: z
    .number()
    .positive("Amount must be positive")
    .max(1000000, "Amount exceeds maximum limit")
    .refine((val) => Number.isFinite(val), "Invalid amount"),
  destinationAmount: z.number().positive("Destination amount must be positive"),
  destinationCurrency: z.string().length(3, "Invalid currency code").toUpperCase(),
  exchangeRate: z.number().positive("Exchange rate must be positive"),
  transferFee: z.number().nonnegative("Fee cannot be negative"),
  totalDeducted: z.number().positive("Total deducted must be positive"),
  corridor: z.string().min(1, "Corridor is required"),
  payoutMethod: z.string().min(1, "Payout method is required"),
})

export const validateTransferSchema = transferSchema

export const passwordChangeSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password too long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const adminCreateSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  firstName: z.string().min(2, "First name required").max(50, "Name too long"),
  lastName: z.string().min(2, "Last name required").max(50, "Name too long"),
  role: z.enum(["super_admin", "admin", "operations", "compliance", "finance", "support"]),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

// Sanitize string inputs to prevent XSS
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 10000)
}

// Validate and sanitize email
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim().substring(0, 255)
}

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Invalid name format"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Name too long")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Invalid name format"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message too long")
    .refine((val) => !/<script|javascript:|on\w+=/i.test(val), "Invalid content detected"),
})

export const amountSchema = z
  .number()
  .positive("Amount must be positive")
  .max(500000, "Amount exceeds maximum limit")
  .refine((val) => Number.isFinite(val) && !Number.isNaN(val), "Invalid amount")
  .refine((val) => val === Math.round(val * 100) / 100, "Amount can have max 2 decimal places")

export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null
    }
    return parsed.href
  } catch {
    return null
  }
}
