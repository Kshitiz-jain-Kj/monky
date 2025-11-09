"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import ProcessorIcon from "@/components/icons/proccesor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useFlowchart } from "@/lib/context/flowchart-context"
import DynamicFlowchartRenderer from "@/components/flowchart/dynamic-renderer"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function CodeFlowPage() {
  const { currentFlowchart } = useFlowchart()
  const [flowType, setFlowType] = useState<"control" | "data">("control")

  const hasAnalyzedCode = currentFlowchart !== null

  return (
    <DashboardPageLayout
      header={{
        title: "Code Flow Visualization",
        description: "Visualize your code execution path and debug data flow",
        icon: ProcessorIcon,
      }}
    >
      {hasAnalyzedCode && (
        <div className="mb-6 p-4 bg-blue-950/30 border border-blue-500/50 rounded flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-blue-400" />
            <p className="text-sm text-blue-300">Showing flowchart from your analyzed code</p>
          </div>
          <Link href="/ai-debugger" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <ArrowLeft className="size-3" />
            Back to Debugger
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  {hasAnalyzedCode ? "Your Code Flowchart" : "Control Flow Diagram"}
                </CardTitle>
                <select
                  value={flowType}
                  onChange={(e) => setFlowType(e.target.value as "control" | "data")}
                  className="px-3 py-1 rounded text-sm bg-accent border border-pop text-foreground"
                >
                  <option value="control">Control Flow</option>
                  <option value="data">Data Flow</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="bg-accent p-6">
              {hasAnalyzedCode && currentFlowchart ? (
                <DynamicFlowchartRenderer flowchart={currentFlowchart.flowchart} height="600px" showSteps={true} />
              ) : (
                <svg viewBox="0 0 600 500" className="w-full h-auto">
                  {/* ... existing SVG content ... */}
                  {/* Start */}
                  <ellipse cx="300" cy="30" rx="40" ry="20" fill="#10b981" stroke="#059669" strokeWidth="2" />
                  <text x="300" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    START
                  </text>

                  {/* Arrow down */}
                  <line x1="300" y1="50" x2="300" y2="90" stroke="#6366f1" strokeWidth="2" />

                  {/* Process - arr check */}
                  <rect x="230" y="90" width="140" height="50" rx="5" fill="#3b82f6" stroke="#1e40af" strokeWidth="2" />
                  <text x="300" y="115" textAnchor="middle" fill="white" fontSize="12">
                    Check if arr
                  </text>
                  <text x="300" y="130" textAnchor="middle" fill="white" fontSize="12">
                    is undefined
                  </text>

                  {/* Diamond - decision */}
                  <polygon points="300,150 340,190 300,230 260,190" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
                  <text x="300" y="195" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                    arr empty?
                  </text>

                  {/* Yes branch */}
                  <line x1="260" y1="190" x2="150" y2="190" stroke="#ef4444" strokeWidth="2" />
                  <text x="200" y="180" fill="#ef4444" fontSize="11" fontWeight="bold">
                    YES
                  </text>
                  <rect x="80" y="170" width="140" height="40" rx="5" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
                  <text x="150" y="195" textAnchor="middle" fill="white" fontSize="12">
                    Return null
                  </text>

                  {/* No branch */}
                  <line x1="300" y1="230" x2="300" y2="270" stroke="#10b981" strokeWidth="2" />
                  <text x="320" y="255" fill="#10b981" fontSize="11" fontWeight="bold">
                    NO
                  </text>

                  {/* Process - loop */}
                  <rect
                    x="230"
                    y="270"
                    width="140"
                    height="50"
                    rx="5"
                    fill="#3b82f6"
                    stroke="#1e40af"
                    strokeWidth="2"
                  />
                  <text x="300" y="295" textAnchor="middle" fill="white" fontSize="12">
                    Iterate through
                  </text>
                  <text x="300" y="310" textAnchor="middle" fill="white" fontSize="12">
                    array elements
                  </text>

                  {/* Arrow down */}
                  <line x1="300" y1="320" x2="300" y2="360" stroke="#6366f1" strokeWidth="2" />

                  {/* Process - find max */}
                  <rect
                    x="230"
                    y="360"
                    width="140"
                    height="50"
                    rx="5"
                    fill="#3b82f6"
                    stroke="#1e40af"
                    strokeWidth="2"
                  />
                  <text x="300" y="385" textAnchor="middle" fill="white" fontSize="12">
                    Compare and
                  </text>
                  <text x="300" y="400" textAnchor="middle" fill="white" fontSize="12">
                    track maximum
                  </text>

                  {/* Arrow down */}
                  <line x1="300" y1="410" x2="300" y2="450" stroke="#6366f1" strokeWidth="2" />

                  {/* End */}
                  <ellipse cx="300" cy="470" rx="40" ry="20" fill="#10b981" stroke="#059669" strokeWidth="2" />
                  <text x="300" y="475" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                    END
                  </text>
                </svg>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Step Debugging
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              {hasAnalyzedCode && currentFlowchart ? (
                currentFlowchart.flowchart.executionSteps.map((step) => (
                  <div key={step.stepNumber} className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-blue-400">
                      Step {step.stepNumber}: {step.description}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-yellow-400">Step 1: arr = [1, 5, 3]</p>
                  </div>
                  <div className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-green-400">Step 2: max = 1</p>
                  </div>
                  <div className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-green-400">Step 3: Compare 5 {">"} 1 → max = 5</p>
                  </div>
                  <div className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-foreground/60">Step 4: Compare 3 {">"} 5 → No change</p>
                  </div>
                  <div className="p-2 bg-background border border-pop rounded text-xs">
                    <p className="font-mono text-green-400">Step 5: Return 5</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Variables at Error Point
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <div className="text-xs space-y-1">
                {hasAnalyzedCode && currentFlowchart ? (
                  currentFlowchart.flowchart.variables.map((variable) => (
                    <p key={variable.name}>
                      <span className="text-foreground/60">{variable.name}:</span>{" "}
                      <span
                        className={
                          variable.status === "error"
                            ? "text-red-400"
                            : variable.status === "warning"
                              ? "text-yellow-400"
                              : "text-blue-400"
                        }
                      >
                        {variable.value}
                      </span>
                    </p>
                  ))
                ) : (
                  <>
                    <p>
                      <span className="text-foreground/60">arr:</span> <span className="text-blue-400">undefined</span>
                    </p>
                    <p>
                      <span className="text-foreground/60">max:</span> <span className="text-red-400">error</span>
                    </p>
                    <p>
                      <span className="text-foreground/60">i:</span> <span className="text-yellow-400">N/A</span>
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
