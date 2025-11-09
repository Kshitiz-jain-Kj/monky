import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/utils/auth"

export const GET = withAuth(async (request: NextRequest) => {
  try {
    const userId = (request as any).user.userId

    const mockUser = {
      id: "demo-user",
      auth0Id: userId,
      name: "Demo User",
      email: "demo@example.com",
      avatar: "/placeholder.svg?height=100&width=100",
      bio: "This is a demo user for preview purposes",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(mockUser)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
