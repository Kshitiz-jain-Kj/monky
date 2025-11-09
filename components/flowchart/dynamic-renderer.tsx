"use client"

import { useState } from "react"
import type { CodeFlowchart, FlowchartNode, FlowchartEdge } from "@/lib/types/flowchart"

interface DynamicFlowchartRendererProps {
  flowchart: CodeFlowchart
  height?: string
  showSteps?: boolean
}

const getNodeColor = (type: FlowchartNode["type"], customColor?: { fill: string; stroke: string }) => {
  const colors = {
    start: { fill: "#10b981", stroke: "#059669" },
    end: { fill: "#10b981", stroke: "#059669" },
    process: { fill: "#3b82f6", stroke: "#1e40af" },
    decision: { fill: "#f59e0b", stroke: "#d97706" },
    error: { fill: "#ef4444", stroke: "#dc2626" },
  }
  return customColor || colors[type]
}

function formatTextForNode(label: string, maxCharsPerLine = 20): string[] {
  return label.split("\n").flatMap((line) => {
    const words = line.split(" ")
    const result = []
    let current = ""
    for (const word of words) {
      if ((current + " " + word).trim().length > maxCharsPerLine) {
        if (current) result.push(current.trim())
        current = word
      } else {
        current = current ? current + " " + word : word
      }
    }
    if (current) result.push(current.trim())
    return result
  })
}

function renderNode(node: FlowchartNode, yOffset: number, isHighlighted: boolean) {
  const colors = getNodeColor(node.type, node.color)
  const isDecision = node.type === "decision"
  const strokeWidth = isHighlighted ? 4 : 2
  const opacity = isHighlighted ? 1 : 0.8
  const textLines = formatTextForNode(node.label, 18)

  if (isDecision) {
    return (
      <g key={node.id} opacity={opacity}>
        <polygon
          points={`${node.position.x},${yOffset + 30} ${node.position.x + 60},${yOffset + 70} ${node.position.x},${yOffset + 110} ${node.position.x - 60},${yOffset + 70}`}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
        />
        {textLines.map((line, idx) => (
          <text
            key={idx}
            x={node.position.x}
            y={yOffset + 65 + idx * 14}
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {line}
          </text>
        ))}
      </g>
    )
  }

  if (node.type === "start" || node.type === "end") {
    return (
      <g key={node.id} opacity={opacity}>
        <ellipse
          cx={node.position.x}
          cy={yOffset + node.size.height / 2}
          rx={node.size.width / 2}
          ry={node.size.height / 2}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
        />
        <text
          x={node.position.x}
          y={yOffset + node.size.height / 2 + 5}
          textAnchor="middle"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          fontFamily="monospace"
        >
          {node.label}
        </text>
      </g>
    )
  }

  const lineHeight = 12
  const padding = 10
  const nodeHeight = Math.max(50, textLines.length * lineHeight + padding * 2)

  return (
    <g key={node.id} opacity={opacity}>
      <rect
        x={node.position.x - node.size.width / 2}
        y={yOffset}
        width={node.size.width}
        height={nodeHeight}
        rx="4"
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={strokeWidth}
      />
      {textLines.map((line, idx) => (
        <text
          key={idx}
          x={node.position.x}
          y={yOffset + padding + (idx + 1) * lineHeight - 2}
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontFamily="monospace"
          fontWeight="500"
        >
          {line}
        </text>
      ))}
    </g>
  )
}

function renderEdge(edge: FlowchartEdge, nodes: FlowchartNode[], yOffset: number) {
  const fromNode = nodes.find((n) => n.id === edge.from)
  const toNode = nodes.find((n) => n.id === edge.to)

  if (!fromNode || !toNode) return null

  const edgeColor = edge.color || "#6366f1"
  const isYes = edge.label?.toLowerCase() === "yes"
  const isNo = edge.label?.toLowerCase() === "no"

  return (
    <g key={edge.id}>
      <line
        x1={fromNode.position.x}
        y1={yOffset + 80}
        x2={toNode.position.x}
        y2={yOffset + toNode.position.y - fromNode.position.y + 10}
        stroke={edgeColor}
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${isYes ? "yes" : isNo ? "no" : "default"})`}
      />
      {edge.label && (
        <text
          x={fromNode.position.x + (toNode.position.x - fromNode.position.x) / 2 + 15}
          y={yOffset + 40 + (toNode.position.y - fromNode.position.y) / 2}
          fontSize="10"
          fill={edgeColor}
          fontWeight="bold"
          fontFamily="monospace"
          className={isYes ? "text-green-400" : isNo ? "text-red-400" : ""}
        >
          {edge.label}
        </text>
      )}
    </g>
  )
}

export default function DynamicFlowchartRenderer({
  flowchart,
  height = "600px",
  showSteps = true,
}: DynamicFlowchartRendererProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const totalHeight = Math.max(700, flowchart.nodes.length * 100)
  const step = flowchart.executionSteps[currentStep]

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center flex-wrap">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
        >
          ← Previous
        </button>
        <span className="text-sm font-mono">
          Step {currentStep + 1} / {flowchart.executionSteps.length}
        </span>
        <button
          onClick={() => setCurrentStep(Math.min(flowchart.executionSteps.length - 1, currentStep + 1))}
          disabled={currentStep === flowchart.executionSteps.length - 1}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      <svg viewBox={`0 0 700 ${totalHeight}`} className="w-full border border-pop rounded bg-accent" style={{ height }}>
        <defs>
          <marker id="arrowhead-yes" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#22c55e" />
          </marker>
          <marker id="arrowhead-no" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
          </marker>
          <marker id="arrowhead-default" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#6366f1" />
          </marker>
        </defs>
        {flowchart.edges.map((edge) => renderEdge(edge, flowchart.nodes, 0))}
        {flowchart.nodes.map((node) =>
          renderNode(node, node.position.y, step?.activeNodes?.includes(node.id) ?? false),
        )}
      </svg>

      {showSteps && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Execution Steps</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {flowchart.executionSteps.map((execStep, idx) => (
                <div
                  key={execStep.stepNumber}
                  onClick={() => setCurrentStep(idx)}
                  className={`p-2 rounded text-xs font-mono border cursor-pointer transition ${
                    idx === currentStep
                      ? "bg-blue-950/50 border-blue-500 ring-2 ring-blue-400"
                      : execStep.status === "error"
                        ? "bg-red-950/30 border-red-500 hover:bg-red-950/40"
                        : "bg-background border-pop hover:bg-background/80"
                  }`}
                >
                  <span className="text-foreground/60">Step {execStep.stepNumber}:</span>{" "}
                  <span
                    className={
                      execStep.status === "error"
                        ? "text-red-400"
                        : idx <= currentStep
                          ? "text-green-400"
                          : "text-foreground"
                    }
                  >
                    {execStep.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Variables at Step {currentStep + 1}</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(step?.variables || {}).map(([name, value]) => (
                <div key={name} className="p-2 rounded text-xs border bg-blue-950/30 border-blue-500">
                  <span className="text-foreground/60">{name}:</span>{" "}
                  <span className="text-blue-400 font-mono">{String(value)}</span>
                </div>
              ))}
              {Object.keys(step?.variables || {}).length === 0 && (
                <div className="p-2 rounded text-xs text-foreground/50">No variables yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
