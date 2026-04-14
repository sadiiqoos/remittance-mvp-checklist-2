-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Transactions: Users can only see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own transactions" ON transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Recipients: Users can only manage their own recipients
CREATE POLICY "Users can view own recipients" ON recipients
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own recipients" ON recipients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipients" ON recipients
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipients" ON recipients
  FOR DELETE
  USING (auth.uid() = user_id);

-- KYC Documents: Users can only see their own documents
CREATE POLICY "Users can view own kyc documents" ON kyc_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own kyc documents" ON kyc_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin policies: Only admins can access admin tables
CREATE POLICY "Only admins can view admin_users" ON admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins with proper permissions can view all data
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
        AND is_active = true
        AND 'view_users' = ANY(permissions)
    )
  );

CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
        AND is_active = true
        AND 'view_transactions' = ANY(permissions)
    )
  );

CREATE POLICY "Admins can update transaction status" ON transactions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
        AND is_active = true
        AND 'approve_transactions' = ANY(permissions)
    )
  );

-- Audit logs: Append-only for all, read-only for admins
CREATE POLICY "Anyone can create audit logs" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view audit logs" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
        AND is_active = true
        AND 'view_reports' = ANY(permissions)
    )
  );

-- Function to automatically encrypt sensitive fields
CREATE OR REPLACE FUNCTION encrypt_sensitive_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Encrypt bank account numbers
  IF NEW.bank_account_number IS NOT NULL THEN
    NEW.bank_account_number_encrypted = pgp_sym_encrypt(NEW.bank_account_number, current_setting('app.encryption_key'));
  END IF;
  
  -- Encrypt IBAN
  IF NEW.iban IS NOT NULL THEN
    NEW.iban_encrypted = pgp_sym_encrypt(NEW.iban, current_setting('app.encryption_key'));
  END IF;
  
  -- Encrypt mobile money numbers
  IF NEW.mobile_money_number IS NOT NULL THEN
    NEW.mobile_money_number_encrypted = pgp_sym_encrypt(NEW.mobile_money_number, current_setting('app.encryption_key'));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply encryption trigger to recipients table
CREATE TRIGGER encrypt_recipient_data
  BEFORE INSERT OR UPDATE ON recipients
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_sensitive_data();

-- Function to decrypt sensitive data (for authorized access only)
CREATE OR REPLACE FUNCTION decrypt_bank_account(encrypted_data bytea)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for better performance with RLS
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_recipients_user_id ON recipients(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
