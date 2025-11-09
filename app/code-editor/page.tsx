"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import BracketsIcon from "@/components/icons/brackets"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState, useEffect } from "react"
import { LanguageSelector } from "@/components/codetutor/language-selector"
import { OutputPanelTabs } from "@/components/codetutor/output-panel-tabs"
import { DebuggerView } from "@/components/codetutor/debugger-view"
import { MonacoEditor } from "@/components/codetutor/monaco-editor"
import type { SupportedLanguage } from "@/lib/types/codetutor"
import { LANGUAGE_MAP, LANGUAGE_EXTENSIONS } from "@/lib/constants/language-map"
import { runCode, type SubmissionResult } from "@/lib/utils/judge0"
import { Download, Copy, Trash2, Check, Play, Bug } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const DEFAULT_CODE: Record<SupportedLanguage, string> = {
  javascript: `function findMax(arr) {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}

console.log(findMax([1, 5, 3]));`,
  python: `def find_max(arr):
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

print(find_max([1, 5, 3]))`,
  cpp: `#include <iostream>
using namespace std;

int findMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}

int main() {
    int arr[] = {1, 5, 3};
    cout << findMax(arr, 3) << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int findMax(int arr[], int n) {
    int max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > max)
            max = arr[i];
    }
    return max;
}

int main() {
    int arr[] = {1, 5, 3};
    printf("%d\\n", findMax(arr, 3));
    return 0;
}`,
  java: `public class Main {
    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max)
                max = arr[i];
        }
        return max;
    }
    
    public static void main(String[] args) {
        int[] arr = {1, 5, 3};
        System.out.println(findMax(arr));
    }
}`,
  typescript: `function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max)
      max = arr[i];
  }
  return max;
}

console.log(findMax([1, 5, 3]));`,
}

export default function CodeEditorPage() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState<SupportedLanguage>("javascript")
  const [stdin, setStdin] = useState("")
  const [result, setResult] = useState<SubmissionResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errorLine, setErrorLine] = useState<number | undefined>(undefined)
  const { toast } = useToast()

  useEffect(() => {
    const savedCode = localStorage.getItem(`code-editor-${language}`)
    if (savedCode) {
      setCode(savedCode)
    } else {
      setCode(DEFAULT_CODE[language] || "")
    }
  }, [language])

  useEffect(() => {
    const timer = setInterval(() => {
      if (code) {
        localStorage.setItem(`code-editor-${language}`, code)
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [code, language])

  const handleRunCode = async () => {
    const languageId = LANGUAGE_MAP[language]
    if (!languageId) {
      toast({
        title: "Language not supported",
        description: `${language} is not supported by Judge0`,
        variant: "destructive",
      })
      return
    }

    if (!code.trim()) {
      toast({
        title: "Empty code",
        description: "Please write some code before running",
        variant: "destructive",
      })
      return
    }

    setIsRunning(true)
    setIsDebugMode(false)
    setResult(null)
    setErrorLine(undefined)

    try {
      const executionResult = await runCode(code, languageId, stdin || undefined)
      setResult(executionResult)

      if (executionResult.status.id !== 3) {
        const errorOutput = executionResult.stderr || executionResult.compile_output || ""
        const lineMatch = errorOutput.match(/line (\d+)/i) || errorOutput.match(/:(\d+):/i)
        if (lineMatch) {
          setErrorLine(Number.parseInt(lineMatch[1]))
        }
      }

      if (executionResult.status.id === 3) {
        toast({
          title: "Execution successful",
          description: `Completed in ${executionResult.time}s`,
        })
      } else {
        toast({
          title: "Execution failed",
          description: executionResult.status.description,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute code",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  const handleDebug = async () => {
    setIsDebugMode(true)
    await handleRunCode()
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    })
  }

  const handleClearCode = () => {
    setCode("")
    setResult(null)
    setErrorLine(undefined)
    localStorage.removeItem(`code-editor-${language}`)
    toast({
      title: "Cleared",
      description: "Code editor cleared",
    })
  }

  const handleDownloadCode = () => {
    const extension = LANGUAGE_EXTENSIONS[language] || "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded",
      description: `Code saved as code.${extension}`,
    })
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Code Editor",
        description: "Write, debug, and analyze code with AI-powered insights",
        icon: BracketsIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  Code Editor
                </CardTitle>
                <LanguageSelector value={language} onChange={setLanguage} />
              </div>
            </CardHeader>
            <CardContent className="bg-accent space-y-4">
              <div className="h-[500px]">
                <MonacoEditor value={code} onChange={setCode} language={language} errorLine={errorLine} />
              </div>

              <div>
                <label className="text-xs text-foreground/60 uppercase mb-2 block">Standard Input (Optional)</label>
                <textarea
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  className="w-full h-20 p-3 font-mono text-sm bg-background border border-pop rounded resize-none focus:outline-none focus:ring-2 focus:ring-pop transition-all"
                  placeholder="Enter input for your program..."
                  spellCheck="false"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isRunning && !isDebugMode ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Run Code
                    </>
                  )}
                </button>
                <button
                  onClick={handleDebug}
                  disabled={isRunning}
                  className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isRunning && isDebugMode ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Debugging...
                    </>
                  ) : (
                    <>
                      <Bug className="w-4 h-4" />
                      Debug
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-pop rounded hover:bg-accent-active transition-all"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-pop rounded hover:bg-accent-active transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleClearCode}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-background border border-pop rounded hover:bg-accent-active transition-all text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </CardContent>
          </Card>

          <OutputPanelTabs result={result} isLoading={isRunning} />

          <DebuggerView result={result} isActive={isDebugMode} />
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-3">
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-1">Code Quality</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                  </div>
                  <span className="text-sm font-bold">85%</span>
                </div>
              </div>
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-2">Issues Found</p>
                <ul className="space-y-1 text-xs">
                  <li className="text-yellow-400">⚠ Unused variable: i</li>
                  <li className="text-red-400">✕ Missing error handling</li>
                  <li className="text-blue-400">ℹ Consider using spread operator</li>
                </ul>
              </div>
              <div className="p-3 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 uppercase mb-1">Complexity</p>
                <p className="text-sm font-bold">O(n) - Linear</p>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left transition-all">
                Format Code
              </button>
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left transition-all">
                Upload File
              </button>
              <button className="w-full px-3 py-2 text-sm bg-background border border-pop rounded hover:bg-accent-active text-left transition-all">
                Save Snippet
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
