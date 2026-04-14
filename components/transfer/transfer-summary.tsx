import type { Recipient, Corridor } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCountryName } from "@/components/country-flag"
import { calculateTransferFee, calculateEffectiveRate } from "@/lib/fee-calculator"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TransferSummaryProps {
  recipient: Recipient
  corridor: Corridor
  sourceAmount: number
  destinationAmount: number
  exchangeRate: number
  transferFee: number
  totalCost: number
}

export function TransferSummary({
  recipient,
  corridor,
  sourceAmount,
  destinationAmount,
  exchangeRate,
  transferFee,
  totalCost,
}: TransferSummaryProps) {
  const feeBreakdown = calculateTransferFee(corridor, sourceAmount)
  const effectiveRate = calculateEffectiveRate(exchangeRate, corridor.fx_margin_percent)

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4">Transfer Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Recipient</span>
          <span className="font-medium text-right">
            {recipient.first_name} {recipient.last_name}
            <div className="text-xs text-muted-foreground">{getCountryName(recipient.country)}</div>
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">You send</span>
          <span className="font-medium">{sourceAmount.toFixed(2)} SEK</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Transfer fee
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span>Base fee:</span>
                      <span>{feeBreakdown.baseFee.toFixed(2)} SEK</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Service fee:</span>
                      <span>{feeBreakdown.percentageFee.toFixed(2)} SEK</span>
                    </div>
                    <div className="pt-1 border-t flex justify-between gap-4 font-medium">
                      <span>Total fee:</span>
                      <span>{feeBreakdown.totalFee.toFixed(2)} SEK</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </span>
          <span className="font-medium">{transferFee.toFixed(2)} SEK</span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="font-semibold">Total to pay</span>
          <span className="font-bold text-lg">{totalCost.toFixed(2)} SEK</span>
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1">
            Exchange rate
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between gap-4">
                      <span>Market rate:</span>
                      <span>{exchangeRate.toFixed(4)}</span>
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
          </span>
          <span className="font-medium">
            1 SEK = {effectiveRate.toFixed(4)} {corridor.destination_currency}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Recipient gets</span>
          <span className="font-medium text-lg">
            {destinationAmount.toFixed(2)} {corridor.destination_currency}
          </span>
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery time</span>
          <span className="font-medium">~{corridor.estimated_delivery_hours} hours</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payout method</span>
          <span className="font-medium capitalize">{recipient.payout_method.replace(/_/g, " ")}</span>
        </div>
      </div>
    </Card>
  )
}
