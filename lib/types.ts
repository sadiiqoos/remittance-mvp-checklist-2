export interface User {
  id: string
  email: string
  phone: string | null
  first_name: string
  last_name: string
  date_of_birth: string | null
  nationality: string | null
  kyc_status: "pending" | "verified" | "rejected" | "expired"
  kyc_verified_at: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  postal_code: string | null
  country: string
  wallet_balance_sek: number
  risk_level: "low" | "medium" | "high"
  is_pep: boolean
  daily_limit_sek: number
  monthly_limit_sek: number
  account_status: "active" | "suspended" | "closed"
  two_factor_enabled: boolean
  two_factor_secret: string | null
  two_factor_backup_codes: string[] | null
  created_at: string
  updated_at: string
}

export interface Recipient {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  country: string
  city: string | null
  payout_method: "bank_transfer" | "mobile_money" | "cash_pickup" | "wallet"
  bank_name: string | null
  bank_account_number: string | null
  bank_code: string | null
  swift_code: string | null
  iban: string | null
  mobile_money_provider: string | null
  mobile_money_number: string | null
  pickup_location: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface Corridor {
  id: string
  name: string
  source_country: string
  destination_country: string
  destination_currency: string
  base_fee_sek: number
  fx_margin_percent: number
  min_transfer_sek: number
  max_transfer_sek: number
  estimated_delivery_hours: number
  is_active: boolean
  payout_methods?: string[]
  created_at: string
  updated_at: string
}

export interface ExchangeRate {
  id: string
  source_currency: string
  destination_currency: string
  rate: number
  provider: string
  valid_from: string
  valid_until: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  recipient_id: string | null
  reference_number: string
  source_amount: number
  source_currency: string
  destination_amount: number
  destination_currency: string
  exchange_rate: number
  exchange_rate_provider: string | null
  transfer_fee: number
  fx_margin: number
  total_deducted_sek: number
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | "refunded"
  corridor: string
  payout_method: string
  partner_transaction_id: string | null
  partner_name: string | null
  aml_check_status: "pending" | "passed" | "flagged" | "failed"
  aml_check_provider: string | null
  sanctions_check_status: "pending" | "passed" | "flagged" | "failed"
  initiated_at: string
  completed_at: string | null
  failed_at: string | null
  failure_reason: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface AdminStats {
  totalTransactions: number
  activeUsers: number
  flaggedTransactions: number
  totalVolumeSek: number
  successRate: number
  averageTransferTime: number
}

export interface ProviderBalance {
  provider: string
  country: string
  balance: number
  currency: string
  status: "healthy" | "low" | "critical"
  lastUpdated: string
}

export interface VelocityData {
  currentHourSek: number
  previousHourSek: number
  percentageChange: number
}

export interface KYCCase {
  id: string
  user_id: string
  user_name: string
  user_email: string
  status: "pending" | "approved" | "rejected"
  documents: KYCDocument[]
  pep_matches: PEPMatch[]
  sanction_matches: SanctionMatch[]
  risk_score: number
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  notes?: string
}

export interface KYCDocument {
  id: string
  type: "id_card" | "passport" | "selfie" | "proof_of_address"
  url: string
  status: "pending" | "verified" | "rejected"
  uploaded_at: string
}

export interface PEPMatch {
  id: string
  name: string
  country: string
  position: string
  matchScore: number
  status: "confirmed" | "dismissed" | "pending"
}

export interface SanctionMatch {
  id: string
  name: string
  list: string
  matchScore: number
  status: "confirmed" | "dismissed" | "pending"
}

export interface TransactionWithDetails extends Transaction {
  user_name: string
  user_email: string
  recipient_name: string
  recipient_country: string
  risk_score: number
  hold_reason?: string
  webhook_status?: "success" | "timeout" | "failed"
  webhook_response?: string
}

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: AdminRole
  permissions: AdminPermission[]
  two_factor_enabled: boolean
  two_factor_secret: string | null
  two_factor_backup_codes: string[] | null
  created_at: string
  created_by: string | null
  last_login: string | null
  is_active: boolean
}

export type AdminRole = "super_admin" | "admin" | "operations" | "compliance" | "finance" | "support"

export type AdminPermission =
  | "view_dashboard"
  | "view_transactions"
  | "approve_transactions"
  | "reject_transactions"
  | "view_kyc"
  | "approve_kyc"
  | "reject_kyc"
  | "manage_pricing"
  | "view_users"
  | "manage_users"
  | "manage_admins"
  | "view_reports"
  | "manage_settings"
