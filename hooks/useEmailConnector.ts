"use client"

import { useState, useRef, useCallback } from "react"
import { Email, Connector, FilterType, ComposeData, Action } from "@/types/email"
import { Send, Forward, Reply, Share, Flag } from "lucide-react"
import React from "react"

export function useEmailConnector() {
  // State
  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      sender: "Alice Cooper",
      subject: "Budget Approval Request",
      preview: "I need your approval for the budget allocation for the new project. Please review the attached documents and let me know if you have any questions",
      isRead: false,
      isStarred: false,
      isMinimized: false,
      position: { x: 50, y: 100 },
      zIndex: 1,
    },
    {
      id: "2",
      sender: "Bob Wilson",
      subject: "Team Meeting Tomorrow",
      preview: "Hi team, just a reminder that we have our weekly meeting tomorrow at 10 AM. Please prepare your updates and join on time",
      isRead: true,
      isStarred: false,
      isMinimized: false,
      position: { x: 50, y: 250 },
      zIndex: 2,
    },
    {
      id: "3",
      sender: "Carol Davis",
      subject: "Project Update - Q4 Goals",
      preview: "Here's the latest update on our Q4 goals. We're making good progress on most fronts, but there are a few areas that need attention",
      isRead: false,
      isStarred: true,
      isMinimized: false,
      position: { x: 50, y: 400 },
      zIndex: 3,
    },
    {
      id: "4",
      sender: "David Miller",
      subject: "Client Feedback Summary",
      preview: "I've compiled the client feedback from our recent survey. The results are quite positive overall, with some valuable insights for improvement",
      isRead: true,
      isStarred: false,
      isMinimized: false,
      position: { x: 50, y: 550 },
      zIndex: 4,
    },
    {
      id: "5",
      sender: "Eva Thompson",
      subject: "New Feature Launch",
      preview: "Great news! Our new feature is ready for launch. The development team has completed all testing and we're good to go live next week",
      isRead: false,
      isStarred: false,
      isMinimized: false,
      position: { x: 50, y: 700 },
      zIndex: 5,
    },
  ])

  const [connectors, setConnectors] = useState<Connector[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [draggedEmail, setDraggedEmail] = useState<string | null>(null)
  const [isCreatingConnector, setIsCreatingConnector] = useState(false)
  const [currentConnector, setCurrentConnector] = useState<{
    fromEmailId: string
    startX: number
    startY: number
    currentX: number
    currentY: number
  } | null>(null)
  const [contextMenu, setContextMenu] = useState<{ emailId: string; x: number; y: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedActionNode, setDraggedActionNode] = useState<string | null>(null)
  const [composeMode, setComposeMode] = useState<string | null>(null)
  const [composeData, setComposeData] = useState<ComposeData>({
    subject: "",
    recipient: "",
    content: ""
  })
  const [composeConnectorId, setComposeConnectorId] = useState<string | null>(null)
  const [appStarted, setAppStarted] = useState(false)
  const [isCanvasDragging, setIsCanvasDragging] = useState(false)
  const [dragEndTime, setDragEndTime] = useState(0)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Refs
  const actionNodeDragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Constants
  const actions: Action[] = [
    { id: "compose", label: "Compose", icon: Send },
    { id: "send", label: "Send", icon: Send },
    { id: "forward", label: "Forward", icon: Forward },
    { id: "reply", label: "Reply", icon: Reply },
    { id: "share", label: "Share", icon: Share },
    { id: "report", label: "Report", icon: Flag },
  ]

  // Computed values
  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredEmails = emails.filter(email => {
    switch (activeFilter) {
      case 'read':
        return email.isRead
      case 'unread':
        return !email.isRead
      case 'starred':
        return email.isStarred
      default:
        return true
    }
  })

  // Event handlers
  const handleEmailMouseDown = useCallback(
    (e: React.MouseEvent, emailId: string) => {
      if (e.target instanceof HTMLElement && e.target.closest(".connector-handle")) {
        return
      }

      e.preventDefault()
      setIsDragging(true)
      setIsCanvasDragging(true)
      setDraggedEmail(emailId)

      const email = emails.find((e) => e.id === emailId)
      if (email && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        dragOffset.current = {
          x: e.clientX - rect.left - email.position.x,
          y: e.clientY - rect.top - email.position.y,
        }

        setEmails((prev) =>
          prev.map((em) => (em.id === emailId ? { ...em, zIndex: Math.max(...prev.map((e) => e.zIndex)) + 1 } : em)),
        )
      }
    },
    [emails],
  )

  const handleConnectorStart = useCallback((e: React.MouseEvent, emailId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const startX = e.clientX - rect.left
      const startY = e.clientY - rect.top

      setIsCreatingConnector(true)
      setIsCanvasDragging(true)
      setCurrentConnector({
        fromEmailId: emailId,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
      })
    }
  }, [])

  const handleActionNodeMouseDown = useCallback((e: React.MouseEvent, connectorId: string) => {
    if (e.target instanceof HTMLElement && 
        (e.target.closest('input') || e.target.closest('.action-dropdown'))) {
      return;
    }
    
    e.preventDefault()
    setDraggedActionNode(connectorId)
    setIsCanvasDragging(true)
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      actionNodeDragOffset.current = {
        x: e.clientX - rect.left - (connector.actionNodePosition?.x ?? connector.endX),
        y: e.clientY - rect.top - (connector.actionNodePosition?.y ?? connector.endY),
      }
    }
  }, [connectors])

  // Email actions
  const toggleEmailMinimize = useCallback((emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId ? { ...e, isMinimized: !e.isMinimized } : e,
      ),
    )
  }, [])

  const starEmail = useCallback((emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId ? { ...e, isStarred: !e.isStarred } : e,
      ),
    )
  }, [])

  const toggleEmailRead = useCallback((emailId: string) => {
    setEmails((prev) =>
      prev.map((e) =>
        e.id === emailId ? { ...e, isRead: !e.isRead } : e,
      ),
    )
  }, [])

  const deleteEmail = useCallback((emailId: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId))
  }, [])

  const openContextMenu = useCallback((e: React.MouseEvent, emailId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      emailId: emailId,
    })
  }, [])

  const closeContextMenu = useCallback(() => {
    setContextMenu(null)
  }, [])

  // Connector actions
  const updateConnectorState = useCallback((connectorId: string, state: 'active' | 'pending' | 'completed' | 'error') => {
    setConnectors(prev => prev.map(c => 
      c.id === connectorId ? { ...c, state } : c
    ))
  }, [])

  const addConnector = useCallback((connector: Connector) => {
    setConnectors(prev => [...prev, connector])
    
    if (connector.type === 'send') {
      setTimeout(() => {
        updateConnectorState(connector.id, 'completed')
      }, 1000)
    }
  }, [updateConnectorState])

  const deleteConnector = useCallback((connectorId: string) => {
    setConnectors((prev) => prev.filter((c) => c.id !== connectorId))
    if (composeMode === connectorId) {
      setComposeMode(null)
      setComposeConnectorId(null)
      setComposeData({ subject: "", recipient: "", content: "" })
    }
  }, [composeMode])

  // Compose actions
  const handleComposeDataChange = useCallback((field: string, value: string) => {
    setComposeData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleComposeCancel = useCallback(() => {
    setComposeMode(null)
    setComposeConnectorId(null)
    setComposeData({ subject: "", recipient: "", content: "" })
  }, [])

  const handleComposeSend = useCallback((connectorId: string, actionNode: { x: number; y: number }) => {
    if (composeData.recipient && composeData.subject && composeData.content) {
      const newEmail: Email = {
        id: Date.now().toString(),
        sender: "You",
        subject: composeData.subject,
        preview: composeData.content.substring(0, 100),
        isRead: false,
        isStarred: false,
        isMinimized: false,
        position: { 
          x: actionNode.x + 50, 
          y: actionNode.y 
        },
        zIndex: Math.max(...emails.map(e => e.zIndex)) + 1,
      }
      
      setEmails(prev => [...prev, newEmail])
      
      const composeConnector: Connector = {
        id: Date.now().toString() + '-send',
        fromEmailId: connectorId,
        startX: actionNode.x,
        startY: actionNode.y,
        endX: newEmail.position.x,
        endY: newEmail.position.y + 50,
        text: "Send",
        state: 'completed',
        type: 'send',
        label: 'Sent'
      }
      setConnectors(prev => [...prev, composeConnector])
      
      setConnectors(prev => prev.map(c => 
        c.id === connectorId 
          ? { ...c, state: 'completed', label: 'Composed' }
          : c
      ))
      
      handleComposeCancel()
      deleteConnector(connectorId)
    }
  }, [composeData, emails, handleComposeCancel, deleteConnector])

  const handleActionClick = useCallback((actionId: string, connectorId: string) => {
    if (actionId === 'compose') {
      setComposeMode(connectorId)
      setComposeConnectorId(connectorId)
      
      const connector = connectors.find(c => c.id === connectorId)
      if (connector?.fromEmailId && connector.actionNodePosition) {
        const sourceEmail = emails.find(e => e.id === connector.fromEmailId)
        if (sourceEmail) {
          const newConnector: Connector = {
            id: Date.now().toString() + '-compose',
            fromEmailId: connector.fromEmailId,
            startX: sourceEmail.position.x + 320,
            startY: sourceEmail.position.y + 50,
            endX: connector.actionNodePosition.x,
            endY: connector.actionNodePosition.y,
            text: "Compose",
            state: 'active',
            type: 'compose',
            label: 'Compose'
          }
          setConnectors(prev => [...prev, newConnector])
        }
      }
    }
    setSearchQuery("")
  }, [connectors, emails])

  // Close context menu on click outside
  React.useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, [contextMenu]);

  // Global mouse event listeners for dragging
  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && draggedEmail && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - dragOffset.current.x
        const newY = e.clientY - rect.top - dragOffset.current.y

        setEmails((prev) =>
          prev.map((email) => (email.id === draggedEmail ? { ...email, position: { x: newX, y: newY } } : email)),
        )
      }

      if (isCreatingConnector && currentConnector && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCurrentConnector((prev) =>
          prev
            ? {
                ...prev,
                currentX: e.clientX - rect.left,
                currentY: e.clientY - rect.top,
              }
            : null,
        )
      }

      if (draggedActionNode && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const newX = e.clientX - rect.left - actionNodeDragOffset.current.x
        const newY = e.clientY - rect.top - actionNodeDragOffset.current.y
        setConnectors((prev) =>
          prev.map((c) =>
            c.id === draggedActionNode
              ? { ...c, actionNodePosition: { x: newX, y: newY }, endX: newX, endY: newY }
              : c,
          ),
        )
      }
    }

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        setIsDragging(false)
        setIsCanvasDragging(false)
        setDraggedEmail(null)
        setDragEndTime(Date.now())
      }

      if (isCreatingConnector && currentConnector && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const endX = e.clientX - rect.left
        const endY = e.clientY - rect.top

        const newConnector: Connector = {
          id: Date.now().toString(),
          fromEmailId: currentConnector.fromEmailId,
          startX: currentConnector.startX,
          startY: currentConnector.startY,
          endX,
          endY,
          text: "",
          actionNodePosition: { x: endX, y: endY },
          state: 'active',
          type: 'compose',
          label: 'Connect'
        }

        setConnectors((prev) => [...prev, newConnector])
        setIsCreatingConnector(false)
        setIsCanvasDragging(false)
        setCurrentConnector(null)
        setDragEndTime(Date.now())
      }

      if (draggedActionNode) {
        setDraggedActionNode(null)
        setIsCanvasDragging(false)
        setDragEndTime(Date.now())
      }
    }

    // Add global listeners
    window.addEventListener('mousemove', handleGlobalMouseMove)
    window.addEventListener('mouseup', handleGlobalMouseUp)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
      window.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [isDragging, draggedEmail, isCreatingConnector, currentConnector, draggedActionNode])

  return {
    // State
    emails,
    connectors,
    isDragging,
    draggedEmail,
    isCreatingConnector,
    currentConnector,
    contextMenu,
    searchQuery,
    draggedActionNode,
    composeMode,
    composeData,
    composeConnectorId,
    appStarted,
    isCanvasDragging,
    dragEndTime,
    activeFilter,
    filteredEmails,
    filteredActions,
    actions,
    containerRef,
    
    // Actions
    setAppStarted,
    setActiveFilter,
    setSearchQuery,
    setComposeMode,
    setComposeConnectorId,
    setComposeData,
    
    // Event handlers
    handleEmailMouseDown,
    handleConnectorStart,
    handleActionNodeMouseDown,
    
    // Email actions
    toggleEmailMinimize,
    starEmail,
    toggleEmailRead,
    deleteEmail,
    openContextMenu,
    closeContextMenu,
    
    // Connector actions
    updateConnectorState,
    addConnector,
    deleteConnector,
    
    // Compose actions
    handleComposeDataChange,
    handleComposeCancel,
    handleComposeSend,
    handleActionClick,
  }
} 