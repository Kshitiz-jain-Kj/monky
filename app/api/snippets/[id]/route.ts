import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const mockSnippet = {
      id,
      userId: "demo-user",
      title: "Sample Snippet",
      language: "javascript",
      code: 'console.log("This is a demo snippet");',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(mockSnippet)
  } catch (error) {
    console.error("[v0] Error fetching snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { title, language, code } = await request.json()

    const snippet = {
      id,
      userId: "demo-user",
      title,
      language,
      code,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(snippet)
  } catch (error) {
    console.error("[v0] Error updating snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({ message: "Snippet deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting snippet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
