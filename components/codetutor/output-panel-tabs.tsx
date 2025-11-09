"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState } from "react"
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react"
import type { SubmissionResult } from "@/lib/utils/judge0"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OutputPanelTabsProps {
  result: SubmissionResult | null
  isLoading: boolean
}

export function OutputPanelTabs({ result, isLoading }: OutputPanelTabsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
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
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
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
            <Tabs defaultValue="output" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-background border border-pop">
                <TabsTrigger value="output">Output</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="time">Execution Time</TabsTrigger>
                <TabsTrigger value="memory">Memory Usage</TabsTrigger>
              </TabsList>

              <TabsContent value="output" className="mt-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-foreground/60 uppercase">Standard Output</span>
                    {result.stdout && (
                      <button
                        onClick={() => handleCopy(result.stdout || "")}
                        className="p-1.5 hover:bg-accent-active rounded transition-colors"
                      >
                        {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                  <div className="p-4 rounded font-mono text-sm bg-green-950/30 border border-green-500/50 text-green-200 space-y-1.5">
                    {result.stdout ? (
                      <div className="whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
                        {result.stdout.split("\n").map((line, idx) => (
                          <div key={idx} className="py-0.5 leading-relaxed">
                            {line || <span className="text-foreground/20">·</span>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-foreground/40">No output</span>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="errors" className="mt-3">
                <div className="space-y-2">
                  <span className="text-xs text-foreground/60 uppercase">Error Output</span>
                  <div className="space-y-2">
                    {result.stderr && (
                      <div className="p-4 rounded font-mono text-sm bg-red-950/30 border border-red-500/50 text-red-200">
                        <div className="text-xs text-red-400 font-bold mb-2 pb-2 border-b border-red-500/30">
                          RUNTIME ERROR
                        </div>
                        <div className="whitespace-pre-wrap break-words max-h-48 overflow-y-auto">{result.stderr}</div>
                      </div>
                    )}

                    {result.compile_output && (
                      <div className="p-4 rounded font-mono text-sm bg-orange-950/30 border border-orange-500/50 text-orange-200">
                        <div className="text-xs text-orange-400 font-bold mb-2 pb-2 border-b border-orange-500/30">
                          COMPILATION ERROR
                        </div>
                        <div className="whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                          {result.compile_output}
                        </div>
                      </div>
                    )}

                    {result.message && (
                      <div className="p-4 rounded font-mono text-sm bg-yellow-950/30 border border-yellow-500/50 text-yellow-200">
                        <div className="text-xs text-yellow-400 font-bold mb-2 pb-2 border-b border-yellow-500/30">
                          MESSAGE
                        </div>
                        <div className="whitespace-pre-wrap break-words">{result.message}</div>
                      </div>
                    )}

                    {!result.stderr && !result.compile_output && !result.message && (
                      <div className="p-4 rounded bg-background border border-pop">
                        <span className="text-foreground/40 text-sm">No errors</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="time" className="mt-3">
                <div className="space-y-3">
                  <div className="p-4 bg-background border border-pop rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-foreground/60 uppercase">Execution Time</span>
                      <span
                        className={`text-2xl font-bold ${
                          result.time && Number.parseFloat(result.time) < 1 ? "text-green-400" : "text-yellow-400"
                        }`}
                      >
                        {result.time || "0"}s
                      </span>
                    </div>
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-yellow-500 transition-all"
                        style={{ width: `${Math.min((Number.parseFloat(result.time || "0") / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-background border border-pop rounded">
                    <p className="text-xs text-foreground/60 uppercase mb-1">Status</p>
                    <p
                      className={`text-sm font-semibold ${result.status.id === 3 ? "text-green-400" : "text-red-400"}`}
                    >
                      {result.status.description}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="memory" className="mt-3">
                <div className="space-y-3">
                  <div className="p-4 bg-background border border-pop rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-foreground/60 uppercase">Memory Usage</span>
                      <span className="text-2xl font-bold text-blue-400">{result.memory || "0"} KB</span>
                    </div>
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                        style={{ width: `${Math.min((Number.parseFloat(result.memory || "0") / 10000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-background border border-pop rounded">
                      <p className="text-xs text-foreground/60 uppercase mb-1">Wall Time</p>
                      <p className="text-sm font-semibold">{result.wall_time || "N/A"}s</p>
                    </div>
                    <div className="p-3 bg-background border border-pop rounded">
                      <p className="text-xs text-foreground/60 uppercase mb-1">CPU Time</p>
                      <p className="text-sm font-semibold">{result.time || "N/A"}s</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="py-8 text-center text-foreground/40 text-sm">Click "Run Code" to see output</div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
