"use client"

import type { DSAQuestion } from "@/lib/dsa-questions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, BookOpen, Building2, Zap, TrendingUp } from "lucide-react"

interface QuestionDetailModalProps {
  question: DSAQuestion | null
  isOpen: boolean
  onClose: () => void
}

export default function QuestionDetailModal({ question, isOpen, onClose }: QuestionDetailModalProps) {
  if (!question) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="space-y-3">
            <DialogTitle className="text-2xl">{question.title}</DialogTitle>
            <DialogDescription className="text-base text-foreground/70">{question.description}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded border border-pop">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-foreground/50 uppercase font-bold">Difficulty</p>
              </div>
              <Badge className={`${getDifficultyColor(question.difficulty)}`}>{question.difficulty}</Badge>
            </div>

            <div className="p-3 bg-background rounded border border-pop">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-foreground/50 uppercase font-bold">XP Reward</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">+{question.xp}</p>
            </div>

            <div className="p-3 bg-background rounded border border-pop">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-foreground/50 uppercase font-bold">Frequency</p>
              </div>
              <Badge variant="outline" className="bg-pop/10">
                {question.frequency}
              </Badge>
            </div>

            <div className="p-3 bg-background rounded border border-pop">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-foreground/50 uppercase font-bold">Topic</p>
              </div>
              <Badge variant="outline">{question.topic}</Badge>
            </div>
          </div>

          {/* Companies Section */}
          <div className="p-4 bg-background rounded border border-pop">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-purple-400" />
              <p className="text-sm font-bold uppercase text-foreground/80">Companies That Asked</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {question.companies.map((company) => (
                <Badge
                  key={company}
                  variant="outline"
                  className="bg-purple-500/10 text-purple-300 border-purple-500/30 px-3 py-1.5"
                >
                  {company}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-foreground/50 mt-3">
              This question appears in interview rounds at these major tech companies
            </p>
          </div>

          {/* Problem Details */}
          <div className="p-4 bg-background rounded border border-pop space-y-2">
            <p className="text-sm font-semibold text-foreground/80 mb-2">Problem Details</p>
            <div className="space-y-2 text-sm text-foreground/70">
              <div>
                <span className="font-semibold text-foreground/80">Title:</span> {question.title}
              </div>
              <div>
                <span className="font-semibold text-foreground/80">Difficulty:</span> {question.difficulty}
              </div>
              <div>
                <span className="font-semibold text-foreground/80">Topic:</span> {question.topic}
              </div>
              <div>
                <span className="font-semibold text-foreground/80">Description:</span> {question.description}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-foreground/10">
            <Link
              href={question.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/80 transition-colors font-semibold"
            >
              <ExternalLink className="w-4 h-4" />
              Practice on LeetCode
            </Link>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-background border border-pop rounded hover:bg-foreground/10 transition-colors font-semibold"
            >
              Close
            </button>
          </div>

          {/* Hint Section */}
          <div className="p-3 bg-blue-950/20 rounded border border-blue-500/30">
            <p className="text-xs text-blue-400 font-semibold mb-1">Hint</p>
            <p className="text-sm text-blue-200/80">
              Try to solve this problem using the techniques specific to {question.topic.toLowerCase()}. Visit LeetCode
              for hints and discussions.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
