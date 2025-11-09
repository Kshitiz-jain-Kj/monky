const ERROR_PATTERNS: Record<string, RegExp> = {
  python: {
    syntaxError: /SyntaxError|IndentationError/,
    typeError: /TypeError|AttributeError/,
    runtime: /RuntimeError|ValueError|KeyError/,
  },
  javascript: {
    syntaxError: /SyntaxError|Unexpected|expected/,
    typeError: /TypeError|Cannot read|is not a function/,
    runtime: /ReferenceError|RangeError/,
  },
}

export function detectErrorType(code: string, errorMessage?: string): string {
  if (!errorMessage) return "Unknown Error"

  if (errorMessage.includes("TypeError")) return "Type Error - Incorrect data type operation"
  if (errorMessage.includes("SyntaxError")) return "Syntax Error - Invalid code structure"
  if (errorMessage.includes("ReferenceError")) return "Reference Error - Undefined variable"
  if (errorMessage.includes("loop")) return "Logical Error - Infinite or incorrect loop"
  if (errorMessage.includes("not iterable")) return "Type Error - Cannot iterate over non-iterable"

  return "Runtime Error"
}

export function analyzeCodeStructure(code: string) {
  const linesOfCode = code.split("\n").length
  const variablesCount = (code.match(/\b(var|let|const|int|float|String)\b/g) || []).length
  const functionsCount = (code.match(/\b(function|def|async|=>)\b/g) || []).length

  return {
    linesOfCode,
    variablesCount,
    functionsCount,
    estimatedComplexity: functionsCount > 10 ? "High" : functionsCount > 3 ? "Medium" : "Low",
  }
}
