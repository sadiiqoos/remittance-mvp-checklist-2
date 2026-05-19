"use client"

import { useState, useEffect } from "react"
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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Key, Search, Power, Loader2 } from "lucide-react"
import { getAdminUsers, updateAdminUserStatus } from "@/app/actions/admin"

interface UserManagementContentProps {
  currentAdmin: any
}

export function UserManagementContent({ currentAdmin }: UserManagementContentProps) {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [passwordForm, setPasswordForm] = useState({ newPassword: "", confirmPassword: "" })
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const data = await getAdminUsers()
    setUsers(data)
    setLoading(false)
  }

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.account_status === "active" ? "suspended" : "active"
    const result = await updateAdminUserStatus(user.id, newStatus)

    if (!result.success) {
      toast({ title: "Error", description: "Failed to update user status", variant: "destructive" })
      return
    }

    setUsers(users.map(u => u.id === user.id ? { ...u, account_status: newStatus } : u))
    toast({
      title: "Success",
      description: `${user.first_name} ${user.last_name} has been ${newStatus === "active" ? "activated" : "suspended"}`,
    })
  }

  const handleChangePassword = () => {
    if (!selectedUser) return
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" })
      return
    }
    setIsPasswordDialogOpen(false)
    setSelectedUser(null)
    setPasswordForm({ newPassword: "", confirmPassword: "" })
    toast({ title: "Success", description: `Password updated for ${selectedUser.first_name} ${selectedUser.last_name}` })
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.first_name?.toLowerCase().includes(query) ||
      user.last_name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    )
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage regular users and their accounts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} in the system
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.kyc_status === "verified" ? "default" : user.kyc_status === "pending" ? "secondary" : "destructive"}>
                          {user.kyc_status || "Not Started"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.account_status === "active" ? "default" : "secondary"}>
                          {user.account_status || "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {currentAdmin?.role === "super_admin" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(user)} title={user.account_status === "active" ? "Suspend User" : "Activate User"}>
                                <Power className={`h-4 w-4 ${user.account_status === "active" ? "text-green-600" : "text-gray-400"}`} />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setPasswordForm({ newPassword: "", confirmPassword: "" }); setIsPasswordDialogOpen(true) }} title="Change Password">
                                <Key className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>Update password for {selectedUser?.first_name} {selectedUser?.last_name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Min. 6 characters" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleChangePassword}>Update Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
