import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { RecipientsContent } from "@/components/recipients/recipients-content"

export default async function RecipientsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <RecipientsContent />
      </div>
    </ProtectedRoute>
  )
}
