export interface DebugSession {
  id: string
  timestamp: Date
  code: string
  language: string
  errorType: string
  explanation: string
  fixApplied: string
  timeSpent: number // in seconds
  complexity: string
  learned: boolean
}

export interface LearningStats {
  totalSessions: number
  totalErrors: number
  commonMistakes: { error: string; count: number }[]
  timeSavedByUnderstanding: number
  achievements: Achievement[]
  successRate: number
  streakDays: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
}

export interface SessionReport {
  session: DebugSession
  summary: string
  keyLearnings: string[]
  nextSteps: string[]
  complexityAnalysis: {
    current: string
    optimized?: string
    explanation: string
  }
}
