import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { KYCContent } from "@/components/kyc/kyc-content"
import { getCurrentUser } from "@/app/actions/kyc"

export default async function KYCPage() {
  const user = await getCurrentUser()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <KYCContent initialUser={user} />
      </div>
    </ProtectedRoute>
  )
}
