export interface Email {
  id: string
  sender: string
  subject: string
  preview: string
  isRead: boolean
  isStarred: boolean
  isMinimized: boolean
  position: { x: number; y: number }
  zIndex: number
}

export interface Connector {
  id: string
  fromEmailId: string
  startX: number
  startY: number
  endX: number
  endY: number
  text: string
  actionNodePosition?: { x: number; y: number }
  state?: "active" | "pending" | "completed" | "error"
  type?: "compose" | "send" | "forward" | "reply" | "share" | "report"
  label?: string
  startOffsetX?: number
  startOffsetY?: number
  toEmailId?: string // Track which email the connector ends at
}

export type FilterType = "all" | "read" | "unread" | "starred"

export interface ComposeData {
  subject: string
  recipient: string
  content: string
}

export interface Action {
  id: string
  label: string
  icon: any
}
