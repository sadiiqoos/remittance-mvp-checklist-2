"use client"

import { useState, useEffect, use } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { TransactionStatusBadge } from "@/components/transactions/transaction-status-badge"
import { CountryFlag, getCountryName } from "@/components/country-flag"
import type { Transaction } from "@/lib/types"
import { getTransactionById, getTransactionStatusHistory } from "@/app/actions/transactions"
import { Loader2, Download, CheckCircle2 } from "lucide-react"
import Link from "next/link"

interface TransactionStatusHistoryItem {
  id: string
  transaction_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  notes: string | null
  created_at: string
}

type TransactionWithRecipient = Transaction & {
  recipients: {
    id: string
    first_name: string
    last_name: string
    country: string
    city: string | null
    payout_method: string
    phone: string | null
    mobile_money_provider: string | null
    mobile_money_number: string | null
    bank_name: string | null
    bank_account_number: string | null
  } | null
}

export function TransactionDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [transaction, setTransaction] = useState<TransactionWithRecipient | null>(null)
  const [statusHistory, setStatusHistory] = useState<TransactionStatusHistoryItem[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const [transactionData, historyData] = await Promise.all([
          getTransactionById(id),
          getTransactionStatusHistory(id),
        ])
        setTransaction(transactionData)
        setStatusHistory(historyData)
      } catch (error) {
        console.error("[v0] Error loading transaction:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Transaction not found</h2>
          <Button asChild>
            <Link href="/transactions">Back to Transactions</Link>
          </Button>
        </div>
      </div>
    )
  }

  const date = new Date(transaction.created_at)
  const formattedDate = date.toLocaleDateString("en-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-SE", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getPayoutMethodLabel = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Bank Transfer"
      case "mobile_money":
        return "Mobile Money"
      case "cash_pickup":
        return "Cash Pickup"
      case "wallet":
        return "Wallet"
      default:
        return method
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Transaction Details</h1>
            <p className="text-muted-foreground font-mono">{transaction.reference_number}</p>
          </div>
          <TransactionStatusBadge status={transaction.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transfer Summary</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount sent</span>
                <span className="font-semibold">
                  {transaction.source_amount.toFixed(2)} {transaction.source_currency}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Transfer fee</span>
                <span className="font-semibold">
                  {transaction.transfer_fee.toFixed(2)} {transaction.source_currency}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold">Total paid</span>
                <span className="font-bold text-lg">
                  {transaction.total_deducted_sek.toFixed(2)} {transaction.source_currency}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange rate</span>
                <span className="font-semibold">
                  1 {transaction.source_currency} = {transaction.exchange_rate.toFixed(4)}{" "}
                  {transaction.destination_currency}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient receives</span>
                <span className="font-semibold text-lg text-green-600">
                  {transaction.destination_amount.toFixed(2)} {transaction.destination_currency}
                </span>
              </div>
            </div>
          </Card>

          {transaction.recipients && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recipient Details</h2>

              <div className="flex items-center gap-3 mb-4">
                <CountryFlag countryCode={transaction.recipients.country} className="w-10 h-10" />
                <div>
                  <div className="font-semibold">
                    {transaction.recipients.first_name} {transaction.recipients.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getCountryName(transaction.recipients.country)}
                    {transaction.recipients.city && `, ${transaction.recipients.city}`}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payout method</span>
                  <span className="font-medium">{getPayoutMethodLabel(transaction.recipients.payout_method)}</span>
                </div>

                {transaction.recipients.payout_method === "mobile_money" &&
                  transaction.recipients.mobile_money_number && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider</span>
                        <span className="font-medium">{transaction.recipients.mobile_money_provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Number</span>
                        <span className="font-mono">{transaction.recipients.mobile_money_number}</span>
                      </div>
                    </>
                  )}

                {transaction.recipients.payout_method === "bank_transfer" && transaction.recipients.bank_name && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank</span>
                      <span className="font-medium">{transaction.recipients.bank_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Account</span>
                      <span className="font-mono">{transaction.recipients.bank_account_number}</span>
                    </div>
                  </>
                )}

                {transaction.recipients.phone && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-mono">{transaction.recipients.phone}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction Timeline</h2>

            <div className="space-y-4">
              {statusHistory.map((item, index) => {
                const historyDate = new Date(item.created_at)
                const historyTime = historyDate.toLocaleTimeString("en-SE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
                const historyDateStr = historyDate.toLocaleDateString("en-SE", {
                  month: "short",
                  day: "numeric",
                })

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === statusHistory.length - 1 ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${index === statusHistory.length - 1 ? "text-primary-foreground" : "text-muted-foreground"}`}
                        />
                      </div>
                      {index < statusHistory.length - 1 && <div className="w-0.5 h-8 bg-muted flex-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="font-medium capitalize">{item.new_status.replace("_", " ")}</div>
                      {item.notes && <div className="text-sm text-muted-foreground">{item.notes}</div>}
                      <div className="text-xs text-muted-foreground mt-1">
                        {historyDateStr} at {historyTime}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-4">
            <h3 className="font-semibold mb-4">Transaction Info</h3>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Reference</div>
                <div className="font-mono text-xs">{transaction.reference_number}</div>
              </div>

              <Separator />

              <div>
                <div className="text-muted-foreground mb-1">Date & Time</div>
                <div className="font-medium">{formattedDate}</div>
                <div className="text-xs text-muted-foreground">{formattedTime}</div>
              </div>

              <Separator />

              <div>
                <div className="text-muted-foreground mb-1">Corridor</div>
                <div className="font-medium">{transaction.corridor}</div>
              </div>

              <Separator />

              <div>
                <div className="text-muted-foreground mb-1">Compliance</div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>AML Check:</span>
                    <span className="font-medium capitalize">{transaction.aml_check_status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sanctions:</span>
                    <span className="font-medium capitalize">{transaction.sanctions_check_status}</span>
                  </div>
                </div>
              </div>

              {transaction.partner_name && (
                <>
                  <Separator />
                  <div>
                    <div className="text-muted-foreground mb-1">Partner</div>
                    <div className="font-medium">{transaction.partner_name}</div>
                    {transaction.partner_transaction_id && (
                      <div className="text-xs text-muted-foreground font-mono mt-1">
                        {transaction.partner_transaction_id}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <Button variant="outline" className="w-full mt-6 bg-transparent" disabled>
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </Card>
        </div>
      </div>
    </main>
  )
}
