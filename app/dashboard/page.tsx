import { ProtectedRoute } from "@/components/protected-route"
import { AppHeader } from "@/components/app-header"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <DashboardContent />
      </div>
    </ProtectedRoute>
  )
}
