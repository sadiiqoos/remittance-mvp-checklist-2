"use client"

import type { Recipient } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CountryFlag, getCountryName } from "@/components/country-flag"
import { Star, Edit, Trash2, Send } from "lucide-react"
import Link from "next/link"

interface RecipientCardProps {
  recipient: Recipient
  onEdit: (recipient: Recipient) => void
  onDelete: (recipient: Recipient) => void
  onToggleFavorite: (recipient: Recipient, isFavorite: boolean) => void
}

export function RecipientCard({ recipient, onEdit, onDelete, onToggleFavorite }: RecipientCardProps) {
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
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <CountryFlag countryCode={recipient.country} className="w-10 h-10" />
          <div>
            <h3 className="font-semibold text-lg">
              {recipient.first_name} {recipient.last_name}
            </h3>
            <p className="text-sm text-muted-foreground">{getCountryName(recipient.country)}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleFavorite(recipient, !recipient.is_favorite)}
          className="h-8 w-8 p-0"
        >
          <Star
            className={`w-4 h-4 ${recipient.is_favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Payout Method:</span>
          <span className="font-medium">{getPayoutMethodLabel(recipient.payout_method)}</span>
        </div>

        {recipient.payout_method === "mobile_money" && recipient.mobile_money_number && (
          <div className="text-sm">
            <span className="text-muted-foreground">{recipient.mobile_money_provider}:</span>
            <span className="ml-2 font-mono">{recipient.mobile_money_number}</span>
          </div>
        )}

        {recipient.payout_method === "bank_transfer" && recipient.bank_name && (
          <div className="text-sm">
            <div className="text-muted-foreground">{recipient.bank_name}</div>
            <div className="font-mono">{recipient.bank_account_number}</div>
          </div>
        )}

        {recipient.payout_method === "cash_pickup" && recipient.pickup_location && (
          <div className="text-sm">
            <span className="text-muted-foreground">Pickup:</span>
            <span className="ml-2">{recipient.pickup_location}</span>
          </div>
        )}

        {recipient.phone && (
          <div className="text-sm">
            <span className="text-muted-foreground">Phone:</span>
            <span className="ml-2 font-mono">{recipient.phone}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button asChild variant="default" size="sm" className="flex-1">
          <Link href={`/send?recipient=${recipient.id}`}>
            <Send className="w-4 h-4 mr-2" />
            Send Money
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(recipient)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(recipient)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
