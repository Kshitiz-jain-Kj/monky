"use client"

import DashboardPageLayout from "@/components/dashboard/layout"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Code2, Trash2, Edit, Calendar, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ProcessorIcon from "@/components/icons/proccesor"

interface CodeSnippet {
  _id: string
  title: string
  language: string
  code: string
  createdAt: string
  updatedAt: string
}

export default function WorkspacePage() {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dbAvailable, setDbAvailable] = useState(true)
  const { user, getAccessToken } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchSnippets()
  }, [user])

  const fetchSnippets = async () => {
    try {
      const token = await getAccessToken()
      const response = await fetch("/api/snippets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (data.error && data.error.includes("Database not configured")) {
        setDbAvailable(false)
        setSnippets([])
      } else if (response.ok) {
        setSnippets(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching snippets:", error)
      toast({
        title: "Error",
        description: "Failed to load code snippets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSnippet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return

    try {
      const token = await getAccessToken()
      const response = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error("Failed to delete snippet")

      toast({
        title: "Success",
        description: "Snippet deleted successfully",
      })

      setSnippets(snippets.filter((s) => s._id !== id))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete snippet",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardPageLayout
        header={{
          title: "My Workspace",
          description: "Manage your saved code snippets",
          icon: ProcessorIcon,
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
        title: "My Workspace",
        description: "Manage your saved code snippets",
        icon: ProcessorIcon,
      }}
    >
      {!dbAvailable && (
        <Card className="mb-6 border-yellow-500 bg-yellow-500/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="font-semibold text-sm">Database Not Configured</p>
                <p className="text-xs text-muted-foreground">
                  Please set MONGODB_URI in your environment variables to enable workspace features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No code snippets yet</h3>
              <p className="text-sm text-muted-foreground">
                {dbAvailable
                  ? "Save your code from the Code Editor to see it here"
                  : "Configure MongoDB to enable saving code snippets"}
              </p>
            </CardContent>
          </Card>
        ) : (
          snippets.map((snippet) => (
            <Card key={snippet._id} className="ring-2 ring-pop hover:ring-primary transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2.5 text-sm font-medium">
                  <Bullet />
                  {snippet.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent className="bg-accent space-y-3">
                <div className="p-3 bg-background border border-pop rounded">
                  <p className="text-xs text-foreground/60 uppercase mb-1">Language</p>
                  <p className="text-sm font-bold capitalize">{snippet.language}</p>
                </div>

                <div className="p-3 bg-background border border-pop rounded">
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-hidden max-h-32 text-foreground/80">
                    {snippet.code.substring(0, 200)}
                    {snippet.code.length > 200 && "..."}
                  </pre>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/code-editor?snippet=${snippet._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90 transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Open
                  </button>
                  <button
                    onClick={() => deleteSnippet(snippet._id)}
                    className="flex items-center justify-center px-3 py-2 text-sm bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardPageLayout>
  )
}
