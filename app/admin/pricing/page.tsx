import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"
import { AdminHeader } from "@/components/admin/admin-header"
import { PricingManagementContent } from "@/components/admin/pricing-management-content"
import { getAdminUser } from "@/lib/auth"

export default async function AdminPricingPage() {
  const admin = await getAdminUser()

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <AdminHeader adminName={`${admin.first_name} ${admin.last_name}`} adminEmail={admin.email} />
        <PricingManagementContent />
      </div>
    </ProtectedAdminRoute>
  )
}
