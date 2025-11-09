"use client"

import { LearningDashboard } from "@/components/codetutor/learning-dashboard"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { LearningStats } from "@/lib/types/session-reports"
import Link from "next/link"

// Mock data for demonstration
const mockStats: LearningStats = {
  totalSessions: 15,
  totalErrors: 28,
  commonMistakes: [
    { error: "Type Error", count: 8 },
    { error: "Reference Error", count: 6 },
    { error: "Syntax Error", count: 5 },
    { error: "Index Error", count: 4 },
    { error: "Logic Error", count: 5 },
  ],
  timeSavedByUnderstanding: 240,
  achievements: [
    {
      id: "1",
      title: "First Debug",
      description: "Complete your first debugging session",
      icon: "🚀",
      unlockedAt: new Date(),
    },
    {
      id: "2",
      title: "Debugger",
      description: "Complete 5 debugging sessions",
      icon: "🔧",
      unlockedAt: new Date(),
    },
    {
      id: "3",
      title: "Error Solver",
      description: "Fix 5 different types of errors",
      icon: "💡",
      unlockedAt: new Date(),
    },
  ],
  successRate: 87,
  streakDays: 5,
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<"english" | "hindi">("english")
  const langText = language === "english"

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{langText ? "Learning Dashboard" : "लर्निंग डैशबोर्ड"}</h1>
              <p className="text-muted-foreground mt-1">
                {langText
                  ? "Track your debugging progress and achievements"
                  : "अपनी debugging progress और achievements track करें"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("english")}
                className={`px-3 py-2 rounded text-sm ${
                  language === "english" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("hindi")}
                className={`px-3 py-2 rounded text-sm ${
                  language === "hindi" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          <Link href="/debugger">
            <Button>{langText ? "Go to Debugger" : "Debugger पर जाएं"}</Button>
          </Link>
        </div>

        {/* Dashboard Content */}
        <LearningDashboard stats={mockStats} language={language} />
      </div>
    </div>
  )
}
