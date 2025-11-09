import DashboardPageLayout from "@/components/dashboard/layout"
import DashboardStat from "@/components/dashboard/stat"
import DashboardChart from "@/components/dashboard/chart"
import EmailIcon from "@/components/icons/email"
import ProcessorIcon from "@/components/icons/proccesor"
import BoomIcon from "@/components/icons/boom"
import GearIcon from "@/components/icons/gear"
import { Bullet } from "@/components/ui/bullet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function CommunicationPage() {
  return (
    <DashboardPageLayout
      header={{
        title: "Communication",
        description: "Messages & Collaboration",
        icon: EmailIcon,
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardStat
          label="MESSAGES"
          value="342"
          description="THIS WEEK"
          icon={EmailIcon}
          tag="💬 ACTIVE"
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="RESPONSE TIME"
          value="2.4h"
          description="AVERAGE"
          icon={ProcessorIcon}
          tag="FAST"
          intent="positive"
          direction="down"
        />
        <DashboardStat
          label="CONVERSATIONS"
          value="78"
          description="ONGOING"
          icon={BoomIcon}
          intent="positive"
          direction="up"
        />
        <DashboardStat
          label="COLLABORATION"
          value="15"
          description="ACTIVE TEAMS"
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
            Communication Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-accent">
          <div className="space-y-3">
            {["#general", "#development", "#security", "#research"].map((channel, i) => (
              <div key={i} className="p-3 bg-background border border-pop rounded flex justify-between items-center">
                <p className="text-sm font-medium">{channel}</p>
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  {Math.floor(Math.random() * 50) + 10} members
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardPageLayout>
  )
}
