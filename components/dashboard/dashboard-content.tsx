"use client"

import { useState, useEffect } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import type { User } from "@/lib/types"
import { getDemoUser } from "@/app/actions/transfer"
import { getMonthlyStats, getRecentTransactions } from "@/app/actions/wallet"
import { Wallet, Send, TrendingUp, Loader2, Users, Globe } from "lucide-react"
import { Card } from "@/components/ui/card"

export function DashboardContent() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [monthlyStats, setMonthlyStats] = useState({ totalSent: 0, transactionCount: 0 })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getDemoUser()
        setUser(userData)

        const [stats, transactions] = await Promise.all([
          getMonthlyStats(userData.id),
          getRecentTransactions(userData.id),
        ])

        setMonthlyStats(stats)
        setRecentTransactions(transactions)
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </div>
    )
  }

  const dailyRemaining = (user.daily_limit_sek || 15000) - monthlyStats.totalSent
  const monthlyRemaining = (user.monthly_limit_sek || 50000) - monthlyStats.totalSent

  return (
    <main className="min-h-screen bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Welcome back, {user.first_name}</h1>
          <p className="text-muted-foreground text-lg">Manage your international money transfers</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2">
            <WalletCard balance={user.wallet_balance_sek} monthlySpent={monthlyStats.totalSent} />
          </div>
          <QuickActions />
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard
            title="Total Sent This Month"
            value={`${monthlyStats.totalSent.toFixed(0)}`}
            subtitle={`${monthlyStats.transactionCount} transactions completed`}
            icon={TrendingUp}
            iconColor="from-blue-500 to-blue-600"
            trend={{ value: "+12%", isPositive: true }}
          />
          <StatCard
            title="Daily Limit Remaining"
            value={`${dailyRemaining.toFixed(0)}`}
            subtitle={`of ${(user.daily_limit_sek || 15000).toFixed(0)} SEK available`}
            icon={Send}
            iconColor="from-green-500 to-green-600"
          />
          <StatCard
            title="Monthly Limit Remaining"
            value={`${monthlyRemaining.toFixed(0)}`}
            subtitle={`of ${(user.monthly_limit_sek || 50000).toFixed(0)} SEK available`}
            icon={Wallet}
            iconColor="from-purple-500 to-purple-600"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentActivity transactions={recentTransactions} />
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-none shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Account Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">KYC Status</span>
                  <span className="text-sm font-semibold capitalize px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {user.kyc_status}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className="text-sm font-semibold capitalize">{user.risk_level}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Account Type</span>
                  <span className="text-sm font-semibold">Personal</span>
                </div>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-none shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary" />
              <div className="relative p-6 text-primary-foreground">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Need Assistance?</h3>
                <p className="text-sm opacity-90 mb-4 text-balance">
                  Our 24/7 support team is ready to help with your transfers
                </p>
                <button className="text-sm font-semibold hover:underline flex items-center gap-1">
                  Contact Support
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
