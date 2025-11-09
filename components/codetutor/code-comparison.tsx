"use client"

import { Card } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ComparisonProps {
  original: string
  optimized: string
  improvements: string[]
  complexity: {
    original: string
    optimized: string
  }
}

export function CodeComparison({ original, optimized, improvements, complexity }: ComparisonProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Code */}
        <Card className="bg-slate-900 border-slate-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Original Code
              </h4>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(original)} className="h-6 w-6 p-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <pre className="bg-slate-800 p-3 rounded text-xs font-mono overflow-x-auto max-h-64 text-gray-200">
              {original}
            </pre>
            <div className="mt-2 p-2 bg-slate-800 rounded text-xs">
              <p className="text-gray-400">Time Complexity:</p>
              <p className="text-red-400 font-bold">{complexity.original}</p>
            </div>
          </div>
        </Card>

        {/* Optimized Code */}
        <Card className="bg-slate-900 border-slate-800">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Optimized Code
              </h4>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(optimized)} className="h-6 w-6 p-0">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <pre className="bg-slate-800 p-3 rounded text-xs font-mono overflow-x-auto max-h-64 text-gray-200">
              {optimized}
            </pre>
            <div className="mt-2 p-2 bg-slate-800 rounded text-xs">
              <p className="text-gray-400">Time Complexity:</p>
              <p className="text-green-400 font-bold">{complexity.optimized}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Key Improvements */}
      <Card className="bg-slate-900 border-slate-800">
        <div className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Key Improvements
          </h4>
          <div className="space-y-2">
            {improvements.map((improvement, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-gray-300">{improvement}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
