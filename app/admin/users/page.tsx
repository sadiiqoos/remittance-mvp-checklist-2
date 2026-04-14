import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"
import { AdminHeader } from "@/components/admin/admin-header"
import { UserManagementContent } from "@/components/admin/user-management-content"
import { getAdminUser } from "@/lib/auth"

export default async function UsersPage() {
  const admin = await getAdminUser()

  return (
    <ProtectedAdminRoute requiredPermission="view_reports">
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <UserManagementContent currentAdmin={admin} />
      </div>
    </ProtectedAdminRoute>
  )
}
