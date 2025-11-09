import DashboardPageLayout from "@/components/dashboard/layout"
import ProcessorIcon from "@/components/icons/proccesor"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"

export default function CommunityPage() {
  const snippets = [
    { title: "Memory Leak Detection Pattern", author: "KRIMSON", votes: 156, language: "JavaScript", helpful: true },
    { title: "Python List Comprehension Errors", author: "MATI", votes: 98, language: "Python", helpful: false },
    { title: "Async/Await Best Practices", author: "PEK", votes: 234, language: "JavaScript", helpful: true },
    { title: "C++ Pointer Debugging Guide", author: "JOYBOY", votes: 67, language: "C++", helpful: false },
    { title: "React Hook Dependency Array", author: "KRIMSON", votes: 189, language: "JavaScript", helpful: true },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Community Snippets",
        description: "Browse, share, and learn from the CodeTutor community",
        icon: ProcessorIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {snippets.map((snippet, idx) => (
            <Card key={idx} className="ring-2 ring-pop">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm mb-1">{snippet.title}</CardTitle>
                    <p className="text-xs text-foreground/60">
                      by {snippet.author} • {snippet.language}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">👍 {snippet.votes}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-accent flex items-center justify-between">
                <span className={snippet.helpful ? "text-green-400 text-sm" : "text-orange-400 text-sm"}>
                  {snippet.helpful ? "✓ Helpful" : "⚠ Review"}
                </span>
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">View</button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-background rounded border border-pop">
                  <span className="text-sm">KRIMSON</span>
                  <span className="text-yellow-400 font-bold">42</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded border border-pop">
                  <span className="text-sm">MATI</span>
                  <span className="text-yellow-400 font-bold">38</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded border border-pop">
                  <span className="text-sm">PEK</span>
                  <span className="text-yellow-400 font-bold">35</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-background rounded border border-pop">
                  <span className="text-sm">JOYBOY</span>
                  <span className="text-yellow-400 font-bold">28</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Share Your Fix
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-2">
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-sm">
                Submit Snippet
              </button>
              <button className="w-full px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 font-semibold text-sm">
                Share Solution
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
