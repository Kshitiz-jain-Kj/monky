export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  language: "english" | "hindi"
}

export interface ChatSessionContext {
  code: string
  errorMessage?: string
  language: string
  errorType?: string
}

export interface MentorResponse {
  message: string
  suggestions?: string[]
  resources?: { title: string; description: string }[]
}
