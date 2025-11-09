"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { FlowchartAnalysis } from "@/lib/types/flowchart"

interface FlowchartContextType {
  currentFlowchart: FlowchartAnalysis | null
  setFlowchart: (flowchart: FlowchartAnalysis) => void
  clearFlowchart: () => void
  isLoading: boolean
}

const FlowchartContext = createContext<FlowchartContextType | undefined>(undefined)

export function FlowchartProvider({ children }: { children: ReactNode }) {
  const [currentFlowchart, setCurrentFlowchart] = useState<FlowchartAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSetFlowchart = (flowchart: FlowchartAnalysis) => {
    setCurrentFlowchart(flowchart)
  }

  const handleClearFlowchart = () => {
    setCurrentFlowchart(null)
  }

  return (
    <FlowchartContext.Provider
      value={{
        currentFlowchart,
        setFlowchart: handleSetFlowchart,
        clearFlowchart: handleClearFlowchart,
        isLoading,
      }}
    >
      {children}
    </FlowchartContext.Provider>
  )
}

export function useFlowchart() {
  const context = useContext(FlowchartContext)
  if (context === undefined) {
    throw new Error("useFlowchart must be used within FlowchartProvider")
  }
  return context
}
