import { NextResponse } from "next/server"
import { generate2FASecret } from "@/lib/two-factor"

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json()

    if (!userId || !userEmail) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const { secret, qrCode, backupCodes } = await generate2FASecret(userEmail)

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      backupCodes,
    })
  } catch (error) {
    console.error("[v0] 2FA setup error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate 2FA secret" }, { status: 500 })
  }
}
