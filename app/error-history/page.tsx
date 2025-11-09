import DashboardPageLayout from "@/components/dashboard/layout"
import BoomIcon from "@/components/icons/boom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ErrorHistoryPage() {
  const errorHistory = [
    {
      date: "Nov 6, 2025",
      error: "TypeError: Cannot read property 'length'",
      fixed: true,
      language: "JavaScript",
      severity: "High",
    },
    {
      date: "Nov 5, 2025",
      error: "IndexError: list index out of range",
      fixed: true,
      language: "Python",
      severity: "Medium",
    },
    {
      date: "Nov 4, 2025",
      error: "NullPointerException at line 42",
      fixed: true,
      language: "Java",
      severity: "Critical",
    },
    {
      date: "Nov 3, 2025",
      error: "Segmentation fault in memory allocation",
      fixed: false,
      language: "C++",
      severity: "Critical",
    },
    {
      date: "Nov 2, 2025",
      error: "ReferenceError: x is not defined",
      fixed: true,
      language: "JavaScript",
      severity: "Low",
    },
  ]

  return (
    <DashboardPageLayout
      header={{
        title: "Error History",
        description: "Review and learn from your past debugging sessions",
        icon: BoomIcon,
      }}
    >
      <div className="space-y-4">
        {errorHistory.map((item, idx) => (
          <Card key={idx} className="ring-2 ring-pop">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm mb-1">{item.error}</CardTitle>
                  <p className="text-xs text-foreground/60">{item.date}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.severity === "Critical"
                        ? "bg-red-500/20 text-red-400"
                        : item.severity === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : item.severity === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-slate-500/20 text-slate-400">{item.language}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="bg-accent flex items-center justify-between">
              <span className={item.fixed ? "text-green-400 text-sm" : "text-red-400 text-sm"}>
                {item.fixed ? "✓ Fixed" : "✗ Not Fixed"}
              </span>
              <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">Review</button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardPageLayout>
  )
}
