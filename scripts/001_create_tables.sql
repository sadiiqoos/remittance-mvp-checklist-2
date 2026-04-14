-- Users table with KYC and compliance fields
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  nationality TEXT,
  
  -- KYC status
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected', 'expired')),
  kyc_verified_at TIMESTAMP,
  kyc_provider TEXT,
  
  -- Address
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'SE',
  
  -- Wallet
  wallet_balance_sek DECIMAL(12, 2) DEFAULT 0.00,
  
  -- Risk and compliance
  risk_level TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  is_pep BOOLEAN DEFAULT false,
  
  -- Limits
  daily_limit_sek DECIMAL(12, 2) DEFAULT 15000.00,
  monthly_limit_sek DECIMAL(12, 2) DEFAULT 50000.00,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  
  -- Recipient location
  country TEXT NOT NULL,
  city TEXT,
  
  -- Payout method
  payout_method TEXT NOT NULL CHECK (payout_method IN ('bank_transfer', 'mobile_money', 'cash_pickup', 'wallet')),
  
  -- Bank details (if applicable)
  bank_name TEXT,
  bank_account_number TEXT,
  bank_code TEXT,
  swift_code TEXT,
  iban TEXT,
  
  -- Mobile money details (if applicable)
  mobile_money_provider TEXT,
  mobile_money_number TEXT,
  
  -- Cash pickup details (if applicable)
  pickup_location TEXT,
  
  is_favorite BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID REFERENCES recipients(id),
  
  -- Transaction details
  reference_number TEXT UNIQUE NOT NULL,
  
  -- Amounts
  source_amount DECIMAL(12, 2) NOT NULL,
  source_currency TEXT NOT NULL DEFAULT 'SEK',
  destination_amount DECIMAL(12, 2) NOT NULL,
  destination_currency TEXT NOT NULL,
  
  -- Exchange rate
  exchange_rate DECIMAL(12, 6) NOT NULL,
  exchange_rate_provider TEXT,
  
  -- Fees
  transfer_fee DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  fx_margin DECIMAL(12, 4) DEFAULT 0.00,
  
  -- Total deducted from user
  total_deducted_sek DECIMAL(12, 2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  
  -- Corridor and method
  corridor TEXT NOT NULL,
  payout_method TEXT NOT NULL,
  
  -- Partner tracking
  partner_transaction_id TEXT,
  partner_name TEXT,
  
  -- Compliance
  aml_check_status TEXT DEFAULT 'pending' CHECK (aml_check_status IN ('pending', 'passed', 'flagged', 'failed')),
  aml_check_provider TEXT,
  sanctions_check_status TEXT DEFAULT 'pending' CHECK (sanctions_check_status IN ('pending', 'passed', 'flagged', 'failed')),
  
  -- Timestamps
  initiated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  
  -- Additional info
  failure_reason TEXT,
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Supported corridors table
CREATE TABLE IF NOT EXISTS corridors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  source_country TEXT NOT NULL DEFAULT 'SE',
  destination_country TEXT NOT NULL,
  destination_currency TEXT NOT NULL,
  
  is_active BOOLEAN DEFAULT true,
  
  -- Limits per transaction
  min_amount_sek DECIMAL(12, 2) DEFAULT 100.00,
  max_amount_sek DECIMAL(12, 2) DEFAULT 50000.00,
  
  -- Fees
  base_fee_sek DECIMAL(12, 2) DEFAULT 49.00,
  percentage_fee DECIMAL(5, 4) DEFAULT 0.0000,
  
  -- Supported payout methods (JSON array)
  supported_payout_methods JSONB DEFAULT '["bank_transfer", "mobile_money"]'::jsonb,
  
  -- Estimated delivery time in hours
  estimated_delivery_hours INTEGER DEFAULT 24,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Exchange rates cache table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_currency TEXT NOT NULL DEFAULT 'SEK',
  destination_currency TEXT NOT NULL,
  rate DECIMAL(12, 6) NOT NULL,
  provider TEXT NOT NULL,
  
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(source_currency, destination_currency, provider, valid_from)
);

-- Transaction status history for audit trail
CREATE TABLE IF NOT EXISTS transaction_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_number);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_exchange_rates_currencies ON exchange_rates(source_currency, destination_currency);
CREATE INDEX IF NOT EXISTS idx_transaction_status_history_transaction_id ON transaction_status_history(transaction_id);
