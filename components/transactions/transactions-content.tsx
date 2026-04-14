"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TransactionCard } from "@/components/transactions/transaction-card"
import type { Transaction, User } from "@/lib/types"
import { getTransactions } from "@/app/actions/transactions"
import { getDemoUser } from "@/app/actions/transfer"
import { Loader2, Filter } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TransactionWithRecipient = Transaction & {
  recipients: {
    id: string
    first_name: string
    last_name: string
    country: string
    payout_method: string
  } | null
}

export function TransactionsContent() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<TransactionWithRecipient[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithRecipient[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await getDemoUser()
        setUser(userData)

        const transactionsData = await getTransactions(userData.id)
        setTransactions(transactionsData)
        setFilteredTransactions(transactionsData)
      } catch (error) {
        console.error("[v0] Error loading transactions:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredTransactions(transactions)
    } else {
      setFilteredTransactions(transactions.filter((t) => t.status === statusFilter))
    }
  }, [statusFilter, transactions])

  const getTotalSent = () => {
    return transactions
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + t.total_deducted_sek, 0)
      .toFixed(2)
  }

  const getStatusCounts = () => {
    return {
      all: transactions.length,
      completed: transactions.filter((t) => t.status === "completed").length,
      processing: transactions.filter((t) => t.status === "processing").length,
      pending: transactions.filter((t) => t.status === "pending").length,
      failed: transactions.filter((t) => t.status === "failed").length,
    }
  }

  const statusCounts = getStatusCounts()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">View and track all your money transfers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
          <div className="text-2xl font-bold">{transactions.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Sent</div>
          <div className="text-2xl font-bold">{getTotalSent()} SEK</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl font-bold">{statusCounts.completed}</div>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({statusCounts.all})</SelectItem>
              <SelectItem value="completed">Completed ({statusCounts.completed})</SelectItem>
              <SelectItem value="processing">Processing ({statusCounts.processing})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="failed">Failed ({statusCounts.failed})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {statusFilter === "all" ? "No transactions yet" : `No ${statusFilter} transactions`}
          </h3>
          <p className="text-muted-foreground mb-6">
            {statusFilter === "all"
              ? "Your transaction history will appear here"
              : "Try changing the filter to see other transactions"}
          </p>
          {statusFilter === "all" && (
            <Button asChild>
              <Link href="/send">Send Your First Transfer</Link>
            </Button>
          )}
        </div>
      )}
    </main>
  )
}
