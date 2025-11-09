import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import AtomIcon from "@/components/icons/atom"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import GearIcon from "@/components/icons/gear"
import { Bullet } from "@/components/ui/bullet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LaboratoryPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Laboratory",
        description: "Experimental Testing Ground",
        icon: AtomIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStat
          label="EXPERIMENTS"
          value="127"
          description="COMPLETED"
          icon={ProcessorIcon}
          tag="🧪 ACTIVE"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="SUCCESS RATE"
          value="87%"
          description="ACCURACY"
          icon={AtomIcon}
          tag="EXCELLENT"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="ITERATIONS"
          value="342"
          description="THIS MONTH"
          icon={BoomIcon}
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="BREAKTHROUGHS"
          value="12"
          description="NEW FINDINGS"
          icon={GearIcon}
          intent="positive"
          direction="up"
        />
      </div>

      <div className="mb-6">
        <DashboardChart />
      </div>

      <Card className="ring-2 ring-pop">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
            <Bullet />
            Recent Experiments
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-accent">
          <div className="space-y-3">
            {["Quantum Threading", "Memory Optimization", "Algorithm Refinement", "Performance Profiling"].map(
              (exp, i) => (
                <div key={i} className="p-3 bg-background border border-pop rounded flex justify-between items-center">
                  <p className="text-sm font-medium">{exp}</p>
                  <span className="text-xs bg-pop/20 px-2 py-1 rounded">Active</span>
                </div>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
