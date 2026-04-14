import { redirect } from "next/navigation"
import { isAuthenticated, getCurrentUser } from "@/lib/auth"
import { PrivacySettings } from "@/components/privacy/privacy-settings"

export default async function PrivacyPage() {
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
          <h1 className="text-3xl font-bold mb-2">Privacy & Data</h1>
          <p className="text-muted-foreground">Manage your privacy settings and data rights under GDPR</p>
        </div>

        <PrivacySettings userId={user.id} userEmail={user.email} />
      </div>
    </div>
  )
}
