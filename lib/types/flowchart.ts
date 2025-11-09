export interface FlowchartNode {
  id: string
  type: "start" | "end" | "process" | "decision" | "error"
  label: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  color?: { fill: string; stroke: string }
}

export interface FlowchartEdge {
  id: string
  from: string
  to: string
  label?: string
  color?: string
}

export interface CodeFlowchart {
  nodes: FlowchartNode[]
  edges: FlowchartEdge[]
  executionSteps: ExecutionStep[]
  variables: VariableSnapshot[]
  metadata: {
    language: string
    errorType?: string
    hasErrors: boolean
    complexity: string
  }
}

export interface ExecutionStep {
  stepNumber: number
  description: string
  activeNodes: string[]
  variables: Record<string, string>
  status: "pending" | "executing" | "completed" | "error"
}

export interface VariableSnapshot {
  name: string
  value: string
  type: string
  status: "normal" | "warning" | "error"
}

export interface FlowchartAnalysis {
  flowchart: CodeFlowchart
  fromCode: string
  language: string
  analyzedAt: string
}
