"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare } from "lucide-react"
import { Bullet } from "@/components/ui/bullet"

interface MentorMessage {
  role: "user" | "mentor"
  text: string
  timestamp: Date
}

export function CodeTutorMentorSidebar() {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      role: "mentor",
      text: "Hey! I'm your AI Mentor. Paste your code above and click 'Analyze Code' to get started. I'll help you understand errors and optimize your code.",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChatSend = () => {
    if (!chatInput.trim()) return

    const userMessage: MentorMessage = {
      role: "user",
      text: chatInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsLoading(true)

    setTimeout(() => {
      const mentorResponse: MentorMessage = {
        role: "mentor",
        text: "That's a great question! In simple terms, this error occurs because... Let me break it down for you step by step.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, mentorResponse])
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="space-y-gap py-sides min-h-screen max-h-screen sticky top-0 overflow-hidden flex flex-col">
      <Card className="flex-1 flex flex-col bg-sidebar border-sidebar-border overflow-hidden">
        {/* Header */}
        <div className="border-b border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-sidebar-primary" />
            <h3 className="font-semibold text-sm uppercase">AI Mentor</h3>
          </div>
          <p className="text-xs text-sidebar-foreground/60">Ask anything about your code</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-lg p-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-sidebar-accent text-sidebar-foreground rounded-lg p-3 text-sm">
                <div className="flex gap-1">
                  <span className="inline-block w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce" />
                  <span className="inline-block w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce delay-100" />
                  <span className="inline-block w-2 h-2 bg-sidebar-foreground/40 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-sidebar-border p-3 shrink-0">
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleChatSend()}
              disabled={isLoading}
              placeholder="Ask a question..."
              className="flex-1 bg-sidebar-foreground/10 border border-sidebar-border/50 rounded px-3 py-2 text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-sidebar-primary disabled:opacity-50"
            />
            <Button
              onClick={handleChatSend}
              disabled={isLoading}
              size="sm"
              className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Tips Card */}
      <Card className="p-4 bg-sidebar border-sidebar-border">
        <div className="flex items-start gap-2 mb-2">
          <Bullet />
          <h4 className="text-xs font-semibold uppercase text-sidebar-foreground">Learning Tips</h4>
        </div>
        <ul className="text-xs space-y-1.5 text-sidebar-foreground/70">
          <li>• Focus on understanding the root cause</li>
          <li>• Use the suggested fixes step by step</li>
          <li>• Ask follow-up questions to learn more</li>
          <li>• Compare original vs optimized code</li>
        </ul>
      </Card>
    </div>
  )
}
