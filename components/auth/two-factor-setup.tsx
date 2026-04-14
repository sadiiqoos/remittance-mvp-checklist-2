"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Copy, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TwoFactorSetupProps {
  userId: string
  userEmail: string
  onComplete?: () => void
}

export function TwoFactorSetup({ userId, userEmail, onComplete }: TwoFactorSetupProps) {
  const [step, setStep] = useState<"generate" | "verify">("generate")
  const [secret, setSecret] = useState<string>("")
  const [qrCode, setQrCode] = useState<string>("")
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail }),
      })

      const data = await response.json()

      if (data.success) {
        setSecret(data.secret)
        setQrCode(data.qrCode)
        setBackupCodes(data.backupCodes)
        setStep("verify")
      } else {
        setError(data.error || "Failed to generate 2FA secret")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/2fa/verify-setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, secret, code: verificationCode }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been enabled successfully.",
        })
        onComplete?.()
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    })
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-500" />
          <CardTitle>Enable Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>Add an extra layer of security to your account by enabling 2FA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {step === "generate" && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h3 className="font-medium">What is Two-Factor Authentication?</h3>
              <p className="text-sm text-muted-foreground">
                2FA adds an extra layer of security by requiring a code from your authenticator app in addition to your
                password when signing in.
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? "Generating..." : "Generate 2FA Secret"}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Step 1: Scan QR Code</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="flex justify-center p-6 bg-white rounded-lg border">
                  <div className="text-center">
                    <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded">
                      <p className="text-sm text-gray-500 px-4">QR Code Display</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Scan with your authenticator app</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Or enter this code manually:</h3>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg font-mono text-sm">
                  <code className="flex-1">{secret}</code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(secret)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Step 2: Save Backup Codes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Save these backup codes in a safe place. You can use them to access your account if you lose your
                  authenticator device.
                </p>
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center gap-2 font-mono text-sm">
                      <span className="text-muted-foreground">{index + 1}.</span>
                      <code className="flex-1">{code}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(code)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Step 3: Verify</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter the 6-digit code from your authenticator app to complete setup
                </p>
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                    className="text-center text-2xl tracking-widest font-mono"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6} className="w-full">
              {isLoading ? "Verifying..." : "Complete Setup"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
