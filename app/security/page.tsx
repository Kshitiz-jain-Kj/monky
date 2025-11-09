import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import CuteRobotIcon from "@/components/icons/cute-robot"
import LockIcon from "@/components/icons/lock"
import BoomIcon from "@/components/icons/boom"
import GearIcon from "@/components/icons/gear"
import { Bullet } from "@/components/ui/bullet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SecurityPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Security",
        description: "System Security & Protection",
        icon: CuteRobotIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStat
          label="THREATS BLOCKED"
          value="1,247"
          description="THIS MONTH"
          icon={GearIcon}
          tag="🛡️ PROTECTED"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="FIREWALL"
          value="100%"
          description="OPERATIONAL"
          icon={CuteRobotIcon}
          tag="ACTIVE"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="VULNERABILITIES"
          value="0"
          description="CRITICAL"
          icon={BoomIcon}
          tag="SECURE"
          intent="positive"
          direction="down"
        />
        <DashboardStat
          label="UPTIME"
          value="99.99%"
          description="LAST 30 DAYS"
          icon={LockIcon}
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
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-accent">
          <div className="space-y-3">
            {[
              { name: "DDoS Protection", status: "Active" },
              { name: "SSL/TLS Encryption", status: "Enabled" },
              { name: "WAF Rules", status: "Updated" },
              { name: "Intrusion Detection", status: "Monitoring" },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-background border border-pop rounded flex justify-between items-center">
                <p className="text-sm font-medium">{item.name}</p>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">{item.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
