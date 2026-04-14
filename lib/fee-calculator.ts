import type { Corridor } from "./types"

export interface FeeBreakdown {
  baseFee: number
  percentageFee: number
  totalFees: number
  fxMargin: number
  effectiveExchangeRate: number
}

export function calculateFees(sourceAmount: number, corridor: Corridor): FeeBreakdown {
  const baseFee = corridor.base_fee_sek

  // Tiered percentage fees based on amount
  let percentageFeeRate = 0
  if (sourceAmount < 500) {
    percentageFeeRate = 0.035 // 3.5% for small transfers
  } else if (sourceAmount < 2000) {
    percentageFeeRate = 0.025 // 2.5% for medium transfers
  } else if (sourceAmount < 5000) {
    percentageFeeRate = 0.015 // 1.5% for large transfers
  } else {
    percentageFeeRate = 0.01 // 1% for very large transfers
  }

  const percentageFee = sourceAmount * percentageFeeRate
  const totalFees = baseFee + percentageFee

  return {
    baseFee,
    percentageFee,
    totalFees,
    fxMargin: corridor.fx_margin_percent,
    effectiveExchangeRate: 0, // Will be calculated with actual rate
  }
}

/**
 * Calculate tiered transfer fees based on transfer amount
 * Larger transfers get lower percentage fees
 */
export function calculateTransferFee(corridor: Corridor, sourceAmount: number): FeeBreakdown {
  const baseFee = corridor.base_fee_sek

  // Tiered percentage fees based on amount
  let percentageFeeRate = 0
  if (sourceAmount < 500) {
    percentageFeeRate = 0.035 // 3.5% for small transfers
  } else if (sourceAmount < 2000) {
    percentageFeeRate = 0.025 // 2.5% for medium transfers
  } else if (sourceAmount < 5000) {
    percentageFeeRate = 0.015 // 1.5% for large transfers
  } else {
    percentageFeeRate = 0.01 // 1% for very large transfers
  }

  const percentageFee = sourceAmount * percentageFeeRate
  const totalFee = baseFee + percentageFee

  // FX margin is built into the exchange rate
  const fxMargin = corridor.fx_margin_percent

  return {
    baseFee,
    percentageFee,
    totalFee,
    fxMargin,
    effectiveExchangeRate: 0, // Will be calculated with actual rate
  }
}

/**
 * Calculate the effective exchange rate after applying FX margin
 */
export function calculateEffectiveRate(marketRate: number, fxMarginPercent: number): number {
  return marketRate * (1 - fxMarginPercent / 100)
}

/**
 * Calculate destination amount after fees and FX margin
 */
export function calculateDestinationAmount(sourceAmount: number, marketRate: number, fxMarginPercent: number): number {
  const effectiveRate = calculateEffectiveRate(marketRate, fxMarginPercent)
  return sourceAmount * effectiveRate
}

/**
 * Get a human-readable fee tier description
 */
export function getFeeTierDescription(sourceAmount: number): string {
  if (sourceAmount < 500) {
    return "Standard rate"
  } else if (sourceAmount < 2000) {
    return "Preferred rate"
  } else if (sourceAmount < 5000) {
    return "Premium rate"
  } else {
    return "VIP rate"
  }
}
