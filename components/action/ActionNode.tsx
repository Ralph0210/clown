"use client"

import React from "react"
import { X, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Connector, Email, Action } from "@/types/email"

interface ActionNodeProps {
  connector: Connector
  composeMode: string | null
  composeData: { subject: string; recipient: string; content: string }
  searchQuery: string
  filteredActions: Action[]
  onMouseDown: (e: React.MouseEvent, connectorId: string) => void
  onSearchChange: (value: string) => void
  onActionClick: (actionId: string, connectorId: string) => void
  onComposeDataChange: (field: string, value: string) => void
  onComposeCancel: () => void
  onComposeSend: (connectorId: string, actionNode: { x: number; y: number }) => void
  onDeleteConnector: (connectorId: string) => void
}

export function ActionNode({
  connector,
  composeMode,
  composeData,
  searchQuery,
  filteredActions,
  onMouseDown,
  onSearchChange,
  onActionClick,
  onComposeDataChange,
  onComposeCancel,
  onComposeSend,
  onDeleteConnector,
}: ActionNodeProps) {
  const actionNode = connector.actionNodePosition
  if (!actionNode) return null

  return (
    <div
      className="absolute z-30"
      style={{
        left: actionNode.x - 150,
        top: actionNode.y - 25,
      }}
      onMouseDown={(e) => onMouseDown(e, connector.id)}
    >
      {composeMode === connector.id ? (
        // Compose Interface
        <div className="w-80 rounded-lg border-2 border-blue-500 bg-gray-800 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Compose Email</h3>
            <button
              className="text-gray-400 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                onComposeCancel()
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">To:</label>
              <Input
                value={composeData.recipient}
                onChange={(e) => {
                  e.stopPropagation()
                  onComposeDataChange('recipient', e.target.value)
                }}
                placeholder="Recipient email"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subject:</label>
              <Input
                value={composeData.subject}
                onChange={(e) => {
                  e.stopPropagation()
                  onComposeDataChange('subject', e.target.value)
                }}
                placeholder="Email subject"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
              <textarea
                value={composeData.content}
                onChange={(e) => {
                  e.stopPropagation()
                  onComposeDataChange('content', e.target.value)
                }}
                placeholder="Type your message here..."
                rows={4}
                className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500"
                onClick={(e) => {
                  e.stopPropagation()
                  onComposeCancel()
                }}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation()
                  if (composeData.recipient && composeData.subject && composeData.content) {
                    onComposeSend(connector.id, actionNode)
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Search Action Patch
        <div className="relative">
          <div className="flex w-80 items-center gap-2 rounded-lg border-2 border-gray-600 bg-gray-800 px-3 py-2 shadow-lg">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => {
                e.stopPropagation()
                onSearchChange(e.target.value)
              }}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
              onMouseDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.target.select()}
            />
          </div>
          
          {searchQuery && (
            <div className="action-dropdown absolute left-0 right-0 top-full mt-1 z-50 rounded-md border border-gray-600 bg-gray-800 p-1 shadow-lg">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    onActionClick(action.id, connector.id)
                  }}
                >
                  <action.icon className="h-3 w-3" />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Delete Button */}
      <button
        className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation()
          onDeleteConnector(connector.id)
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
} 