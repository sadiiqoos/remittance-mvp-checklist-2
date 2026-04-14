-- Seed supported corridors for Sweden to African countries
INSERT INTO corridors (name, source_country, destination_country, destination_currency, base_fee_sek, min_amount_sek, max_amount_sek, supported_payout_methods, estimated_delivery_hours) VALUES
  ('Sweden to Kenya', 'SE', 'KE', 'KES', 49.00, 100.00, 50000.00, '["bank_transfer", "mobile_money"]'::jsonb, 2),
  ('Sweden to Nigeria', 'SE', 'NG', 'NGN', 49.00, 100.00, 50000.00, '["bank_transfer", "cash_pickup"]'::jsonb, 24),
  ('Sweden to Ghana', 'SE', 'GH', 'GHS', 49.00, 100.00, 50000.00, '["bank_transfer", "mobile_money", "cash_pickup"]'::jsonb, 12),
  ('Sweden to Uganda', 'SE', 'UG', 'UGX', 49.00, 100.00, 50000.00, '["bank_transfer", "mobile_money"]'::jsonb, 6),
  ('Sweden to Tanzania', 'SE', 'TZ', 'TZS', 49.00, 100.00, 50000.00, '["bank_transfer", "mobile_money"]'::jsonb, 12),
  ('Sweden to South Africa', 'SE', 'ZA', 'ZAR', 49.00, 100.00, 50000.00, '["bank_transfer"]'::jsonb, 24),
  ('Sweden to Ethiopia', 'SE', 'ET', 'ETB', 49.00, 100.00, 50000.00, '["bank_transfer", "cash_pickup"]'::jsonb, 48),
  ('Sweden to Rwanda', 'SE', 'RW', 'RWF', 49.00, 100.00, 50000.00, '["bank_transfer", "mobile_money"]'::jsonb, 6);

-- Seed mock exchange rates (valid for 1 hour)
INSERT INTO exchange_rates (source_currency, destination_currency, rate, provider, valid_until) VALUES
  ('SEK', 'KES', 13.85, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'NGN', 156.42, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'GHS', 1.52, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'UGX', 349.21, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'TZS', 237.64, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'ZAR', 1.68, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'ETB', 11.23, 'mock-fx-provider', NOW() + INTERVAL '1 hour'),
  ('SEK', 'RWF', 130.45, 'mock-fx-provider', NOW() + INTERVAL '1 hour');
