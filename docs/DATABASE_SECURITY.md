# Database Security Implementation

## Row Level Security (RLS) Policies

### Overview
All tables have Row Level Security enabled to ensure users can only access their own data, and admins can only access data according to their role permissions.

### User Policies

**Users Table**
- Users can only view and update their own profile data
- Admins with `view_users` permission can view all users

**Transactions Table**
- Users can only view their own transactions
- Users can only create transactions for themselves
- Admins with `view_transactions` permission can view all transactions
- Admins with `approve_transactions` permission can update transaction status

**Recipients Table**
- Users have full CRUD access to only their own recipients
- Admin access follows user access patterns

**KYC Documents Table**
- Users can only view and upload their own KYC documents
- Admins with `view_kyc` permission can access all KYC documents

### Admin Policies

**Admin Users Table**
- Only active admins can view the admin_users table
- Super admins can manage other admin accounts

**Audit Logs Table**
- Any authenticated user/admin can create audit logs (append-only)
- Only admins with `view_reports` permission can read audit logs
- Audit logs cannot be updated or deleted

## Data Encryption

### Field-Level Encryption

Sensitive fields are encrypted at rest using AES-256-GCM:

**Encrypted Fields:**
- Bank account numbers
- IBAN codes
- Mobile money numbers
- 2FA secrets
- Backup codes
- Any PII (Personally Identifiable Information)

**Encryption Process:**
1. Data is encrypted before INSERT/UPDATE operations
2. Each encrypted value has unique IV (Initialization Vector)
3. Auth tags prevent tampering
4. Encryption key stored in environment variable (never in code)

**Decryption:**
- Only authorized operations can decrypt
- Decryption happens in secure database functions
- Application layer has limited decryption access

### Key Management

**Development:**
- Uses derived key from passphrase (NOT for production)
- Key rotation not implemented

**Production Requirements:**
- `DATABASE_ENCRYPTION_KEY` environment variable must be set
- Use AWS KMS, Azure Key Vault, or similar for key storage
- Implement key rotation every 90 days
- Maintain old keys for data that hasn't been re-encrypted yet

## Data Masking

For display purposes, sensitive data is masked:

**Masking Functions:**
- `maskBankAccount()` - Shows only last 4 digits
- `maskEmail()` - Shows first 2 characters of local part
- `maskPhone()` - Shows first 3 and last 3 digits

**Usage:**
Always use masked versions for:
- Admin dashboards
- User interfaces
- Logs and monitoring
- API responses (unless specifically authorized)

## SQL Injection Prevention

**Parameterized Queries:**
- Always use parameterized queries with `$1, $2, etc.`
- Never concatenate user input into SQL strings
- Use `buildSafeQuery()` helper for dynamic queries

**Input Validation:**
- `sanitizeTableName()` - Validates table names
- `sanitizeColumnName()` - Validates column names
- Zod schemas validate all user input before database operations

## Connection Security

**SSL/TLS:**
- Required in production (`ssl: true`)
- Certificate verification enabled (`sslMode: "verify-full"`)
- Connections timeout after 10 seconds
- Idle connections closed after 30 seconds

**Connection Pooling:**
- Maximum 20 concurrent connections
- Prevents connection exhaustion attacks
- Automatic connection recycling

## Rate Limiting

**Database Operation Limits:**
- Per-user, per-operation limits
- Prevents abuse and DoS attacks
- Configurable limits per operation type

**Example Limits:**
- SELECT operations: 100/minute
- INSERT operations: 20/minute
- UPDATE operations: 30/minute
- DELETE operations: 10/minute

## Audit Logging

**All database operations are logged:**
- User ID
- Operation type (SELECT, INSERT, UPDATE, DELETE)
- Table name
- Record ID (if applicable)
- Success/failure status
- Timestamp
- IP address

**Audit Log Retention:**
- Logs retained for 7 years (regulatory compliance)
- Logs are immutable (append-only)
- Encrypted at rest
- Regular backups to separate storage

## Secure Deletion

**Data Deletion Process:**
1. Overwrite sensitive fields with random data
2. Force database flush to disk
3. Delete the record
4. Log the deletion in audit log
5. Cannot be recovered from disk

**GDPR Right to Erasure:**
- Users can request complete data deletion
- System performs secure deletion of all user data
- Deletion confirmed within 30 days
- Audit log entry created (cannot be deleted for compliance)

## Backup Security

**Backup Encryption:**
- All backups encrypted at rest
- Separate encryption keys from production
- Stored in geographically distributed locations

**Backup Access:**
- Limited to super admins only
- Multi-factor authentication required
- All access logged and monitored

**Backup Testing:**
- Monthly restore tests
- Verify data integrity
- Test disaster recovery procedures

## Monitoring and Alerts

**Security Monitoring:**
- Failed authentication attempts
- Unusual query patterns
- Large data exports
- RLS policy violations
- Slow queries (potential DoS)

**Alerts Triggered For:**
- 5+ failed login attempts from same IP
- Queries returning >10,000 rows
- Direct database access (bypassing application)
- Encryption failures
- Backup failures

## Compliance

**Regulatory Requirements:**
- GDPR compliance (EU data protection)
- PSD2 compliance (payment services)
- PCI DSS compliance (if handling card data)
- SOC 2 Type II (security controls)

**Regular Audits:**
- Quarterly security audits
- Annual penetration testing
- Continuous vulnerability scanning
- Code security reviews

## Best Practices

1. **Never log sensitive data** - Use masked versions
2. **Principle of least privilege** - Users get minimum required access
3. **Defense in depth** - Multiple security layers (RLS + encryption + validation)
4. **Assume breach** - Design as if attacker has database access
5. **Regular updates** - Keep database and libraries patched
6. **Monitor everything** - Comprehensive logging and alerting
7. **Test security** - Regular security testing and drills

## Migration Guide

**Enabling RLS on Existing Tables:**
1. Back up all data first
2. Enable RLS on table: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
3. Create policies for current use cases
4. Test thoroughly with real users
5. Monitor for policy violations
6. Adjust policies as needed

**Adding Encryption to Existing Data:**
1. Add encrypted columns: `ALTER TABLE table_name ADD COLUMN field_encrypted bytea;`
2. Create encryption function
3. Migrate data in batches: `UPDATE table_name SET field_encrypted = encrypt(field) WHERE id IN (...);`
4. Verify encryption
5. Drop old unencrypted column
6. Update application code to use encrypted field

## Emergency Procedures

**If Encryption Key is Compromised:**
1. Immediately rotate to new encryption key
2. Re-encrypt all data with new key
3. Audit all access logs for suspicious activity
4. Notify users if data may have been exposed
5. Update security incident log

**If RLS Policy is Breached:**
1. Immediately patch the policy
2. Audit all affected data access
3. Notify affected users
4. Review and strengthen all other policies
5. Conduct security review

## Contact

For security issues or questions:
- Security Team: security@remitswift.com
- Emergency Hotline: +46-XX-XXX-XXXX
- Incident Response: https://remitswift.com/security-incident
