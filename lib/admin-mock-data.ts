import type {
  AdminStats,
  ProviderBalance,
  VelocityData,
  KYCCase,
  TransactionWithDetails,
  Corridor,
  ExchangeRate,
} from "./types"
import { mockTransactions, mockRecipients, mockUser, mockCorridors, mockExchangeRates } from "./mock-data"
import { ROLE_PERMISSIONS } from "./constants"

// Mock admin credentials
export const ADMIN_CREDENTIALS = {
  email: "admin@remittance.se",
  password: "admin123",
}

// Mock admin user
export const mockAdminUser: any = {
  id: "admin-1",
  email: "admin@remittance.se",
  first_name: "Admin",
  last_name: "User",
  role: "super_admin",
  permissions: ROLE_PERMISSIONS.super_admin,
  two_factor_enabled: false,
  two_factor_secret: null,
  two_factor_backup_codes: null,
  created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
  created_by: null,
  last_login: new Date().toISOString(),
  is_active: true,
}

// Mock sub-admin users
export const mockSubAdmins: any[] = [
  {
    id: "admin-2",
    email: "operations@remittance.se",
    first_name: "Maria",
    last_name: "Andersson",
    role: "operations",
    permissions: ROLE_PERMISSIONS.operations,
    two_factor_enabled: false,
    two_factor_secret: null,
    two_factor_backup_codes: null,
    created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "admin-1",
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: "admin-3",
    email: "compliance@remittance.se",
    first_name: "Erik",
    last_name: "Larsson",
    role: "compliance",
    permissions: ROLE_PERMISSIONS.compliance,
    two_factor_enabled: false,
    two_factor_secret: null,
    two_factor_backup_codes: null,
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "admin-1",
    last_login: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
  {
    id: "admin-4",
    email: "finance@remittance.se",
    first_name: "Sofia",
    last_name: "Bergström",
    role: "finance",
    permissions: ROLE_PERMISSIONS.finance,
    two_factor_enabled: false,
    two_factor_secret: null,
    two_factor_backup_codes: null,
    created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "admin-1",
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
  },
]

// Mock provider balances
export const mockProviderBalances: ProviderBalance[] = [
  {
    provider: "M-Pesa Kenya",
    country: "KE",
    balance: 2450000,
    currency: "KES",
    status: "healthy",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "M-Pesa Tanzania",
    country: "TZ",
    balance: 850000,
    currency: "TZS",
    status: "low",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "WAAFiPay Somalia",
    country: "SO",
    balance: 450000,
    currency: "USD",
    status: "healthy",
    lastUpdated: new Date().toISOString(),
  },
  {
    provider: "GTBank Nigeria",
    country: "NG",
    balance: 15000000,
    currency: "NGN",
    status: "healthy",
    lastUpdated: new Date().toISOString(),
  },
]

// Mock velocity data
export function getMockVelocityData(): VelocityData {
  const currentHourSek = 125000 + Math.random() * 50000
  const previousHourSek = 100000 + Math.random() * 40000
  const percentageChange = ((currentHourSek - previousHourSek) / previousHourSek) * 100

  return {
    currentHourSek,
    previousHourSek,
    percentageChange,
  }
}

// Mock admin stats
export function getMockAdminStats(): AdminStats {
  const totalTransactions = mockTransactions.length + 150
  const completedTransactions = mockTransactions.filter((t) => t.status === "completed").length + 142

  return {
    totalTransactions,
    activeUsers: 42,
    flaggedTransactions: 8,
    totalVolumeSek: 2450000,
    successRate: (completedTransactions / totalTransactions) * 100,
    averageTransferTime: 18.5,
  }
}

// Mock flagged transactions
export const mockFlaggedTransactions: TransactionWithDetails[] = [
  {
    id: "txn-flagged-1",
    user_id: "user-suspicious-1",
    recipient_id: "recip-101",
    reference_number: "REF20240123FLG001",
    source_amount: 50000.0,
    source_currency: "SEK",
    destination_amount: 672500.0,
    destination_currency: "KES",
    exchange_rate: 13.45,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: 49.0,
    fx_margin: 0,
    total_deducted_sek: 50049.0,
    status: "pending",
    corridor: "Sweden to Kenya",
    payout_method: "mobile_money",
    partner_name: "mock-partner",
    aml_check_status: "flagged",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "passed",
    initiated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
    failed_at: null,
    failure_reason: null,
    notes: null,
    user_name: "Erik Johansson",
    user_email: "erik.j@example.com",
    recipient_name: "Peter Mwangi",
    recipient_country: "KE",
    risk_score: 85,
    hold_reason: "First time sending large amount (50,000 SEK). User registered 3 days ago.",
    webhook_status: undefined,
  },
  {
    id: "txn-flagged-2",
    user_id: "user-suspicious-2",
    recipient_id: "recip-102",
    reference_number: "REF20240123FLG002",
    source_amount: 15000.0,
    source_currency: "SEK",
    destination_amount: 2142000.0,
    destination_currency: "NGN",
    exchange_rate: 142.8,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: 59.0,
    fx_margin: 0,
    total_deducted_sek: 15059.0,
    status: "pending",
    corridor: "Sweden to Nigeria",
    payout_method: "bank_transfer",
    partner_name: "mock-partner",
    aml_check_status: "flagged",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "passed",
    initiated_at: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
    failed_at: null,
    failure_reason: null,
    notes: null,
    user_name: "Anna Bergström",
    user_email: "anna.b@example.com",
    recipient_name: "Oluwaseun Adeyemi",
    recipient_country: "NG",
    risk_score: 72,
    hold_reason: "Velocity check: 3 transactions in last hour totaling 35,000 SEK",
    webhook_status: undefined,
  },
  {
    id: "txn-flagged-3",
    user_id: "user-suspicious-3",
    recipient_id: "recip-103",
    reference_number: "REF20240123FLG003",
    source_amount: 8000.0,
    source_currency: "SEK",
    destination_amount: 107600.0,
    destination_currency: "KES",
    exchange_rate: 13.45,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: 49.0,
    fx_margin: 0,
    total_deducted_sek: 8049.0,
    status: "pending",
    corridor: "Sweden to Kenya",
    payout_method: "cash_pickup",
    partner_name: "mock-partner",
    aml_check_status: "flagged",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "flagged",
    initiated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
    failed_at: null,
    failure_reason: null,
    notes: null,
    user_name: "Lars Andersson",
    user_email: "lars.a@example.com",
    recipient_name: "Mohammed Hassan",
    recipient_country: "KE",
    risk_score: 68,
    hold_reason: "Recipient name partial match on sanctions list (60% similarity)",
    webhook_status: undefined,
  },
]

// Mock KYC cases
export const mockKYCCases: KYCCase[] = [
  {
    id: "kyc-1",
    user_id: "user-kyc-1",
    user_name: "Sara Lindström",
    user_email: "sara.l@example.com",
    status: "pending",
    documents: [
      {
        id: "doc-1",
        type: "passport",
        url: "/passport-document.png",
        status: "verified",
        uploaded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "doc-2",
        type: "selfie",
        url: "/diverse-group-selfie.png",
        status: "verified",
        uploaded_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    pep_matches: [
      {
        id: "pep-1",
        name: "Sara Lindstrom",
        country: "Sweden",
        position: "Municipal Council Member, Gothenburg",
        matchScore: 78,
        status: "pending",
      },
    ],
    sanction_matches: [],
    risk_score: 45,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "kyc-2",
    user_id: "user-kyc-2",
    user_name: "Mohammed Ali",
    user_email: "mohammed.a@example.com",
    status: "pending",
    documents: [
      {
        id: "doc-3",
        type: "id_card",
        url: "/id-card-document.jpg",
        status: "pending",
        uploaded_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "doc-4",
        type: "selfie",
        url: "/person-selfie-photo.jpg",
        status: "pending",
        uploaded_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
    pep_matches: [],
    sanction_matches: [],
    risk_score: 32,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock functions for admin operations
export function getMockFlaggedTransactions(): Promise<TransactionWithDetails[]> {
  return Promise.resolve(mockFlaggedTransactions)
}

export function getMockAllTransactionsAdmin(): Promise<TransactionWithDetails[]> {
  const allTransactions: TransactionWithDetails[] = [
    ...mockFlaggedTransactions,
    ...mockTransactions.map((t) => {
      const recipient = mockRecipients.find((r) => r.id === t.recipient_id)
      return {
        ...t,
        user_name: `${mockUser.first_name} ${mockUser.last_name}`,
        user_email: mockUser.email,
        recipient_name: recipient ? `${recipient.first_name} ${recipient.last_name}` : "Unknown",
        recipient_country: recipient?.country || "Unknown",
        risk_score: Math.floor(Math.random() * 40) + 10, // 10-50 for normal transactions
        webhook_status: t.status === "completed" ? "success" : undefined,
      }
    }),
  ]

  return Promise.resolve(
    allTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
  )
}

export function getMockTransactionAdmin(id: string): Promise<TransactionWithDetails> {
  const flagged = mockFlaggedTransactions.find((t) => t.id === id)
  if (flagged) {
    return Promise.resolve(flagged)
  }

  const transaction = mockTransactions.find((t) => t.id === id)
  if (!transaction) {
    throw new Error(`Transaction not found: ${id}`)
  }

  const recipient = mockRecipients.find((r) => r.id === transaction.recipient_id)

  return Promise.resolve({
    ...transaction,
    user_name: `${mockUser.first_name} ${mockUser.last_name}`,
    user_email: mockUser.email,
    recipient_name: recipient ? `${recipient.first_name} ${recipient.last_name}` : "Unknown",
    recipient_country: recipient?.country || "Unknown",
    risk_score: Math.floor(Math.random() * 40) + 10,
    webhook_status: transaction.status === "completed" ? "success" : undefined,
  })
}

export function releaseTransaction(id: string, notes?: string): Promise<void> {
  const transaction = mockFlaggedTransactions.find((t) => t.id === id)
  if (transaction) {
    transaction.status = "processing"
    transaction.aml_check_status = "passed"
    transaction.notes = notes || "Released by admin"
    transaction.updated_at = new Date().toISOString()

    // Auto-complete after 2 seconds
    setTimeout(() => {
      transaction.status = "completed"
      transaction.completed_at = new Date().toISOString()
      transaction.webhook_status = "success"
    }, 2000)
  }
  return Promise.resolve()
}

export function refundTransaction(id: string, reason: string): Promise<void> {
  const transaction = mockFlaggedTransactions.find((t) => t.id === id)
  if (transaction) {
    transaction.status = "refunded"
    transaction.notes = `Refunded: ${reason}`
    transaction.updated_at = new Date().toISOString()
  }
  return Promise.resolve()
}

export function requestMoreInfo(id: string, message: string): Promise<void> {
  const transaction = mockFlaggedTransactions.find((t) => t.id === id)
  if (transaction) {
    transaction.notes = `More info requested: ${message}`
    transaction.updated_at = new Date().toISOString()
  }
  return Promise.resolve()
}

export function getMockKYCCases(): Promise<KYCCase[]> {
  return Promise.resolve(mockKYCCases)
}

export function getMockKYCCase(id: string): Promise<KYCCase> {
  const kycCase = mockKYCCases.find((k) => k.id === id)
  if (!kycCase) {
    throw new Error(`KYC case not found: ${id}`)
  }
  return Promise.resolve(kycCase)
}

export function approveKYCCase(id: string, notes: string): Promise<void> {
  const kycCase = mockKYCCases.find((k) => k.id === id)
  if (kycCase) {
    kycCase.status = "approved"
    kycCase.notes = notes
    kycCase.reviewed_at = new Date().toISOString()
    kycCase.reviewed_by = "admin-1"
  }
  return Promise.resolve()
}

export function rejectKYCCase(id: string, reason: string): Promise<void> {
  const kycCase = mockKYCCases.find((k) => k.id === id)
  if (kycCase) {
    kycCase.status = "rejected"
    kycCase.notes = reason
    kycCase.reviewed_at = new Date().toISOString()
    kycCase.reviewed_by = "admin-1"
  }
  return Promise.resolve()
}

export function updatePEPMatchStatus(
  kycCaseId: string,
  pepMatchId: string,
  status: "confirmed" | "dismissed",
  note: string,
): Promise<void> {
  const kycCase = mockKYCCases.find((k) => k.id === kycCaseId)
  if (kycCase) {
    const pepMatch = kycCase.pep_matches.find((p) => p.id === pepMatchId)
    if (pepMatch) {
      pepMatch.status = status
    }
  }
  return Promise.resolve()
}

export function updateCorridorFees(
  corridorId: string,
  data: {
    baseFee?: number
    fxMargin?: number
    minTransfer?: number
    maxTransfer?: number
  },
): Promise<void> {
  const corridor = mockCorridors.find((c) => c.id === corridorId)
  if (corridor) {
    if (data.baseFee !== undefined) corridor.base_fee_sek = data.baseFee
    if (data.fxMargin !== undefined) corridor.fx_margin_percent = data.fxMargin
    if (data.minTransfer !== undefined) corridor.min_transfer_sek = data.minTransfer
    if (data.maxTransfer !== undefined) corridor.max_transfer_sek = data.maxTransfer
    corridor.updated_at = new Date().toISOString()
  }
  return Promise.resolve()
}

export function updateExchangeRate(currency: string, newRate: number): Promise<void> {
  const rate = mockExchangeRates.find((r) => r.source_currency === "SEK" && r.destination_currency === currency)
  if (rate) {
    rate.rate = newRate
    rate.created_at = new Date().toISOString()
    rate.valid_until = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
  return Promise.resolve()
}

export function getAllCorridorsAdmin(): Promise<Corridor[]> {
  return Promise.resolve(mockCorridors)
}

export function getAllExchangeRatesAdmin(): Promise<ExchangeRate[]> {
  return Promise.resolve(mockExchangeRates)
}

export function getPendingKYCCases(): any[] {
  return mockKYCCases
    .filter((k) => k.status === "pending" || k.status === "approved" || k.status === "rejected")
    .map((kycCase) => ({
      id: kycCase.id,
      user_id: kycCase.user_id,
      email: kycCase.user_email,
      first_name: kycCase.user_name.split(" ")[0],
      last_name: kycCase.user_name.split(" ").slice(1).join(" "),
      kyc_status: kycCase.status,
      date_of_birth: "1990-01-01",
      nationality: "SE",
      phone_number: "+46701234567",
      submitted_at: kycCase.created_at,
      documents: kycCase.documents.map((doc) => ({
        type: doc.type,
        url: doc.url,
        uploaded_at: doc.uploaded_at,
      })),
    }))
}

export function updateUserKYCStatus(userId: string, newStatus: "verified" | "rejected"): void {
  const kycCase = mockKYCCases.find((k) => k.user_id === userId)
  if (kycCase) {
    kycCase.status = newStatus === "verified" ? "approved" : "rejected"
    kycCase.reviewed_at = new Date().toISOString()
    kycCase.reviewed_by = "admin-1"
  }
}

export function getAllTransactions(): any[] {
  const allTransactions = [
    ...mockFlaggedTransactions,
    ...mockTransactions.map((t) => {
      const recipient = mockRecipients.find((r) => r.id === t.recipient_id)
      return {
        ...t,
        user: {
          email: mockUser.email,
          first_name: mockUser.first_name,
          last_name: mockUser.last_name,
        },
        recipient: recipient
          ? {
              first_name: recipient.first_name,
              last_name: recipient.last_name,
              country: recipient.country,
            }
          : undefined,
        compliance_check_status: t.aml_check_status || "passed",
      }
    }),
  ]

  return allTransactions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

export function updateTransactionStatus(transactionId: string, newStatus: string): void {
  const flagged = mockFlaggedTransactions.find((t) => t.id === transactionId)
  if (flagged) {
    flagged.status = newStatus as any
    flagged.updated_at = new Date().toISOString()
    if (newStatus === "completed") {
      flagged.completed_at = new Date().toISOString()
    } else if (newStatus === "failed") {
      flagged.failed_at = new Date().toISOString()
    }
    return
  }

  const transaction = mockTransactions.find((t) => t.id === transactionId)
  if (transaction) {
    transaction.status = newStatus as any
    transaction.updated_at = new Date().toISOString()
    if (newStatus === "completed") {
      transaction.completed_at = new Date().toISOString()
    } else if (newStatus === "failed") {
      transaction.failed_at = new Date().toISOString()
    }
  }
}

// Functions to manage sub-admins
export function getAllAdmins(): any[] {
  return [mockAdminUser, ...mockSubAdmins]
}

export function getAdminById(id: string): any | null {
  const allAdmins = getAllAdmins()
  return allAdmins.find((admin) => admin.id === id) || null
}

export function createSubAdmin(data: {
  email: string
  first_name: string
  last_name: string
  role: any
  password: string
}): any {
  const newAdmin = {
    id: `admin-${mockSubAdmins.length + 2}`,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    role: data.role,
    permissions: ROLE_PERMISSIONS[data.role as keyof typeof ROLE_PERMISSIONS] || [],
    two_factor_enabled: false,
    two_factor_secret: null,
    two_factor_backup_codes: null,
    created_at: new Date().toISOString(),
    created_by: mockAdminUser.id,
    last_login: null,
    is_active: true,
  }

  mockSubAdmins.push(newAdmin)
  return newAdmin
}

export function updateAdminRole(adminId: string, newRole: any): void {
  const admin = mockSubAdmins.find((a) => a.id === adminId)
  if (admin) {
    admin.role = newRole
    admin.permissions = ROLE_PERMISSIONS[newRole as keyof typeof ROLE_PERMISSIONS] || []
  }
}

export function toggleAdminStatus(adminId: string): void {
  const admin = mockSubAdmins.find((a) => a.id === adminId)
  if (admin) {
    admin.is_active = !admin.is_active
  }
}

export function deleteAdmin(adminId: string): void {
  const index = mockSubAdmins.findIndex((a) => a.id === adminId)
  if (index !== -1) {
    mockSubAdmins.splice(index, 1)
  }
}

export function updateAdminPassword(adminId: string, newPassword: string): void {
  const admin = mockSubAdmins.find((a) => a.id === adminId)
  if (admin) {
    // In a real app, this would hash the password
    admin.password = newPassword
    admin.updated_at = new Date().toISOString()
  }

  // Also check if it's the main admin user
  if (mockAdminUser.id === adminId) {
    mockAdminUser.password = newPassword
  }
}

export function updateUserPassword(userId: string, newPassword: string): void {
  // In a real app, this would update the user's password in the database
  // For now, just return success
  if (mockUser.id === userId) {
    mockUser.password = newPassword
  }
}

// Mock users
const mockUsers = [
  {
    ...mockUser,
    kyc_status: "verified",
    account_status: "active",
  },
  {
    id: "user-2",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    phone: "+46702345678",
    date_of_birth: "1985-03-20",
    nationality: "Swedish",
    address_line1: "Drottninggatan 50",
    address_line2: null,
    city: "Stockholm",
    postal_code: "111 21",
    country: "SE",
    wallet_balance_sek: 2500.0,
    kyc_status: "pending",
    kyc_verified_at: null,
    risk_level: "low",
    is_pep: false,
    daily_limit_sek: 15000.0,
    monthly_limit_sek: 50000.0,
    account_status: "active",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "user-3",
    email: "maria.svensson@example.com",
    first_name: "Maria",
    last_name: "Svensson",
    phone: "+46703456789",
    date_of_birth: "1992-07-12",
    nationality: "Swedish",
    address_line1: "Vasagatan 22",
    address_line2: null,
    city: "Gothenburg",
    postal_code: "411 24",
    country: "SE",
    wallet_balance_sek: 8200.0,
    kyc_status: "verified",
    kyc_verified_at: "2024-01-20T00:00:00Z",
    risk_level: "low",
    is_pep: false,
    daily_limit_sek: 15000.0,
    monthly_limit_sek: 50000.0,
    account_status: "suspended",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
]

export function getAllUsers(): any[] {
  return mockUsers
}

export function toggleUserStatus(userId: string): void {
  const user = mockUsers.find((u) => u.id === userId)
  if (user) {
    user.account_status = user.account_status === "active" ? "suspended" : "active"
  }
}

// Functions to enable/disable 2FA
export function enable2FAForAdmin(adminId: string, secret: string, backupCodes: string[]): boolean {
  const admin = getAllAdmins().find((a) => a.id === adminId)
  if (!admin) return false

  admin.two_factor_enabled = true
  admin.two_factor_secret = secret
  admin.two_factor_backup_codes = backupCodes

  return true
}

export function disable2FAForAdmin(adminId: string): boolean {
  const admin = getAllAdmins().find((a) => a.id === adminId)
  if (!admin) return false

  admin.two_factor_enabled = false
  admin.two_factor_secret = null
  admin.two_factor_backup_codes = null

  return true
}
