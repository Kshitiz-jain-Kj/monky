import { Badge } from "@/components/ui/badge"
import DashboardCard from "@/components/dashboard/card"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CodeTutorUser {
  id: number
  name: string
  handle: string
  points: number
  avatar: string
  featured?: boolean
  streak: string
}

interface CodeTutorRankingProps {
  users: CodeTutorUser[]
}

export default function CodeTutorRanking({ users }: CodeTutorRankingProps) {
  return (
    <DashboardCard
      title="TOP DEBUG MASTERS"
      intent="default"
      addon={<Badge variant="outline-warning">🔥 LEADERBOARD</Badge>}
    >
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-1 w-full">
              <div
                className={cn(
                  "flex items-center justify-center rounded text-sm font-bold px-1.5 mr-1 md:mr-2",
                  user.featured
                    ? "h-10 bg-primary text-primary-foreground"
                    : "h-8 bg-secondary text-secondary-foreground",
                )}
              >
                {user.id}
              </div>
              <div
                className={cn(
                  "rounded-lg overflow-hidden bg-muted",
                  user.featured ? "size-14 md:size-16" : "size-10 md:size-12",
                )}
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <div
                className={cn(
                  "flex flex-1 h-full items-center justify-between py-2 px-2.5 rounded",
                  user.featured && "bg-accent",
                )}
              >
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={cn("font-display", user.featured ? "text-xl md:text-2xl" : "text-lg md:text-xl")}
                      >
                        {user.name}
                      </span>
                      <span className="text-muted-foreground text-xs md:text-sm">{user.handle}</span>
                    </div>
                    <Badge variant={user.featured ? "default" : "secondary"}>{user.points} BUGS FIXED</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground italic">{user.streak}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}
