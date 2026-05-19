"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { addRecipient } from "@/app/actions/recipients"
import type { Recipient } from "@/lib/types"

interface AddRecipientDialogProps {
  open: boolean
  onClose: () => void
  onAdded: (recipient: Recipient) => void
  defaultCountry?: string
}

export function AddRecipientDialog({ open, onClose, onAdded, defaultCountry }: AddRecipientDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState(defaultCountry ?? "")
  const [payoutMethod, setPayoutMethod] = useState<string>("")

  // Bank transfer fields
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [swiftCode, setSwiftCode] = useState("")

  // Mobile money fields
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState("")
  const [mobileMoneyNumber, setMobileMoneyNumber] = useState("")

  // Cash pickup fields
  const [pickupLocation, setPickupLocation] = useState("")

  const countries: Record<string, string> = {
    KE: "Kenya", NG: "Nigeria", GH: "Ghana",
    UG: "Uganda", TZ: "Tanzania", ZA: "South Africa",
    ET: "Ethiopia", RW: "Rwanda",
  }

  const handleSubmit = async () => {
    if (!firstName || !lastName || !country || !payoutMethod) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await addRecipient({
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        email: email || null,
        country,
        payout_method: payoutMethod as Recipient["payout_method"],
        bank_name: payoutMethod === "bank_transfer" ? bankName : null,
        bank_account_number: payoutMethod === "bank_transfer" ? bankAccountNumber : null,
        swift_code: payoutMethod === "bank_transfer" ? swiftCode : null,
        mobile_money_provider: payoutMethod === "mobile_money" ? mobileMoneyProvider : null,
        mobile_money_number: payoutMethod === "mobile_money" ? mobileMoneyNumber : null,
        pickup_location: payoutMethod === "cash_pickup" ? pickupLocation : null,
      })

      if (!result.success || !result.recipient) {
        setError(result.error ?? "Failed to add recipient")
        return
      }

      onAdded(result.recipient)
      onClose()

      // Reset form
      setFirstName(""); setLastName(""); setPhone(""); setEmail("")
      setCountry(defaultCountry ?? ""); setPayoutMethod("")
      setBankName(""); setBankAccountNumber(""); setSwiftCode("")
      setMobileMoneyProvider(""); setMobileMoneyNumber(""); setPickupLocation("")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Recipient</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>First Name *</Label>
              <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ahmed" />
            </div>
            <div className="space-y-1">
              <Label>Last Name *</Label>
              <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Mohamed" />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Country *</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(countries).map(([code, name]) => (
                  <SelectItem key={code} value={code}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Payout Method *</Label>
            <Select value={payoutMethod} onValueChange={setPayoutMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payout method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="cash_pickup">Cash Pickup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Phone</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+254700000000" />
          </div>

          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="recipient@email.com" type="email" />
          </div>

          {payoutMethod === "bank_transfer" && (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
              <p className="text-sm font-medium">Bank Details</p>
              <div className="space-y-1">
                <Label>Bank Name *</Label>
                <Input value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. Equity Bank" />
              </div>
              <div className="space-y-1">
                <Label>Account Number *</Label>
                <Input value={bankAccountNumber} onChange={e => setBankAccountNumber(e.target.value)} placeholder="0123456789" />
              </div>
              <div className="space-y-1">
                <Label>SWIFT / BIC Code</Label>
                <Input value={swiftCode} onChange={e => setSwiftCode(e.target.value)} placeholder="EQBLKENA" />
              </div>
            </div>
          )}

          {payoutMethod === "mobile_money" && (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
              <p className="text-sm font-medium">Mobile Money Details</p>
              <div className="space-y-1">
                <Label>Provider *</Label>
                <Select value={mobileMoneyProvider} onValueChange={setMobileMoneyProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="MTN Mobile Money">MTN Mobile Money</SelectItem>
                    <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                    <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                    <SelectItem value="Orange Money">Orange Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Mobile Number *</Label>
                <Input value={mobileMoneyNumber} onChange={e => setMobileMoneyNumber(e.target.value)} placeholder="+254700000000" />
              </div>
            </div>
          )}

          {payoutMethod === "cash_pickup" && (
            <div className="space-y-3 border rounded-lg p-3 bg-muted/30">
              <p className="text-sm font-medium">Pickup Details</p>
              <div className="space-y-1">
                <Label>Pickup Location *</Label>
                <Input value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} placeholder="e.g. Nairobi CBD branch" />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Add Recipient"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
