"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface WalletCardProps {
  balance: number
  monthlySpent: number
}

export function WalletCard({ balance, monthlySpent }: WalletCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <Card className="relative overflow-hidden border-none shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />

      <div className="relative p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-primary-foreground/80">Available Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-primary-foreground/60 hover:text-primary-foreground/100 transition-colors"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-5xl font-bold text-primary-foreground tracking-tight">
              {showBalance ? `${balance.toFixed(2)}` : "••••••"}
              <span className="text-2xl ml-2 font-semibold opacity-90">SEK</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
          <div>
            <div className="text-xs text-primary-foreground/70 mb-1">Spent This Month</div>
            <div className="text-xl font-bold text-primary-foreground">{monthlySpent.toFixed(2)} SEK</div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-primary-foreground/60" />
        </div>

        <Button
          variant="secondary"
          className="w-full bg-white hover:bg-white/90 text-primary font-semibold h-12 rounded-xl shadow-lg"
        >
          Add Funds to Wallet
        </Button>
      </div>
    </Card>
  )
}
