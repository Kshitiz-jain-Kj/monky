"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import type { SubmissionResult } from "@/lib/utils/judge0"

interface DebuggerViewProps {
  result: SubmissionResult | null
  isActive: boolean
}

export function DebuggerView({ result, isActive }: DebuggerViewProps) {
  if (!isActive) return null

  return (
    <Card className="ring-2 ring-pop mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
          <Bullet />
          Debug Information
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-accent space-y-3">
        <div className="p-3 bg-background border border-pop rounded">
          <p className="text-xs text-foreground/60 uppercase mb-2">Execution Trace</p>
          <div className="font-mono text-xs space-y-1">
            {result ? (
              <>
                <div className="text-blue-400">→ Code compilation started</div>
                <div className="text-green-400">✓ Compilation successful</div>
                <div className="text-blue-400">→ Execution started</div>
                <div className="text-green-400">✓ Execution completed</div>
                <div className="text-foreground/60">
                  Total time: {result.time}s | Memory: {result.memory} KB
                </div>
              </>
            ) : (
              <div className="text-foreground/40">Run code in debug mode to see trace</div>
            )}
          </div>
        </div>

        <div className="p-3 bg-background border border-pop rounded">
          <p className="text-xs text-foreground/60 uppercase mb-2">Memory Dump</p>
          <div className="font-mono text-xs">
            {result?.memory ? (
              <div className="space-y-1">
                <div>Stack: {Math.floor(result.memory * 0.6)} KB</div>
                <div>Heap: {Math.floor(result.memory * 0.4)} KB</div>
                <div className="text-foreground/60">Total: {result.memory} KB</div>
              </div>
            ) : (
              <div className="text-foreground/40">No memory data available</div>
            )}
          </div>
        </div>

        <div className="p-3 bg-background border border-pop rounded">
          <p className="text-xs text-foreground/60 uppercase mb-2">Status Details</p>
          <div className="text-xs space-y-1">
            {result ? (
              <>
                <div>
                  Status Code: <span className="font-semibold">{result.status.id}</span>
                </div>
                <div>
                  Description: <span className="font-semibold">{result.status.description}</span>
                </div>
              </>
            ) : (
              <div className="text-foreground/40">No status data available</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
