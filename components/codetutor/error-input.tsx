"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ErrorInputProps {
  value: string
  onChange: (error: string) => void
  onAnalyze: () => void
  isAnalyzing: boolean
}

export function ErrorInput({ value, onChange, onAnalyze, isAnalyzing }: ErrorInputProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Error Message (Optional)</label>
      <Textarea
        placeholder="Paste your error message here... e.g., TypeError: Cannot read property 'map' of undefined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <Button onClick={onAnalyze} disabled={isAnalyzing} className="w-full bg-primary hover:bg-primary/90">
        {isAnalyzing ? "Analyzing..." : "Analyze Code"}
      </Button>
    </div>
  )
}
