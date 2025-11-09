import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mockSnippets = [
      {
        id: "1",
        userId: "demo-user",
        title: "Hello World",
        language: "javascript",
        code: 'console.log("Hello World");',
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        userId: "demo-user",
        title: "Array Filter",
        language: "javascript",
        code: "const numbers = [1, 2, 3, 4, 5];\nconst evens = numbers.filter(n => n % 2 === 0);",
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json(mockSnippets)
  } catch (error) {
    console.error("[v0] Error fetching snippets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, language, code } = await request.json()

    if (!title || !language || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const snippet = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "demo-user",
      title,
      language,
      code,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(snippet, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
