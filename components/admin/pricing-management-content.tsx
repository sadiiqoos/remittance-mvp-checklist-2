"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Check, X, TrendingUp, DollarSign, Globe } from "lucide-react"
import {
  getAllCorridorsAdmin,
  getAllExchangeRatesAdmin,
  updateCorridorFees,
  updateExchangeRate,
} from "@/lib/admin-mock-data"
import type { Corridor, ExchangeRate } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export function PricingManagementContent() {
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([])
  const [editingCorridor, setEditingCorridor] = useState<string | null>(null)
  const [editingRate, setEditingRate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Edit form states
  const [editForm, setEditForm] = useState({
    baseFee: "",
    fxMargin: "",
    minTransfer: "",
    maxTransfer: "",
  })

  const [rateForm, setRateForm] = useState({
    rate: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [corridorsData, ratesData] = await Promise.all([getAllCorridorsAdmin(), getAllExchangeRatesAdmin()])
      setCorridors(corridorsData)
      setExchangeRates(ratesData)
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load pricing data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function startEditingCorridor(corridor: Corridor) {
    setEditingCorridor(corridor.id)
    setEditForm({
      baseFee: corridor.base_fee_sek.toString(),
      fxMargin: corridor.fx_margin_percent.toString(),
      minTransfer: corridor.min_transfer_sek.toString(),
      maxTransfer: corridor.max_transfer_sek.toString(),
    })
  }

  function startEditingRate(rate: ExchangeRate) {
    setEditingRate(rate.id)
    setRateForm({
      rate: rate.rate.toString(),
    })
  }

  async function saveCorridor(corridorId: string) {
    try {
      await updateCorridorFees(corridorId, {
        baseFee: Number.parseFloat(editForm.baseFee),
        fxMargin: Number.parseFloat(editForm.fxMargin),
        minTransfer: Number.parseFloat(editForm.minTransfer),
        maxTransfer: Number.parseFloat(editForm.maxTransfer),
      })

      await loadData()
      setEditingCorridor(null)

      toast({
        title: "Success",
        description: "Corridor fees updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update corridor fees",
        variant: "destructive",
      })
    }
  }

  async function saveRate(currency: string) {
    try {
      await updateExchangeRate(currency, Number.parseFloat(rateForm.rate))

      await loadData()
      setEditingRate(null)

      toast({
        title: "Success",
        description: `Exchange rate for ${currency} updated successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update exchange rate",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading pricing data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pricing Management</h1>
        <p className="text-muted-foreground mt-1">Manage corridor fees and exchange rates</p>
      </div>

      <Tabs defaultValue="corridors" className="space-y-6">
        <TabsList>
          <TabsTrigger value="corridors" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Corridor Fees
          </TabsTrigger>
          <TabsTrigger value="rates" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Exchange Rates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="corridors" className="space-y-4">
          {corridors.map((corridor) => {
            const isEditing = editingCorridor === corridor.id

            return (
              <Card key={corridor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{corridor.name}</CardTitle>
                        <CardDescription>
                          {corridor.source_country} → {corridor.destination_country} ({corridor.destination_currency})
                        </CardDescription>
                      </div>
                    </div>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => startEditingCorridor(corridor)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" onClick={() => saveCorridor(corridor.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingCorridor(null)}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor={`baseFee-${corridor.id}`}>Base Fee (SEK)</Label>
                      {isEditing ? (
                        <Input
                          id={`baseFee-${corridor.id}`}
                          type="number"
                          step="0.01"
                          value={editForm.baseFee}
                          onChange={(e) => setEditForm({ ...editForm, baseFee: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-2xl font-semibold">{corridor.base_fee_sek.toFixed(2)} SEK</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`fxMargin-${corridor.id}`}>FX Margin (%)</Label>
                      {isEditing ? (
                        <Input
                          id={`fxMargin-${corridor.id}`}
                          type="number"
                          step="0.1"
                          value={editForm.fxMargin}
                          onChange={(e) => setEditForm({ ...editForm, fxMargin: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-2xl font-semibold">{corridor.fx_margin_percent.toFixed(1)}%</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`minTransfer-${corridor.id}`}>Min Transfer (SEK)</Label>
                      {isEditing ? (
                        <Input
                          id={`minTransfer-${corridor.id}`}
                          type="number"
                          step="100"
                          value={editForm.minTransfer}
                          onChange={(e) => setEditForm({ ...editForm, minTransfer: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-2xl font-semibold">{corridor.min_transfer_sek.toLocaleString()}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`maxTransfer-${corridor.id}`}>Max Transfer (SEK)</Label>
                      {isEditing ? (
                        <Input
                          id={`maxTransfer-${corridor.id}`}
                          type="number"
                          step="1000"
                          value={editForm.maxTransfer}
                          onChange={(e) => setEditForm({ ...editForm, maxTransfer: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-2xl font-semibold">{corridor.max_transfer_sek.toLocaleString()}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-muted-foreground">
                    Last updated: {new Date(corridor.updated_at).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="rates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchangeRates.map((rate) => {
              const isEditing = editingRate === rate.id

              return (
                <Card key={rate.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {rate.source_currency} → {rate.destination_currency}
                        </CardTitle>
                        <CardDescription>
                          1 SEK = {rate.rate.toFixed(4)} {rate.destination_currency}
                        </CardDescription>
                      </div>
                      {!isEditing && (
                        <Button variant="ghost" size="icon" onClick={() => startEditingRate(rate)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`rate-${rate.id}`}>Exchange Rate</Label>
                          <Input
                            id={`rate-${rate.id}`}
                            type="number"
                            step="0.0001"
                            value={rateForm.rate}
                            onChange={(e) => setRateForm({ rate: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveRate(rate.destination_currency)} className="flex-1">
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingRate(null)} className="flex-1">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl font-bold text-primary">{rate.rate.toFixed(4)}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Valid until: {new Date(rate.valid_until).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
