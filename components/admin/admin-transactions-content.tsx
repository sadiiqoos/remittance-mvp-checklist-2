"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllTransactions, updateTransactionStatus } from "@/lib/admin-mock-data"
import type { Transaction } from "@/lib/types"
import { Search, Filter, AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type TransactionWithDetails = Transaction & {
  user?: { email: string; first_name: string; last_name: string }
  recipient?: { first_name: string; last_name: string; country: string }
}

export function AdminTransactionsContent() {
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionWithDetails[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDetails | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [searchQuery, statusFilter, transactions])

  const loadTransactions = () => {
    const data = getAllTransactions()
    setTransactions(data)
  }

  const filterTransactions = () => {
    let filtered = transactions

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.recipient?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.recipient?.last_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered)
  }

  const handleStatusUpdate = (transactionId: string, newStatus: string) => {
    updateTransactionStatus(transactionId, newStatus as any)
    loadTransactions()
    toast({
      title: "Transaction updated",
      description: `Transaction status changed to ${newStatus}`,
    })
  }

  const getStatusBadge = (status: string) => {
    const config = {
      completed: { label: "Completed", icon: CheckCircle2, className: "bg-green-100 text-green-800" },
      processing: { label: "Processing", icon: Clock, className: "bg-blue-100 text-blue-800" },
      pending: { label: "Pending", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      failed: { label: "Failed", icon: XCircle, className: "bg-red-100 text-red-800" },
      flagged: { label: "Flagged", icon: AlertTriangle, className: "bg-orange-100 text-orange-800" },
    }

    const { label, icon: Icon, className } = config[status as keyof typeof config] || config.pending

    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getStats = () => {
    return {
      total: transactions.length,
      completed: transactions.filter((t) => t.status === "completed").length,
      pending: transactions.filter((t) => t.status === "pending" || t.status === "processing").length,
      flagged: transactions.filter((t) => t.compliance_check_status === "flagged").length,
      totalVolume: transactions
        .filter((t) => t.status === "completed")
        .reduce((sum, t) => sum + t.total_deducted_sek, 0),
    }
  }

  const stats = getStats()

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction Management</h1>
        <p className="text-muted-foreground">Monitor and manage all money transfers</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground mb-1">Flagged</div>
          <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction ID, user email, or recipient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-mono text-sm text-muted-foreground mb-1">{transaction.id}</div>
                <div className="font-semibold">
                  {transaction.user?.first_name} {transaction.user?.last_name}
                </div>
                <div className="text-sm text-muted-foreground">{transaction.user?.email}</div>
              </div>
              <div className="text-right">
                {getStatusBadge(transaction.status)}
                {transaction.compliance_check_status === "flagged" && (
                  <Badge className="bg-orange-100 text-orange-800 ml-2">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <div className="text-muted-foreground">Amount</div>
                <div className="font-semibold">{(transaction.source_amount_sek || 0).toFixed(2)} SEK</div>
              </div>
              <div>
                <div className="text-muted-foreground">Recipient Gets</div>
                <div className="font-semibold">
                  {(transaction.destination_amount || 0).toFixed(2)} {transaction.destination_currency || "USD"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">To</div>
                <div className="font-semibold">
                  {transaction.recipient?.first_name} {transaction.recipient?.last_name}
                </div>
                <div className="text-xs text-muted-foreground">{transaction.recipient?.country}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Created</div>
                <div className="font-semibold">{new Date(transaction.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {transaction.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleStatusUpdate(transaction.id, "processing")}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(transaction.id, "failed")}>
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </main>
  )
}
