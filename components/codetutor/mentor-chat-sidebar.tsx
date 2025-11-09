"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bullet } from "@/components/ui/bullet"
import { Badge } from "@/components/ui/badge"
import { Send } from "lucide-react"
import type { MentorMessage } from "@/types/codetutor"

const QUICK_TIPS = ["What is this error?", "How to optimize?", "Best practices", "Variable scope"]

export default function MentorChatSidebar() {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: "1",
      role: "mentor",
      content: "Hey! I'm your AI Debugging Partner. Ask me anything about your code!",
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [input, setInput] = useState("")
  const [unreadCount, setUnreadCount] = useState(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    // Add user message
    const userMessage: MentorMessage = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate mentor response
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "What is this error?":
          "This error typically occurs when you're trying to access a property or method on an undefined object. Let's debug this step by step!",
        "How to optimize?":
          "You can optimize by using built-in methods like Math.max() instead of loops, or by reducing unnecessary iterations.",
        "Best practices":
          "Always validate input, handle edge cases, add meaningful error messages, and write clean, readable code.",
        "Variable scope":
          "Variables have scope - global, function, and block scope. Make sure you understand where your variables are accessible.",
      }

      const mentorMessage: MentorMessage = {
        id: (Date.now() + 1).toString(),
        role: "mentor",
        content:
          responses[messageText] || "Great question! Can you provide more details about what you're trying to do?",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, mentorMessage])
    }, 1000)
  }

  return (
    <Card className="h-full flex flex-col ring-2 ring-pop">
      <CardHeader className="flex items-center justify-between pl-3 pr-1 flex-shrink-0">
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
          {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
          {unreadCount === 0 && <Bullet />}
          AI Mentor
        </CardTitle>
      </CardHeader>

      <CardContent className="bg-accent flex-1 overflow-hidden p-1.5 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-background border border-pop rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {QUICK_TIPS.map((tip) => (
            <Button
              key={tip}
              variant="outline"
              size="sm"
              className="text-xs h-auto py-1.5 border-pop bg-transparent"
              onClick={() => {
                handleSendMessage(tip)
                setUnreadCount(0)
              }}
            >
              {tip}
            </Button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
                setUnreadCount(0)
              }
            }}
            placeholder="Ask me..."
            className="flex-1 bg-background border border-pop rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-foreground/40"
          />
          <Button
            size="sm"
            onClick={() => {
              handleSendMessage()
              setUnreadCount(0)
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
