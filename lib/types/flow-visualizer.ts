export interface FlowNode {
  id: string
  label: string
  type: "function" | "loop" | "condition" | "variable" | "return" | "error"
  lineNumber?: number
  isError?: boolean
}

export interface FlowEdge {
  id: string
  source: string
  target: string
  label?: string
  animated?: boolean
}

export interface CodeFlowData {
  nodes: FlowNode[]
  edges: FlowEdge[]
  errorNodeId?: string
}
