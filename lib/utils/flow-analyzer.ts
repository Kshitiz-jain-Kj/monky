import type { CodeFlowData, FlowNode, FlowEdge } from "@/lib/types/flow-visualizer"

export function analyzeCodeFlow(code: string, language: string): CodeFlowData {
  const nodes: FlowNode[] = []
  const edges: FlowEdge[] = []
  const lines = code.split("\n")

  let nodeId = 0
  const nodeMap: Record<number, string> = {}
  let lastNodeId = "start"

  nodes.push({
    id: "start",
    label: "Start",
    type: "function",
  })

  lines.forEach((line, index) => {
    const trimmedLine = line.trim()
    if (!trimmedLine || trimmedLine.startsWith("//") || trimmedLine.startsWith("#")) {
      return // Skip empty lines and comments
    }

    let nodeType: "function" | "loop" | "condition" | "variable" | "return" | "error" = "variable"
    let label = trimmedLine.substring(0, 50)

    // Detect control structures
    if (trimmedLine.match(/^(def|function|async function|const.*=.*=>|let.*=.*=>)/)) {
      nodeType = "function"
      label = trimmedLine.match(/\w+(?=\()/)?.[0] || "function"
    } else if (trimmedLine.match(/^(for|while|do.*while)/)) {
      nodeType = "loop"
      label = trimmedLine.match(/(for|while|do)/)?.[0] || "loop"
    } else if (trimmedLine.match(/^(if|else if|else|switch)/)) {
      nodeType = "condition"
      label = trimmedLine.substring(0, 30)
    } else if (trimmedLine.match(/^return/)) {
      nodeType = "return"
      label = "Return: " + trimmedLine.substring(7, 30)
    } else if (trimmedLine.match(/^(var|let|const|int|float|String|def)/)) {
      nodeType = "variable"
      label = trimmedLine.substring(0, 40)
    }

    const currentNodeId = `node-${nodeId}`
    nodes.push({
      id: currentNodeId,
      label,
      type: nodeType,
      lineNumber: index + 1,
    })

    nodeMap[index] = currentNodeId

    // Create edge from previous node
    if (lastNodeId) {
      edges.push({
        id: `edge-${lastNodeId}-${currentNodeId}`,
        source: lastNodeId,
        target: currentNodeId,
      })
    }

    lastNodeId = currentNodeId
    nodeId++
  })

  // Add end node
  if (lastNodeId && lastNodeId !== "start") {
    nodes.push({
      id: "end",
      label: "End",
      type: "return",
    })

    edges.push({
      id: `edge-${lastNodeId}-end`,
      source: lastNodeId,
      target: "end",
    })
  }

  return {
    nodes,
    edges,
  }
}

export function layoutFlowNodes(nodes: FlowNode[], edges: FlowEdge[]): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {}
  const nodeWidths: Record<string, number> = {
    function: 180,
    loop: 160,
    condition: 160,
    variable: 200,
    return: 140,
    error: 160,
  }

  const nodeHeights: Record<string, number> = {
    function: 80,
    loop: 80,
    condition: 80,
    variable: 60,
    return: 60,
    error: 80,
  }

  let yOffset = 0
  const verticalSpacing = 120
  const horizontalSpacing = 240

  nodes.forEach((node, index) => {
    const xBase = 50
    const yBase = 100 + yOffset

    // Hierarchical layout based on node type
    let depth = 0
    if (node.type === "function") depth = 0
    else if (node.type === "condition") depth = 1
    else if (node.type === "loop") depth = 1
    else if (node.type === "return") depth = 2

    positions[node.id] = {
      x: xBase + depth * horizontalSpacing,
      y: yBase + index * verticalSpacing,
    }

    yOffset += 0
  })

  return positions
}
