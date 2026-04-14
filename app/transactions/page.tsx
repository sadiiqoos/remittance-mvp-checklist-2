import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { TransactionsContent } from "@/components/transactions/transactions-content"

export default async function TransactionsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <TransactionsContent />
      </div>
    </ProtectedRoute>
  )
}
