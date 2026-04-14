-- Create a demo user for testing
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  date_of_birth,
  nationality,
  kyc_status,
  kyc_verified_at,
  address_line1,
  city,
  postal_code,
  country,
  wallet_balance_sek,
  phone
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@remittance.se',
  'Erik',
  'Andersson',
  '1985-06-15',
  'SE',
  'verified',
  NOW(),
  'Drottninggatan 123',
  'Stockholm',
  '111 21',
  'SE',
  25000.00,
  '+46701234567'
);

-- Create demo recipients
INSERT INTO recipients (user_id, first_name, last_name, country, payout_method, mobile_money_provider, mobile_money_number, phone, is_favorite) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Grace', 'Wanjiku', 'KE', 'mobile_money', 'M-Pesa', '254712345678', '+254712345678', true),
  ('00000000-0000-0000-0000-000000000001', 'Chinonso', 'Okafor', 'NG', 'bank_transfer', null, null, '+234803456789', false);

-- Update recipients with bank details for the Nigerian recipient
UPDATE recipients 
SET bank_name = 'Access Bank', 
    bank_account_number = '0123456789',
    bank_code = '044'
WHERE first_name = 'Chinonso' AND last_name = 'Okafor';
