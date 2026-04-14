import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"

export async function AppHeader() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="w-full px-4 py-4 lg:px-16">
        <div className="flex items-center justify-between">

          {/* 🔥 LOGO (FIXED) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-red-50 ring-1 ring-orange-200 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo-icon.png"
                alt="RemitSwift"
                className="h-10 w-10 object-contain"
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
                RemitSwift
              </span>
              <span className="hidden text-xs text-slate-400 sm:block">
                Fast global transfers
              </span>
            </div>
          </Link>

          {/* 🔥 RIGHT SIDE */}
          {user ? (
            <div className="flex items-center gap-8">
              <nav className="hidden items-center gap-6 lg:flex">
                <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-orange-600">
                  Dashboard
                </Link>
                <Link href="/send" className="text-sm font-medium text-slate-700 hover:text-orange-600">
                  Send Money
                </Link>
                <Link href="/transactions" className="text-sm font-medium text-slate-700 hover:text-orange-600">
                  Transactions
                </Link>
                <Link href="/recipients" className="text-sm font-medium text-slate-700 hover:text-orange-600">
                  Recipients
                </Link>
                <Link href="/kyc" className="text-sm font-medium text-slate-700 hover:text-orange-600">
                  KYC
                </Link>
              </nav>

              <UserMenu user={user} />
            </div>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/signup"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Sign Up
              </Link>

              <Button
                asChild
                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-2 text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}