import type { Corridor, ExchangeRate, Recipient, User, Transaction } from "./types"

// Mock demo user
export const mockUser: User = {
  id: "demo-user-123",
  email: "demo@remittance.se",
  phone: "+46701234567",
  first_name: "Demo",
  last_name: "User",
  date_of_birth: "1990-01-15",
  nationality: "Swedish",
  address_line1: "Kungsgatan 1",
  address_line2: null,
  city: "Stockholm",
  postal_code: "111 43",
  country: "SE",
  wallet_balance_sek: 5000.0,
  kyc_status: "verified",
  kyc_verified_at: "2024-01-10T10:00:00Z",
  risk_level: "low",
  is_pep: false,
  daily_limit_sek: 15000.0,
  monthly_limit_sek: 50000.0,
  account_status: "active",
  two_factor_enabled: false,
  two_factor_secret: null,
  two_factor_backup_codes: null,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-10T10:00:00Z",
}

// Mock corridors
export const mockCorridors: Corridor[] = [
  {
    id: "corr-1",
    name: "Sweden to Kenya",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "KE",
    destination_currency: "KES",
    base_fee_sek: 49.0,
    fx_margin_percent: 2.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 24,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-2",
    name: "Sweden to Nigeria",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "NG",
    destination_currency: "NGN",
    base_fee_sek: 59.0,
    fx_margin_percent: 3.0,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 48,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-3",
    name: "Sweden to Ghana",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "GH",
    destination_currency: "GHS",
    base_fee_sek: 54.0,
    fx_margin_percent: 2.8,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 36,
    payout_methods: ["mobile_money", "bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-4",
    name: "Sweden to Uganda",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "UG",
    destination_currency: "UGX",
    base_fee_sek: 49.0,
    fx_margin_percent: 2.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 24,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-5",
    name: "Sweden to Tanzania",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "TZ",
    destination_currency: "TZS",
    base_fee_sek: 52.0,
    fx_margin_percent: 2.6,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 30,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-6",
    name: "Sweden to South Africa",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "ZA",
    destination_currency: "ZAR",
    base_fee_sek: 45.0,
    fx_margin_percent: 2.2,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 12,
    payout_methods: ["bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-7",
    name: "Sweden to Ethiopia",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "ET",
    destination_currency: "ETB",
    base_fee_sek: 57.0,
    fx_margin_percent: 2.9,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 48,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-8",
    name: "Sweden to Rwanda",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "RW",
    destination_currency: "RWF",
    base_fee_sek: 51.0,
    fx_margin_percent: 2.7,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 36,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  // Sweden to all destinations
  {
    id: "corr-se-dj",
    name: "Sweden to Djibouti",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "DJ",
    destination_currency: "DJF",
    base_fee_sek: 55.0,
    fx_margin_percent: 2.8,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 48,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-et",
    name: "Sweden to Ethiopia",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "ET",
    destination_currency: "ETB",
    base_fee_sek: 57.0,
    fx_margin_percent: 2.9,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 48,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-in",
    name: "Sweden to India",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "IN",
    destination_currency: "INR",
    base_fee_sek: 45.0,
    fx_margin_percent: 2.0,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 12,
    payout_methods: ["bank_transfer", "mobile_money"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-ke",
    name: "Sweden to Kenya",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "KE",
    destination_currency: "KES",
    base_fee_sek: 49.0,
    fx_margin_percent: 2.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 24,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-ly",
    name: "Sweden to Libya",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "LY",
    destination_currency: "LYD",
    base_fee_sek: 65.0,
    fx_margin_percent: 3.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 72,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-ng",
    name: "Sweden to Nigeria",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "NG",
    destination_currency: "NGN",
    base_fee_sek: 59.0,
    fx_margin_percent: 3.0,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 48,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-sa",
    name: "Sweden to Saudi Arabia",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "SA",
    destination_currency: "SAR",
    base_fee_sek: 42.0,
    fx_margin_percent: 1.8,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 6,
    payout_methods: ["bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-so",
    name: "Sweden to Somalia",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "SO",
    destination_currency: "SOS",
    base_fee_sek: 62.0,
    fx_margin_percent: 3.2,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 60,
    payout_methods: ["mobile_money", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-sl",
    name: "Sweden to Somaliland",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "SL",
    destination_currency: "SLS",
    base_fee_sek: 64.0,
    fx_margin_percent: 3.3,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 72,
    payout_methods: ["mobile_money", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-za",
    name: "Sweden to South Africa",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "ZA",
    destination_currency: "ZAR",
    base_fee_sek: 45.0,
    fx_margin_percent: 2.2,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 12,
    payout_methods: ["bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-ss",
    name: "Sweden to South Sudan",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "SS",
    destination_currency: "SSP",
    base_fee_sek: 68.0,
    fx_margin_percent: 3.7,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 72,
    payout_methods: ["bank_transfer", "cash_pickup"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-tz",
    name: "Sweden to Tanzania",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "TZ",
    destination_currency: "TZS",
    base_fee_sek: 52.0,
    fx_margin_percent: 2.6,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 30,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-tr",
    name: "Sweden to Turkey",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "TR",
    destination_currency: "TRY",
    base_fee_sek: 38.0,
    fx_margin_percent: 1.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 4,
    payout_methods: ["bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "corr-se-ug",
    name: "Sweden to Uganda",
    source_country: "SE",
    source_currency: "SEK",
    destination_country: "UG",
    destination_currency: "UGX",
    base_fee_sek: 49.0,
    fx_margin_percent: 2.5,
    min_transfer_sek: 100.0,
    max_transfer_sek: 50000.0,
    estimated_delivery_hours: 24,
    payout_methods: ["mobile_money", "bank_transfer"],
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Mock exchange rates
export const mockExchangeRates: ExchangeRate[] = [
  {
    id: "rate-1",
    source_currency: "SEK",
    destination_currency: "KES",
    rate: 13.45,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-2",
    source_currency: "SEK",
    destination_currency: "NGN",
    rate: 142.8,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-3",
    source_currency: "SEK",
    destination_currency: "GHS",
    rate: 1.45,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-4",
    source_currency: "SEK",
    destination_currency: "UGX",
    rate: 365.2,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-5",
    source_currency: "SEK",
    destination_currency: "TZS",
    rate: 245.6,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-6",
    source_currency: "SEK",
    destination_currency: "ZAR",
    rate: 1.78,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-7",
    source_currency: "SEK",
    destination_currency: "ETB",
    rate: 11.92,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-8",
    source_currency: "SEK",
    destination_currency: "RWF",
    rate: 132.45,
    provider: "mock-fx-provider",
    valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-1",
    source_currency: "SEK",
    destination_currency: "DJF",
    rate: 16.25,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-2",
    source_currency: "SEK",
    destination_currency: "ETB",
    rate: 5.45,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-3",
    source_currency: "SEK",
    destination_currency: "INR",
    rate: 7.85,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-4",
    source_currency: "SEK",
    destination_currency: "KES",
    rate: 12.34,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-5",
    source_currency: "SEK",
    destination_currency: "LYD",
    rate: 0.45,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-6",
    source_currency: "SEK",
    destination_currency: "NGN",
    rate: 145.67,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-7",
    source_currency: "SEK",
    destination_currency: "SAR",
    rate: 0.35,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-8",
    source_currency: "SEK",
    destination_currency: "SOS",
    rate: 53.42,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-9",
    source_currency: "SEK",
    destination_currency: "SLS",
    rate: 55.2,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-10",
    source_currency: "SEK",
    destination_currency: "ZAR",
    rate: 1.72,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-11",
    source_currency: "SEK",
    destination_currency: "SSP",
    rate: 123.45,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-12",
    source_currency: "SEK",
    destination_currency: "TZS",
    rate: 234.56,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-13",
    source_currency: "SEK",
    destination_currency: "TRY",
    rate: 3.25,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
  {
    id: "rate-14",
    source_currency: "SEK",
    destination_currency: "UGX",
    rate: 345.67,
    markup_percent: 0,
    provider: "mock",
    created_at: new Date().toISOString(),
  },
]

// Mock recipients
export const mockRecipients: Recipient[] = [
  {
    id: "recip-1",
    user_id: "demo-user-123",
    first_name: "John",
    last_name: "Kamau",
    email: "john.kamau@example.com",
    phone_number: "+254712345678",
    country: "KE",
    city: "Nairobi",
    address_line1: "Kenyatta Avenue 123",
    payout_method: "mobile_money",
    mobile_money_number: "+254712345678",
    mobile_money_provider: "M-Pesa",
    is_favorite: true,
    is_verified: true,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "recip-2",
    user_id: "demo-user-123",
    first_name: "Grace",
    last_name: "Wanjiku",
    email: "grace.w@example.com",
    phone_number: "+254723456789",
    country: "KE",
    city: "Mombasa",
    address_line1: "Moi Avenue 45",
    payout_method: "bank_transfer",
    bank_name: "Equity Bank",
    bank_account_number: "0123456789",
    bank_code: "EQUITY",
    is_favorite: false,
    is_verified: true,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "recip-3",
    user_id: "demo-user-123",
    first_name: "Oluwaseun",
    last_name: "Adeyemi",
    email: "oluwa@example.com",
    phone_number: "+2348012345678",
    country: "NG",
    city: "Lagos",
    address_line1: "Victoria Island",
    payout_method: "bank_transfer",
    bank_name: "GTBank",
    bank_account_number: "0123456789",
    bank_code: "GTBANK",
    is_favorite: true,
    is_verified: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
]

// Mock transactions storage
export const mockTransactions: Transaction[] = [
  {
    id: "txn-1",
    user_id: "demo-user-123",
    recipient_id: "recip-1",
    reference_number: "REF20240115ABC123",
    source_amount: 1000.0,
    source_currency: "SEK",
    destination_amount: 13450.0,
    destination_currency: "KES",
    exchange_rate: 13.45,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: 49.0,
    fx_margin: 0,
    total_deducted_sek: 1049.0,
    status: "completed",
    corridor: "Sweden to Kenya",
    payout_method: "mobile_money",
    partner_name: "mock-partner",
    aml_check_status: "passed",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "passed",
    initiated_at: "2024-01-15T10:30:00Z",
    completed_at: "2024-01-15T14:30:00Z",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T14:30:00Z",
    failed_at: null,
    failure_reason: null,
    notes: null,
    partner_transaction_id: null,
  },
  {
    id: "txn-2",
    user_id: "demo-user-123",
    recipient_id: "recip-3",
    reference_number: "REF20240112XYZ789",
    source_amount: 2000.0,
    source_currency: "SEK",
    destination_amount: 285600.0,
    destination_currency: "NGN",
    exchange_rate: 142.8,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: 59.0,
    fx_margin: 0,
    total_deducted_sek: 2059.0,
    status: "completed",
    corridor: "Sweden to Nigeria",
    payout_method: "bank_transfer",
    partner_name: "mock-partner",
    aml_check_status: "passed",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "passed",
    initiated_at: "2024-01-12T09:00:00Z",
    completed_at: "2024-01-13T11:00:00Z",
    created_at: "2024-01-12T09:00:00Z",
    updated_at: "2024-01-13T11:00:00Z",
    failed_at: null,
    failure_reason: null,
    notes: null,
    partner_transaction_id: null,
  },
]

// Mock transaction status history
type TransactionStatusHistory = {
  id: string
  transaction_id: string
  old_status?: string
  new_status: string
  notes?: string
  created_at: string
}

const mockStatusHistory: TransactionStatusHistory[] = [
  {
    id: "hist-1",
    transaction_id: "txn-1",
    new_status: "processing",
    notes: "Transaction initiated by user",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "hist-2",
    transaction_id: "txn-1",
    old_status: "processing",
    new_status: "completed",
    notes: "Transaction completed by partner",
    created_at: "2024-01-15T14:30:00Z",
  },
  {
    id: "hist-3",
    transaction_id: "txn-2",
    new_status: "processing",
    notes: "Transaction initiated by user",
    created_at: "2024-01-12T09:00:00Z",
  },
  {
    id: "hist-4",
    transaction_id: "txn-2",
    old_status: "processing",
    new_status: "completed",
    notes: "Transaction completed by partner",
    created_at: "2024-01-13T11:00:00Z",
  },
]

export function getCorridors(): Corridor[] {
  return mockCorridors.filter((c) => c.is_active)
}

export function getExchangeRate(sourceCurrency: string, destinationCurrency: string): ExchangeRate {
  const rate = mockExchangeRates.find(
    (r) => r.source_currency === sourceCurrency && r.destination_currency === destinationCurrency,
  )
  if (!rate) {
    throw new Error(`Exchange rate not found for ${sourceCurrency} to ${destinationCurrency}`)
  }
  return rate
}

// Helper functions to simulate database operations
export function getMockCorridors(): Promise<Corridor[]> {
  return Promise.resolve(mockCorridors.filter((c) => c.is_active))
}

export function getMockExchangeRate(sourceCurrency: string, destinationCurrency: string): Promise<ExchangeRate> {
  const rate = mockExchangeRates.find(
    (r) => r.source_currency === sourceCurrency && r.destination_currency === destinationCurrency,
  )
  if (!rate) {
    throw new Error(`Exchange rate not found for ${sourceCurrency} to ${destinationCurrency}`)
  }
  return Promise.resolve(rate)
}

export function getMockRecipients(userId: string): Promise<Recipient[]> {
  const recipients = mockRecipients
    .filter((r) => r.user_id === userId)
    .sort((a, b) => {
      if (a.is_favorite !== b.is_favorite) {
        return a.is_favorite ? -1 : 1
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  return Promise.resolve(recipients)
}

export function getMockUser(): Promise<User> {
  return Promise.resolve(mockUser)
}

export function createMockTransaction(data: {
  userId: string
  recipientId: string
  sourceAmount: number
  destinationAmount: number
  destinationCurrency: string
  exchangeRate: number
  transferFee: number
  totalDeducted: number
  corridor: string
  payoutMethod: string
}): Promise<Transaction> {
  const referenceNumber = `REF${Date.now()}${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    user_id: data.userId,
    recipient_id: data.recipientId,
    reference_number: referenceNumber,
    source_amount: data.sourceAmount,
    source_currency: "SEK",
    destination_amount: data.destinationAmount,
    destination_currency: data.destinationCurrency,
    exchange_rate: data.exchangeRate,
    exchange_rate_provider: "mock-fx-provider",
    transfer_fee: data.transferFee,
    fx_margin: 0,
    total_deducted_sek: data.totalDeducted,
    status: "processing",
    corridor: data.corridor,
    payout_method: data.payoutMethod,
    partner_name: "mock-partner",
    aml_check_status: "passed",
    aml_check_provider: "mock-aml-provider",
    sanctions_check_status: "passed",
    initiated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    failed_at: null,
    failure_reason: null,
    notes: null,
    partner_transaction_id: null,
  }

  mockTransactions.push(transaction)

  mockStatusHistory.push({
    id: `hist-${Date.now()}`,
    transaction_id: transaction.id,
    new_status: "processing",
    notes: "Transaction initiated by user",
    created_at: new Date().toISOString(),
  })

  // Update user wallet balance
  mockUser.wallet_balance_sek -= data.totalDeducted
  mockUser.spending_current_month_sek += data.totalDeducted

  // Mock auto-complete after 2 seconds
  setTimeout(() => {
    const txn = mockTransactions.find((t) => t.id === transaction.id)
    if (txn) {
      txn.status = "completed"
      txn.completed_at = new Date().toISOString()
      txn.updated_at = new Date().toISOString()

      mockStatusHistory.push({
        id: `hist-${Date.now()}-complete`,
        transaction_id: transaction.id,
        old_status: "processing",
        new_status: "completed",
        notes: "Transaction completed by partner",
        created_at: new Date().toISOString(),
      })
    }
  }, 2000)

  return Promise.resolve(transaction)
}

export function getMockTransactions(userId: string): Promise<Transaction[]> {
  const transactions = mockTransactions
    .filter((t) => t.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return Promise.resolve(transactions)
}

export function getMockTransaction(id: string): Promise<Transaction> {
  const transaction = mockTransactions.find((t) => t.id === id)
  if (!transaction) {
    throw new Error(`Transaction not found: ${id}`)
  }
  return Promise.resolve(transaction)
}

export function getMockRecipient(id: string): Promise<Recipient> {
  const recipient = mockRecipients.find((r) => r.id === id)
  if (!recipient) {
    throw new Error(`Recipient not found: ${id}`)
  }
  return Promise.resolve(recipient)
}

// Recipient CRUD operations
export function createMockRecipient(data: {
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
}): Promise<Recipient> {
  const newRecipient: Recipient = {
    id: `recip-${Date.now()}`,
    user_id: data.userId,
    first_name: data.firstName,
    last_name: data.lastName,
    country: data.country,
    payout_method: data.payoutMethod,
    phone_number: data.phone,
    email: data.email,
    city: data.city,
    bank_name: data.bankName,
    bank_account_number: data.bankAccountNumber,
    bank_code: data.bankCode,
    swift_code: data.swiftCode,
    iban: data.iban,
    mobile_money_provider: data.mobileMoneyProvider,
    mobile_money_number: data.mobileMoneyNumber,
    pickup_location: data.pickupLocation,
    is_favorite: false,
    is_verified: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockRecipients.push(newRecipient)
  return Promise.resolve(newRecipient)
}

export function updateMockRecipient(
  recipientId: string,
  data: {
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
): Promise<Recipient> {
  const recipient = mockRecipients.find((r) => r.id === recipientId)
  if (!recipient) {
    throw new Error(`Recipient not found: ${recipientId}`)
  }

  recipient.first_name = data.firstName
  recipient.last_name = data.lastName
  recipient.phone_number = data.phone
  recipient.email = data.email
  recipient.city = data.city
  recipient.bank_name = data.bankName
  recipient.bank_account_number = data.bankAccountNumber
  recipient.bank_code = data.bankCode
  recipient.swift_code = data.swiftCode
  recipient.iban = data.iban
  recipient.mobile_money_provider = data.mobileMoneyProvider
  recipient.mobile_money_number = data.mobileMoneyNumber
  recipient.pickup_location = data.pickupLocation
  recipient.updated_at = new Date().toISOString()

  return Promise.resolve(recipient)
}

export function deleteMockRecipient(recipientId: string): Promise<void> {
  const index = mockRecipients.findIndex((r) => r.id === recipientId)
  if (index === -1) {
    throw new Error(`Recipient not found: ${recipientId}`)
  }
  mockRecipients.splice(index, 1)
  return Promise.resolve()
}

export function toggleMockFavorite(recipientId: string, isFavorite: boolean): Promise<Recipient> {
  const recipient = mockRecipients.find((r) => r.id === recipientId)
  if (!recipient) {
    throw new Error(`Recipient not found: ${recipientId}`)
  }

  recipient.is_favorite = isFavorite
  recipient.updated_at = new Date().toISOString()

  return Promise.resolve(recipient)
}

// Transaction status history
export function getMockTransactionStatusHistory(transactionId: string): Promise<TransactionStatusHistory[]> {
  const history = mockStatusHistory
    .filter((h) => h.transaction_id === transactionId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  return Promise.resolve(history)
}

// Wallet statistics
export function getMockMonthlyStats(userId: string): Promise<{ totalSent: number; transactionCount: number }> {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const monthlyTransactions = mockTransactions.filter(
    (t) =>
      t.user_id === userId &&
      new Date(t.created_at) >= startOfMonth &&
      (t.status === "completed" || t.status === "processing"),
  )

  const totalSent = monthlyTransactions.reduce((sum, t) => sum + t.total_deducted_sek, 0)
  const transactionCount = monthlyTransactions.length

  return Promise.resolve({ totalSent, transactionCount })
}

export function getMockRecentTransactions(userId: string, limit = 5): Promise<Transaction[]> {
  const transactions = mockTransactions
    .filter((t) => t.user_id === userId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
  return Promise.resolve(transactions)
}
