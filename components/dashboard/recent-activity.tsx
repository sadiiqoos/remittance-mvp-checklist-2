import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/types"
import { TransactionStatusBadge } from "@/components/transactions/transaction-status-badge"
import { CountryFlag } from "@/components/country-flag"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

type TransactionWithRecipient = Transaction & {
  recipients: {
    id: string
    first_name: string
    last_name: string
    country: string
  } | null
}

interface RecentActivityProps {
  transactions: TransactionWithRecipient[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Recent Activity</h3>
        <Button asChild variant="ghost" size="sm">
          <Link href="/transactions">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const date = new Date(transaction.created_at)
            const formattedDate = date.toLocaleDateString("en-SE", {
              month: "short",
              day: "numeric",
            })

            return (
              <Link
                key={transaction.id}
                href={`/transaction/${transaction.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  {transaction.recipients && <CountryFlag countryCode={transaction.recipients.country} />}
                  <div>
                    <div className="font-medium text-sm">
                      {transaction.recipients
                        ? `${transaction.recipients.first_name} ${transaction.recipients.last_name}`
                        : "Unknown"}
                    </div>
                    <div className="text-xs text-muted-foreground">{formattedDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {transaction.source_amount.toFixed(2)} {transaction.source_currency}
                    </div>
                    <TransactionStatusBadge status={transaction.status} className="text-xs" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No recent activity</p>
        </div>
      )}
    </Card>
  )
}
