export interface CodeLine {
  lineNumber: number
  code: string
  type: "declaration" | "assignment" | "condition" | "loop" | "function" | "return" | "comment" | "other"
}

export interface ExecutionTrace {
  steps: Array<{
    stepNumber: number
    lineNumber: number
    code: string
    type: CodeLine["type"]
    description: string
    variables: Record<string, any>
    branchTaken?: string
  }>
  finalVariables: Record<string, any>
  executionPath: number[] // Line numbers in execution order
}

export function parseCodeStructure(code: string, language: string): CodeLine[] {
  const lines = code.split("\n")
  const parsed: CodeLine[] = []

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) {
      parsed.push({ lineNumber: idx + 1, code: line, type: "comment" })
      return
    }

    let type: CodeLine["type"] = "other"

    if (/^(let|const|var|int|string|float|bool)\s+\w+\s*=/.test(trimmed) || /^\w+\s*=\s*(?!.*[=<>!])/.test(trimmed)) {
      type = "declaration"
    } else if (/^\w+\s*=(?!=)/.test(trimmed)) {
      type = "assignment"
    } else if (/^if\s*\(|^else|^else\s+if/.test(trimmed)) {
      type = "condition"
    } else if (/^for\s*\(|^while\s*\(|^do\s*\{/.test(trimmed)) {
      type = "loop"
    } else if (/^function\s+\w+|^const\s+\w+\s*=\s*(function|$$.*$$.*=>)|^\w+\s*$$.*$$\s*{/.test(trimmed)) {
      type = "function"
    } else if (/^return\s+/.test(trimmed)) {
      type = "return"
    }

    parsed.push({ lineNumber: idx + 1, code: line, type })
  })

  return parsed
}

export function traceExecution(code: string, language: string, variableSnapshot?: Record<string, any>): ExecutionTrace {
  const codeLines = parseCodeStructure(code, language)
  const steps: ExecutionTrace["steps"] = []
  const variables = { ...variableSnapshot } || {}
  const executionPath: number[] = []

  let stepNumber = 0

  // Step 1: Start
  steps.push({
    stepNumber: ++stepNumber,
    lineNumber: 0,
    code: "START",
    type: "other",
    description: "Program execution started",
    variables: { ...variables },
  })

  // Trace through each code line
  codeLines.forEach((line) => {
    if (line.type === "comment") return

    const extractedVars = extractVariablesFromLine(line.code, language)
    Object.assign(variables, extractedVars)

    executionPath.push(line.lineNumber)

    let description = ""
    switch (line.type) {
      case "declaration":
        description = `Initialize: ${line.code.trim().substring(0, 50)}`
        break
      case "assignment":
        description = `Assign: ${line.code.trim().substring(0, 50)}`
        break
      case "condition":
        description = `Check condition: ${line.code.trim().substring(0, 50)}`
        break
      case "loop":
        description = `Loop start: ${line.code.trim().substring(0, 50)}`
        break
      case "function":
        description = `Call function: ${line.code.trim().substring(0, 50)}`
        break
      case "return":
        description = `Return value: ${line.code.trim().substring(0, 50)}`
        break
      default:
        description = line.code.trim().substring(0, 60)
    }

    steps.push({
      stepNumber: ++stepNumber,
      lineNumber: line.lineNumber,
      code: line.code,
      type: line.type,
      description,
      variables: { ...variables },
    })
  })

  // Step: End
  steps.push({
    stepNumber: ++stepNumber,
    lineNumber: 0,
    code: "END",
    type: "other",
    description: "Program execution completed",
    variables: { ...variables },
  })

  return {
    steps,
    finalVariables: variables,
    executionPath,
  }
}

function extractVariablesFromLine(line: string, language: string): Record<string, any> {
  const vars: Record<string, any> = {}

  if (language === "python" || language === "javascript" || language === "typescript") {
    // Match: var = value
    const match = line.match(/(\w+)\s*=\s*([^;#\n]+)/)
    if (match) {
      const varName = match[1]
      const value = match[2].trim()

      // Try to parse value
      if (value === "true" || value === "True") vars[varName] = true
      else if (value === "false" || value === "False") vars[varName] = false
      else if (!isNaN(Number(value))) vars[varName] = Number(value)
      else vars[varName] = value
    }
  }

  return vars
}
