"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

const allCountries = [
  { name: "Somalia", flag: "🇸🇴", code: "SO" },
  { name: "Kenya", flag: "🇰🇪", code: "KE" },
  { name: "Ethiopia", flag: "🇪🇹", code: "ET" },
  { name: "Djibouti", flag: "🇩🇯", code: "DJ" },
  { name: "Uganda", flag: "🇺🇬", code: "UG" },
  { name: "Tanzania", flag: "🇹🇿", code: "TZ" },
  { name: "Ghana", flag: "🇬🇭", code: "GH" },
  { name: "Nigeria", flag: "🇳🇬", code: "NG" },
  { name: "Zambia", flag: "🇿🇲", code: "ZM" },
  { name: "Rwanda", flag: "🇷🇼", code: "RW" },
  { name: "Senegal", flag: "🇸🇳", code: "SN" },
  { name: "Cameroon", flag: "🇨🇲", code: "CM" },
]

export function CountriesSection() {
  const [showAll, setShowAll] = useState(false)

  const displayedCountries = showAll ? allCountries : allCountries.slice(0, 6)

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600" id="corridors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Where can you send money with RemitSwift?</h2>
          <p className="text-xl text-purple-100 font-medium">Popular countries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8">
          {displayedCountries.map((country) => (
            <button
              key={country.code}
              className="group flex items-center gap-4 bg-purple-700/50 hover:bg-purple-600/70 backdrop-blur-sm rounded-xl p-4 transition-all duration-200 text-left border border-purple-500/30"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-3xl">{country.flag}</span>
                <span className="text-white text-lg font-medium">{country.name}</span>
              </div>
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white hover:text-purple-600 transition-all duration-200"
          >
            {showAll ? "Show less" : "View all countries"}
          </button>
        </div>
      </div>
    </section>
  )
}
