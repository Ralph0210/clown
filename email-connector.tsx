"use client"

import React, { useCallback } from "react"
import { EmailCard } from "@/components/email/EmailCard"
import { ConnectorSystem } from "@/components/connector/ConnectorSystem"
import { ActionNode } from "@/components/action/ActionNode"
import { FilterChips } from "@/components/ui/FilterChips"
import { WelcomeScreen } from "@/components/ui/WelcomeScreen"
import { useEmailConnector } from "@/hooks/useEmailConnector"

export default function EmailConnector() {
  const {
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
  } = useEmailConnector()

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Don't create action patch if dragging is happening
    if (isCanvasDragging || isDragging || isCreatingConnector || draggedActionNode) {
      return;
    }

    // Don't create action patch if a drag just ended (within 100ms)
    const timeSinceDragEnd = Date.now() - dragEndTime;
    if (timeSinceDragEnd < 100) {
      return;
    }

    // Don't create action patch if clicking on existing elements
    if (e.target instanceof HTMLElement && 
        (e.target.closest('.action-dropdown') || 
         e.target.closest('input') || 
         e.target.closest('.connector-handle') ||
         e.target.closest('[data-email]') ||
         e.target.closest('button'))) {
      return;
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newConnector = {
        id: Date.now().toString(),
        fromEmailId: "", // No email connection
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        text: "",
        actionNodePosition: { x, y },
        state: 'active' as const,
        type: 'compose' as const,
        label: 'Connect'
      }

      addConnector(newConnector)
    }
  }, [isCanvasDragging, isDragging, isCreatingConnector, draggedActionNode, dragEndTime, containerRef, addConnector])

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full cursor-crosshair overflow-hidden"
      style={{ backgroundColor: '#15171B' }}
      onClick={handleCanvasClick}
    >
      {/* Welcome Screen */}
      {!appStarted && (
        <WelcomeScreen 
          emails={emails} 
          onStart={() => setAppStarted(true)} 
        />
      )}

      {/* Main Interface */}
      {appStarted && (
        <>
          {/* Filter Chips */}
          <FilterChips 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />

          {/* Emails */}
          {filteredEmails.map((email) => (
            <EmailCard
              key={email.id}
              email={email}
              isDragging={draggedEmail === email.id}
              onMouseDown={handleEmailMouseDown}
              onConnectorStart={handleConnectorStart}
              onToggleMinimize={toggleEmailMinimize}
              onContextMenu={openContextMenu}
              contextMenu={contextMenu}
              onStarEmail={starEmail}
              onToggleRead={toggleEmailRead}
              onDeleteEmail={deleteEmail}
              onCloseContextMenu={closeContextMenu}
            />
          ))}

          {/* Connector System */}
          <ConnectorSystem 
            connectors={connectors} 
            currentConnector={currentConnector} 
          />

          {/* Action Nodes */}
          {connectors.map((connector) => (
            <ActionNode
              key={connector.id}
              connector={connector}
              composeMode={composeMode}
              composeData={composeData}
              searchQuery={searchQuery}
              filteredActions={filteredActions}
              onMouseDown={handleActionNodeMouseDown}
              onSearchChange={setSearchQuery}
              onActionClick={handleActionClick}
              onComposeDataChange={handleComposeDataChange}
              onComposeCancel={handleComposeCancel}
              onComposeSend={handleComposeSend}
              onDeleteConnector={deleteConnector}
            />
          ))}
        </>
      )}
    </div>
  )
}
