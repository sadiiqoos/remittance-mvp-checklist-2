"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle2, Clock, Activity } from "lucide-react"
import {
  getMockAdminStats,
  getMockVelocityData,
  mockProviderBalances,
  getMockFlaggedTransactions,
} from "@/lib/admin-mock-data"
import type { AdminStats, VelocityData, ProviderBalance, TransactionWithDetails } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CommandCenterContent() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [velocity, setVelocity] = useState<VelocityData | null>(null)
  const [balances, setBalances] = useState<ProviderBalance[]>([])
  const [flaggedTransactions, setFlaggedTransactions] = useState<TransactionWithDetails[]>([])

  useEffect(() => {
    setStats(getMockAdminStats())
    setVelocity(getMockVelocityData())
    setBalances(mockProviderBalances)
    getMockFlaggedTransactions().then(setFlaggedTransactions)

    // Refresh velocity data every 30 seconds
    const interval = setInterval(() => {
      setVelocity(getMockVelocityData())
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!stats || !velocity) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const lowBalances = balances.filter((b) => b.status === "low" || b.status === "critical")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Command Center</h1>
        <p className="text-muted-foreground">Real-time monitoring and system health</p>
      </div>

      {lowBalances.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Balance Alert:</strong> {lowBalances.length} provider{lowBalances.length > 1 ? "s have" : " has"}{" "}
            low balance. Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume (24h)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVolumeSek.toLocaleString()} SEK</div>
            <p className="text-xs text-muted-foreground">{stats.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Webhook success vs timeout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flaggedTransactions}</div>
            <p className="text-xs text-muted-foreground">Require manual review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Transfer Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTransferTime}h</div>
            <p className="text-xs text-muted-foreground">Initiation to completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Velocity Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Velocity Monitor
            </CardTitle>
            <CardDescription>SEK sent in the last hour vs. previous hour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Hour</p>
                <p className="text-3xl font-bold">{velocity.currentHourSek.toLocaleString()} SEK</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {velocity.percentageChange > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-500">+{velocity.percentageChange.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">{velocity.percentageChange.toFixed(1)}%</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Previous Hour</p>
              <p className="text-xl font-semibold">{velocity.previousHourSek.toLocaleString()} SEK</p>
            </div>
            {Math.abs(velocity.percentageChange) > 50 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Significant velocity change detected. Review for fraud.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Provider Balances */}
        <Card>
          <CardHeader>
            <CardTitle>Provider Balances</CardTitle>
            <CardDescription>Real-time balances across payout partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {balances.map((balance) => (
                <div key={balance.provider} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{balance.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      {balance.balance.toLocaleString()} {balance.currency}
                    </p>
                  </div>
                  <Badge
                    variant={
                      balance.status === "healthy" ? "default" : balance.status === "low" ? "secondary" : "destructive"
                    }
                  >
                    {balance.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flagged Transactions Queue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Flagged Transaction Queue</CardTitle>
            <CardDescription>Transactions requiring manual review</CardDescription>
          </div>
          <Link href="/admin/transactions?filter=flagged">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {flaggedTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No flagged transactions. All clear!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedTransactions.slice(0, 5).map((txn) => (
                <Link key={txn.id} href={`/admin/transaction/${txn.id}`}>
                  <div className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{txn.user_name}</p>
                        <Badge variant="destructive" className="text-xs">
                          Risk: {txn.risk_score}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{txn.hold_reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{txn.source_amount.toLocaleString()} SEK</p>
                      <p className="text-xs text-muted-foreground">{txn.recipient_country}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
