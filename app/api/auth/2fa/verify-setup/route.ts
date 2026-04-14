import { NextResponse } from "next/server"
import { verify2FAToken } from "@/lib/two-factor"

export async function POST(request: Request) {
  try {
    const { userId, secret, code } = await request.json()

    if (!userId || !secret || !code) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const verification = await verify2FAToken(secret, code)

    if (!verification.valid) {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }

    // Store the 2FA secret for the user (in a real app, this would be in the database)
    // For now, we'll just return success

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] 2FA verification error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify code" }, { status: 500 })
  }
}
