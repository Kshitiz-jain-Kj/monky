export interface ErrorAnalysis {
  errorType: string
  severity: "critical" | "warning" | "info"
  explanation: {
    english: string
    hindi: string
  }
  rootCause: string
  suggestedFix: {
    code: string
    explanation: string
  }
  complexity?: string | null
  confidence: number
  alternatives?: Array<{
    title: string
    code: string
    explanation: string
  }>
  variableSnapshot?: Record<string, string>
  learningResources?: Array<{
    title: string
    description: string
  }>
  learningTip?: string
}

export interface CodeAnalysisRequest {
  code: string
  language: "python" | "javascript" | "typescript" | "java" | "cpp" | "c"
  errorMessage?: string
}

export interface CodeInsight {
  linesOfCode: number
  variablesCount: number
  functionsCount: number
  estimatedComplexity: string
}
