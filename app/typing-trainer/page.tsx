"use client"

import { useState, useEffect, useRef } from "react"
import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bullet } from "@/components/ui/bullet"
import BracketsIcon from "@/components/icons/brackets"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { codeSnippets } from "@/lib/code-snippets"
import Editor from "@monaco-editor/react"

type Language = "javascript" | "python" | "c" | "cpp" | "java" | "go"
type Difficulty = "beginner" | "intermediate" | "advanced"
type SnippetLength = "short" | "medium" | "long"

interface TypingStats {
  wpm: number
  cpm: number
  accuracy: number
  errors: number
  correctChars: number
  totalChars: number
}

interface SavedScore {
  id: string
  language: string
  difficulty: string
  wpm: number
  accuracy: number
  errors: number
  timestamp: string
}

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  javascript: "javascript",
  python: "python",
  c: "c",
  cpp: "cpp",
  java: "java",
  go: "go",
}

export default function TypingTrainerPage() {
  const [language, setLanguage] = useState<Language>("javascript")
  const [difficulty, setDifficulty] = useState<Difficulty>("beginner")
  const [snippetLength, setSnippetLength] = useState<SnippetLength>("short")
  const [timerDuration, setTimerDuration] = useState(60)
  const [isTestActive, setIsTestActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timerDuration)
  const [currentSnippet, setCurrentSnippet] = useState("")
  const [userInput, setUserInput] = useState("")
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
  })
  const [showResults, setShowResults] = useState(false)
  const [savedScores, setSavedScores] = useState<SavedScore[]>([])
  const [loadingScores, setLoadingScores] = useState(false)
  const editorRef = useRef<any>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const startTest = () => {
    const snippet = getRandomSnippet()
    setCurrentSnippet(snippet)
    setUserInput("")
    setCurrentCharIndex(0)
    setIsTestActive(true)
    setTimeRemaining(timerDuration)
    setShowResults(false)
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
    })
    setTimeout(() => editorRef.current?.focus(), 100)
  }

  const getRandomSnippet = () => {
    const snippetsForLang = codeSnippets[language]?.[difficulty]?.[snippetLength] || []
    if (snippetsForLang.length === 0) return "// No snippets available"
    const randomIndex = Math.floor(Math.random() * snippetsForLang.length)
    return snippetsForLang[randomIndex]
  }

  const endTest = () => {
    setIsTestActive(false)
    setShowResults(true)
  }

  const handleEditorChange = (value: string | undefined) => {
    if (!isTestActive || value === undefined) return

    setUserInput(value)

    const newIndex = value.length
    setCurrentCharIndex(newIndex)

    let correct = 0
    let errors = 0

    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentSnippet[i]) {
        correct++
      } else {
        errors++
      }
    }

    const accuracy = value.length > 0 ? (correct / value.length) * 100 : 100
    const timeElapsed = timerDuration - timeRemaining
    const minutes = timeElapsed / 60
    const words = correct / 5
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0
    const cpm = minutes > 0 ? Math.round(correct / minutes) : 0

    setStats({
      wpm,
      cpm,
      accuracy: Math.round(accuracy * 10) / 10,
      errors,
      correctChars: correct,
      totalChars: value.length,
    })

    if (newIndex >= currentSnippet.length) {
      endTest()
    }
  }

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    editor.focus()
  }

  const saveScore = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your scores",
        variant: "destructive",
      })
      return
    }

    try {
      const newScore: SavedScore = {
        id: Date.now().toString(),
        language,
        difficulty,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        timestamp: new Date().toISOString(),
      }

      const existingScores = JSON.parse(localStorage.getItem(`typing-scores-${user.id}`) || "[]")
      const updatedScores = [newScore, ...existingScores].slice(0, 50)
      localStorage.setItem(`typing-scores-${user.id}`, JSON.stringify(updatedScores))

      toast({
        title: "Score Saved",
        description: "Your typing score has been saved successfully!",
      })
      fetchScores()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save score.",
        variant: "destructive",
      })
    }
  }

  const fetchScores = async () => {
    if (!user) return
    setLoadingScores(true)
    try {
      const scores = JSON.parse(localStorage.getItem(`typing-scores-${user.id}`) || "[]")
      setSavedScores(scores)
    } catch (error) {
      console.error("Failed to fetch scores:", error)
      setSavedScores([])
    } finally {
      setLoadingScores(false)
    }
  }

  const resetToConfig = () => {
    setIsTestActive(false)
    setShowResults(false)
    setCurrentSnippet("")
    setUserInput("")
    setCurrentCharIndex(0)
    setStats({
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
    })
  }

  useEffect(() => {
    if (isTestActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && isTestActive) {
      endTest()
    }
  }, [timeRemaining, isTestActive])

  const renderSnippet = () => {
    return currentSnippet.split("").map((char, index) => {
      let className = "font-mono"
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className += " text-success bg-success/10"
        } else {
          className += " text-destructive bg-destructive/10"
        }
      } else if (index === currentCharIndex) {
        className += " bg-primary/20"
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Code Typing Trainer",
        description: "Practice typing code and improve your speed",
        icon: BracketsIcon,
      }}
    >
      <Tabs defaultValue="trainer" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="trainer">TYPING TRAINER</TabsTrigger>
          <TabsTrigger value="history" onClick={fetchScores}>
            SCORE HISTORY
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainer">
          {!isTestActive && !showResults && (
            <Card className="mb-6 ring-2 ring-pop">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  Test Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-xs text-foreground/60 mb-2 block uppercase">Language</label>
                    <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="c">C</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-foreground/60 mb-2 block uppercase">Difficulty</label>
                    <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-foreground/60 mb-2 block uppercase">Snippet Length</label>
                    <Select value={snippetLength} onValueChange={(v) => setSnippetLength(v as SnippetLength)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs text-foreground/60 mb-2 block uppercase">Timer</label>
                    <Select value={timerDuration.toString()} onValueChange={(v) => setTimerDuration(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                        <SelectItem value="90">90 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={startTest} size="lg" className="w-full md:w-auto">
                  START TEST
                </Button>
              </CardContent>
            </Card>
          )}

          {isTestActive && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <Card className="ring-2 ring-pop">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                      <Bullet />
                      Code Snippet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-muted">
                    <div className="p-4 bg-background border border-pop rounded-lg mb-4 max-h-[300px] overflow-auto text-sm leading-relaxed whitespace-pre-wrap">
                      {renderSnippet()}
                    </div>
                    <label className="text-xs text-foreground/60 mb-2 block uppercase">Type Here</label>
                    <div className="relative">
                      <div className="absolute top-2 right-2 z-10 pointer-events-none">
                        <Badge variant="secondary" className="text-xs opacity-80">
                          {language.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="h-[400px] border border-input rounded overflow-hidden">
                        <Editor
                          height="100%"
                          language={MONACO_LANGUAGE_MAP[language]}
                          value={userInput}
                          onChange={handleEditorChange}
                          onMount={handleEditorDidMount}
                          theme="vs-dark"
                          options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            readOnly: false,
                            automaticLayout: true,
                            tabSize: 2,
                            wordWrap: "on",
                            folding: false,
                            lineDecorationsWidth: 10,
                            lineNumbersMinChars: 3,
                            renderLineHighlight: "all",
                            matchBrackets: "always",
                            scrollbar: {
                              vertical: "visible",
                              horizontal: "visible",
                              useShadows: false,
                              verticalScrollbarSize: 10,
                              horizontalScrollbarSize: 10,
                            },
                            suggestOnTriggerCharacters: false,
                            acceptSuggestionOnEnter: "off",
                            quickSuggestions: false,
                            tabCompletion: "off",
                            autoClosingBrackets: "never",
                            autoClosingQuotes: "never",
                            autoIndent: "none",
                            formatOnPaste: false,
                            formatOnType: false,
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="ring-2 ring-pop">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                      <Bullet />
                      Timer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-accent">
                    <div className="text-center">
                      <div className="text-5xl font-display mb-2">{timeRemaining}s</div>
                      <Badge variant="secondary" className="uppercase">
                        Time Remaining
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="ring-2 ring-pop">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                      <Bullet />
                      Live Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="bg-accent space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/60 uppercase">WPM</span>
                      <span className="text-xl font-bold">{stats.wpm}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/60 uppercase">CPM</span>
                      <span className="text-xl font-bold">{stats.cpm}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/60 uppercase">Accuracy</span>
                      <span className="text-xl font-bold">{stats.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/60 uppercase">Errors</span>
                      <span className="text-xl font-bold text-destructive">{stats.errors}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-foreground/60 uppercase">Correct Chars</span>
                      <span className="text-xl font-bold text-success">{stats.correctChars}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {showResults && (
            <Card className="mb-6 ring-2 ring-pop">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">WPM</p>
                    <p className="text-3xl font-bold">{stats.wpm}</p>
                  </div>
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">CPM</p>
                    <p className="text-3xl font-bold">{stats.cpm}</p>
                  </div>
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">Accuracy</p>
                    <p className="text-3xl font-bold">{stats.accuracy}%</p>
                  </div>
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">Errors</p>
                    <p className="text-3xl font-bold text-destructive">{stats.errors}</p>
                  </div>
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">Total Chars</p>
                    <p className="text-3xl font-bold">{stats.totalChars}</p>
                  </div>
                  <div className="p-4 bg-background border border-pop rounded text-center">
                    <p className="text-xs text-foreground/60 mb-2 uppercase">Time</p>
                    <p className="text-3xl font-bold">{timerDuration}s</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={startTest} size="lg">
                    RETRY TEST
                  </Button>
                  <Button onClick={resetToConfig} variant="outline" size="lg">
                    NEW TEST
                  </Button>
                  <Button onClick={saveScore} variant="secondary" size="lg">
                    SAVE SCORE
                  </Button>
                  <Badge variant="outline" className="px-4 py-2">
                    {language.toUpperCase()} - {difficulty.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Previous Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent">
              {!user ? (
                <div className="text-center py-8">
                  <p className="text-foreground/60">Please login to view your score history</p>
                </div>
              ) : loadingScores ? (
                <div className="text-center py-8">
                  <p className="text-foreground/60">Loading scores...</p>
                </div>
              ) : savedScores.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-foreground/60">No saved scores yet. Complete a test to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedScores.map((score) => (
                    <div
                      key={score.id}
                      className="p-4 bg-background border border-pop rounded flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="flex-1 min-w-[200px]">
                        <p className="font-bold text-lg">{score.wpm} WPM</p>
                        <p className="text-xs text-foreground/60 uppercase">
                          {score.language} • {score.difficulty}
                        </p>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div>
                          <p className="text-xs text-foreground/60 uppercase">Accuracy</p>
                          <p className="font-bold">{score.accuracy}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-foreground/60 uppercase">Errors</p>
                          <p className="font-bold text-destructive">{score.errors}</p>
                        </div>
                      </div>
                      <div className="text-xs text-foreground/50">{new Date(score.timestamp).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardPageLayout>
  )
}
