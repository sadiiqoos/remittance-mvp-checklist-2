"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function MobileHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              RemitSwift
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all"
            >
              How it works
            </Link>
            <Link
              href="#download"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all"
            >
              Download
            </Link>
            <Link
              href="#about"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all"
            >
              Who we are
            </Link>
            <Link
              href="#contact"
              className="text-sm font-semibold text-orange-700 hover:text-orange-800 transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-orange-700 hover:after:w-full after:transition-all"
            >
              Contact Us
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="font-semibold text-orange-700 hover:text-orange-800 hover:bg-orange-50 px-3 sm:px-6 rounded-lg transition-all text-xs sm:text-sm"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-4 sm:px-8 rounded-lg shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <Link href="/signup" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
              Sign Up
            </Link>
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-6 rounded-lg shadow-md"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-orange-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4 space-y-3">
            <Link
              href="#how-it-works"
              className="block text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </Link>
            <Link
              href="#download"
              className="block text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download
            </Link>
            <Link
              href="#about"
              className="block text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Who we are
            </Link>
            <Link
              href="#contact"
              className="block text-sm font-semibold text-gray-700 hover:text-orange-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
