const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com"
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com"

export interface SubmissionResult {
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

export async function runCode(code: string, languageId: number, stdin?: string): Promise<SubmissionResult> {
  const response = await fetch("/api/execute-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      source_code: code,
      language_id: languageId,
      stdin,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to execute code")
  }

  return await response.json()
}
