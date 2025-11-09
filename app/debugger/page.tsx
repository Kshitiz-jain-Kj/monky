"use client"

import { useState } from "react"
import { CodeEditor } from "@/components/codetutor/code-editor"
import { LanguageSelector } from "@/components/codetutor/language-selector"
import { ErrorInput } from "@/components/codetutor/error-input"
import { AnalysisPanel } from "@/components/codetutor/analysis-panel"
import { FlowPanel } from "@/components/codetutor/flow-panel"
import { MentorFAB } from "@/components/codetutor/mentor-fab"
import type { SupportedLanguage, AnalysisResult } from "@/lib/types/codetutor"
import { toast } from "sonner"

const SAMPLE_CODE = {
  python: `def add_numbers(a, b):
    return a + b

result = add_numbers(5, "10")
print(result)`,
  javascript: `function fetchData() {
  let data = users.map(user => user.name);
  console.log(data);
}`,
  typescript: `interface User {
  id: number;
  name: string;
}

const users: User[] = [];
users.forEach(user => console.log(user.email));`,
  java: `public class Calculator {
  public static void main(String[] args) {
    int[] numbers = {1, 2, 3};
    System.out.println(numbers[5]);
  }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
  int arr[5] = {1, 2, 3};
  cout << arr[10] << endl;
  return 0;
}`,
  c: `#include <stdio.h>

int main() {
  int *ptr;
  printf("%d", *ptr);
  return 0;
}`,
}

export default function DebuggerPage() {
  const [code, setCode] = useState(SAMPLE_CODE.python)
  const [language, setLanguage] = useState<SupportedLanguage>("python")
  const [errorMessage, setErrorMessage] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [displayLanguage, setDisplayLanguage] = useState<"english" | "hindi">("english")

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze")
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          errorMessage: errorMessage || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze code")
      }

      const data = await response.json()
      if (data.success) {
        setAnalysisResult(data)
        toast.success("Analysis complete")
      } else {
        toast.error("Analysis failed")
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      toast.error("Error analyzing code")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang)
    setCode(SAMPLE_CODE[newLang])
    setAnalysisResult(null)
  }

  const mentorContext = {
    code,
    language,
    errorMessage,
    errorType: analysisResult?.analysis?.errorType,
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">CodeTutor</h1>
          <p className="text-muted-foreground">AI-powered debugging assistant for smarter learning</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Code Editor</h2>
              <LanguageSelector value={language} onChange={handleLanguageChange} />
            </div>
            <div className="bg-background border border-border rounded-lg overflow-hidden">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>
          </div>

          {/* Right: Error Input & Analysis */}
          <div className="lg:col-span-2 space-y-4">
            <ErrorInput
              value={errorMessage}
              onChange={setErrorMessage}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            <AnalysisPanel
              result={analysisResult}
              isLoading={isAnalyzing}
              language={displayLanguage}
              onLanguageChange={setDisplayLanguage}
            />
          </div>
        </div>

        {/* Flow Visualizer - Full Width */}
        <div>
          <FlowPanel
            code={code}
            language={language}
            errorLineNumber={
              analysisResult?.analysis?.errorType ? Number.parseInt(analysisResult.analysis.errorType) : undefined
            }
          />
        </div>
      </div>

      <MentorFAB context={mentorContext} language={displayLanguage} />
    </div>
  )
}
