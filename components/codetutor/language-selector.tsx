"use client"

import type { SupportedLanguage } from "@/lib/types/codetutor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
]

interface LanguageSelectorProps {
  value: SupportedLanguage
  onChange: (lang: SupportedLanguage) => void
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium">Language:</label>
      <Select value={value} onValueChange={(val) => onChange(val as SupportedLanguage)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
