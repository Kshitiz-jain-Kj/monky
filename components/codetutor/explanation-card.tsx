"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContextualTip } from "@/lib/utils/enhanced-translator"
import { Badge } from "@/components/ui/badge"

interface ExplanationCardProps {
  errorType: string
  explanation: string
  language: "english" | "hindi"
  confidence: number
  showTips?: boolean
}

export function ExplanationCard({
  errorType,
  explanation,
  language,
  confidence,
  showTips = true,
}: ExplanationCardProps) {
  const tip = getContextualTip(errorType)
  const tipText = language === "english" ? tip.english : tip.hindi
  const confidencePercent = Math.round(confidence * 100)

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Understanding the Error</CardTitle>
          <Badge variant="outline" className="text-xs">
            {confidencePercent}% Confidence
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="simple" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-3 mt-4">
            <p className="text-sm leading-relaxed text-foreground">{explanation}</p>
            {showTips && (
              <div className="bg-primary/10 border border-primary/20 rounded p-3">
                <p className="text-xs font-semibold text-primary mb-1">
                  {language === "english" ? "Learning Tip" : "सीखने की सलाह"}
                </p>
                <p className="text-xs text-foreground/90">{tipText}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="detailed" className="space-y-3 mt-4">
            <div className="bg-muted p-3 rounded border border-border">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{explanation}</p>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded p-3">
              <p className="text-xs font-semibold text-primary mb-2">
                {language === "english" ? "What to Check" : "क्या जांचें"}
              </p>
              <ul className="text-xs space-y-1 text-foreground/90">
                <li>• {language === "english" ? "Variable types and values" : "Variable के types और values"}</li>
                <li>• {language === "english" ? "Function parameters" : "Function के parameters"}</li>
                <li>• {language === "english" ? "Loop conditions" : "Loop की conditions"}</li>
                <li>• {language === "english" ? "Array bounds" : "Array की range"}</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
