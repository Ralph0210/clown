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
const createCurvedPath = (startX: number, startY: number, endX: number, endY: number) => {
  const dx = endX - startX
  const dy = endY - startY
  const controlX1 = startX + dx * 0.5
  const controlY1 = startY + dy * 0.5
  const controlX2 = startX + dx * 0.5
  const controlY2 = endY

  return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`
}

// Function to get connector styling based on state and type
const getConnectorStyle = (connector: Connector) => {
  const baseStyle = {
    stroke: '#1751CF',
    strokeWidth: '2',
    fill: 'none',
  }

  switch (connector.state) {
    case 'pending':
      return {
        ...baseStyle,
        strokeDasharray: '5,5',
        stroke: '#FFA500', // Orange for pending
      }
    case 'completed':
      return {
        ...baseStyle,
        stroke: '#10B981', // Green for completed
      }
    case 'error':
      return {
        ...baseStyle,
        stroke: '#EF4444', // Red for error
        strokeDasharray: '3,3',
      }
    default:
      return baseStyle
  }
}

// Function to get connector label position
const getConnectorLabelPosition = (startX: number, startY: number, endX: number, endY: number) => {
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  return { x: midX, y: midY }
}

export function ConnectorSystem({ connectors, currentConnector }: ConnectorSystemProps) {
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 999 }}>
      {/* Existing connectors */}
      {connectors.map((connector) => {
        const style = getConnectorStyle(connector)
        const labelPos = getConnectorLabelPosition(
          connector.startX,
          connector.startY,
          connector.actionNodePosition?.x ?? connector.endX,
          connector.actionNodePosition?.y ?? connector.endY
        )
        
        return (
          <g key={connector.id}>
            {/* Draw connector line for all connectors */}
            <path
              d={createCurvedPath(
                connector.startX,
                connector.startY,
                connector.actionNodePosition?.x ?? connector.endX,
                connector.actionNodePosition?.y ?? connector.endY,
              )}
              {...style}
              markerEnd="url(#arrowhead)"
            />
            
            {/* Show start circle for all connectors */}
            <circle 
              cx={connector.startX} 
              cy={connector.startY} 
              r="4" 
              fill={style.stroke}
              stroke="#15171B"
              strokeWidth="1"
            />
            
            {/* Always show end circle */}
            <circle 
              cx={connector.actionNodePosition?.x ?? connector.endX} 
              cy={connector.actionNodePosition?.y ?? connector.endY} 
              r="4" 
              fill={style.stroke}
              stroke="#15171B"
              strokeWidth="1"
            />
            
            {/* Connector label */}
            {(connector.label || connector.type) && (
              <g>
                {/* Label background */}
                <rect
                  x={labelPos.x - 30}
                  y={labelPos.y - 12}
                  width="60"
                  height="24"
                  rx="12"
                  fill="#15171B"
                  stroke={style.stroke}
                  strokeWidth="1"
                  opacity="0.9"
                />
                {/* Label text */}
                <text
                  x={labelPos.x}
                  y={labelPos.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="500"
                  className="select-none"
                >
                  {connector.label || connector.type}
                </text>
              </g>
            )}
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
              currentConnector.currentY,
            )}
            stroke="#1751CF"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.7"
          />
          <circle 
            cx={currentConnector.startX} 
            cy={currentConnector.startY} 
            r="4" 
            fill="#1751CF"
            stroke="#15171B"
            strokeWidth="1"
          />
        </g>
      )}

      {/* Arrow marker definition */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  )
} 