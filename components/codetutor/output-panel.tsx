"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import type { SubmissionResult } from "@/lib/utils/judge0"

interface OutputPanelProps {
  result: SubmissionResult | null
  isLoading: boolean
}

export function OutputPanel({ result, isLoading }: OutputPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const output = result?.stdout || result?.stderr || result?.compile_output || ""
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasError = result?.stderr || result?.compile_output || result?.status.id !== 3
  const hasOutput = result?.stdout || result?.stderr || result?.compile_output

  return (
    <Card className="ring-2 ring-pop">
      <CardHeader className="cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
            <Bullet />
            Output
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasOutput && !isCollapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                className="p-1.5 hover:bg-accent rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent className="bg-accent">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-pop border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-foreground/60 animate-pulse">Executing code...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-3">
              {/* Execution Metadata */}
              <div className="flex gap-3 text-xs">
                <div className="px-3 py-1.5 bg-background border border-pop rounded">
                  <span className="text-foreground/60">Status: </span>
                  <span
                    className={result.status.id === 3 ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}
                  >
                    {result.status.description}
                  </span>
                </div>
                {result.time && (
                  <div className="px-3 py-1.5 bg-background border border-pop rounded">
                    <span className="text-foreground/60">Time: </span>
                    <span className="font-semibold">{result.time}s</span>
                  </div>
                )}
                {result.memory && (
                  <div className="px-3 py-1.5 bg-background border border-pop rounded">
                    <span className="text-foreground/60">Memory: </span>
                    <span className="font-semibold">{result.memory} KB</span>
                  </div>
                )}
              </div>

              {/* Output Display */}
              <div
                className={`p-4 rounded font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto ${
                  hasError
                    ? "bg-red-950/30 border border-red-500/50 text-red-200"
                    : "bg-green-950/30 border border-green-500/50 text-green-200"
                }`}
              >
                {result.stdout && <div className="text-white">{result.stdout}</div>}
                {result.stderr && <div className="text-red-300">{result.stderr}</div>}
                {result.compile_output && <div className="text-red-300">{result.compile_output}</div>}
                {result.message && <div className="text-yellow-300">{result.message}</div>}
                {!hasOutput && <div className="text-foreground/40">No output</div>}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-foreground/40 text-sm">Click "Run Code" to see output</div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
