"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Shield } from "lucide-react"

interface TwoFactorVerifyProps {
  email: string
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
}

export function TwoFactorVerify({ email, onVerify, onCancel }: TwoFactorVerifyProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [useBackupCode, setUseBackupCode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await onVerify(code)

      if (!result.success) {
        setError(result.error || "Invalid code")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-500" />
          <CardTitle>Two-Factor Authentication</CardTitle>
        </div>
        <CardDescription>
          Enter the {useBackupCode ? "backup code" : "6-digit code"} from your authenticator app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-1">Signing in as:</p>
            <p className="text-muted-foreground">{email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">{useBackupCode ? "Backup Code" : "Verification Code"}</Label>
            <Input
              id="code"
              type="text"
              inputMode={useBackupCode ? "text" : "numeric"}
              pattern={useBackupCode ? undefined : "[0-9]*"}
              maxLength={useBackupCode ? 8 : 6}
              placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
              value={code}
              onChange={(e) =>
                setCode(useBackupCode ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, ""))
              }
              className="text-center text-2xl tracking-widest font-mono"
              autoFocus
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isLoading || code.length < (useBackupCode ? 8 : 6)}>
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          </div>

          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode)
              setCode("")
              setError("")
            }}
            className="text-sm text-muted-foreground hover:text-foreground underline w-full text-center"
          >
            {useBackupCode ? "Use authenticator code instead" : "Use backup code instead"}
          </button>
        </form>
      </CardContent>
    </Card>
  )
}
