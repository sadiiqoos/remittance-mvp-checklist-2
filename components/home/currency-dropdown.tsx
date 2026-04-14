"use client"

import { useMemo, useState } from "react"
import { Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CurrencyItem {
  countryCode: string
  countryName: string
  currencyCode: string
}

const currencies: CurrencyItem[] = [
  { countryCode: "se", countryName: "Sweden", currencyCode: "SEK" },
  { countryCode: "au", countryName: "Australia", currencyCode: "AUD" },
  { countryCode: "at", countryName: "Austria", currencyCode: "EUR" },
  { countryCode: "bh", countryName: "Bahrain", currencyCode: "BHD" },
  { countryCode: "be", countryName: "Belgium", currencyCode: "EUR" },
  { countryCode: "br", countryName: "Brazil", currencyCode: "BRL" },
  { countryCode: "bg", countryName: "Bulgaria", currencyCode: "EUR" },
  { countryCode: "ca", countryName: "Canada", currencyCode: "CAD" },
  { countryCode: "hr", countryName: "Croatia", currencyCode: "EUR" },
  { countryCode: "dk", countryName: "Denmark", currencyCode: "DKK" },
  { countryCode: "et", countryName: "Ethiopia", currencyCode: "ETB" },
  { countryCode: "ke", countryName: "Kenya", currencyCode: "KES" },
  { countryCode: "no", countryName: "Norway", currencyCode: "NOK" },
  { countryCode: "pk", countryName: "Pakistan", currencyCode: "PKR" },
  { countryCode: "ph", countryName: "Philippines", currencyCode: "PHP" },
  { countryCode: "so", countryName: "Somalia", currencyCode: "SOS" },
  { countryCode: "tz", countryName: "Tanzania", currencyCode: "TZS" },
  { countryCode: "ug", countryName: "Uganda", currencyCode: "UGX" },
]

interface CurrencyDropdownProps {
  value: string
  onValueChange: (value: string) => void
  variant?: "dark" | "light"
}

export function CurrencyDropdown({
  value,
  onValueChange,
  variant = "dark",
}: CurrencyDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const selectedCurrency =
    currencies.find((item) => item.currencyCode === value) ?? currencies[0]

  const filteredCurrencies = useMemo(() => {
    const query = search.toLowerCase().trim()

    if (!query) return currencies

    return currencies.filter(
      (item) =>
        item.countryName.toLowerCase().includes(query) ||
        item.currencyCode.toLowerCase().includes(query) ||
        item.countryCode.toLowerCase().includes(query),
    )
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between font-semibold rounded-xl px-4 py-2 h-auto focus:ring-0 min-w-[130px]",
            variant === "dark"
              ? "bg-slate-900 text-white hover:bg-slate-800 border-0"
              : "bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-900",
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className={`fi fis fi-${selectedCurrency.countryCode} h-5 w-5 rounded-full overflow-hidden`}
            />
            <span>{selectedCurrency.currencyCode}</span>
          </span>

          <svg
            className="ml-2 h-4 w-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="end">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Enter a country or currency"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-slate-200 focus-visible:ring-teal-600"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {filteredCurrencies.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-500">
              No currency found.
            </div>
          )}

          {filteredCurrencies.map((item, index) => {
            const isSelected = value === item.currencyCode
            const key = `${item.countryCode}-${item.currencyCode}-${index}`

            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onValueChange(item.currencyCode)
                  setOpen(false)
                  setSearch("")
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`fi fis fi-${item.countryCode} h-6 w-6 rounded-full overflow-hidden`}
                  />
                  <div className="text-left">
                    <div className="font-medium text-slate-900">
                      {item.countryName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600">
                    {item.currencyCode}
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-teal-600" />}
                </div>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}