"use client"

import type { Transaction } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionStatusBadge } from "./transaction-status-badge"
import { CountryFlag, getCountryName } from "@/components/country-flag"
import { Eye } from "lucide-react"
import Link from "next/link"

interface TransactionCardProps {
  transaction: Transaction & {
    recipients: {
      id: string
      first_name: string
      last_name: string
      country: string
      payout_method: string
    } | null
  }
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const date = new Date(transaction.created_at)
  const formattedDate = date.toLocaleDateString("en-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  const formattedTime = date.toLocaleTimeString("en-SE", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {transaction.recipients && <CountryFlag countryCode={transaction.recipients.country} />}
          <div>
            <div className="font-medium">
              {transaction.recipients
                ? `${transaction.recipients.first_name} ${transaction.recipients.last_name}`
                : "Unknown Recipient"}
            </div>
            <div className="text-sm text-muted-foreground">
              {transaction.recipients && getCountryName(transaction.recipients.country)}
            </div>
          </div>
        </div>
        <TransactionStatusBadge status={transaction.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <div className="text-muted-foreground">You sent</div>
          <div className="font-semibold">
            {transaction.source_amount.toFixed(2)} {transaction.source_currency}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">They received</div>
          <div className="font-semibold">
            {transaction.destination_amount.toFixed(2)} {transaction.destination_currency}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="text-xs text-muted-foreground">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground font-mono">{transaction.reference_number}</div>
          <Button asChild variant="ghost" size="sm">
            <Link href={`/transaction/${transaction.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
