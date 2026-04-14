import { NextResponse } from "next/server"
import { exportUserData } from "@/lib/gdpr"

export async function POST(request: Request) {
  try {
    const { userId, categories, format } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID required" }, { status: 400 })
    }

    const result = await exportUserData(userId, categories, format)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] GDPR export API error:", error)
    return NextResponse.json({ success: false, error: "Export failed" }, { status: 500 })
  }
}
