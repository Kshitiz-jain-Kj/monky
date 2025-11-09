import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const mockHistory = [
      {
        id: "1",
        userId: "demo-user",
        errorMessage: "TypeError: Cannot read property 'length' of undefined",
        analysis: "The variable is undefined. You need to check if it exists before accessing properties.",
        fixedCode: "const arr = [];\nif (arr) {\n  console.log(arr.length);\n}",
        codeSnippetId: null,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "2",
        userId: "demo-user",
        errorMessage: "SyntaxError: Unexpected token",
        analysis: "Missing colon between property name and value in object literal.",
        fixedCode: "const obj = { name: 'John' };",
        codeSnippetId: null,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    return NextResponse.json(mockHistory)
  } catch (error) {
    console.error("[v0] Error fetching debug history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { codeSnippetId, errorMessage, analysis, fixedCode } = await request.json()

    if (!errorMessage || !analysis || !fixedCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const debugEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId: "demo-user",
      codeSnippetId,
      errorMessage,
      analysis,
      fixedCode,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(debugEntry, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating debug history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
