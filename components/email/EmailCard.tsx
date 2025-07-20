"use client"

import React from "react"
import { Star, ChevronDown, Mail, Trash2 } from "lucide-react"
import { Email } from "@/types/email"

interface EmailCardProps {
  email: Email
  isDragging: boolean
  onMouseDown: (e: React.MouseEvent, emailId: string) => void
  onConnectorStart: (e: React.MouseEvent, emailId: string) => void
  onToggleMinimize: (emailId: string) => void
  onContextMenu: (e: React.MouseEvent, emailId: string) => void
  contextMenu: { emailId: string; x: number; y: number } | null
  onStarEmail: (emailId: string) => void
  onToggleRead: (emailId: string) => void
  onDeleteEmail: (emailId: string) => void
  onCloseContextMenu: () => void
}

export function EmailCard({
  email,
  isDragging,
  onMouseDown,
  onConnectorStart,
  onToggleMinimize,
  onContextMenu,
  contextMenu,
  onStarEmail,
  onToggleRead,
  onDeleteEmail,
  onCloseContextMenu,
}: EmailCardProps) {
  return (
    <div
      data-email={email.id}
      className={`absolute cursor-move select-none transition-shadow duration-200 hover:shadow-lg ${
        isDragging ? "z-50" : ""
      }`}
      style={{
        left: email.position.x,
        top: email.position.y,
        zIndex: email.zIndex,
      }}
      onMouseDown={(e) => onMouseDown(e, email.id)}
    >
      <div 
        className={`relative w-80 rounded-lg border-2 p-4 shadow-md ${
          email.isStarred 
            ? "border-yellow-400" 
            : email.isRead 
              ? "border-green-500" 
              : "border-purple-300"
        }`}
        style={{ backgroundColor: '#141414' }}
      >
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <h3 className="font-semibold text-white">{email.sender}</h3>
          <button 
            className="text-white hover:text-gray-300 transition-transform duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onToggleMinimize(email.id)
            }}
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${email.isMinimized ? '' : 'rotate-180'}`} />
          </button>
        </div>
        
        {/* Subject */}
        <h4 className="mb-2 font-semibold text-white">{email.subject}</h4>
        
        {/* Message Preview - Only show when not minimized */}
        {!email.isMinimized && (
          <p className="mb-4 text-sm text-gray-300 leading-relaxed">
            {email.preview}...
          </p>
        )}
        
        {/* Footer with Unread Badge - Always show */}
        <div className="flex justify-end">
          <div className="relative group">
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                email.isRead
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onContextMenu={(e) => onContextMenu(e, email.id)}
            >
              {email.isRead ? "Read" : "Unread"}
            </button>
            
            {/* Context Menu */}
            {contextMenu?.emailId === email.id && (
              <div
                className="absolute right-0 top-full mt-1 z-50 min-w-32 rounded-md border border-gray-600 bg-gray-800 p-1 shadow-lg"
                style={{
                  left: contextMenu.x,
                  top: contextMenu.y,
                }}
              >
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    onStarEmail(email.id)
                    onCloseContextMenu()
                  }}
                >
                  <Star className={`h-3 w-3 ${email.isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  Star
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => {
                    onToggleRead(email.id)
                    onCloseContextMenu()
                  }}
                >
                  <Mail className="h-3 w-3" />
                  {email.isRead ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-red-400 hover:bg-gray-700"
                  onClick={() => {
                    onDeleteEmail(email.id)
                    onCloseContextMenu()
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Connector Handle */}
        <div
          className="connector-handle absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 cursor-crosshair rounded-full border-2 border-blue-500 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-110 shadow-lg"
          onMouseDown={(e) => onConnectorStart(e, email.id)}
          title="Drag to create connector"
        />
      </div>
    </div>
  )
} 