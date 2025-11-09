"use client"

import * as React from "react"
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mockDataJson from "@/mock.json"
import { Bullet } from "@/components/ui/bullet"
import type { MockData, TimePeriod } from "@/types/dashboard"

const mockData = mockDataJson as MockData

type ChartDataPoint = {
  date: string
  bugsFixed: number
  codeQuality: number
  learningTime: number
}

const chartConfig = {
  bugsFixed: {
    label: "Bugs Fixed",
    color: "var(--chart-1)",
  },
  codeQuality: {
    label: "Code Quality %",
    color: "var(--chart-2)",
  },
  learningTime: {
    label: "Learning Time (min)",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export default function DashboardChart() {
  const [activeTab, setActiveTab] = React.useState<TimePeriod>("week")

  const handleTabChange = (value: string) => {
    if (value === "week" || value === "month" || value === "year") {
      setActiveTab(value as TimePeriod)
    }
  }

  const formatYAxisValue = (value: number) => {
    if (value === 0) {
      return ""
    }
    return value.toString()
  }

  const renderChart = (data: ChartDataPoint[]) => {
    return (
      <div className="bg-accent rounded-lg p-3">
        <ChartContainer className="md:aspect-[3/1] w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id="fillBugsFixed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-bugsFixed)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-bugsFixed)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillCodeQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-codeQuality)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-codeQuality)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillLearningTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-learningTime)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-learningTime)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="8 8"
              strokeWidth={2}
              stroke="var(--muted-foreground)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              strokeWidth={1.5}
              className="uppercase text-sm fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickCount={6}
              className="text-sm fill-muted-foreground"
              tickFormatter={formatYAxisValue}
              domain={[0, "dataMax"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" className="min-w-[200px] px-4 py-3" />}
            />
            <Area
              dataKey="bugsFixed"
              type="linear"
              fill="url(#fillBugsFixed)"
              fillOpacity={0.4}
              stroke="var(--color-bugsFixed)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              dataKey="codeQuality"
              type="linear"
              fill="url(#fillCodeQuality)"
              fillOpacity={0.4}
              stroke="var(--color-codeQuality)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Area
              dataKey="learningTime"
              type="linear"
              fill="url(#fillLearningTime)"
              fillOpacity={0.4}
              stroke="var(--color-learningTime)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="max-md:gap-4">
      <div className="flex items-center justify-between mb-4 max-md:contents">
        <TabsList className="max-md:w-full">
          <TabsTrigger value="week">WEEK</TabsTrigger>
          <TabsTrigger value="month">MONTH</TabsTrigger>
          <TabsTrigger value="year">YEAR</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-6 max-md:order-1">
          {Object.entries(chartConfig).map(([key, value]) => (
            <ChartLegend key={key} label={value.label} color={value.color} />
          ))}
        </div>
      </div>
      <TabsContent value="week" className="space-y-4">
        {renderChart(mockData.chartData.week as ChartDataPoint[])}
      </TabsContent>
      <TabsContent value="month" className="space-y-4">
        {renderChart(mockData.chartData.month as ChartDataPoint[])}
      </TabsContent>
      <TabsContent value="year" className="space-y-4">
        {renderChart(mockData.chartData.year as ChartDataPoint[])}
      </TabsContent>
    </Tabs>
  )
}

export const ChartLegend = ({
  label,
  color,
}: {
  label: string
  color: string
}) => {
  return (
    <div className="flex items-center gap-2 uppercase">
      <Bullet style={{ backgroundColor: color }} className="rotate-45" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
