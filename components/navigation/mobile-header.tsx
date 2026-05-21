"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function MobileHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-red-50 ring-1 ring-orange-200 transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo-icon.png"
                  alt="RemitSwift"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent tracking-tight">
                  RemitSwift
                </span>
                <span className="hidden text-xs text-slate-400 sm:block">
                  Fast global transfers
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="#how-it-works" className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all">
                How it works
              </Link>
              <Link href="#download" className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all">
                Download
              </Link>
              <Link href="#about" className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all">
                Who we are
              </Link>
              <Link href="#contact" className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all">
                Contact Us
              </Link>
            </nav>

            {/* Desktop buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Button asChild variant="ghost" size="sm" className="font-semibold text-orange-700 hover:text-orange-800 hover:bg-orange-50 px-6 rounded-lg">
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 rounded-lg shadow-lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Mobile right side */}
            <div className="flex lg:hidden items-center gap-2">
              <Link href="/signup" className="text-sm font-semibold text-orange-600 hover:text-orange-700 px-2">
                Sign Up
              </Link>
              <Button asChild size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold px-4 rounded-lg shadow-md">
                <Link href="/login">Sign In</Link>
              </Button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 ml-1 text-gray-700 hover:text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Menu panel */}
          <div className="absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-3xl overflow-hidden">
            {/* Header space */}
            <div className="h-20" />

            {/* Menu links */}
            <nav className="px-6 pb-8 space-y-1">
              <Link
                href="#how-it-works"
                onClick={closeMenu}
                className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 hover:text-orange-600 border-b border-gray-100 transition-colors"
              >
                How it works
                <span className="text-orange-400">›</span>
              </Link>
              <Link
                href="#download"
                onClick={closeMenu}
                className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 hover:text-orange-600 border-b border-gray-100 transition-colors"
              >
                Download
                <span className="text-orange-400">›</span>
              </Link>
              <Link
                href="#about"
                onClick={closeMenu}
                className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 hover:text-orange-600 border-b border-gray-100 transition-colors"
              >
                Who we are
                <span className="text-orange-400">›</span>
              </Link>
              <Link
                href="#contact"
                onClick={closeMenu}
                className="flex items-center justify-between py-4 text-lg font-semibold text-gray-800 hover:text-orange-600 transition-colors"
              >
                Contact Us
                <span className="text-orange-400">›</span>
              </Link>

              {/* CTA buttons */}
              <div className="pt-6 space-y-3">
                <Button asChild className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-6 rounded-xl text-base shadow-lg">
                  <Link href="/login" onClick={closeMenu}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full border-2 border-orange-200 text-orange-600 font-semibold py-6 rounded-xl text-base hover:bg-orange-50">
                  <Link href="/signup" onClick={closeMenu}>Create Account</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
