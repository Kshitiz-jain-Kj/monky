"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import type { LearningStats } from "@/lib/types/session-reports"

interface LearningDashboardProps {
  stats: LearningStats
  language: "english" | "hindi"
}

export function LearningDashboard({ stats, language }: LearningDashboardProps) {
  const langText = language === "english"

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", sessions: 2, errors: 3 },
    { day: "Tue", sessions: 1, errors: 1 },
    { day: "Wed", sessions: 3, errors: 4 },
    { day: "Thu", sessions: 2, errors: 2 },
    { day: "Fri", sessions: 4, errors: 5 },
    { day: "Sat", sessions: 1, errors: 1 },
    { day: "Sun", sessions: 2, errors: 2 },
  ]

  const errorTypeData = stats.commonMistakes.slice(0, 5).map((item) => ({
    name: item.error,
    count: item.count,
  }))

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-background border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {langText ? "Total Sessions" : "कुल Sessions"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalSessions}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {langText ? "Debugging sessions completed" : "Debugging sessions complete"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{langText ? "Success Rate" : "सफलता दर"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(stats.successRate)}%</p>
            <p className="text-xs text-muted-foreground mt-1">
              {langText ? "Errors fixed correctly" : "Errors सही तरीके से fix"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {langText ? "Current Streak" : "वर्तमान Streak"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.streakDays}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {langText ? "Days of consistent learning" : "लगातार सीखने के दिन"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {langText ? "Total Errors Fixed" : "कुल Errors ठीक किए"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalErrors}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {langText ? "Different error types handled" : "विभिन्न error types संभाले"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-base">{langText ? "Weekly Activity" : "साप्ताहिक गतिविधि"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sessions" stroke="var(--primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="errors" stroke="var(--destructive)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-base">{langText ? "Common Mistakes" : "सामान्य गलतियाँ"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--background)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-background border-border">
        <CardHeader>
          <CardTitle className="text-base">{langText ? "Achievements" : "उपलब्धियां"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.achievements.length > 0 ? (
              stats.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 rounded-lg border border-border bg-muted/50 text-center space-y-2"
                >
                  <p className="text-3xl">{achievement.icon}</p>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <Badge className="mt-2 text-xs">{langText ? "Unlocked" : "अनलॉक किया गया"}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground col-span-full text-center">
                {langText
                  ? "Complete more sessions to unlock achievements"
                  : "अधिक sessions complete करें achievements unlock करने के लिए"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
