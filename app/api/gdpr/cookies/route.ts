import { NextResponse } from "next/server"
import { saveCookiePreferences } from "@/lib/gdpr"

export async function POST(request: Request) {
  try {
    const { userId, preferences } = await request.json()

    if (!userId || !preferences) {
      return NextResponse.json({ success: false, error: "User ID and preferences required" }, { status: 400 })
    }

    const result = await saveCookiePreferences(userId, preferences)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Cookie preferences API error:", error)
    return NextResponse.json({ success: false, error: "Failed to save preferences" }, { status: 500 })
  }
}
