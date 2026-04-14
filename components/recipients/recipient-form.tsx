"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Corridor } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface RecipientFormProps {
  corridors: Corridor[]
  onSubmit: (data: RecipientFormData) => Promise<void>
  onCancel: () => void
  initialData?: RecipientFormData
  isEditing?: boolean
}

export interface RecipientFormData {
  firstName: string
  lastName: string
  country: string
  payoutMethod: "bank_transfer" | "mobile_money" | "cash_pickup" | "wallet"
  phone?: string
  email?: string
  city?: string
  bankName?: string
  bankAccountNumber?: string
  bankCode?: string
  swiftCode?: string
  iban?: string
  mobileMoneyProvider?: string
  mobileMoneyNumber?: string
  pickupLocation?: string
}

export function RecipientForm({ corridors, onSubmit, onCancel, initialData, isEditing = false }: RecipientFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<RecipientFormData>(
    initialData || {
      firstName: "",
      lastName: "",
      country: "",
      payoutMethod: "mobile_money",
      phone: "",
      email: "",
      city: "",
    },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(formData)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedCorridor = corridors.find((c) => c.destination_country === formData.country)
  const availablePayoutMethods = selectedCorridor?.supported_payout_methods || []

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">{isEditing ? "Edit Recipient" : "Add New Recipient"}</h2>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => setFormData({ ...formData, country: value })}
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {corridors.map((corridor) => (
                  <SelectItem key={corridor.id} value={corridor.destination_country}>
                    {corridor.name.replace("Sweden to ", "")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.country && (
            <div className="space-y-2">
              <Label htmlFor="payoutMethod">Payout Method *</Label>
              <Select
                value={formData.payoutMethod}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    payoutMethod: value as RecipientFormData["payoutMethod"],
                  })
                }
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payout method" />
                </SelectTrigger>
                <SelectContent>
                  {availablePayoutMethods.includes("mobile_money") && (
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  )}
                  {availablePayoutMethods.includes("bank_transfer") && (
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  )}
                  {availablePayoutMethods.includes("cash_pickup") && (
                    <SelectItem value="cash_pickup">Cash Pickup</SelectItem>
                  )}
                  {availablePayoutMethods.includes("wallet") && <SelectItem value="wallet">Wallet</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+254..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>

          {formData.payoutMethod === "mobile_money" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobileMoneyProvider">Mobile Money Provider *</Label>
                <Input
                  id="mobileMoneyProvider"
                  value={formData.mobileMoneyProvider}
                  onChange={(e) => setFormData({ ...formData, mobileMoneyProvider: e.target.value })}
                  placeholder="e.g., M-Pesa, MTN Mobile Money"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileMoneyNumber">Mobile Money Number *</Label>
                <Input
                  id="mobileMoneyNumber"
                  value={formData.mobileMoneyNumber}
                  onChange={(e) => setFormData({ ...formData, mobileMoneyNumber: e.target.value })}
                  placeholder="e.g., 254712345678"
                  required
                />
              </div>
            </>
          )}

          {formData.payoutMethod === "bank_transfer" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bankCode">Bank Code</Label>
                  <Input
                    id="bankCode"
                    value={formData.bankCode}
                    onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT/BIC Code</Label>
                  <Input
                    id="swiftCode"
                    value={formData.swiftCode}
                    onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="iban">IBAN (if applicable)</Label>
                <Input
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                />
              </div>
            </>
          )}

          {formData.payoutMethod === "cash_pickup" && (
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                placeholder="e.g., Lagos Main Branch"
                required
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Add Recipient"
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
