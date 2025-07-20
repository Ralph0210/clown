"use client"

import React from "react"
import { Connector } from "@/types/email"

interface ConnectorSystemProps {
  connectors: Connector[]
  currentConnector: {
    fromEmailId: string
    startX: number
    startY: number
    currentX: number
    currentY: number
  } | null
}

// Function to create curved path
const createCurvedPath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const dx = endX - startX
  const dy = endY - startY

  // Calculate the distance for control points
  const distance = Math.sqrt(dx * dx + dy * dy)
  const controlDistance = Math.min(distance * 0.4, 100) // Limit control point distance

  // Create smooth Bézier curve with proper control points
  const controlX1 = startX + controlDistance
  const controlY1 = startY
  const controlX2 = endX - controlDistance
  const controlY2 = endY

  return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
}

// Function to get connector styling based on state and type
const getConnectorStyle = (connector: Connector) => {
  const baseStyle = {
    stroke: "#1751CF",
    strokeWidth: "2",
    fill: "none",
  }

  switch (connector.state) {
    case "pending":
      return {
        ...baseStyle,
        strokeDasharray: "5,5",
        stroke: "#FFA500", // Orange for pending
      }
    case "completed":
      return {
        ...baseStyle,
        stroke: "#10B981", // Green for completed
      }
    case "error":
      return {
        ...baseStyle,
        stroke: "#EF4444", // Red for error
        strokeDasharray: "3,3",
      }
    default:
      return baseStyle
  }
}

// Function to get connector label position
const getConnectorLabelPosition = (
  startX: number,
  startY: number,
  endX: number,
  endY: number
) => {
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  return { x: midX, y: midY }
}

export function ConnectorSystem({
  connectors,
  currentConnector,
}: ConnectorSystemProps) {
  console.log("ConnectorSystem render - connectors:", connectors)
  console.log("ConnectorSystem render - currentConnector:", currentConnector)

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 999 }}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {/* Existing connectors */}
      {connectors.map((connector) => {
        console.log("Rendering connector:", connector)
        const style = getConnectorStyle(connector)
        const labelPos = getConnectorLabelPosition(
          connector.startX,
          connector.startY,
          connector.actionNodePosition?.x ?? connector.endX,
          connector.actionNodePosition?.y ?? connector.endY
        )

        const pathData = createCurvedPath(
          connector.startX,
          connector.startY,
          connector.actionNodePosition?.x ?? connector.endX,
          connector.actionNodePosition?.y ?? connector.endY
        )
        console.log("Path data:", pathData)

        return (
          <g key={connector.id}>
            {/* Draw connector line for all connectors */}
            <path
              d={createCurvedPath(
                connector.startX,
                connector.startY,
                connector.endX,
                connector.endY
              )}
              {...style}
            />

            {/* Blue dot at the connection point */}
            <circle
              cx={connector.endX}
              cy={connector.endY}
              r="4"
              fill="#1751CF"
              stroke="#15171B"
              strokeWidth="1"
            />
          </g>
        )
      })}

      {/* Current connector being drawn */}
      {currentConnector && (
        <g>
          <path
            d={createCurvedPath(
              currentConnector.startX,
              currentConnector.startY,
              currentConnector.currentX,
              currentConnector.currentY
            )}
            stroke="#1751CF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.7"
          />
        </g>
      )}

      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  )
}
