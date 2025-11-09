"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Bug, Calendar, Code } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import BoomIcon from "@/components/icons/boom"

interface DebugEntry {
  _id: string
  errorMessage: string
  analysis: string
  fixedCode: string
  createdAt: string
  codeSnippetId?: any
}

export default function DebugHistoryPage() {
  const [history, setHistory] = useState<DebugEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<DebugEntry | null>(null)
  const { user, getAccessToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchHistory()
  }, [user])

  const fetchHistory = async () => {
    try {
      const token = await getAccessToken()
      const response = await fetch("/api/debug-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to fetch debug history")

      const data = await response.json()
      setHistory(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load debug history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "Debug History",
          description: "View your past debugging sessions",
          icon: BoomIcon,
        }}
      >
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardPageLayout>
    )
  }

  return (
    <DashboardPageLayout
      header={{
        title: "Debug History",
        description: "View your past debugging sessions",
        icon: BoomIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {history.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No debug history</h3>
                <p className="text-sm text-muted-foreground">Run the AI Debugger to see your history here</p>
              </CardContent>
            </Card>
          ) : (
            history.map((entry) => (
              <Card
                key={entry._id}
                className={`ring-2 cursor-pointer transition-all ${
                  selectedEntry?._id === entry._id ? "ring-primary" : "ring-pop hover:ring-primary/50"
                }`}
                onClick={() => setSelectedEntry(entry)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2.5 text-sm font-medium">
                    <Bullet />
                    Debug Session
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(entry.createdAt).toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="bg-accent">
                  <div className="p-3 bg-background border border-pop rounded">
                    <p className="text-xs font-mono text-red-400 line-clamp-3">{entry.errorMessage}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedEntry ? (
            <Card className="ring-2 ring-pop">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                  <Bullet />
                  Debug Details
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-accent space-y-4">
                <div>
                  <label className="text-xs text-foreground/60 uppercase mb-2 block">Error Message</label>
                  <div className="p-4 bg-background border border-pop rounded">
                    <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap">
                      {selectedEntry.errorMessage}
                    </pre>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-foreground/60 uppercase mb-2 block">AI Analysis</label>
                  <div className="p-4 bg-background border border-pop rounded">
                    <p className="text-sm whitespace-pre-wrap">{selectedEntry.analysis}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-foreground/60 uppercase mb-2 block flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Fixed Code
                  </label>
                  <div className="p-4 bg-background border border-pop rounded">
                    <pre className="text-sm font-mono whitespace-pre-wrap text-green-400">
                      {selectedEntry.fixedCode}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="ring-2 ring-pop">
              <CardContent className="p-12 text-center">
                <Bug className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select a debug session</h3>
                <p className="text-sm text-muted-foreground">Click on a session from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardPageLayout>
  )
}
