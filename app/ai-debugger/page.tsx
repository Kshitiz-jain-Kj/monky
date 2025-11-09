"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import CuteRobotIcon from "@/components/icons/cute-robot"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Copy, Check, AlertTriangle, AlertCircle, Info, Sparkles, Code2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useFlowchart } from "@/lib/context/flowchart-context"
import { generateFlowchart } from "@/lib/utils/flowchart-generator"
import type { ErrorAnalysis } from "@/lib/types/error-analysis"

const MOCK_ANALYSIS = {
  errorType: "TypeError",
  severity: "critical" as const,
  rootCause:
    "The function expects an array, but received undefined. This happens when the array parameter is not passed or is null.",
  confidence: 0.87,
  buggyCode: `function findMax(arr) {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}`,
  fixedCode: `function findMax(arr) {
  if (!arr || arr.length === 0) {
    return null;
  }
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}`,
  errorMessage: "TypeError: Cannot read property 'length' of undefined",
  errorLine: "at findMax (index.js:3:25)",
  variables: [
    { name: "arr", value: "undefined", type: "object", status: "error" },
    { name: "max", value: "not initialized", type: "undefined", status: "warning" },
    { name: "i", value: "0", type: "number", status: "normal" },
  ],
  learningResources: [
    { title: "Arrays in JavaScript", description: "Learn about array methods and properties" },
    { title: "Handling undefined values", description: "Best practices for null checks" },
    { title: "Defensive programming", description: "Write robust code that handles edge cases" },
  ],
  learningTip:
    "Always validate function parameters at the start. Use default values or null checks to prevent undefined errors.",
}

export default function AIDebuggerPage() {
  const [mode, setMode] = useState<"example" | "analyze">("example")
  const [language, setLanguage] = useState<"english" | "hindi">("english")
  const [copiedFix, setCopiedFix] = useState(false)
  const [copiedExplanation, setCopiedExplanation] = useState(false)

  const [userCode, setUserCode] = useState("")
  const [userLanguage, setUserLanguage] = useState<"javascript" | "python" | "typescript" | "java" | "cpp" | "c">(
    "javascript",
  )
  const [userErrorMessage, setUserErrorMessage] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<ErrorAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const router = useRouter()
  const { setFlowchart } = useFlowchart()

  const handleAnalyzeCode = async () => {
    if (!userCode.trim()) {
      setAnalysisError("Please enter some code to analyze")
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const response = await fetch("/api/analyze-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: userCode,
          language: userLanguage,
          errorMessage: userErrorMessage || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze code")
      }

      const data = await response.json()
      setAiAnalysis(data.analysis)
      setMode("example") // Switch to display mode after analysis

      const flowchartData = generateFlowchart({
        code: userCode,
        language: userLanguage,
        errorType: data.analysis.errorType,
        rootCause: data.analysis.rootCause,
        variableSnapshot: data.analysis.variableSnapshot,
      })

      setFlowchart({
        flowchart: flowchartData,
        fromCode: userCode,
        language: userLanguage,
        analyzedAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Error analyzing code:", error)
      setAnalysisError(error instanceof Error ? error.message : "Failed to analyze code")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const displayData = aiAnalysis || MOCK_ANALYSIS
  const isUsingAI = aiAnalysis !== null

  const handleCopyFix = () => {
    const fixCode = isUsingAI && aiAnalysis?.suggestedFix?.code ? aiAnalysis.suggestedFix.code : MOCK_ANALYSIS.fixedCode
    navigator.clipboard.writeText(fixCode)
    setCopiedFix(true)
    setTimeout(() => setCopiedFix(false), 2000)
  }

  const handleCopyExplanation = () => {
    const explanation = isUsingAI ? aiAnalysis?.rootCause : MOCK_ANALYSIS.rootCause
    navigator.clipboard.writeText(explanation || "")
    setCopiedExplanation(true)
    setTimeout(() => setCopiedExplanation(false), 2000)
  }

  const defaultAlternatives = [
    {
      title: "Add null check",
      code: `if (!arr || arr.length === 0) {\n  return null;\n}`,
      explanation: "Best practice: Validates input before processing",
    },
    {
      title: "Add default parameter",
      code: `function findMax(arr = []) {\n  // function body\n}`,
      explanation: "Provides a fallback value if no argument is passed",
    },
    {
      title: "Throw custom error",
      code: `if (!arr) {\n  throw new Error('Array required');\n}`,
      explanation: "Makes the error explicit and easier to debug",
    },
  ]

  const alternativeFixes =
    isUsingAI && aiAnalysis?.alternatives && aiAnalysis.alternatives.length >= 3
      ? aiAnalysis.alternatives
      : defaultAlternatives

  const variableSnapshot =
    isUsingAI && aiAnalysis?.variableSnapshot
      ? Object.entries(aiAnalysis.variableSnapshot).map(([name, value]) => ({
          name,
          value: String(value),
          type: typeof value === "number" ? "number" : typeof value === "string" ? "string" : "object",
          status: value === "undefined" || value === "null" ? ("error" as const) : ("normal" as const),
        }))
      : MOCK_ANALYSIS.variables

  const learningResources =
    isUsingAI && aiAnalysis?.learningResources && aiAnalysis.learningResources.length > 0
      ? aiAnalysis.learningResources
      : [
          { title: "Arrays in JavaScript", description: "Learn about array methods and properties" },
          { title: "Handling undefined values", description: "Best practices for null checks" },
          { title: "Defensive programming", description: "Write robust code that handles edge cases" },
        ]

  const learningTip =
    isUsingAI && aiAnalysis?.learningTip
      ? aiAnalysis.learningTip
      : "Always validate function parameters at the start. Use default values or null checks to prevent undefined errors."

  return (
    <DashboardPageLayout
      header={{
        title: "AI Debugger",
        description: "Step-by-step debugging with AI-powered error analysis",
        icon: CuteRobotIcon,
      }}
    >
      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => setMode("analyze")}
          variant={mode === "analyze" ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Sparkles className="size-4" />
          Analyze My Code
        </Button>
        <Button
          onClick={() => {
            setMode("example")
            setAiAnalysis(null)
          }}
          variant={mode === "example" ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Code2 className="size-4" />
          Show Example
        </Button>
      </div>

      {mode === "analyze" && (
        <Card className="mb-6 ring-2 ring-pop border-blue-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase text-blue-400">
              <Bullet />
              Paste Your Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs uppercase text-foreground/60 mb-2 block">Select Language</label>
              <select
                value={userLanguage}
                onChange={(e) => setUserLanguage(e.target.value as any)}
                className="w-full px-3 py-2 bg-background border border-pop rounded text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
              </select>
            </div>

            <div>
              <label className="text-xs uppercase text-foreground/60 mb-2 block">Your Code</label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full h-48 px-3 py-2 bg-background border border-pop rounded font-mono text-sm resize-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase text-foreground/60 mb-2 block">Error Message (Optional)</label>
              <input
                type="text"
                value={userErrorMessage}
                onChange={(e) => setUserErrorMessage(e.target.value)}
                placeholder="e.g., TypeError: Cannot read property 'length' of undefined"
                className="w-full px-3 py-2 bg-background border border-pop rounded text-sm"
              />
            </div>

            {analysisError && (
              <div className="p-3 bg-red-950/20 border border-red-500 rounded">
                <p className="text-sm text-red-400">{analysisError}</p>
              </div>
            )}

            <Button
              onClick={handleAnalyzeCode}
              disabled={isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="size-4 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Analyze Code with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {mode === "example" && (
        <>
          {isUsingAI && (
            <div className="mb-4 p-3 bg-blue-950/20 border border-blue-500 rounded">
              <p className="text-sm text-blue-400 flex items-center gap-2">
                <Sparkles className="size-4" />
                Showing AI-powered analysis of your code
              </p>
            </div>
          )}

          <Card
            className={`mb-6 ${isUsingAI && displayData.errorType === "No Errors Found" ? "bg-gradient-to-r from-green-950/30 to-emerald-950/30 border-green-500/50" : "bg-gradient-to-r from-red-950/30 to-orange-950/30 border-red-500/50"}`}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {isUsingAI && displayData.errorType === "No Errors Found" ? (
                    <Check className="size-5 text-green-400" />
                  ) : (
                    <AlertCircle className="size-5 text-red-400" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-semibold ${isUsingAI && displayData.errorType === "No Errors Found" ? "text-green-300" : "text-red-300"}`}
                    >
                      {isUsingAI ? displayData.errorType : "TypeError"}
                    </p>
                    <p className="text-xs text-foreground/60">
                      {isUsingAI && displayData.errorType === "No Errors Found"
                        ? "Code analysis complete • No issues detected"
                        : "Line 3 • Fix Time: ~10s • Complexity: Low"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                    {Math.round((isUsingAI ? displayData.confidence : 0.87) * 100)}% Confidence
                  </Badge>
                  {!(isUsingAI && displayData.errorType === "No Errors Found") && (
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                      183 similar errors
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card
                className={`ring-2 ring-pop ${isUsingAI && displayData.errorType === "No Errors Found" ? "border-green-500" : "border-red-500"}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`flex items-center gap-2.5 text-sm font-medium uppercase ${isUsingAI && displayData.errorType === "No Errors Found" ? "text-green-400" : "text-red-400"}`}
                    >
                      <Bullet />
                      {isUsingAI && displayData.errorType === "No Errors Found"
                        ? "Analysis Result"
                        : "Error Root Cause"}
                    </CardTitle>
                    {!(isUsingAI && displayData.errorType === "No Errors Found") && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/50 border">
                        <AlertTriangle className="size-3 mr-1" />
                        {isUsingAI ? displayData.severity.toUpperCase() : "HIGH"} SEVERITY
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent
                  className={
                    isUsingAI && displayData.errorType === "No Errors Found" ? "bg-green-950/20" : "bg-red-950/20"
                  }
                >
                  {isUsingAI && displayData.errorType === "No Errors Found" ? (
                    <div className="p-3 bg-green-950/50 border border-green-500 rounded">
                      <p className="font-mono text-sm text-green-300">✓ {displayData.rootCause}</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 bg-red-950/50 border border-red-500 rounded">
                        <p className="font-mono text-sm text-red-300">
                          {isUsingAI && userErrorMessage ? userErrorMessage : MOCK_ANALYSIS.errorMessage}
                        </p>
                        <p className="text-xs text-red-400 mt-1">{MOCK_ANALYSIS.errorLine}</p>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs uppercase text-foreground/60">Why This Error Occurred</p>
                          <button
                            onClick={handleCopyExplanation}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            {copiedExplanation ? <Check className="size-3" /> : <Copy className="size-3" />}
                            {copiedExplanation ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-sm text-foreground/80">
                          {isUsingAI ? displayData.rootCause : MOCK_ANALYSIS.rootCause}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                    <Bullet />
                    Before vs After
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase text-red-400 mb-2 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                        Buggy Code
                      </p>
                      <pre className="font-mono text-xs bg-red-950/20 border border-red-500/50 p-3 rounded overflow-auto max-h-64">
                        {isUsingAI ? userCode : MOCK_ANALYSIS.buggyCode}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-green-400 mb-2 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        Fixed Code
                      </p>
                      <pre className="font-mono text-xs bg-green-950/20 border border-green-500/50 p-3 rounded overflow-auto max-h-64">
                        {isUsingAI && aiAnalysis?.suggestedFix?.code
                          ? aiAnalysis.suggestedFix.code
                          : MOCK_ANALYSIS.fixedCode}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                    <Bullet />
                    Alternative Fixes
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent space-y-3">
                  <Tabs defaultValue="option1" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="option1">Option A</TabsTrigger>
                      <TabsTrigger value="option2">Option B</TabsTrigger>
                      <TabsTrigger value="option3">Option C</TabsTrigger>
                    </TabsList>
                    <TabsContent value="option1" className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                          Recommended
                        </Badge>
                        <p className="text-sm font-semibold">{alternativeFixes[0]?.title || "Fix Option 1"}</p>
                      </div>
                      <pre className="font-mono text-xs bg-background border border-pop p-3 rounded overflow-auto">
                        {alternativeFixes[0]?.code || "// No code available"}
                      </pre>
                      <p className="text-xs text-foreground/70">
                        {alternativeFixes[0]?.explanation || "No explanation available"}
                      </p>
                    </TabsContent>
                    <TabsContent value="option2" className="space-y-2">
                      <p className="text-sm font-semibold">{alternativeFixes[1]?.title || "Fix Option 2"}</p>
                      <pre className="font-mono text-xs bg-background border border-pop p-3 rounded overflow-auto">
                        {alternativeFixes[1]?.code || "// No code available"}
                      </pre>
                      <p className="text-xs text-foreground/70">
                        {alternativeFixes[1]?.explanation || "No explanation available"}
                      </p>
                    </TabsContent>
                    <TabsContent value="option3" className="space-y-2">
                      <p className="text-sm font-semibold">{alternativeFixes[2]?.title || "Fix Option 3"}</p>
                      <pre className="font-mono text-xs bg-background border border-pop p-3 rounded overflow-auto">
                        {alternativeFixes[2]?.code || "// No code available"}
                      </pre>
                      <p className="text-xs text-foreground/70">
                        {alternativeFixes[2]?.explanation || "No explanation available"}
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                    <Bullet />
                    Suggested Fix
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent space-y-3">
                  <div className="p-3 bg-green-950/20 border border-green-500 rounded">
                    <p className="text-xs uppercase text-green-400 mb-2">Corrected Code</p>
                    <pre className="font-mono text-xs text-green-300 overflow-auto bg-background p-2 rounded max-h-64">
                      {isUsingAI && aiAnalysis?.suggestedFix?.code
                        ? aiAnalysis.suggestedFix.code
                        : MOCK_ANALYSIS.fixedCode}
                    </pre>
                  </div>
                  {isUsingAI && aiAnalysis?.suggestedFix?.explanation && (
                    <p className="text-sm text-foreground/80">{aiAnalysis.suggestedFix.explanation}</p>
                  )}
                  <button
                    onClick={handleCopyFix}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    {copiedFix ? (
                      <>
                        <Check className="size-4" />
                        Copied to Clipboard!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy Fix to Clipboard
                      </>
                    )}
                  </button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="ring-2 ring-pop border-yellow-500/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase text-yellow-400">
                    <Bullet />
                    Variable Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent">
                  <p className="text-xs text-foreground/60 mb-3 uppercase">
                    {isUsingAI && displayData.errorType === "No Errors Found"
                      ? "Variables in code"
                      : "At moment of failure"}
                  </p>
                  <div className="space-y-2">
                    {variableSnapshot.length > 0 ? (
                      variableSnapshot.map((variable) => (
                        <div key={variable.name} className="bg-background border border-pop rounded p-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono text-foreground/80">{variable.name}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                variable.status === "error"
                                  ? "bg-red-500/20 text-red-400 border-red-500/50"
                                  : variable.status === "warning"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                              }`}
                            >
                              {variable.value}
                            </Badge>
                          </div>
                          <p className="text-xs text-foreground/50 mt-1">Type: {variable.type}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 bg-background border border-pop rounded">
                        <p className="text-xs text-foreground/60 text-center">
                          {isUsingAI && displayData.errorType === "No Errors Found"
                            ? "No variables detected in the code"
                            : "No variables detected in the code"}
                        </p>
                      </div>
                    )}
                  </div>
                  {variableSnapshot.some((v) => v.status === "error") && (
                    <div className="mt-3 p-2 bg-yellow-950/20 border border-yellow-500/50 rounded">
                      <p className="text-xs text-yellow-400">
                        <Info className="size-3 inline mr-1" />
                        Some variables have unexpected values
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                      <Bullet />
                      Simple Explanation
                    </CardTitle>
                    <div className="flex gap-1 bg-background border border-pop rounded p-1">
                      <button
                        onClick={() => setLanguage("english")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          language === "english"
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage("hindi")}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          language === "hindi"
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/60 hover:text-foreground"
                        }`}
                      >
                        हिंदी
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="bg-accent space-y-3">
                  {language === "english" ? (
                    <div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {isUsingAI && aiAnalysis?.explanation?.english
                          ? aiAnalysis.explanation.english
                          : "Your function tried to access the length property of something that doesn't exist. Always check if your data exists before using it."}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {isUsingAI && aiAnalysis?.explanation?.hindi
                          ? aiAnalysis.explanation.hindi
                          : "आपका फंक्शन किसी ऐसी चीज़ की length को एक्सेस करने की कोशिश कर रहा है जो मौजूद नहीं है। हमेशा चेक करें कि आपका डेटा है या नहीं।"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                    <Bullet />
                    Learning Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent space-y-2">
                  {learningResources.map((resource, index) => (
                    <button
                      key={index}
                      className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left flex items-center justify-between"
                      title={resource.description}
                    >
                      <span>{resource.title}</span>
                      <span className="text-xs text-foreground/50">→</span>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="ring-2 ring-pop">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                    <Bullet />
                    Learning Tip
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-accent">
                  <p className="text-sm text-foreground/80 leading-relaxed">{learningTip}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {mode === "example" && isUsingAI && (
            <div className="mt-6 flex gap-3">
              <Button
                onClick={() => router.push("/code-flow")}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <ArrowRight className="size-4" />
                View Code Flowchart
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardPageLayout>
  )
}
