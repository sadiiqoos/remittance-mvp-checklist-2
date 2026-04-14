"use client"

import type { Corridor } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { CountryFlag, getCountryName } from "@/components/country-flag"
import { ArrowRight, Clock } from "lucide-react"

interface CorridorSelectorProps {
  corridors: Corridor[]
  selectedCorridor: Corridor | null
  onSelect: (corridor: Corridor) => void
}

export function CorridorSelector({ corridors, selectedCorridor, onSelect }: CorridorSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Send money to</label>
      <div className="grid gap-3 md:grid-cols-2">
        {corridors.map((corridor) => (
          <Card
            key={corridor.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedCorridor?.id === corridor.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
            }`}
            onClick={() => onSelect(corridor)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CountryFlag countryCode={corridor.destination_country} />
                <div>
                  <div className="font-medium">{getCountryName(corridor.destination_country)}</div>
                  <div className="text-sm text-muted-foreground">{corridor.destination_currency}</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>~{corridor.estimated_delivery_hours}h delivery</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
