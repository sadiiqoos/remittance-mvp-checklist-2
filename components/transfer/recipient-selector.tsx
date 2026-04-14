"use client"

import type { Recipient } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"
import { getCountryName } from "@/components/country-flag"

interface RecipientSelectorProps {
  recipients: Recipient[]
  selectedRecipient: Recipient | null
  onSelect: (recipient: Recipient) => void
  onAddNew: () => void
}

export function RecipientSelector({ recipients, selectedRecipient, onSelect, onAddNew }: RecipientSelectorProps) {
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Select recipient</label>
        <Button variant="outline" size="sm" onClick={onAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="space-y-2">
        {recipients.map((recipient) => (
          <Card
            key={recipient.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedRecipient?.id === recipient.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
            onClick={() => onSelect(recipient)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {recipient.first_name} {recipient.last_name}
                  </span>
                  {recipient.is_favorite && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getCountryName(recipient.country)} • {getPayoutMethodLabel(recipient.payout_method)}
                </div>
                {recipient.payout_method === "mobile_money" && recipient.mobile_money_number && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {recipient.mobile_money_provider}: {recipient.mobile_money_number}
                  </div>
                )}
                {recipient.payout_method === "bank_transfer" && recipient.bank_name && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {recipient.bank_name} - {recipient.bank_account_number}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {recipients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No recipients yet</p>
            <p className="text-sm mt-1">Add your first recipient to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
