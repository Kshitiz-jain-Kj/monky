"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatMentor } from "@/components/codetutor/chat-mentor"
import type { ChatSessionContext } from "@/lib/types/chat-mentor"

interface MentorFABProps {
  context: ChatSessionContext
  language: "english" | "hindi"
}

export function MentorFAB({ context, language }: MentorFABProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow z-40"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Modal */}
      <ChatMentor context={context} language={language} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
