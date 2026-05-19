"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

const popularCountries = [
  { name: "Somalia", code: "so" },
  { name: "Kenya", code: "ke" },
  { name: "Ethiopia", code: "et" },
  { name: "Djibouti", code: "dj" },
  { name: "Uganda", code: "ug" },
  { name: "Tanzania", code: "tz" },
]

const allCountries = [
  { name: "Somalia", code: "so" },
  { name: "Kenya", code: "ke" },
  { name: "Ethiopia", code: "et" },
  { name: "Djibouti", code: "dj" },
  { name: "Uganda", code: "ug" },
  { name: "Tanzania", code: "tz" },
  { name: "Ghana", code: "gh" },
  { name: "Nigeria", code: "ng" },
  { name: "Rwanda", code: "rw" },
  { name: "Zambia", code: "zm" },
  { name: "Senegal", code: "sn" },
  { name: "Cameroon", code: "cm" },
  { name: "South Africa", code: "za" },
  { name: "South Sudan", code: "ss" },
  { name: "Eritrea", code: "er" },
  { name: "Sudan", code: "sd" },
  { name: "Mozambique", code: "mz" },
  { name: "Zimbabwe", code: "zw" },
  { name: "Malawi", code: "mw" },
  { name: "Burkina Faso", code: "bf" },
  { name: "Mali", code: "ml" },
  { name: "Congo DRC", code: "cd" },
  { name: "Pakistan", code: "pk" },
  { name: "India", code: "in" },
]

export function CountriesSection() {
  const [showAll, setShowAll] = useState(false)
  const displayedCountries = showAll ? allCountries : popularCountries

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-600" id="corridors">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Where can you send money with RemitSwift?
          </h2>
          <p className="text-xl text-purple-100 font-medium">Popular countries</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto mb-8">
          {displayedCountries.map((country) => (
            <button
              key={country.code}
              className="group flex items-center gap-4 bg-purple-700/50 hover:bg-purple-600/70 backdrop-blur-sm rounded-xl p-4 transition-all duration-200 text-left border border-purple-500/30"
            >
              <div className="flex items-center gap-3 flex-1">
                <span
                  className={`fi fi-${country.code} fis`}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "inline-block",
                    backgroundSize: "cover",
                    flexShrink: 0,
                  }}
                />
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
            {showAll ? "View less" : "View all countries"}
          </button>
        </div>
      </div>
    </section>
  )
}
