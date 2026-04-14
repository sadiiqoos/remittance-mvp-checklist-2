import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProtectedAdminRoute } from "@/components/admin/protected-admin-route"
import { CommandCenterContent } from "@/components/admin/command-center-content"

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-muted/30">
        <AdminHeader adminName={`${admin.first_name} ${admin.last_name}`} adminEmail={admin.email} />
        <CommandCenterContent />
      </div>
    </ProtectedAdminRoute>
  )
}
