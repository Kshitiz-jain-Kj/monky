import DashboardPageLayout from "@/components/dashboard/layout"
import AtomIcon from "@/components/icons/atom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bullet } from "@/components/ui/bullet"

export default function LearningHubPage() {
  const lessons = [
    { title: "Understanding Variable Scope", progress: 100, status: "Completed" },
    { title: "Common Array Errors", progress: 75, status: "In Progress" },
    { title: "Async/Await Debugging", progress: 40, status: "In Progress" },
    { title: "Memory Leaks Prevention", progress: 0, status: "Locked" },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Learning Hub",
        description: "Learn debugging concepts and improve your skills",
        icon: AtomIcon,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {lessons.map((lesson, idx) => (
            <Card key={idx} className="ring-2 ring-pop">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{lesson.title}</CardTitle>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      lesson.status === "Completed"
                        ? "bg-green-500/20 text-green-400"
                        : lesson.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {lesson.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="bg-accent">
                <div className="space-y-3">
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all" style={{ width: `${lesson.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-foreground/60">{lesson.progress}% Complete</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent space-y-3">
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Total XP</p>
                <p className="text-2xl font-bold text-blue-400">2,450</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Lessons Completed</p>
                <p className="text-2xl font-bold text-green-400">8/12</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 uppercase mb-1">Current Level</p>
                <p className="text-2xl font-bold text-purple-400">Expert</p>
              </div>
            </CardContent>
          </Card>

          <Card className="ring-2 ring-pop">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
                <Bullet />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-accent">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-yellow-500/20 rounded text-center text-xs">🏆 Bug Hunter</div>
                <div className="p-2 bg-red-500/20 rounded text-center text-xs">🔥 7 Day Streak</div>
                <div className="p-2 bg-blue-500/20 rounded text-center text-xs">🎯 Accuracy Pro</div>
                <div className="p-2 bg-green-500/20 rounded text-center text-xs">⚡ Speed Runner</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardPageLayout>
  )
}
