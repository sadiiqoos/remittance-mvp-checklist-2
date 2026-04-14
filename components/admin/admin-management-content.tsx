"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Shield, Edit, Trash2, Power, Key } from "lucide-react"
import {
  getAllAdmins,
  createSubAdmin,
  updateAdminRole,
  toggleAdminStatus,
  deleteAdmin,
  updateAdminPassword,
} from "@/lib/admin-mock-data"

interface AdminManagementContentProps {
  currentAdmin: any
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  operations: "Operations",
  compliance: "Compliance",
  finance: "Finance",
  support: "Support",
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  super_admin: "Full system access including admin management",
  admin: "Manage transactions, KYC, pricing, and view reports",
  operations: "Approve transactions and monitor operations",
  compliance: "Review and approve KYC cases",
  finance: "Manage pricing and view financial reports",
  support: "View transactions and assist users",
}

export function AdminManagementContent({ currentAdmin }: AdminManagementContentProps) {
  const [admins, setAdmins] = useState(getAllAdmins())
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    role: "support" as any,
    password: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleAddAdmin = () => {
    if (!formData.email || !formData.first_name || !formData.last_name || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newAdmin = createSubAdmin(formData)
    setAdmins(getAllAdmins())
    setIsAddDialogOpen(false)
    setFormData({
      email: "",
      first_name: "",
      last_name: "",
      role: "support",
      password: "",
    })

    toast({
      title: "Success",
      description: `Sub-admin ${newAdmin.first_name} ${newAdmin.last_name} has been created`,
    })
  }

  const handleUpdateRole = () => {
    if (!selectedAdmin) return

    updateAdminRole(selectedAdmin.id, formData.role)
    setAdmins(getAllAdmins())
    setIsEditDialogOpen(false)
    setSelectedAdmin(null)

    toast({
      title: "Success",
      description: "Admin role has been updated",
    })
  }

  const handleToggleStatus = (adminId: string) => {
    toggleAdminStatus(adminId)
    setAdmins(getAllAdmins())

    const admin = admins.find((a) => a.id === adminId)
    toast({
      title: "Success",
      description: `Admin ${admin?.first_name} has been ${admin?.is_active ? "deactivated" : "activated"}`,
    })
  }

  const handleDeleteAdmin = (adminId: string) => {
    if (confirm("Are you sure you want to delete this admin?")) {
      deleteAdmin(adminId)
      setAdmins(getAllAdmins())

      toast({
        title: "Success",
        description: "Admin has been deleted",
      })
    }
  }

  const openEditDialog = (admin: any) => {
    setSelectedAdmin(admin)
    setFormData({
      email: admin.email,
      first_name: admin.first_name,
      last_name: admin.last_name,
      role: admin.role,
      password: "",
    })
    setIsEditDialogOpen(true)
  }

  const openPasswordDialog = (admin: any) => {
    setSelectedAdmin(admin)
    setPasswordForm({ newPassword: "", confirmPassword: "" })
    setIsPasswordDialogOpen(true)
  }

  const handleChangePassword = () => {
    if (!selectedAdmin) return

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    updateAdminPassword(selectedAdmin.id, passwordForm.newPassword)
    setIsPasswordDialogOpen(false)
    setSelectedAdmin(null)
    setPasswordForm({ newPassword: "", confirmPassword: "" })

    toast({
      title: "Success",
      description: `Password for ${selectedAdmin.first_name} ${selectedAdmin.last_name} has been updated`,
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-muted-foreground">Manage sub-admins and their roles</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Sub-Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Sub-Admin</DialogTitle>
              <DialogDescription>Create a new admin user with specific role and permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@remittance.se"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ROLE_LABELS)
                      .filter(([key]) => key !== "super_admin")
                      .map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{label}</span>
                            <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[value]}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>Create Admin</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>
            {admins.length} admin{admins.length !== 1 ? "s" : ""} with various roles and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {admin.role === "super_admin" && <Shield className="h-4 w-4 text-primary" />}
                      {admin.first_name} {admin.last_name}
                    </div>
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Badge variant={admin.role === "super_admin" ? "default" : "secondary"}>
                      {ROLE_LABELS[admin.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.last_login
                      ? new Date(admin.last_login).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={admin.is_active ? "default" : "secondary"}>
                      {admin.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {admin.id !== currentAdmin.id && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPasswordDialog(admin)}
                          title="Change Password"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        {admin.role !== "super_admin" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(admin)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(admin.id)}>
                              <Power className={`h-4 w-4 ${admin.is_active ? "text-destructive" : "text-green-600"}`} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAdmin(admin.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Role</DialogTitle>
            <DialogDescription>
              Update the role and permissions for {selectedAdmin?.first_name} {selectedAdmin?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS)
                    .filter(([key]) => key !== "super_admin")
                    .map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{label}</span>
                          <span className="text-xs text-muted-foreground">{ROLE_DESCRIPTIONS[value]}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update password for {selectedAdmin?.first_name} {selectedAdmin?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password (min. 6 characters)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
