import type { Transaction, User } from "./types"
import { detectFraud, performAMLCheck, updateUserPattern } from "./fraud-detection"
import { logSecurityEvent } from "./security"

// Real-time transaction monitoring service
export class TransactionMonitor {
  private static instance: TransactionMonitor
  private monitoringEnabled = true
  private alertThreshold = 40 // Risk score threshold for alerts

  private constructor() {}

  static getInstance(): TransactionMonitor {
    if (!TransactionMonitor.instance) {
      TransactionMonitor.instance = new TransactionMonitor()
    }
    return TransactionMonitor.instance
  }

  // Monitor a transaction before it's approved
  async monitorTransaction(transaction: Transaction, user: User, history: Transaction[]): Promise<MonitoringResult> {
    if (!this.monitoringEnabled) {
      return {
        allowed: true,
        requiresReview: false,
        riskScore: 0,
        alerts: [],
        amlResult: { passed: true, flags: [], requiresReporting: false },
      }
    }

    // Run fraud detection
    const fraudCheck = await detectFraud(transaction, user, history)

    // Run AML check
    const amlResult = await performAMLCheck(transaction, user)

    // Update user transaction pattern
    updateUserPattern(user.id, transaction)

    // Determine if transaction should be allowed
    const allowed = fraudCheck.decision !== "blocked" && amlResult.passed
    const requiresReview = fraudCheck.decision === "review" || amlResult.requiresReporting

    // Log monitoring result
    logSecurityEvent({
      userId: user.id,
      action: "transaction_monitored",
      success: true,
      metadata: {
        transactionId: transaction.id,
        riskScore: fraudCheck.riskScore,
        decision: fraudCheck.decision,
        amlPassed: amlResult.passed,
        requiresReview,
      },
    })

    // Send alerts if risk score exceeds threshold
    if (fraudCheck.riskScore >= this.alertThreshold) {
      await this.sendAlert({
        transactionId: transaction.id,
        userId: user.id,
        riskScore: fraudCheck.riskScore,
        alerts: fraudCheck.alerts.map((a) => a.reason),
        decision: fraudCheck.decision,
      })
    }

    return {
      allowed,
      requiresReview,
      riskScore: fraudCheck.riskScore,
      alerts: fraudCheck.alerts,
      amlResult,
    }
  }

  // Send alert to compliance team
  private async sendAlert(alert: TransactionAlert): Promise<void> {
    console.log("[Fraud Alert]", {
      transactionId: alert.transactionId,
      userId: alert.userId,
      riskScore: alert.riskScore,
      alerts: alert.alerts,
      decision: alert.decision,
      timestamp: new Date().toISOString(),
    })

    // In production, this would:
    // 1. Send email/SMS to compliance team
    // 2. Create ticket in compliance dashboard
    // 3. Log to external monitoring service
    // 4. Trigger webhook notifications
  }

  // Get monitoring statistics
  getStatistics(): MonitoringStatistics {
    return {
      monitoringEnabled: this.monitoringEnabled,
      alertThreshold: this.alertThreshold,
      // In production, these would come from database
      totalTransactionsMonitored: 0,
      totalAlertsGenerated: 0,
      totalBlocked: 0,
      totalUnderReview: 0,
    }
  }

  // Enable/disable monitoring
  setMonitoringEnabled(enabled: boolean): void {
    this.monitoringEnabled = enabled
    logSecurityEvent({
      action: "monitoring_toggled",
      success: true,
      metadata: { enabled },
    })
  }

  // Update alert threshold
  setAlertThreshold(threshold: number): void {
    this.alertThreshold = threshold
    logSecurityEvent({
      action: "alert_threshold_updated",
      success: true,
      metadata: { threshold },
    })
  }
}

// Types
export interface MonitoringResult {
  allowed: boolean
  requiresReview: boolean
  riskScore: number
  alerts: any[]
  amlResult: {
    passed: boolean
    flags: string[]
    requiresReporting: boolean
  }
}

export interface TransactionAlert {
  transactionId: string
  userId: string
  riskScore: number
  alerts: string[]
  decision: string
}

export interface MonitoringStatistics {
  monitoringEnabled: boolean
  alertThreshold: number
  totalTransactionsMonitored: number
  totalAlertsGenerated: number
  totalBlocked: number
  totalUnderReview: number
}

// Export singleton instance
export const transactionMonitor = TransactionMonitor.getInstance()
