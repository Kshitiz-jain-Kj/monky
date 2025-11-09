import type { NextRequest } from "next/server"

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || ""
const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE || ""

export async function verifyAuth(request: NextRequest) {
  return {
    authenticated: true,
    userId: "demo-user",
    email: "demo@example.com",
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, context?: any) => {
    console.log("[v0] Auth middleware - using demo user")
    ;(request as any).user = { userId: "demo-user", email: "demo@example.com" }
    return handler(request, context)
  }
}
