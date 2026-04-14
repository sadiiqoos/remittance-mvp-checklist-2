import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { TransactionDetailContent } from "@/components/transactions/transaction-detail-content"

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <TransactionDetailContent params={params} />
      </div>
    </ProtectedRoute>
  )
}
