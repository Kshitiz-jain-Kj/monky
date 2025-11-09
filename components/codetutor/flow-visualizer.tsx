"use client"
import type { CodeFlowData } from "@/lib/types/flow-visualizer"

interface FlowVisualizerProps {
  codeFlow: CodeFlowData
  errorLineNumber?: number
}

export function FlowVisualizer({ codeFlow, errorLineNumber }: FlowVisualizerProps) {
  // This provides better compatibility and simpler visualization

  const nodeTypeColors: Record<string, string> = {
    function: "fill-blue-500/20 stroke-blue-400",
    loop: "fill-yellow-500/20 stroke-yellow-400",
    condition: "fill-purple-500/20 stroke-purple-400",
    variable: "fill-green-500/20 stroke-green-400",
    return: "fill-red-500/20 stroke-red-400",
    error: "fill-red-600/20 stroke-red-500",
  }

  const nodeTypeLabels: Record<string, string> = {
    function: "Function",
    loop: "Loop",
    condition: "Condition",
    variable: "Variable",
    return: "Return",
    error: "Error",
  }

  const viewWidth = 1000
  const viewHeight = Math.max(600, codeFlow.nodes.length * 100)

  return (
    <div className="w-full h-full bg-background border border-border rounded-lg overflow-auto">
      <svg width="100%" height={viewHeight} viewBox={`0 0 ${viewWidth} ${viewHeight}`} className="min-w-full">
        {/* Draw edges first */}
        {codeFlow.edges.map((edge) => {
          const sourceNode = codeFlow.nodes.find((n) => n.id === edge.source)
          const targetNode = codeFlow.nodes.find((n) => n.id === edge.target)

          if (!sourceNode || !targetNode) return null

          const sourceIndex = codeFlow.nodes.indexOf(sourceNode)
          const targetIndex = codeFlow.nodes.indexOf(targetNode)

          const sourceY = 50 + sourceIndex * 100
          const targetY = 50 + targetIndex * 100

          return (
            <g key={edge.id}>
              <line
                x1={150}
                y1={sourceY + 40}
                x2={150}
                y2={targetY}
                stroke="currentColor"
                strokeWidth="2"
                className="text-border"
                markerEnd="url(#arrowhead)"
              />
            </g>
          )
        })}

        {/* Arrow marker definition */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="currentColor" className="text-border" />
          </marker>
        </defs>

        {/* Draw nodes */}
        {codeFlow.nodes.map((node, index) => {
          const yPos = 50 + index * 100
          const isError = errorLineNumber === node.lineNumber

          return (
            <g key={node.id}>
              {/* Node background */}
              <rect
                x={50}
                y={yPos}
                width={200}
                height={40}
                rx={6}
                className={`${
                  nodeTypeColors[node.type] || "fill-gray-500/20 stroke-gray-400"
                } stroke-2 transition-all ${isError ? "filter drop-shadow-lg" : ""}`}
                style={{
                  opacity: isError ? 1 : 0.8,
                }}
              />

              {/* Error highlight */}
              {isError && (
                <rect
                  x={45}
                  y={yPos - 5}
                  width={210}
                  height={50}
                  rx={8}
                  className="fill-none stroke-red-500 stroke-2"
                  strokeDasharray="5,5"
                />
              )}

              {/* Node type badge */}
              <rect x={55} y={yPos + 3} width={50} height={14} rx={2} className="fill-background" />
              <text
                x={80}
                y={yPos + 12}
                className="text-xs font-semibold text-foreground text-center"
                textAnchor="middle"
              >
                {nodeTypeLabels[node.type] || node.type}
              </text>

              {/* Node label */}
              <text
                x={155}
                y={yPos + 28}
                className="text-xs text-foreground"
                textAnchor="middle"
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxWidth: "180px",
                }}
              >
                {node.label.length > 25 ? node.label.substring(0, 22) + "..." : node.label}
              </text>

              {/* Line number */}
              {node.lineNumber && (
                <text x={250} y={yPos + 25} className="text-xs text-muted-foreground">
                  Line {node.lineNumber}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
