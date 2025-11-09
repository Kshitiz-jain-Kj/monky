import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/utils/auth"

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const userId = (request as any).user.userId
    const { actionType, metadata } = await request.json()

    if (!actionType) {
      return NextResponse.json({ error: "Missing action type" }, { status: 400 })
    }

    const activity = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      actionType,
      metadata,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
