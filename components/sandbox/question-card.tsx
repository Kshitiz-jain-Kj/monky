"use client"

import type { DSAQuestion } from "@/lib/dsa-questions"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, Check } from "lucide-react"

interface QuestionCardProps {
  question: DSAQuestion
  onViewDetails: (question: DSAQuestion) => void
}

export default function QuestionCard({ question, onViewDetails }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Hard":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <Card className="hover:border-primary/50 transition-all cursor-pointer group overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Title and Start Button Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              {question.title}
            </h3>
            <p className="text-sm text-foreground/60 mt-1">{question.description}</p>
          </div>

          {question.solved ? (
            <div className="flex items-center gap-1 text-green-400 text-xs font-semibold whitespace-nowrap flex-shrink-0">
              <Check className="w-4 h-4" />
              Solved
            </div>
          ) : (
            <button
              className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails(question)
              }}
            >
              Start
            </button>
          )}
        </div>

        {/* Metadata Row - Difficulty, XP, Frequency */}
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={`text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </Badge>
          <span className="text-xs text-blue-400 font-semibold">+{question.xp} XP</span>
          <Badge variant="outline" className="text-xs">
            {question.frequency}
          </Badge>
        </div>

        {/* Companies Section */}
        <div className="pt-3 border-t border-foreground/10">
          <p className="text-xs text-foreground/50 font-semibold uppercase mb-2">Asked by:</p>
          <div className="flex flex-wrap gap-1.5">
            {question.companies.slice(0, 3).map((company) => (
              <span
                key={company}
                className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/20"
              >
                {company}
              </span>
            ))}
            {question.companies.length > 3 && (
              <span className="text-xs text-foreground/50 px-2 py-1">+{question.companies.length - 3}</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 bg-foreground/5 border-t border-foreground/10 flex justify-end">
        <Link
          href={question.leetcodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1.5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Solve
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </Card>
  )
}
