import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminTransactionsContent } from "@/components/admin/admin-transactions-content"
import { getAdminUser } from "@/lib/auth"

export default async function AdminTransactionsPage() {
  const admin = await getAdminUser()

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader adminName={admin?.name || ""} adminEmail={admin?.email || ""} />
        <AdminTransactionsContent />
      </div>
    </ProtectedAdminRoute>
  )
}
