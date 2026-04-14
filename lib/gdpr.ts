import { logSecurityEvent } from "./security"
import { secureDelete } from "./database-security"

// GDPR Data Subject Rights
export enum GDPRRight {
  ACCESS = "right_to_access",
  RECTIFICATION = "right_to_rectification",
  ERASURE = "right_to_erasure",
  RESTRICTION = "right_to_restriction",
  PORTABILITY = "right_to_portability",
  OBJECTION = "right_to_objection",
}

// Data export formats
export type ExportFormat = "json" | "csv" | "pdf"

// Personal data categories
export interface PersonalDataCategories {
  identity: boolean // Name, date of birth, nationality
  contact: boolean // Email, phone, address
  financial: boolean // Transactions, wallet balance
  authentication: boolean // Login history, sessions
  kyc: boolean // KYC documents and verification status
  communications: boolean // Support tickets, emails
}

// Data retention policy
export interface RetentionPolicy {
  category: string
  retentionPeriod: number // in days
  reason: string
  canBeDeleted: boolean
}

export const DATA_RETENTION_POLICIES: RetentionPolicy[] = [
  {
    category: "transactions",
    retentionPeriod: 2555, // 7 years for financial records
    reason: "Legal requirement for financial transaction records",
    canBeDeleted: false,
  },
  {
    category: "kyc_documents",
    retentionPeriod: 1825, // 5 years after account closure
    reason: "AML/KYC regulatory requirements",
    canBeDeleted: false,
  },
  {
    category: "audit_logs",
    retentionPeriod: 2555, // 7 years
    reason: "Security and compliance auditing",
    canBeDeleted: false,
  },
  {
    category: "user_profile",
    retentionPeriod: 0, // Can be deleted immediately after account closure
    reason: "User preference",
    canBeDeleted: true,
  },
  {
    category: "marketing_data",
    retentionPeriod: 0, // Can be deleted immediately
    reason: "User consent withdrawn",
    canBeDeleted: true,
  },
]

// Consent types
export interface ConsentRecord {
  userId: string
  consentType: ConsentType
  granted: boolean
  grantedAt: Date
  revokedAt?: Date
  version: string
  ipAddress: string
}

export enum ConsentType {
  TERMS_OF_SERVICE = "terms_of_service",
  PRIVACY_POLICY = "privacy_policy",
  MARKETING_EMAILS = "marketing_emails",
  DATA_PROCESSING = "data_processing",
  THIRD_PARTY_SHARING = "third_party_sharing",
  COOKIES = "cookies",
}

// GDPR Request tracking
export interface GDPRRequest {
  id: string
  userId: string
  requestType: GDPRRight
  status: "pending" | "processing" | "completed" | "rejected"
  requestedAt: Date
  completedAt?: Date
  rejectionReason?: string
  dataExported?: string // URL to exported data
  notes?: string
}

// Export user data in compliance with GDPR Article 15 (Right to Access)
export async function exportUserData(
  userId: string,
  categories: PersonalDataCategories,
  format: ExportFormat = "json",
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    logSecurityEvent({
      userId,
      action: "gdpr_data_export_requested",
      success: true,
      metadata: { categories, format },
    })

    const exportData: any = {
      exportDate: new Date().toISOString(),
      userId,
      categories: [],
    }

    // Export identity data
    if (categories.identity) {
      exportData.identity = {
        firstName: "Demo",
        lastName: "User",
        dateOfBirth: "1990-01-15",
        nationality: "Swedish",
      }
      exportData.categories.push("identity")
    }

    // Export contact data
    if (categories.contact) {
      exportData.contact = {
        email: "demo@remittance.se",
        phone: "+46701234567",
        address: {
          line1: "Kungsgatan 1",
          city: "Stockholm",
          postalCode: "111 43",
          country: "SE",
        },
      }
      exportData.categories.push("contact")
    }

    // Export financial data
    if (categories.financial) {
      exportData.financial = {
        walletBalance: 5000.0,
        currency: "SEK",
        transactions: [], // Would fetch from database
        totalSent: 0,
        totalReceived: 0,
      }
      exportData.categories.push("financial")
    }

    // Export authentication data
    if (categories.authentication) {
      exportData.authentication = {
        accountCreated: "2024-01-01T00:00:00Z",
        lastLogin: new Date().toISOString(),
        twoFactorEnabled: false,
        loginHistory: [], // Would fetch from audit logs
      }
      exportData.categories.push("authentication")
    }

    // Export KYC data
    if (categories.kyc) {
      exportData.kyc = {
        status: "verified",
        verifiedAt: "2024-01-10T10:00:00Z",
        documents: [], // Would fetch KYC documents
        riskLevel: "low",
      }
      exportData.categories.push("kyc")
    }

    // Format data based on requested format
    let formattedData: any
    switch (format) {
      case "json":
        formattedData = JSON.stringify(exportData, null, 2)
        break
      case "csv":
        formattedData = convertToCSV(exportData)
        break
      case "pdf":
        formattedData = await generatePDF(exportData)
        break
      default:
        formattedData = JSON.stringify(exportData, null, 2)
    }

    logSecurityEvent({
      userId,
      action: "gdpr_data_export_completed",
      success: true,
      metadata: { format, categoriesCount: exportData.categories.length },
    })

    return { success: true, data: formattedData }
  } catch (error) {
    console.error("[v0] GDPR export error:", error)
    return { success: false, error: "Failed to export data" }
  }
}

// Delete user data in compliance with GDPR Article 17 (Right to Erasure)
export async function deleteUserData(
  userId: string,
  reason: string,
): Promise<{ success: boolean; deleted: string[]; retained: string[]; error?: string }> {
  try {
    logSecurityEvent({
      userId,
      action: "gdpr_erasure_requested",
      success: true,
      metadata: { reason },
    })

    const deleted: string[] = []
    const retained: string[] = []

    // Check what data can be deleted vs. must be retained
    for (const policy of DATA_RETENTION_POLICIES) {
      if (policy.canBeDeleted) {
        // Perform secure deletion
        await secureDelete(policy.category, userId)
        deleted.push(policy.category)
      } else {
        retained.push(policy.category)
      }
    }

    // Anonymize data that must be retained
    await anonymizeRetainedData(userId)

    logSecurityEvent({
      userId,
      action: "gdpr_erasure_completed",
      success: true,
      metadata: { deleted, retained },
    })

    return { success: true, deleted, retained }
  } catch (error) {
    console.error("[v0] GDPR deletion error:", error)
    return { success: false, deleted: [], retained: [], error: "Failed to delete data" }
  }
}

// Anonymize data that must be retained for legal reasons
async function anonymizeRetainedData(userId: string): Promise<void> {
  // Replace PII with anonymized values
  // Keep data structure for compliance but remove identifiable information
  console.log(`Anonymizing retained data for user ${userId}`)
  // In production:
  // - Replace name with "Anonymized User"
  // - Replace email with hashed version
  // - Replace phone with "***"
  // - Keep transaction amounts and dates for auditing
}

// Manage user consents
export async function recordConsent(
  userId: string,
  consentType: ConsentType,
  granted: boolean,
  version: string,
  ipAddress: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const consent: ConsentRecord = {
      userId,
      consentType,
      granted,
      grantedAt: new Date(),
      version,
      ipAddress,
    }

    if (!granted) {
      consent.revokedAt = new Date()
    }

    logSecurityEvent({
      userId,
      action: "consent_recorded",
      success: true,
      metadata: { consentType, granted },
    })

    // In production: Save to database
    return { success: true }
  } catch (error) {
    console.error("[v0] Consent recording error:", error)
    return { success: false, error: "Failed to record consent" }
  }
}

// Get user's current consents
export async function getUserConsents(userId: string): Promise<ConsentRecord[]> {
  // In production: Fetch from database
  return [
    {
      userId,
      consentType: ConsentType.TERMS_OF_SERVICE,
      granted: true,
      grantedAt: new Date("2024-01-01"),
      version: "1.0",
      ipAddress: "192.168.1.1",
    },
    {
      userId,
      consentType: ConsentType.PRIVACY_POLICY,
      granted: true,
      grantedAt: new Date("2024-01-01"),
      version: "1.0",
      ipAddress: "192.168.1.1",
    },
    {
      userId,
      consentType: ConsentType.MARKETING_EMAILS,
      granted: false,
      grantedAt: new Date("2024-01-01"),
      revokedAt: new Date("2024-02-15"),
      version: "1.0",
      ipAddress: "192.168.1.1",
    },
  ]
}

// Create GDPR request
export async function createGDPRRequest(
  userId: string,
  requestType: GDPRRight,
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    const requestId = `gdpr-${Date.now()}`

    const request: GDPRRequest = {
      id: requestId,
      userId,
      requestType,
      status: "pending",
      requestedAt: new Date(),
    }

    logSecurityEvent({
      userId,
      action: "gdpr_request_created",
      success: true,
      metadata: { requestId, requestType },
    })

    // In production: Save to database and notify compliance team
    return { success: true, requestId }
  } catch (error) {
    console.error("[v0] GDPR request error:", error)
    return { success: false, error: "Failed to create request" }
  }
}

// Helper functions
function convertToCSV(data: any): string {
  // Simple CSV conversion
  const lines: string[] = []
  lines.push("Category,Field,Value")

  Object.keys(data).forEach((category) => {
    if (typeof data[category] === "object" && !Array.isArray(data[category])) {
      Object.keys(data[category]).forEach((field) => {
        const value = data[category][field]
        lines.push(`${category},${field},"${value}"`)
      })
    }
  })

  return lines.join("\n")
}

async function generatePDF(data: any): Promise<string> {
  // In production: Use library like PDFKit or Puppeteer
  return `PDF generation would happen here for: ${JSON.stringify(data)}`
}

// Cookie consent management
export interface CookieCategory {
  id: string
  name: string
  description: string
  required: boolean
  enabled: boolean
}

export const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "necessary",
    name: "Necessary Cookies",
    description: "Required for the website to function properly",
    required: true,
    enabled: true,
  },
  {
    id: "functional",
    name: "Functional Cookies",
    description: "Remember your preferences and settings",
    required: false,
    enabled: false,
  },
  {
    id: "analytics",
    name: "Analytics Cookies",
    description: "Help us understand how you use our website",
    required: false,
    enabled: false,
  },
  {
    id: "marketing",
    name: "Marketing Cookies",
    description: "Used to track visitors and display relevant ads",
    required: false,
    enabled: false,
  },
]

export async function saveCookiePreferences(
  userId: string,
  preferences: Record<string, boolean>,
): Promise<{ success: boolean }> {
  logSecurityEvent({
    userId,
    action: "cookie_preferences_saved",
    success: true,
    metadata: { preferences },
  })

  // In production: Save to database
  return { success: true }
}
