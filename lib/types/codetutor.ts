export type SupportedLanguage = "python" | "javascript" | "typescript" | "java" | "cpp" | "c"

export interface EditorState {
  code: string
  language: SupportedLanguage
  errorMessage: string
  isAnalyzing: boolean
}

export interface AnalysisResult {
  success: boolean
  analysis: {
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
  }
  codeInsight: {
    linesOfCode: number
    variablesCount: number
    functionsCount: number
    estimatedComplexity: string
  }
}
