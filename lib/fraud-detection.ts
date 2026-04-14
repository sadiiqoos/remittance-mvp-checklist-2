import type { Transaction, User } from "./types"
import { logSecurityEvent } from "./security"

// Fraud detection rule types
export interface FraudRule {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  check: (transaction: Transaction, user: User, history: Transaction[]) => Promise<FraudAlert | null>
}

export interface FraudAlert {
  ruleId: string
  ruleName: string
  severity: "low" | "medium" | "high" | "critical"
  score: number
  reason: string
  recommendation: "block" | "review" | "monitor"
  metadata?: Record<string, any>
}

export interface FraudCheckResult {
  transactionId: string
  riskScore: number
  alerts: FraudAlert[]
  decision: "approved" | "blocked" | "review"
  reasons: string[]
}

// Calculate composite risk score
function calculateRiskScore(alerts: FraudAlert[]): number {
  const weights = {
    critical: 40,
    high: 25,
    medium: 10,
    low: 5,
  }

  return alerts.reduce((total, alert) => {
    return total + (weights[alert.severity] * alert.score) / 100
  }, 0)
}

// Rule 1: Velocity Check - Multiple transactions in short time
const velocityRule: FraudRule = {
  id: "velocity_check",
  name: "High Transaction Velocity",
  description: "Detects unusually high number of transactions in short period",
  severity: "high",
  check: async (transaction, user, history) => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const recentTransactions = history.filter((t) => new Date(t.created_at).getTime() > oneHourAgo)

    if (recentTransactions.length >= 5) {
      const totalAmount = recentTransactions.reduce((sum, t) => sum + t.source_amount, 0)

      return {
        ruleId: "velocity_check",
        ruleName: "High Transaction Velocity",
        severity: "high",
        score: Math.min(100, (recentTransactions.length / 5) * 100),
        reason: `${recentTransactions.length} transactions in last hour (${totalAmount.toFixed(0)} SEK total)`,
        recommendation: "review",
        metadata: {
          transactionCount: recentTransactions.length,
          totalAmount,
          timeWindow: "1 hour",
        },
      }
    }

    return null
  },
}

// Rule 2: Large Amount - First time or unusual large transfer
const largeAmountRule: FraudRule = {
  id: "large_amount",
  name: "Unusually Large Amount",
  description: "Detects transactions significantly larger than user's history",
  severity: "high",
  check: async (transaction, user, history) => {
    const amount = transaction.source_amount

    // First transaction over 10,000 SEK
    if (history.length === 0 && amount > 10000) {
      return {
        ruleId: "large_amount",
        ruleName: "Large First Transaction",
        severity: "high",
        score: Math.min(100, (amount / 50000) * 100),
        reason: `First transaction with large amount (${amount.toFixed(0)} SEK)`,
        recommendation: "review",
        metadata: { amount, isFirstTransaction: true },
      }
    }

    // Calculate average transaction amount
    if (history.length > 0) {
      const avgAmount = history.reduce((sum, t) => sum + t.source_amount, 0) / history.length
      const maxAmount = Math.max(...history.map((t) => t.source_amount))

      // Current transaction is 5x average or 2x max
      if (amount > avgAmount * 5 || amount > maxAmount * 2) {
        return {
          ruleId: "large_amount",
          ruleName: "Unusually Large Amount",
          severity: "high",
          score: Math.min(100, Math.max((amount / avgAmount) * 20, (amount / maxAmount) * 50)),
          reason: `Amount ${amount.toFixed(0)} SEK is ${(amount / avgAmount).toFixed(1)}x average (${avgAmount.toFixed(0)} SEK)`,
          recommendation: "review",
          metadata: { amount, avgAmount, maxAmount },
        }
      }
    }

    return null
  },
}

// Rule 3: New Account - Account created recently
const newAccountRule: FraudRule = {
  id: "new_account",
  name: "New Account Activity",
  description: "Flags activity from newly created accounts",
  severity: "medium",
  check: async (transaction, user, history) => {
    const accountAge = Date.now() - new Date(user.created_at).getTime()
    const daysOld = accountAge / (1000 * 60 * 60 * 24)

    if (daysOld < 7 && transaction.source_amount > 5000) {
      return {
        ruleId: "new_account",
        ruleName: "New Account High Value",
        severity: "medium",
        score: Math.min(100, 100 - daysOld * 14),
        reason: `Account created ${daysOld.toFixed(1)} days ago, transferring ${transaction.source_amount.toFixed(0)} SEK`,
        recommendation: daysOld < 1 ? "review" : "monitor",
        metadata: { accountAgeDays: daysOld, amount: transaction.source_amount },
      }
    }

    return null
  },
}

// Rule 4: Multiple Recipients - Sending to many different recipients
const multipleRecipientsRule: FraudRule = {
  id: "multiple_recipients",
  name: "Multiple Recipients",
  description: "Detects transactions to unusually many different recipients",
  severity: "medium",
  check: async (transaction, user, history) => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentTransactions = history.filter((t) => new Date(t.created_at).getTime() > oneWeekAgo)

    const uniqueRecipients = new Set(recentTransactions.map((t) => t.recipient_id))

    if (uniqueRecipients.size >= 10) {
      return {
        ruleId: "multiple_recipients",
        ruleName: "Multiple Recipients",
        severity: "medium",
        score: Math.min(100, (uniqueRecipients.size / 10) * 100),
        reason: `Sent to ${uniqueRecipients.size} different recipients in last 7 days`,
        recommendation: "monitor",
        metadata: { recipientCount: uniqueRecipients.size, timeWindow: "7 days" },
      }
    }

    return null
  },
}

// Rule 5: Round Amount - Suspicious round numbers
const roundAmountRule: FraudRule = {
  id: "round_amount",
  name: "Suspicious Round Amount",
  description: "Flags perfectly round amounts which are unusual for legitimate transfers",
  severity: "low",
  check: async (transaction, user, history) => {
    const amount = transaction.source_amount

    // Check if amount is perfectly round (e.g., 10000, 5000, 50000)
    if (amount >= 5000 && amount % 1000 === 0 && amount % 100 === 0) {
      const roundAmountCount = history.filter((t) => t.source_amount % 1000 === 0).length

      // Multiple round amounts are more suspicious
      if (roundAmountCount >= 3) {
        return {
          ruleId: "round_amount",
          ruleName: "Multiple Round Amounts",
          severity: "low",
          score: 30,
          reason: `Round amount ${amount} SEK (${roundAmountCount + 1} round amounts total)`,
          recommendation: "monitor",
          metadata: { amount, roundAmountCount },
        }
      }
    }

    return null
  },
}

// Rule 6: High-Risk Country - Sending to sanctioned or high-risk countries
const highRiskCountryRule: FraudRule = {
  id: "high_risk_country",
  name: "High-Risk Destination",
  description: "Flags transactions to high-risk or sanctioned countries",
  severity: "critical",
  check: async (transaction, user, history) => {
    const highRiskCountries = ["SO", "SS", "SY", "IR", "KP", "AF"]
    const destination = transaction.corridor.split(" to ")[1]

    // Check if destination country matches high-risk list
    const isHighRisk = highRiskCountries.some((country) => destination.includes(country))

    if (isHighRisk) {
      return {
        ruleId: "high_risk_country",
        ruleName: "High-Risk Destination Country",
        severity: "critical",
        score: 100,
        reason: `Transaction to high-risk country: ${destination}`,
        recommendation: "review",
        metadata: { destination, amount: transaction.source_amount },
      }
    }

    return null
  },
}

// Rule 7: KYC Status - User not verified
const kycStatusRule: FraudRule = {
  id: "kyc_status",
  name: "Incomplete KYC",
  description: "Flags transactions from users with incomplete KYC verification",
  severity: "high",
  check: async (transaction, user, history) => {
    if (user.kyc_status !== "verified" && transaction.source_amount > 3000) {
      return {
        ruleId: "kyc_status",
        ruleName: "Unverified User High Value",
        severity: "high",
        score: 90,
        reason: `KYC status: ${user.kyc_status}, Amount: ${transaction.source_amount.toFixed(0)} SEK`,
        recommendation: "block",
        metadata: { kycStatus: user.kyc_status, amount: transaction.source_amount },
      }
    }

    return null
  },
}

// Rule 8: Structuring Detection - Breaking up large amounts
const structuringRule: FraudRule = {
  id: "structuring",
  name: "Transaction Structuring",
  description: "Detects potential structuring to avoid reporting thresholds",
  severity: "critical",
  check: async (transaction, user, history) => {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    const recentTransactions = history.filter(
      (t) =>
        new Date(t.created_at).getTime() > oneDayAgo &&
        t.recipient_id === transaction.recipient_id &&
        t.source_amount > 4000 &&
        t.source_amount < 6000,
    )

    // Multiple transactions just below 5000 SEK threshold to same recipient
    if (recentTransactions.length >= 2 && transaction.source_amount > 4000 && transaction.source_amount < 6000) {
      const totalAmount = recentTransactions.reduce((sum, t) => sum + t.source_amount, 0) + transaction.source_amount

      return {
        ruleId: "structuring",
        ruleName: "Possible Structuring",
        severity: "critical",
        score: 95,
        reason: `${recentTransactions.length + 1} transactions of ${transaction.source_amount.toFixed(0)} SEK in 24h (total: ${totalAmount.toFixed(0)} SEK)`,
        recommendation: "review",
        metadata: {
          transactionCount: recentTransactions.length + 1,
          totalAmount,
          avgAmount: totalAmount / (recentTransactions.length + 1),
        },
      }
    }

    return null
  },
}

// All fraud detection rules
const ALL_RULES: FraudRule[] = [
  velocityRule,
  largeAmountRule,
  newAccountRule,
  multipleRecipientsRule,
  roundAmountRule,
  highRiskCountryRule,
  kycStatusRule,
  structuringRule,
]

// Main fraud detection function
export async function detectFraud(
  transaction: Transaction,
  user: User,
  history: Transaction[],
): Promise<FraudCheckResult> {
  const alerts: FraudAlert[] = []

  // Run all fraud detection rules
  for (const rule of ALL_RULES) {
    try {
      const alert = await rule.check(transaction, user, history)
      if (alert) {
        alerts.push(alert)
      }
    } catch (error) {
      console.error(`[v0] Fraud rule ${rule.id} failed:`, error)
    }
  }

  // Calculate overall risk score
  const riskScore = calculateRiskScore(alerts)

  // Determine decision based on risk score and recommendations
  let decision: "approved" | "blocked" | "review" = "approved"

  if (riskScore >= 80 || alerts.some((a) => a.recommendation === "block")) {
    decision = "blocked"
  } else if (riskScore >= 40 || alerts.some((a) => a.recommendation === "review")) {
    decision = "review"
  }

  // Extract reasons
  const reasons = alerts.map((a) => a.reason)

  // Log fraud check
  logSecurityEvent({
    userId: user.id,
    action: "fraud_check",
    success: true,
    metadata: {
      transactionId: transaction.id,
      riskScore,
      alertCount: alerts.length,
      decision,
    },
  })

  return {
    transactionId: transaction.id,
    riskScore,
    alerts,
    decision,
    reasons,
  }
}

// Real-time transaction monitoring
export interface TransactionPattern {
  userId: string
  avgAmount: number
  maxAmount: number
  transactionCount: number
  recipientCount: number
  countriesUsed: Set<string>
  lastTransactionTime: number
}

const userPatterns = new Map<string, TransactionPattern>()

export function updateUserPattern(userId: string, transaction: Transaction): void {
  const pattern = userPatterns.get(userId) || {
    userId,
    avgAmount: 0,
    maxAmount: 0,
    transactionCount: 0,
    recipientCount: 0,
    countriesUsed: new Set(),
    lastTransactionTime: 0,
  }

  pattern.transactionCount++
  pattern.avgAmount =
    (pattern.avgAmount * (pattern.transactionCount - 1) + transaction.source_amount) / pattern.transactionCount
  pattern.maxAmount = Math.max(pattern.maxAmount, transaction.source_amount)
  pattern.lastTransactionTime = Date.now()

  const country = transaction.corridor.split(" to ")[1]
  pattern.countriesUsed.add(country)

  userPatterns.set(userId, pattern)
}

export function getUserPattern(userId: string): TransactionPattern | null {
  return userPatterns.get(userId) || null
}

// AML (Anti-Money Laundering) checks
export interface AMLCheckResult {
  passed: boolean
  flags: string[]
  requiresReporting: boolean
}

export async function performAMLCheck(transaction: Transaction, user: User): Promise<AMLCheckResult> {
  const flags: string[] = []
  let requiresReporting = false

  // Check 1: Large transaction reporting threshold (15,000 EUR ≈ 160,000 SEK)
  if (transaction.source_amount >= 160000) {
    flags.push("Large transaction exceeds reporting threshold")
    requiresReporting = true
  }

  // Check 2: PEP (Politically Exposed Person)
  if (user.is_pep) {
    flags.push("User is a Politically Exposed Person (PEP)")
    requiresReporting = true
  }

  // Check 3: High-risk user
  if (user.risk_level === "high") {
    flags.push("User classified as high-risk")
  }

  // Check 4: Sanctioned country
  if (transaction.sanctions_check_status === "flagged") {
    flags.push("Transaction involves sanctioned entity or country")
    requiresReporting = true
  }

  const passed = flags.length === 0 || !requiresReporting

  return {
    passed,
    flags,
    requiresReporting,
  }
}
