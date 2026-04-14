"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CorridorSelector } from "@/components/transfer/corridor-selector"
import { AmountInput } from "@/components/transfer/amount-input"
import { RecipientSelector } from "@/components/transfer/recipient-selector"
import { TransferSummary } from "@/components/transfer/transfer-summary"
import type { Corridor, ExchangeRate, Recipient, User } from "@/lib/types"
import { getCorridors, getExchangeRate, getRecipients, createTransaction, getDemoUser } from "@/app/actions/transfer"
import { Loader2 } from "lucide-react"

export function SendMoneyContent() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [user, setUser] = useState<User | null>(null)
  const [corridors, setCorridors] = useState<Corridor[]>([])
  const [selectedCorridor, setSelectedCorridor] = useState<Corridor | null>(null)
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null)

  const [sourceAmount, setSourceAmount] = useState("")
  const [destinationAmount, setDestinationAmount] = useState("")
  const [transferFee, setTransferFee] = useState(0)

  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [corridorsData, userData] = await Promise.all([getCorridors(), getDemoUser()])
        setCorridors(corridorsData)
        setUser(userData)
      } catch (error) {
        console.error("[v0] Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (selectedCorridor) {
      async function loadExchangeRate() {
        try {
          const rate = await getExchangeRate("SEK", selectedCorridor.destination_currency)
          setExchangeRate(rate)
        } catch (error) {
          console.error("[v0] Error loading exchange rate:", error)
        }
      }
      loadExchangeRate()
    }
  }, [selectedCorridor])

  useEffect(() => {
    if (user && selectedCorridor) {
      async function loadRecipients() {
        try {
          const recipientsData = await getRecipients(user.id)
          const filtered = recipientsData.filter((r) => r.country === selectedCorridor.destination_country)
          setRecipients(filtered)
        } catch (error) {
          console.error("[v0] Error loading recipients:", error)
        }
      }
      loadRecipients()
    }
  }, [user, selectedCorridor])

  const handleCorridorSelect = (corridor: Corridor) => {
    setSelectedCorridor(corridor)
    setSourceAmount("")
    setDestinationAmount("")
    setSelectedRecipient(null)
    setTransferFee(0)
  }

  const handleNext = () => {
    if (step === 1 && selectedCorridor) {
      setStep(2)
    } else if (step === 2 && sourceAmount && Number.parseFloat(sourceAmount) > 0) {
      setStep(3)
    } else if (step === 3 && selectedRecipient) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!user || !selectedCorridor || !selectedRecipient || !exchangeRate) return

    setSubmitting(true)
    try {
      const source = Number.parseFloat(sourceAmount)
      const destination = Number.parseFloat(destinationAmount)
      const total = source + transferFee

      const transaction = await createTransaction({
        userId: user.id,
        recipientId: selectedRecipient.id,
        sourceAmount: source,
        destinationAmount: destination,
        destinationCurrency: selectedCorridor.destination_currency,
        exchangeRate: exchangeRate.rate,
        transferFee: transferFee,
        totalDeducted: total,
        corridor: selectedCorridor.name,
        payoutMethod: selectedRecipient.payout_method,
      })

      router.push(`/transaction/${transaction.id}`)
    } catch (error) {
      console.error("[v0] Error creating transaction:", error)
      alert("Failed to create transaction. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return selectedCorridor !== null
    if (step === 2) return sourceAmount && Number.parseFloat(sourceAmount) > 0
    if (step === 3) return selectedRecipient !== null
    return false
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Send Money</h1>
            <p className="text-muted-foreground">
              {step === 1 && "Choose where to send money"}
              {step === 2 && "Enter the amount to send"}
              {step === 3 && "Select a recipient"}
              {step === 4 && "Review and confirm your transfer"}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">Step {step} of 4</div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            {step === 1 && (
              <CorridorSelector
                corridors={corridors}
                selectedCorridor={selectedCorridor}
                onSelect={handleCorridorSelect}
              />
            )}

            {step === 2 && selectedCorridor && (
              <AmountInput
                sourceAmount={sourceAmount}
                destinationAmount={destinationAmount}
                sourceCurrency="SEK"
                destinationCurrency={selectedCorridor.destination_currency}
                exchangeRate={exchangeRate}
                corridor={selectedCorridor}
                onSourceAmountChange={setSourceAmount}
                onDestinationAmountChange={setDestinationAmount}
                onFeeChange={setTransferFee}
              />
            )}

            {step === 3 && (
              <RecipientSelector
                recipients={recipients}
                selectedRecipient={selectedRecipient}
                onSelect={setSelectedRecipient}
                onAddNew={() => alert("Add recipient functionality coming soon")}
              />
            )}

            {step === 4 && selectedCorridor && selectedRecipient && exchangeRate && (
              <TransferSummary
                recipient={selectedRecipient}
                corridor={selectedCorridor}
                sourceAmount={Number.parseFloat(sourceAmount)}
                destinationAmount={Number.parseFloat(destinationAmount)}
                exchangeRate={exchangeRate.rate}
                transferFee={transferFee}
                totalCost={Number.parseFloat(sourceAmount) + transferFee}
              />
            )}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={handleBack} disabled={submitting}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
                  Continue
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm & Send"
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-4">Transfer Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground mb-1">Destination</div>
                <div className="font-medium">
                  {selectedCorridor ? getCountryName(selectedCorridor.destination_country) : "Not selected"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Amount</div>
                <div className="font-medium">{sourceAmount ? `${sourceAmount} SEK` : "Not entered"}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Recipient</div>
                <div className="font-medium">
                  {selectedRecipient
                    ? `${selectedRecipient.first_name} ${selectedRecipient.last_name}`
                    : "Not selected"}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}

function getCountryName(code: string): string {
  const names: Record<string, string> = {
    KE: "Kenya",
    NG: "Nigeria",
    GH: "Ghana",
    UG: "Uganda",
    TZ: "Tanzania",
    ZA: "South Africa",
    ET: "Ethiopia",
    RW: "Rwanda",
  }
  return names[code] || code
}
