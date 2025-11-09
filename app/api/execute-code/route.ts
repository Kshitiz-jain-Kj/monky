import { type NextRequest, NextResponse } from "next/server"

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ""
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com"

interface SubmissionResult {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  status: {
    id: number
    description: string
  }
  time: string | null
  memory: number | null
}

export async function POST(request: NextRequest) {
  try {
    const { source_code, language_id, stdin } = await request.json()

    if (!source_code || !language_id) {
      return NextResponse.json({ error: "Missing required fields: source_code and language_id" }, { status: 400 })
    }

    // Submit code to Judge0
    const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin,
      }),
    })

    if (!submissionResponse.ok) {
      return NextResponse.json(
        { error: `Failed to submit code: ${submissionResponse.statusText}` },
        { status: submissionResponse.status },
      )
    }

    const { token } = await submissionResponse.json()

    // Poll for result
    let result: SubmissionResult
    let attempts = 0
    const maxAttempts = 20

    do {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      })

      if (!resultResponse.ok) {
        return NextResponse.json(
          { error: `Failed to get submission result: ${resultResponse.statusText}` },
          { status: resultResponse.status },
        )
      }

      result = await resultResponse.json()
      attempts++

      if (attempts >= maxAttempts) {
        return NextResponse.json({ error: "Execution timeout: Maximum polling attempts reached" }, { status: 408 })
      }
    } while (result.status.id === 1 || result.status.id === 2) // 1: In Queue, 2: Processing

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error executing code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute code" },
      { status: 500 },
    )
  }
}
