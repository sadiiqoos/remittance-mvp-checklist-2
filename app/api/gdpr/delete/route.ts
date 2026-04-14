import { NextResponse } from "next/server"
import { deleteUserData } from "@/lib/gdpr"

export async function POST(request: Request) {
  try {
    const { userId, reason } = await request.json()

    if (!userId || !reason) {
      return NextResponse.json({ success: false, error: "User ID and reason required" }, { status: 400 })
    }

    const result = await deleteUserData(userId, reason)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] GDPR deletion API error:", error)
    return NextResponse.json({ success: false, error: "Deletion request failed" }, { status: 500 })
  }
}
