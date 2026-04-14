"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Shield, LayoutDashboard, AlertTriangle, Users, DollarSign, LogOut, UserCog } from "lucide-react"
import { logoutAdmin } from "@/lib/auth"

interface AdminHeaderProps {
  adminName: string
  adminEmail: string
}

export function AdminHeader({ adminName, adminEmail }: AdminHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin/login")
    router.refresh()
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/transactions", label: "Transactions", icon: AlertTriangle },
    { href: "/admin/kyc", label: "KYC Cases", icon: Users },
    { href: "/admin/pricing", label: "Pricing", icon: DollarSign },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/manage", label: "Admins", icon: UserCog },
  ]

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Shield className="h-6 w-6 text-primary" />
            <span>Admin Portal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="gap-2">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden md:inline">{adminName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{adminName}</p>
              <p className="text-xs text-muted-foreground">{adminEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
