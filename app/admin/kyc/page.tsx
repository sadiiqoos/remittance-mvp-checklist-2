import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminKYCContent } from "@/components/admin/admin-kyc-content"
import { getAdminUser } from "@/lib/auth"

export default async function AdminKYCPage() {
  const admin = await getAdminUser()

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader adminName={admin?.name || ""} adminEmail={admin?.email || ""} />
        <AdminKYCContent />
      </div>
    </ProtectedAdminRoute>
  )
}
