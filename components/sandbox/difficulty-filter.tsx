"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"

interface DifficultyFilterProps {
  selectedDifficulty: string | null
  onSelectDifficulty: (difficulty: string | null) => void
}

export default function DifficultyFilter({ selectedDifficulty, onSelectDifficulty }: DifficultyFilterProps) {
  const difficulties = [
    { label: "All", value: null },
    { label: "Easy", value: "Easy" },
    { label: "Medium", value: "Medium" },
    { label: "Hard", value: "Hard" },
  ]

  return (
    <Card className="ring-2 ring-pop">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
          <Bullet />
          Filter by Difficulty
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-2">
        {difficulties.map((diff) => (
          <button
            key={diff.value || "all"}
            onClick={() => onSelectDifficulty(diff.value)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              selectedDifficulty === diff.value
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-foreground/10"
            }`}
          >
            {diff.label}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
