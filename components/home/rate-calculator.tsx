"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCorridors, getExchangeRate } from "@/lib/mock-data"
import { calculateFees } from "@/lib/fee-calculator"
import { CountryFlag, getCountryName } from "@/components/country-flag"
import type { Corridor, ExchangeRate } from "@/lib/types"

const sourceCountries = [
  { code: "BE", name: "Belgium" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GR", name: "Greece" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "NO", name: "Norway" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
]

export function RateCalculator() {
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [sourceCountry, setSourceCountry] = useState("SE")
  const [selectedCorridor, setSelectedCorridor] = useState<string>("")
  const [corridor, setCorridor] = useState<Corridor | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)
  const [sendAmount, setSendAmount] = useState("1000")
  const [receiveAmount, setReceiveAmount] = useState("0.00")

  useEffect(() => {
    const loadedCorridors = getCorridors()
    setCorridors(loadedCorridors)
    if (loadedCorridors.length > 0) {
      setSelectedCorridor(loadedCorridors[0].id)
    }
  }, [])

  useEffect(() => {
    if (selectedCorridor) {
      const foundCorridor = corridors.find((c) => c.id === selectedCorridor)
      setCorridor(foundCorridor || null)

      if (foundCorridor) {
        const rate = getExchangeRate("SEK", foundCorridor.destination_currency)
        setExchangeRate(rate)
      }
    }
  }, [selectedCorridor, corridors])

  useEffect(() => {
    if (corridor && exchangeRate && sendAmount) {
      const amount = Number.parseFloat(sendAmount) || 0
      const feeBreakdown = calculateFees(amount, corridor)
      const totalDeducted = amount - feeBreakdown.totalFees
      const received = totalDeducted * exchangeRate.rate * (1 - corridor.fx_margin_percent / 100)
      setReceiveAmount(received.toFixed(2))
    }
  }, [sendAmount, corridor, exchangeRate])

  const destinationCountries = Array.from(new Set(corridors.map((c) => c.destination_country))).map((code) => ({
    code,
    name: getCountryName(code),
  }))

  return (
    <Card className="p-0 shadow-xl border-0 overflow-hidden bg-white rounded-2xl">
      <div className="bg-orange-600 text-white px-6 py-6">
        <h3 className="font-bold text-xl text-center tracking-wider">RATE CALCULATOR</h3>
      </div>

      <div className="p-6 space-y-5 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Sending from</Label>
            <Select value={sourceCountry} onValueChange={setSourceCountry}>
              <SelectTrigger className="h-auto py-3 border-2 border-gray-200 hover:border-orange-500 focus:border-orange-600 transition-colors bg-white rounded-lg">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <CountryFlag countryCode={sourceCountry} />
                    <span className="font-medium text-base text-gray-800">{getCountryName(sourceCountry)}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-2">
                {sourceCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code} className="py-3 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CountryFlag countryCode={country.code} />
                      <span className="font-medium">{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Receiving in</Label>
            <Select value={selectedCorridor} onValueChange={setSelectedCorridor}>
              <SelectTrigger className="h-auto py-3 border-2 border-gray-200 hover:border-orange-500 focus:border-orange-600 transition-colors bg-white rounded-lg">
                <SelectValue>
                  {corridor && (
                    <div className="flex items-center gap-2">
                      <CountryFlag countryCode={corridor.destination_country} />
                      <span className="font-medium text-base text-gray-800">
                        {getCountryName(corridor.destination_country)}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="rounded-lg border-2">
                {destinationCountries.map((country) => {
                  const corridorForCountry = corridors.find((c) => c.destination_country === country.code)
                  return corridorForCountry ? (
                    <SelectItem
                      key={corridorForCountry.id}
                      value={corridorForCountry.id}
                      className="py-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <CountryFlag countryCode={country.code} />
                        <span className="font-medium">{country.name}</span>
                      </div>
                    </SelectItem>
                  ) : null
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {corridor && (
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Delivery Method</Label>
            <Select defaultValue="default">
              <SelectTrigger className="py-3 border-2 border-gray-200 hover:border-orange-500 focus:border-orange-600 transition-colors bg-white rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-2">
                <SelectItem value="default" className="py-3 cursor-pointer">
                  {corridor.payout_methods && corridor.payout_methods[0]
                    ? corridor.payout_methods[0]
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")
                    : "Bank Transfer"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">You will send</Label>
            <div className="flex items-center gap-3 border-2 border-gray-200 rounded-lg p-3 bg-gray-50 hover:border-orange-500 transition-colors">
              <CountryFlag countryCode={sourceCountry} />
              <span className="text-sm font-bold text-gray-700">SEK</span>
              <Input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="border-0 p-0 h-auto text-lg font-semibold focus-visible:ring-0 bg-transparent text-gray-900"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">Recipient will receive</Label>
            <div className="flex items-center gap-3 border-2 border-orange-200 rounded-lg p-3 bg-orange-50">
              {corridor && <CountryFlag countryCode={corridor.destination_country} />}
              <span className="text-sm font-bold text-gray-700">{corridor?.destination_currency || "USD"}</span>
              <div className="text-lg font-semibold text-orange-700">{receiveAmount}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
