"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap } from "lucide-react"
import { CodeComparison } from "@/components/codetutor/code-comparison"
import DashboardPageLayout from "@/components/dashboard/layout"
import ProcessorIcon from "@/components/icons/proccesor"
import { Bullet } from "@/components/ui/bullet"

const LANGUAGE_TEMPLATES = {
  javascript: `function findMax(arr) {
    let max = arr[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > max)
            max = arr[i]
    }
    return max;
}

console.log(findMax([1, 5, 3]));`,
  python: `def find_max(arr):
    max_val = arr[0]
    for i in range(len(arr)):
        if arr[i] > max_val
            max_val = arr[i]
    return max_val

print(find_max([1, 5, 3]))`,
  typescript: `interface User {
    name: string;
    age: number;
}

function getUser(id: string) {
    return {
        name: 'John'
        age: 30
    }
}`,
}

const OPTIMIZATION_EXAMPLES = {
  javascript: {
    original: `function findMax(arr) {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}`,
    optimized: `function findMax(arr) {
  return Math.max(...arr);
}

// Or for large arrays:
function findMax(arr) {
  return arr.reduce((max, val) => 
    val > max ? val : max
  );
}`,
    improvements: [
      "Reduced from O(n) with manual loop to O(n) with built-in optimized function",
      "Removed unnecessary variable assignment and loop overhead",
      "Math.max is optimized at native level in JavaScript engines",
      "More readable and maintainable code",
      "Handles edge cases better (empty arrays, null checks)",
    ],
    complexity: {
      original: "O(n) - Linear iteration",
      optimized: "O(n) - But with C++ level optimization",
    },
  },
}

export default function CodeTutor() {
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript)
  const [language, setLanguage] = useState("javascript")
  const [analysis, setAnalysis] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"errors" | "optimize">("errors")

  const handleAnalyze = async () => {
    if (!code.trim()) return

    setLoading(true)
    try {
      const mockAnalysis = {
        errors: [
          {
            line: 4,
            type: "Syntax Error",
            message: "Missing closing parenthesis",
            severity: "high",
          },
          {
            line: 8,
            type: "Logic Error",
            message: "Array might be empty, causing undefined behavior",
            severity: "medium",
          },
        ],
        explanation: {
          simple: "Your code has a missing parenthesis on line 4. Also, if the array is empty, the code will crash.",
          detailed:
            "The function tries to access arr[0] without checking if the array exists or has elements. Additionally, there is a syntax error with a missing closing parenthesis in the loop condition.",
          hindi: "आपके कोड में line 4 पर एक बंद करने वाली parenthesis गायब है। अगर array खाली है, तो कोड क्रैश हो जाएगा।",
        },
        fixes: [
          "Add proper array length validation before accessing elements",
          "Use Math.max(...arr) as a simpler alternative",
          "Add error handling for edge cases",
        ],
        bigO: "Time: O(n), Space: O(1)",
      }

      setAnalysis(mockAnalysis)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPageLayout
      header={{
        title: "CodeTutor",
        description: "Your AI Debugging Partner",
        icon: ProcessorIcon,
      }}
    >
      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Code Editor Section */}
        <Card className="ring-2 ring-pop">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium uppercase flex items-center gap-2">
                <Bullet />
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value)
                  setCode(LANGUAGE_TEMPLATES[e.target.value as keyof typeof LANGUAGE_TEMPLATES])
                }}
                className="bg-accent border border-pop rounded px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 bg-accent border border-pop rounded font-mono text-sm p-4 text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Paste your code here..."
            />

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 font-semibold"
              >
                {loading ? "Analyzing..." : "Analyze Code"}
              </Button>
              <Button variant="outline" onClick={() => setCode("")} className="border-pop">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Tab Buttons */}
        {analysis && (
          <div className="flex gap-2">
            <Button
              onClick={() => setActiveTab("errors")}
              variant={activeTab === "errors" ? "default" : "outline"}
              className="flex-1"
            >
              Error Analysis
            </Button>
            <Button
              onClick={() => setActiveTab("optimize")}
              variant={activeTab === "optimize" ? "default" : "outline"}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        )}

        {/* Error Analysis Tab */}
        {analysis && activeTab === "errors" && (
          <div className="space-y-6">
            {/* Issues Found */}
            <Card className="ring-2 ring-pop">
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2 uppercase">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  Issues Found
                </h3>
                <div className="space-y-3">
                  {analysis.errors.map((err: any, idx: number) => (
                    <div key={idx} className="bg-accent p-4 rounded border-l-4 border-red-500 ring-1 ring-pop">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-mono text-xs text-foreground/60 mb-1">Line {err.line}</p>
                          <p className="font-semibold text-sm">{err.type}</p>
                          <p className="text-sm text-foreground/80 mt-1">{err.message}</p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2 py-1 rounded ${
                            err.severity === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {err.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Explanations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Simple Explanation */}
              <Card className="ring-2 ring-pop">
                <div className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 uppercase text-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Simple Explanation
                  </h3>
                  <p className="text-sm leading-relaxed mb-4">{analysis.explanation.simple}</p>
                  <p className="text-xs text-foreground/60 font-semibold mb-2">हिंदी में (Hindi):</p>
                  <p className="text-sm leading-relaxed text-foreground/80">{analysis.explanation.hindi}</p>
                </div>
              </Card>

              {/* Suggested Fixes */}
              <Card className="ring-2 ring-pop">
                <div className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 uppercase text-sm">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                    Suggested Fixes
                  </h3>
                  <ul className="space-y-2 mb-4">
                    {analysis.fixes.map((fix: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-green-400 font-bold shrink-0">✓</span>
                        <span className="text-foreground/80">{fix}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 bg-accent rounded border border-pop">
                    <p className="text-xs text-foreground/60 font-medium mb-1">Big-O Complexity:</p>
                    <p className="text-sm font-mono font-bold text-primary">{analysis.bigO}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {analysis && activeTab === "optimize" && (
          <CodeComparison
            original={OPTIMIZATION_EXAMPLES.javascript.original}
            optimized={OPTIMIZATION_EXAMPLES.javascript.optimized}
            improvements={OPTIMIZATION_EXAMPLES.javascript.improvements}
            complexity={OPTIMIZATION_EXAMPLES.javascript.complexity}
          />
        )}
      </div>
    </DashboardPageLayout>
  )
}
