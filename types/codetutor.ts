export interface CodeTutorStats {
  bugsFix: number
  codeQuality: number
  learningStreak: string
  languagesMastered: number
}

export interface MentorMessage {
  id: string
  role: "user" | "mentor"
  content: string
  timestamp: Date
}
