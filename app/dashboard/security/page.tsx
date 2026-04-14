import { redirect } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { TwoFactorSetup } from "@/components/auth/two-factor-setup"

export default async function SecurityPage() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect("/login")
  }

  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-muted-foreground">Manage your account security and two-factor authentication</p>
        </div>

        <div className="grid gap-6">
          {!user.two_factor_enabled ? (
            <TwoFactorSetup userId={user.id} userEmail={user.email} onComplete={() => window.location.reload()} />
          ) : (
            <div className="p-6 bg-muted rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Two-Factor Authentication Enabled
              </h3>
              <p className="text-sm text-muted-foreground">Your account is protected with two-factor authentication.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
