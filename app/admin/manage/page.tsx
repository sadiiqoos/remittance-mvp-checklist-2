import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminManagementContent } from "@/components/admin/admin-management-content"

export default async function AdminManagementPage() {
  const admin = await getCurrentAdmin()

  if (!admin) {
    redirect("/admin/login")
  }

  // Check if user has permission to manage admins
  if (!admin.permissions?.includes("manage_admins")) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader adminName={`${admin.first_name} ${admin.last_name}`} adminEmail={admin.email} />
      <AdminManagementContent currentAdmin={admin} />
    </div>
  )
}
