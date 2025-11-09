import type { CodeFlowchart, FlowchartNode, FlowchartEdge, ExecutionStep } from "@/lib/types/flowchart"
import { traceExecution } from "./code-executor"

interface GenerateFlowchartParams {
  code: string
  language: string
  errorType?: string
  rootCause?: string
  variableSnapshot?: Record<string, any>
}

export function generateFlowchart({
  code,
  language,
  errorType,
  rootCause,
  variableSnapshot,
}: GenerateFlowchartParams): CodeFlowchart {
  // Trace actual code execution
  const trace = traceExecution(code, language, variableSnapshot)

  const nodes: FlowchartNode[] = []
  const edges: FlowchartEdge[] = []
  let nodeId = 0
  let yPosition = 30

  const createNode = (
    type: FlowchartNode["type"],
    label: string,
    color?: { fill: string; stroke: string },
  ): FlowchartNode => {
    const id = `node-${nodeId++}`
    const node: FlowchartNode = {
      id,
      type,
      label,
      position: { x: 300, y: yPosition },
      size: { width: 140, height: type === "decision" ? 60 : 50 },
      color,
    }
    yPosition += type === "decision" ? 100 : 70
    nodes.push(node)
    return node
  }

  const createEdge = (from: string, to: string, label?: string, color?: string): FlowchartEdge => {
    const id = `edge-${from}-${to}`
    const edge: FlowchartEdge = { id, from, to, label, color }
    edges.push(edge)
    return edge
  }

  // Start node
  const startNode = createNode("start", "START", { fill: "#10b981", stroke: "#059669" })
  let prevNode = startNode

  // Create nodes from execution trace
  const nodeMap: Record<number, FlowchartNode> = {}
  nodeMap[0] = startNode

  trace.steps.forEach((step, idx) => {
    if (step.stepNumber === 1) return // Skip START step as we already have it

    let nodeType: FlowchartNode["type"] = "process"
    let color: { fill: string; stroke: string } | undefined
    let label = step.description

    if (step.type === "condition") {
      nodeType = "decision"
      // Extract condition from code
      const condMatch = step.code.match(/if\s*$$(.*?)$$/)
      label = condMatch ? `${condMatch[1].substring(0, 30)}?` : "Condition?"
      color = { fill: "#f59e0b", stroke: "#d97706" }
    } else if (step.type === "loop") {
      nodeType = "decision"
      label = "Loop\nCondition?"
      color = { fill: "#f59e0b", stroke: "#d97706" }
    } else if (step.type === "return") {
      color = { fill: "#3b82f6", stroke: "#1e40af" }
    } else if (step.type === "declaration" || step.type === "assignment") {
      color = { fill: "#3b82f6", stroke: "#1e40af" }
    }

    const node = createNode(nodeType, label, color)
    nodeMap[step.stepNumber] = node
    createEdge(prevNode.id, node.id)
    prevNode = node
  })

  // Add error node if exists
  if (errorType && errorType !== "No Errors Found") {
    const errorNode = createNode("error", `Error:\n${errorType}`, {
      fill: "#ef4444",
      stroke: "#dc2626",
    })
    createEdge(prevNode.id, errorNode.id, "", "#ef4444")
    prevNode = errorNode
  }

  // End node
  const endNode = createNode("end", "END", { fill: "#10b981", stroke: "#059669" })
  createEdge(prevNode.id, endNode.id)

  const executionSteps: ExecutionStep[] = trace.steps.map((step, idx) => ({
    stepNumber: step.stepNumber,
    description: step.description,
    activeNodes: [nodeMap[step.stepNumber]?.id || `node-${idx}`],
    variables: step.variables || {},
    status:
      errorType && errorType !== "No Errors Found" && step.stepNumber === trace.steps.length - 1
        ? "error"
        : "completed",
  }))

  return {
    nodes,
    edges,
    executionSteps,
    variables: Object.entries(trace.finalVariables).map(([name, value]) => ({
      name,
      value: String(value),
      type: typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "string",
      status: value === undefined || value === null ? "error" : "normal",
    })),
    metadata: {
      language,
      errorType,
      hasErrors: errorType && errorType !== "No Errors Found" ? true : false,
      complexity: nodes.length > 10 ? "High" : nodes.length > 5 ? "Medium" : "Low",
    },
  }
}
