import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import CodeTutorRanking from "@/components/codetutor/codetutor-ranking"
import ProcessorIcon from "@/components/icons/proccesor"
import GearIcon from "@/components/icons/gear"
import BoomIcon from "@/components/icons/boom"
import AtomIcon from "@/components/icons/atom"
import { Bullet } from "@/components/ui/bullet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const TOP_DEBUG_MASTERS = [
  {
    id: 1,
    name: "KRIMSON",
    handle: "@KRIMSON",
    points: 187,
    avatar: "/avatars/user_krimson.png",
    featured: true,
    streak: "5 DAYS STREAK 🔥 Bugs: 47",
  },
  {
    id: 2,
    name: "MATI",
    handle: "@MATI",
    points: 156,
    avatar: "/avatars/user_mati.png",
    streak: "3 DAYS STREAK - Bugs: 39",
  },
  {
    id: 3,
    name: "PEK",
    handle: "@MATT",
    points: 124,
    avatar: "/avatars/user_pek.png",
    streak: "2 DAYS STREAK - Bugs: 31",
  },
  {
    id: 4,
    name: "JOYBOY",
    handle: "@JOYBOY",
    points: 98,
    avatar: "/avatars/user_joyboy.png",
    streak: "1 DAY STREAK - Bugs: 24",
  },
]

export default function CodeTutorDashboard() {
  return (
    <DashboardPageLayout
      header={{
        title: "CodeTutor",
        description: "Your AI Debugging Partner",
        icon: ProcessorIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStat
          label="BUGS FIXED"
          value="324"
          description="THIS MONTH"
          icon={GearIcon}
          tag="🐛 SOLVED"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="CODE QUALITY"
          value="94%"
          description="IMPROVEMENT SCORE"
          icon={AtomIcon}
          tag="EXCELLENT"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="LEARNING STREAK"
          value="12"
          description="DAYS CONSECUTIVE"
          icon={ProcessorIcon}
          tag="🔥 HOT"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="LANGUAGES MASTERED"
          value="6"
          description="PROFICIENCY LEVEL"
          icon={BoomIcon}
          intent="positive"
          direction="up"
        />
      </div>

      <div className="mb-6">
        <Card className="ring-2 ring-pop">
          <CardHeader>
            <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
              <Bullet />
              Weekly Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-accent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 mb-2 uppercase">Most Fixed Errors</p>
                <p className="text-lg font-bold">Undefined References</p>
                <p className="text-xs text-foreground/50 mt-1">58 fixes this week</p>
              </div>
              <div className="p-4 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 mb-2 uppercase">Top Language</p>
                <p className="text-lg font-bold">JavaScript</p>
                <p className="text-xs text-foreground/50 mt-1">126 bugs debugged</p>
              </div>
              <div className="p-4 bg-background border border-pop rounded">
                <p className="text-xs text-foreground/60 mb-2 uppercase">Avg Debug Time</p>
                <p className="text-lg font-bold">3.2 min</p>
                <p className="text-xs text-foreground/50 mt-1">20% faster than last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CodeTutorRanking users={TOP_DEBUG_MASTERS} />
    </DashboardPageLayout>
  )
}
