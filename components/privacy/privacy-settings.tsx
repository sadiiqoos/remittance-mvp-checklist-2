"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Trash2, Shield, FileText, Cookie } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface PrivacySettingsProps {
  userId: string
  userEmail: string
}

export function PrivacySettings({ userId, userEmail }: PrivacySettingsProps) {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionReason, setDeletionReason] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [dataCategories, setDataCategories] = useState({
    identity: true,
    contact: true,
    financial: true,
    authentication: true,
    kyc: true,
    communications: true,
  })

  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  const handleExportData = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/gdpr/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, categories: dataCategories, format: "json" }),
      })

      const data = await response.json()

      if (data.success) {
        // Download the exported data
        const blob = new Blob([data.data], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `remitswift-data-export-${Date.now()}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Data Exported",
          description: "Your data has been exported successfully.",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletionReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for account deletion.",
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch("/api/gdpr/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, reason: deletionReason }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Account Deletion Requested",
          description: "Your account deletion request has been submitted. You will be contacted within 30 days.",
        })
        setDeleteDialogOpen(false)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit deletion request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSaveCookies = async () => {
    try {
      const response = await fetch("/api/gdpr/cookies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, preferences: cookiePreferences }),
      })

      if (response.ok) {
        toast({
          title: "Preferences Saved",
          description: "Your cookie preferences have been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save cookie preferences.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-500" />
            <CardTitle>Export Your Data</CardTitle>
          </div>
          <CardDescription>Download a copy of all your personal data (GDPR Article 15)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Select data categories to export:</Label>
            {Object.entries(dataCategories).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) => setDataCategories((prev) => ({ ...prev, [key]: checked as boolean }))}
                />
                <label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
              </div>
            ))}
          </div>

          <Button onClick={handleExportData} disabled={isExporting} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Data as JSON"}
          </Button>

          <p className="text-xs text-muted-foreground">
            Your data will be provided in JSON format within 30 days as required by GDPR.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-teal-500" />
            <CardTitle>Cookie Preferences</CardTitle>
          </div>
          <CardDescription>Manage how we use cookies on your device</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <Label className="font-medium">Necessary Cookies</Label>
                <p className="text-xs text-muted-foreground mt-1">Required for the website to function properly</p>
              </div>
              <Checkbox checked disabled />
            </div>

            {[
              { key: "functional", label: "Functional Cookies", desc: "Remember your preferences and settings" },
              { key: "analytics", label: "Analytics Cookies", desc: "Help us understand how you use our website" },
              { key: "marketing", label: "Marketing Cookies", desc: "Used to track visitors and display relevant ads" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start justify-between p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <Label className="font-medium">{label}</Label>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
                <Checkbox
                  checked={cookiePreferences[key as keyof typeof cookiePreferences]}
                  onCheckedChange={(checked) =>
                    setCookiePreferences((prev) => ({ ...prev, [key]: checked as boolean }))
                  }
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSaveCookies} className="w-full">
            Save Cookie Preferences
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">Delete Your Account</CardTitle>
          </div>
          <CardDescription>Permanently delete your account and data (GDPR Article 17)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
            <p className="text-sm font-medium">Warning: This action cannot be undone</p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
              <li>Your account will be permanently deleted</li>
              <li>All your personal data will be removed</li>
              <li>Transaction records will be anonymized (required by law)</li>
              <li>You will lose access to all services</li>
            </ul>
          </div>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="w-4 h-4 mr-2" />
                Request Account Deletion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Your Account?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please provide a reason for deletion (optional but helpful).
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for deletion</Label>
                  <Textarea
                    id="reason"
                    placeholder="e.g., No longer need the service, Privacy concerns, etc."
                    value={deletionReason}
                    onChange={(e) => setDeletionReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? "Processing..." : "Confirm Deletion"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <p className="text-xs text-muted-foreground">
            Your deletion request will be processed within 30 days as required by GDPR. Some data may be retained for
            legal compliance.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-500" />
            <CardTitle>Your Rights</CardTitle>
          </div>
          <CardDescription>Under GDPR, you have the following rights</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2">
              <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Access:</strong> Request a copy of your personal data
              </div>
            </li>
            <li className="flex gap-2">
              <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Rectification:</strong> Request correction of inaccurate data
              </div>
            </li>
            <li className="flex gap-2">
              <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Erasure:</strong> Request deletion of your data (with legal exceptions)
              </div>
            </li>
            <li className="flex gap-2">
              <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Data Portability:</strong> Receive your data in a machine-readable format
              </div>
            </li>
            <li className="flex gap-2">
              <Shield className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Right to Object:</strong> Object to processing of your data for specific purposes
              </div>
            </li>
          </ul>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              For any questions about your data rights or to exercise them, contact us at{" "}
              <a href="mailto:privacy@remitswift.com" className="text-teal-600 hover:underline">
                privacy@remitswift.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
