"use client"

import { Input } from "@/components/ui/input"
import type { ExchangeRate, Corridor } from "@/lib/types"
import { calculateTransferFee, calculateEffectiveRate, getFeeTierDescription } from "@/lib/fee-calculator"
import { ArrowDownUp, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AmountInputProps {
  sourceAmount: string
  destinationAmount: string
  sourceCurrency: string
  destinationCurrency: string
  exchangeRate: ExchangeRate | null
  corridor: Corridor | null
  onSourceAmountChange: (amount: string) => void
  onDestinationAmountChange: (amount: string) => void
  onFeeChange: (fee: number) => void
}

export function AmountInput({
  sourceAmount,
  destinationAmount,
  sourceCurrency,
  destinationCurrency,
  exchangeRate,
  corridor,
  onSourceAmountChange,
  onDestinationAmountChange,
  onFeeChange,
}: AmountInputProps) {
  const [isEditingSource, setIsEditingSource] = useState(true)

  const sourceAmountNum = Number.parseFloat(sourceAmount) || 0
  const feeBreakdown = corridor ? calculateTransferFee(corridor, sourceAmountNum) : null
  const effectiveRate =
    exchangeRate && corridor
      ? calculateEffectiveRate(exchangeRate.rate, corridor.fx_margin_percent)
      : exchangeRate?.rate || 0

  useEffect(() => {
    if (feeBreakdown) {
      onFeeChange(feeBreakdown.totalFee)
    }
  }, [feeBreakdown])

  useEffect(() => {
    if (!exchangeRate || !effectiveRate) return

    if (isEditingSource && sourceAmount) {
      const source = Number.parseFloat(sourceAmount)
      if (!isNaN(source)) {
        const destination = source * effectiveRate
        onDestinationAmountChange(destination.toFixed(2))
      }
    } else if (!isEditingSource && destinationAmount) {
      const destination = Number.parseFloat(destinationAmount)
      if (!isNaN(destination)) {
        const source = destination / effectiveRate
        onSourceAmountChange(source.toFixed(2))
      }
    }
  }, [sourceAmount, destinationAmount, effectiveRate, isEditingSource])

  const totalCost =
    sourceAmount && feeBreakdown ? (Number.parseFloat(sourceAmount) + feeBreakdown.totalFee).toFixed(2) : "0.00"

  const feeTier = sourceAmountNum > 0 ? getFeeTierDescription(sourceAmountNum) : null

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">You send</label>
        <div className="relative">
          <Input
            type="number"
            value={sourceAmount}
            onChange={(e) => {
              setIsEditingSource(true)
              onSourceAmountChange(e.target.value)
            }}
            placeholder="0.00"
            className="text-lg h-14 pr-16"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {sourceCurrency}
          </div>
        </div>

        {feeBreakdown && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Transfer fee: {feeBreakdown.totalFee.toFixed(2)} {sourceCurrency}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span>Base fee:</span>
                        <span>
                          {feeBreakdown.baseFee.toFixed(2)} {sourceCurrency}
                        </span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Service fee:</span>
                        <span>
                          {feeBreakdown.percentageFee.toFixed(2)} {sourceCurrency}
                        </span>
                      </div>
                      {feeTier && <div className="pt-1 border-t text-primary font-medium">{feeTier}</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {feeTier && (
              <div className="text-xs text-primary font-medium">{feeTier} • Save more by sending larger amounts</div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowDownUp className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient gets</label>
        <div className="relative">
          <Input
            type="number"
            value={destinationAmount}
            onChange={(e) => {
              setIsEditingSource(false)
              onDestinationAmountChange(e.target.value)
            }}
            placeholder="0.00"
            className="text-lg h-14 pr-16"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
            {destinationCurrency}
          </div>
        </div>
        {exchangeRate && corridor && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Rate: 1 {sourceCurrency} = {effectiveRate.toFixed(4)} {destinationCurrency}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between gap-4">
                        <span>Market rate:</span>
                        <span>{exchangeRate.rate.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>FX margin:</span>
                        <span>{corridor.fx_margin_percent}%</span>
                      </div>
                      <div className="pt-1 border-t flex justify-between gap-4 font-medium">
                        <span>Your rate:</span>
                        <span>{effectiveRate.toFixed(4)}</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total to pay</span>
          <span className="text-lg font-bold">
            {totalCost} {sourceCurrency}
          </span>
        </div>
      </div>
    </div>
  )
}
