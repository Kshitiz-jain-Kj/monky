"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Send, Sparkles } from "lucide-react"
import type { ChatMessage, ChatSessionContext } from "@/lib/types/chat-mentor"
import { toast } from "sonner"

interface ChatMentorProps {
  context: ChatSessionContext
  language: "english" | "hindi"
  isOpen: boolean
  onClose: () => void
}

export function ChatMentor({ context, language, isOpen, onClose }: ChatMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        language === "english"
          ? "Hi! I'm your CodeTutor mentor. Ask me anything about your code or programming concepts. I'm here to help you learn!"
          : "नमस्ते! मैं आपका CodeTutor mentor हूँ। अपने कोड या प्रोग्रामिंग के बारे में कुछ भी पूछें। मैं आपको सीखने में मदद करने के लिए यहाँ हूँ!",
      timestamp: new Date(),
      language,
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context,
          language,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get mentor response")
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        language,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      toast.error("Failed to get response from mentor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-end">
      <Card className="w-full md:w-96 h-screen md:h-[600px] md:rounded-lg rounded-none bg-background border-border flex flex-col">
        <CardHeader className="border-b border-border flex flex-row items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">CodeTutor Mentor</CardTitle>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">
            ×
          </button>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none border border-border"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted px-4 py-2 rounded-lg border border-border">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="px-4 py-2 border-t border-border space-y-2">
            <p className="text-xs text-muted-foreground">
              {language === "english" ? "Quick questions:" : "त्वरित प्रश्न:"}
            </p>
            <div className="flex flex-wrap gap-1">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded border border-border transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <CardContent className="border-t border-border p-3 space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder={language === "english" ? "Ask me anything..." : "कुछ भी पूछें..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage()
                }
              }}
              disabled={isLoading}
              className="text-sm"
            />
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="sm" className="px-3">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {language === "english" ? "Press Enter or click Send" : "Enter दबाएं या Send क्लिक करें"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
