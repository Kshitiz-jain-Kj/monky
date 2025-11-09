import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import ProcessorIcon from "@/components/icons/proccesor"
import CuteRobotIcon from "@/components/icons/cute-robot"
import BoomIcon from "@/components/icons/boom"
import GearIcon from "@/components/icons/gear"
import { Bullet } from "@/components/ui/bullet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DevicesPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Devices",
        description: "System & Hardware Status",
        icon: ProcessorIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStat
          label="ACTIVE DEVICES"
          value="24"
          description="ONLINE"
          icon={ProcessorIcon}
          tag="⚙️ OPERATIONAL"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="CPU USAGE"
          value="42%"
          description="AVERAGE"
          icon={CuteRobotIcon}
          tag="NORMAL"
          intent="positive"
          direction="down"
        />
        <DashboardStat
          label="MEMORY"
          value="68%"
          description="UTILIZED"
          icon={BoomIcon}
          intent="neutral"
          direction="up"
        />
        <DashboardStat
          label="LATENCY"
          value="12ms"
          description="RESPONSE TIME"
          icon={GearIcon}
          intent="positive"
          direction="down"
        />
      </div>

      <div className="mb-6">
        <DashboardChart />
      </div>

      <Card className="ring-2 ring-pop">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-sm font-medium uppercase">
            <Bullet />
            Device Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-accent">
          <div className="space-y-3">
            {["Server A", "Server B", "Gateway Node", "Cache Layer"].map((device, i) => (
              <div key={i} className="p-3 bg-background border border-pop rounded flex justify-between items-center">
                <p className="text-sm font-medium">{device}</p>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Healthy</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
