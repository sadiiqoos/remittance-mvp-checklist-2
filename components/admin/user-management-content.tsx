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
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Key, Search, Power } from "lucide-react"
import { getAllUsers, updateUserPassword, toggleUserStatus } from "@/lib/admin-mock-data"

interface UserManagementContentProps {
  currentAdmin: any
}

export function UserManagementContent({ currentAdmin }: UserManagementContentProps) {
  const [users, setUsers] = useState(getAllUsers())
  const [searchQuery, setSearchQuery] = useState("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const { toast } = useToast()

  const handleChangePassword = () => {
    if (!selectedUser) return

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

    updateUserPassword(selectedUser.id, passwordForm.newPassword)
    setIsPasswordDialogOpen(false)
    setSelectedUser(null)
    setPasswordForm({ newPassword: "", confirmPassword: "" })

    toast({
      title: "Success",
      description: `Password for ${selectedUser.first_name} ${selectedUser.last_name} has been updated`,
    })
  }

  const handleToggleStatus = (user: any) => {
    toggleUserStatus(user.id)
    setUsers(getAllUsers())

    const newStatus = user.account_status === "active" ? "suspended" : "active"
    toast({
      title: "Success",
      description: `${user.first_name} ${user.last_name} has been ${newStatus === "active" ? "activated" : "suspended"}`,
    })
  }

  const openPasswordDialog = (user: any) => {
    setSelectedUser(user)
    setPasswordForm({ newPassword: "", confirmPassword: "" })
    setIsPasswordDialogOpen(true)
  }

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase()
    return (
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
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
            <div className="flex items-center gap-2">
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
          </div>
        </CardHeader>
        <CardContent>
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.kyc_status === "verified"
                          ? "default"
                          : user.kyc_status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {user.kyc_status || "Not Started"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.account_status === "active" ? "default" : "secondary"}>
                      {user.account_status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {currentAdmin.role === "super_admin" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user)}
                            title={user.account_status === "active" ? "Suspend User" : "Activate User"}
                          >
                            <Power
                              className={`h-4 w-4 ${user.account_status === "active" ? "text-green-600" : "text-gray-400"}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openPasswordDialog(user)}
                            title="Change Password"
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Password</DialogTitle>
            <DialogDescription>
              Update password for {selectedUser?.first_name} {selectedUser?.last_name}
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
