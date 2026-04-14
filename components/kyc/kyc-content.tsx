"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Upload, Loader2 } from "lucide-react"
import type { User } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { updateKYCStatus } from "@/app/actions/kyc"

interface KYCContentProps {
  initialUser: User
}

export function KYCContent({ initialUser }: KYCContentProps) {
  const [user, setUser] = useState<User>(initialUser)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleDocumentUpload = async (documentType: string) => {
    setUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setUploading(false)
    toast({
      title: "Document uploaded",
      description: `Your ${documentType} has been uploaded successfully.`,
    })
  }

  const handleSubmitForReview = async () => {
    setSubmitting(true)
    try {
      const updatedUser = await updateKYCStatus("pending")
      setUser(updatedUser)
      toast({
        title: "Submitted for review",
        description: "Your KYC documents have been submitted for review. We'll notify you once approved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit for review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getKYCStatusBadge = () => {
    const status = user?.kyc_status || "pending"
    const config = {
      verified: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-800" },
      approved: { label: "Verified", icon: CheckCircle2, className: "bg-green-100 text-green-800" },
      pending: { label: "Pending Review", icon: Clock, className: "bg-yellow-100 text-yellow-800" },
      rejected: { label: "Rejected", icon: AlertCircle, className: "bg-red-100 text-red-800" },
      expired: { label: "Expired", icon: AlertCircle, className: "bg-orange-100 text-orange-800" },
    }

    const statusConfig = config[status as keyof typeof config] || config.pending
    const { label, icon: Icon, className } = statusConfig

    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">KYC Verification</h1>
          {getKYCStatusBadge()}
        </div>
        <p className="text-muted-foreground">
          Complete your identity verification to unlock full transfer capabilities
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            Personal Information
            {(user?.kyc_status === "verified" || user?.kyc_status === "approved") && (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            )}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={user?.first_name || ""} disabled />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={user?.last_name || ""} disabled />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user?.email || ""} disabled />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={user?.phone_number || ""} disabled />
            </div>
            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={user?.date_of_birth || ""} disabled />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" value={user?.nationality || ""} disabled />
            </div>
          </div>
        </Card>

        {/* Address Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Address Information</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" placeholder="Enter your street address" />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Enter your city" />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" placeholder="Enter postal code" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="country">Country</Label>
              <Select defaultValue="sweden">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sweden">Sweden</SelectItem>
                  <SelectItem value="norway">Norway</SelectItem>
                  <SelectItem value="denmark">Denmark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Document Upload */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Identity Documents</h2>

          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Government-Issued ID</p>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a clear photo of your passport or national ID card
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDocumentUpload("ID document")}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload ID
                  </>
                )}
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Proof of Address</p>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a utility bill or bank statement (not older than 3 months)
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDocumentUpload("proof of address")}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Verification Tiers */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Tiers</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Tier 1 - Basic (Completed)</div>
                <p className="text-sm text-muted-foreground mb-2">Email and phone verification</p>
                <p className="text-sm font-medium">Limit: 5,000 SEK per transaction</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Tier 2 - Standard (Pending)</div>
                <p className="text-sm text-muted-foreground mb-2">ID verification required</p>
                <p className="text-sm font-medium">Limit: 50,000 SEK per transaction</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-muted rounded-lg opacity-60">
              <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold mb-1">Tier 3 - Premium (Locked)</div>
                <p className="text-sm text-muted-foreground mb-2">Full documentation + proof of address</p>
                <p className="text-sm font-medium">Limit: 200,000 SEK per transaction</p>
              </div>
            </div>
          </div>
        </Card>

        {user?.kyc_status !== "verified" && user?.kyc_status !== "approved" && (
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSubmitForReview} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
