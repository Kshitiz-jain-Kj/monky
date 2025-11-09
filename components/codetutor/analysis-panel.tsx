"use client"

import type { AnalysisResult } from "@/lib/types/codetutor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExplanationCard } from "@/components/codetutor/explanation-card"

interface AnalysisPanelProps {
  result: AnalysisResult | null
  isLoading: boolean
  language: "english" | "hindi"
  onLanguageChange: (lang: "english" | "hindi") => void
}

export function AnalysisPanel({ result, isLoading, language, onLanguageChange }: AnalysisPanelProps) {
  if (isLoading) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle>Analyzing...</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">Your analysis will appear here</CardContent>
      </Card>
    )
  }

  const { analysis, codeInsight } = result
  const explanation = language === "english" ? analysis.explanation.english : analysis.explanation.hindi

  const severityColors: Record<string, string> = {
    critical: "bg-red-500/20 text-red-400 border-red-500/50",
    warning: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  }

  return (
    <div className="space-y-4">
      <ExplanationCard
        errorType={analysis.errorType}
        explanation={explanation}
        language={language}
        confidence={analysis.confidence}
      />

      <Card className="bg-background border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Details</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => onLanguageChange("english")}
              className={`px-2 py-1 text-xs rounded ${
                language === "english" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange("hindi")}
              className={`px-2 py-1 text-xs rounded ${
                language === "hindi" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              हिंदी
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-sm">Error Type</h3>
              <Badge className={`${severityColors[analysis.severity]} border`}>{analysis.severity}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{analysis.errorType}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Root Cause</h3>
            <p className="text-sm text-muted-foreground">{analysis.rootCause}</p>
          </div>

          <Tabs defaultValue="fix" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fix">Suggested Fix</TabsTrigger>
              <TabsTrigger value="insights">Code Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="fix" className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Fixed Code</p>
                <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-[200px] border border-border">
                  <code>{analysis.suggestedFix.code}</code>
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Why this works</p>
                <p className="text-sm">{analysis.suggestedFix.explanation}</p>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Lines of Code</p>
                  <p className="text-lg font-semibold">{codeInsight.linesOfCode}</p>
                </div>
                <div className="bg-muted p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Variables</p>
                  <p className="text-lg font-semibold">{codeInsight.variablesCount}</p>
                </div>
                <div className="bg-muted p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Functions</p>
                  <p className="text-lg font-semibold">{codeInsight.functionsCount}</p>
                </div>
                <div className="bg-muted p-3 rounded border border-border">
                  <p className="text-xs text-muted-foreground">Complexity</p>
                  <p className="text-lg font-semibold">{codeInsight.estimatedComplexity}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
