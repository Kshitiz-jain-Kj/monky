"use client"

import type { SessionReport } from "@/lib/types/session-reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Copy } from "lucide-react"
import { toast } from "sonner"

interface SessionReportModalProps {
  report: SessionReport | null
  isOpen: boolean
  onClose: () => void
  language: "english" | "hindi"
}

export function SessionReportModal({ report, isOpen, onClose, language }: SessionReportModalProps) {
  if (!report) return null

  const handleDownloadMarkdown = () => {
    const { generateDownloadableReport } = require("@/lib/utils/report-generator")
    const markdown = generateDownloadableReport(report, language)
    const element = document.createElement("a")
    element.setAttribute("href", "data:text/markdown;charset=utf-8," + encodeURIComponent(markdown))
    element.setAttribute("download", `debug-report-${report.session.id}.md`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success(language === "english" ? "Report downloaded!" : "रिपोर्ट डाउनलोड हुई!")
  }

  const handleDownloadPDF = () => {
    toast.info(language === "english" ? "PDF export coming soon" : "PDF export जल्द आ रहा है")
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(report.session.code)
    toast.success(language === "english" ? "Code copied!" : "Code copy हो गया!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{language === "english" ? "Debug Session Report" : "Debug Session Report"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-muted/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{language === "english" ? "Summary" : "सारांश"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </CardContent>
          </Card>

          {/* Error Details */}
          <Card className="bg-muted/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{language === "english" ? "Error Details" : "Error विवरण"}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">{language === "english" ? "Error Type" : "Error प्रकार"}</p>
                <p className="font-semibold">{report.session.errorType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{language === "english" ? "Language" : "भाषा"}</p>
                <p className="font-semibold">{report.session.language}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{language === "english" ? "Complexity" : "जटिलता"}</p>
                <p className="font-semibold">{report.session.complexity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{language === "english" ? "Time Spent" : "समय लगा"}</p>
                <p className="font-semibold">{Math.round(report.session.timeSpent / 60)} min</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Learnings */}
          <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{language === "english" ? "Key Learnings" : "मुख्य सीख"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.keyLearnings.map((learning, idx) => (
                  <li key={idx} className="text-sm flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{learning}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{language === "english" ? "Next Steps" : "अगले कदम"}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-sm flex gap-2">
                    <span className="text-blue-400">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Code Preview */}
          <Card className="bg-muted/50 border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">{language === "english" ? "Code" : "कोड"}</CardTitle>
              <Button size="sm" variant="ghost" onClick={handleCopyCode} className="h-8 w-8 p-0">
                <Copy className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="bg-background p-3 rounded text-xs overflow-auto max-h-[150px] border border-border">
                <code>{report.session.code}</code>
              </pre>
            </CardContent>
          </Card>

          {/* Download Options */}
          <div className="flex gap-2">
            <Button onClick={handleDownloadMarkdown} className="flex-1 gap-2 bg-transparent" variant="outline">
              <Download className="w-4 h-4" />
              {language === "english" ? "Download Markdown" : "Markdown डाउनलोड करें"}
            </Button>
            <Button onClick={handleDownloadPDF} className="flex-1 gap-2 bg-transparent" variant="outline">
              <Download className="w-4 h-4" />
              {language === "english" ? "Download PDF" : "PDF डाउनलोड करें"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
