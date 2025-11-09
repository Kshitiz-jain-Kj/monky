"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"

interface TopicFilterProps {
  selectedTopic: string
  topics: string[]
  onSelectTopic: (topic: string) => void
}

export default function TopicFilter({ selectedTopic, topics, onSelectTopic }: TopicFilterProps) {
  return (
    <Card className="ring-2 ring-pop">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
          <Bullet />
          Data Structures
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-2 max-h-96 overflow-y-auto">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onSelectTopic(topic)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              selectedTopic === topic
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground hover:bg-foreground/10"
            }`}
          >
            {topic}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
