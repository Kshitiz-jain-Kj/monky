"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlowVisualizer } from "@/components/codetutor/flow-visualizer"
import { analyzeCodeFlow } from "@/lib/utils/flow-analyzer"
import type { SupportedLanguage } from "@/lib/types/codetutor"

interface FlowPanelProps {
  code: string
  language: SupportedLanguage
  errorLineNumber?: number
}

export function FlowPanel({ code, language, errorLineNumber }: FlowPanelProps) {
  const codeFlow = analyzeCodeFlow(code, language)

  const stepDebugItems = codeFlow.nodes.map((node) => ({
    id: node.id,
    label: node.label,
    type: node.type,
    lineNumber: node.lineNumber,
  }))

  return (
    <Card className="bg-background border-border">
      <CardHeader>
        <CardTitle className="text-base">Code Flow Visualization</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flow">Flow Diagram</TabsTrigger>
            <TabsTrigger value="debug">Step Debug</TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="mt-4">
            <div className="border border-border rounded-lg overflow-hidden bg-muted/30">
              <FlowVisualizer codeFlow={codeFlow} errorLineNumber={errorLineNumber} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Shows the control flow of your code with functions, loops, and conditions. Red highlighting indicates
              where the error occurred.
            </p>
          </TabsContent>

          <TabsContent value="debug" className="space-y-3 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Execution Steps</p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {stepDebugItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border text-xs ${
                      item.lineNumber === errorLineNumber
                        ? "bg-red-500/10 border-red-500/30 font-semibold text-red-400"
                        : "bg-muted border-border text-foreground"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-muted-foreground">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="font-medium">{item.type}</p>
                        <p className="text-muted-foreground truncate">{item.label}</p>
                        {item.lineNumber && (
                          <p className="text-xs mt-1 text-muted-foreground">Line {item.lineNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
