"use client"
import Image from "next/image"
import { Shield, Smartphone, Phone, MapPin, Send, Heart } from "lucide-react"
import Link from "next/link"
import MobileHeader from "@/components/navigation/mobile-header"
import { CountriesSection } from "@/components/home/countries-section"
import { CurrencyDropdown } from "@/components/home/currency-dropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function Home() {
  const [sendAmount, setSendAmount] = useState("999.96")
  const [sendCurrency, setSendCurrency] = useState("SEK")
  const [receiveCurrency, setReceiveCurrency] = useState("KES")
  const [receiveAmount, setReceiveAmount] = useState("12143.33")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <MobileHeader />

      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-800 overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-slate-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content with unique messaging */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="bg-teal-500/20 border border-teal-400/30 text-teal-300 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    ✨ Trusted by 50,000+ families worldwide
                  </span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-balance">
                  Send love across
                  <br />
                  <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    borders instantly
                  </span>
                </h1>

                <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                  Connect with family anywhere in the world. Lightning-fast transfers, rock-bottom fees, and bank-grade
                  security—all from your phone.
                </p>
              </div>

              {/* Trust indicators with unique design */}
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center backdrop-blur-sm border border-teal-400/30">
                    <Shield className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Bank-level security</div>
                    <div className="text-slate-400 text-sm">End-to-end encrypted</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-sm border border-emerald-400/30">
                    <Heart className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">4.9/5 Rating</div>
                    <div className="text-slate-400 text-sm">50,000+ happy customers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Enhanced Calculator Card */}
            <div className="lg:ml-auto w-full max-w-lg">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-gradient-to-r from-teal-600 to-teal-500 p-4 text-center">
                  <p className="text-white font-semibold">💸 First transfer fee-free!</p>
                </div>

                {/* You send section */}
                <div className="p-6 border-b border-slate-100">
                  <Label className="text-teal-700 text-sm font-semibold mb-3 block">You send</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      className="flex-1 text-3xl font-bold border-2 border-slate-200 focus-visible:ring-teal-500 focus-visible:border-teal-500 h-auto py-4 px-4 rounded-xl"
                    />
                    <CurrencyDropdown value={sendCurrency} onValueChange={setSendCurrency} variant="dark" />
                  </div>
                </div>

                {/* Exchange rate with better design */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 flex items-center justify-center gap-2 border-y border-teal-100">
                  <div className="flex items-center gap-2 text-teal-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span className="text-sm font-bold">
                      1 {sendCurrency} = 12.16 {receiveCurrency}
                    </span>
                  </div>
                </div>

                {/* They get section */}
                <div className="p-6 border-b border-slate-100">
                  <Label className="text-slate-600 text-sm font-semibold mb-3 block">They receive</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      value={receiveAmount}
                      onChange={(e) => setReceiveAmount(e.target.value)}
                      className="flex-1 text-3xl font-bold border-2 border-slate-200 focus-visible:ring-teal-500 focus-visible:border-teal-500 h-auto py-4 px-4 rounded-xl"
                    />
                    <CurrencyDropdown value={receiveCurrency} onValueChange={setReceiveCurrency} variant="dark" />
                  </div>
                </div>

                {/* Receive method and details */}
                <div className="p-6 space-y-4">
                  <div>
                    <Label className="text-slate-600 text-sm font-semibold mb-3 block">How they'll receive it</Label>
                    <Select defaultValue="bank">
                      <SelectTrigger className="w-full border-2 border-slate-200 h-12 rounded-xl hover:border-teal-300 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">🏦 Bank Transfer</SelectItem>
                        <SelectItem value="mobile">📱 Mobile Money</SelectItem>
                        <SelectItem value="cash">💵 Cash Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fee and transfer details with better hierarchy */}
                  <div className="space-y-3 pt-4 bg-slate-50 p-4 rounded-xl">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Transfer fee</span>
                      <span className="font-semibold text-slate-900">25 {sendCurrency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Delivery time</span>
                      <span className="font-semibold text-teal-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Within minutes
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-3 border-t-2 border-slate-200">
                      <span className="text-slate-900">Total to pay</span>
                      <span className="text-teal-600">1024.96 {sendCurrency}</span>
                    </div>
                  </div>

                  {/* Enhanced CTA button */}
                  <Link href="/send" className="block">
                    <Button className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      Send Money Now →
                    </Button>
                  </Link>

                  <p className="text-center text-xs text-slate-500 mt-2">🔒 Secure • Fast • Trusted by thousands</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Simple & Fast
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Send money in{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                3 easy steps
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              No complicated paperwork. No long waits. Just simple, fast money transfers to the people who matter most.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create your free account",
                desc: "Sign up in under 2 minutes. Just your email and basic info—no hidden requirements or surprise fees.",
                icon: "👤",
              },
              {
                step: "02",
                title: "Choose who and where",
                desc: "Select your recipient's country and how they'll receive the money—bank transfer, mobile wallet, or cash pickup.",
                icon: "🌍",
              },
              {
                step: "03",
                title: "Send and track instantly",
                desc: "Complete your transfer with your preferred payment method. Track every step in real-time until it arrives.",
                icon: "⚡",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative bg-gradient-to-br from-slate-50 to-teal-50 rounded-2xl p-8 border-2 border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="absolute top-4 right-4 text-6xl font-bold text-teal-100 group-hover:text-teal-200 transition-colors">
                  {item.step}
                </div>

                <div className="text-5xl mb-6">{item.icon}</div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>

                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started For Free →
            </Button>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white" id="download">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left side - Phone Mockups */}
              <div className="relative flex justify-center lg:justify-start">
                {/* Left Phone - Country List */}
                <div className="relative z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="w-[280px] bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-900 overflow-hidden">
                    <div className="bg-white p-6 h-[580px] overflow-y-auto">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Where do you want to send money?</h3>
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                          readOnly
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-500 mb-2">A</div>
                        {["Albania", "Argentina", "Australia"].map((country) => (
                          <div key={country} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                            <span className="text-2xl">🇦🇱</span>
                            <span className="text-sm font-medium text-gray-900">{country}</span>
                          </div>
                        ))}

                        <div className="text-xs font-semibold text-gray-500 mb-2 mt-4">B</div>
                        {["Bangladesh", "Barbados", "Benin", "Bolivia"].map((country) => (
                          <div key={country} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                            <span className="text-2xl">🇧🇩</span>
                            <span className="text-sm font-medium text-gray-900">{country}</span>
                          </div>
                        ))}

                        <div className="text-xs font-semibold text-gray-500 mb-2 mt-4">P</div>
                        {["Pakistan", "Panama"].map((country) => (
                          <div key={country} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                            <span className="text-2xl">🇵🇰</span>
                            <span className="text-sm font-medium text-gray-900">{country}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Phone - Send Money Screen */}
                <div className="relative z-20 transform translate-x-[-40px] rotate-6 hover:rotate-0 transition-transform duration-500">
                  <div className="w-[280px] bg-white rounded-[3rem] shadow-2xl border-[14px] border-gray-900 overflow-hidden">
                    <div className="bg-white p-6 h-[580px]">
                      <h3 className="text-lg font-bold text-gray-900 mb-6">Send money</h3>

                      {/* You send */}
                      <div className="mb-4">
                        <label className="text-xs text-teal-600 font-medium mb-2 block">You send</label>
                        <div className="flex items-center border-2 border-gray-200 rounded-xl p-4">
                          <input
                            type="text"
                            defaultValue="100.00"
                            className="flex-1 text-2xl font-bold outline-none"
                            readOnly
                          />
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <span className="text-lg">🇬🇧</span>
                            <span className="font-semibold">GBP</span>
                          </div>
                        </div>
                      </div>

                      {/* Exchange rate */}
                      <div className="flex items-center gap-2 text-xs text-teal-600 mb-4">
                        <span className="text-teal-600">◉</span>
                        <span>GBP 1.00 = 65.1760 PHP</span>
                      </div>

                      {/* They receive */}
                      <div className="mb-6">
                        <label className="text-xs text-gray-600 font-medium mb-2 block">They receive</label>
                        <div className="flex items-center border-2 border-gray-200 rounded-xl p-4">
                          <input
                            type="text"
                            defaultValue="6517.78"
                            className="flex-1 text-2xl font-bold outline-none"
                            readOnly
                          />
                          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <span className="text-lg">🇵🇭</span>
                            <span className="font-semibold">PHP</span>
                          </div>
                        </div>
                      </div>

                      {/* Receive method */}
                      <div className="mb-6">
                        <label className="text-xs text-gray-500 uppercase font-medium mb-2 block">Receive method</label>
                        <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-teal-600">✈</span>
                            <span className="text-sm font-medium">Select method</span>
                          </div>
                          <span className="text-gray-400">›</span>
                        </button>
                      </div>

                      {/* Promo code */}
                      <button className="text-sm text-teal-600 flex items-center gap-2 mb-4">
                        <span>⚡</span>
                        <span>Promo code</span>
                        <span>›</span>
                      </button>

                      {/* Fee details */}
                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transfer fee</span>
                          <span className="font-semibold">-</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total to pay</span>
                          <span className="text-teal-600">100.00 GBP</span>
                        </div>
                      </div>

                      {/* Next button */}
                      <button className="w-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold py-4 rounded-xl">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Fresh messaging */}
              <div className="space-y-8">
                <div>
                  <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                    📱 Available on iOS & Android
                  </span>

                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight text-balance">
                    Your entire world in
                    <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                      {" "}
                      one app
                    </span>
                  </h2>

                  <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Send money anytime, anywhere—whether you're at home or on the go. Track every transfer in real-time
                    and manage all your recipients in one secure place.
                  </p>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Send to 130+ countries instantly",
                      "Live tracking for every transfer",
                      "Saved recipients for quick sending",
                      "24/7 customer support in-app",
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* App Store Buttons */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href="#"
                    className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-xl font-semibold">App Store</div>
                    </div>
                  </a>

                  <a
                    href="#"
                    className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-xl font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CountriesSection />

      {/* Money Delivery Methods section */}
      <section className="py-24 bg-gradient-to-br from-white to-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Multiple Options
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Deliver money{" "}
              <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                their way
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Everyone has their preference. Choose from bank transfers, mobile wallets, cash pickup, or instant airtime
              top-ups—whatever works best for your recipient.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Send,
                title: "Bank Transfer",
                desc: "Direct deposit to any bank account worldwide",
                color: "teal",
              },
              {
                icon: Smartphone,
                title: "Mobile Wallet",
                desc: "Instant delivery to M-Pesa, GCash, and more",
                color: "emerald",
              },
              {
                icon: MapPin,
                title: "Cash Pickup",
                desc: "Collect cash at 500,000+ agent locations",
                color: "cyan",
              },
              {
                icon: Phone,
                title: "Airtime Top-up",
                desc: "Reload mobile credit in seconds—perfect for staying connected",
                color: "sky",
              },
            ].map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.title}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-100 hover:border-teal-200 group"
                >
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-${method.color}-100 to-${method.color}-50 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity`}
                  />

                  <div className="relative">
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{method.title}</h3>

                    <p className="text-gray-600 text-sm leading-relaxed text-center">{method.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">About Us</h2>
              <Image
                src="/remitswift-logo-with-tagline.jpg"
                alt="RemitSwift Logo"
                width={300}
                height={200}
                className="mx-auto mb-8 max-w-xs"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <p className="text-gray-700 mb-6 leading-relaxed">
                  <strong className="text-gray-900">RemitSwift AB is a privately-owned company</strong> specialized in
                  serving remittance services to Scandinavia and beyond. Operating from Sweden.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  RemitSwift AB was established and registered as a payment service provider in 2012, and in 2016 became
                  a payment institution (betalningsinstitut).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  In 2021, RemitSwift AB | LocalSend was launched, with a mission to make international money transfer
                  between business-to-customer and customer-to-customer, hassle-free and affordable.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow hover:border-orange-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Commercial Standard AB Payment Service Provider Registration
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow hover:border-orange-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Commercial Payment Institution Service Provider Has Become a Payment Institution
                    (Betalningsinstitut), Cleanwhite, Sweden, Norway & Belgium
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow hover:border-orange-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Send className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">Commercial Tracking ab | LocalSend</p>
                </div>

                <div className="bg-white border-2 border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow hover:border-orange-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">Digital Messaging Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us form section */}
      <section className="py-24 bg-white" id="contact">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Get In Touch
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Have questions?{" "}
                <span className="bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  We're here
                </span>
              </h2>
              <p className="text-lg text-gray-600">
                Our support team is available 24/7 to help with anything you need.
              </p>
            </div>

            <form className="space-y-6 bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border-2 border-slate-100 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-slate-700 font-semibold mb-2 block">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="w-full border-2 border-slate-200 focus:border-teal-500 focus-visible:ring-teal-500 h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName" className="text-slate-700 font-semibold mb-2 block">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="w-full border-2 border-slate-200 focus:border-teal-500 focus-visible:ring-teal-500 h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700 font-semibold mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="w-full border-2 border-slate-200 focus:border-teal-500 focus-visible:ring-teal-500 h-12 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-slate-700 font-semibold mb-2 block">
                  Your Message
                </Label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full border-2 border-slate-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl p-4 resize-none"
                />
              </div>

              <Button className="w-full h-14 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                Send Message →
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-gray-50" id="values">
        {/* Our Values content here */}
      </section>

      {/* Contact Information footer section */}
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-teal-400">Regulatory Information</h3>
              <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                <p>
                  <strong className="text-white">Skandsom AB</strong>, Reg NO 556843-9946 is an authorized payment
                  institution under the supervision of Finansinspektionen.
                </p>
                <p>The Swedish Financial Supervisory Authority, with institution number 45537.</p>
                <p>
                  <strong className="text-white">Address:</strong> Stockholm, Sweden.
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 text-teal-400">Contact Us</h3>
              <div className="space-y-4">
                <a
                  href="tel:+46721821823"
                  className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center group-hover:bg-teal-500/30 transition-colors">
                    <Phone className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Phone / WhatsApp</div>
                    <div className="font-semibold text-lg">+46 72 1821823</div>
                  </div>
                </a>

                <div className="flex items-start gap-4 text-slate-300">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Office Address</div>
                    <div className="font-medium leading-relaxed">
                      Skandsom AB, Kista Science Tower
                      <br />
                      Färogatan 33, 12 Tr, 164 51 Kista, Sweden
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">RemitSwift</div>
                  <div className="text-xs text-teal-400">A key for all money transfer</div>
                </div>
              </div>

              {/* Powered by */}
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <span>Powered by</span>
                <span className="font-semibold text-white">IDSSC</span>
              </div>

              {/* Copyright */}
              <div className="text-slate-400 text-sm">
                <p>
                  Copyright © {new Date().getFullYear()} RemitSwift.
                  <br className="md:hidden" /> All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}