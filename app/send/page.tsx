import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { SendMoneyContent } from "@/components/transfer/send-money-content"

export default async function SendMoneyPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <SendMoneyContent />
      </div>
    </ProtectedRoute>
  )
}
