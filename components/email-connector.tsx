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
    deleteConnector,

    // Compose actions
    handleComposeDataChange,
    handleComposeCancel,
    handleComposeSend,
    handleActionClick,
  } = useEmailConnector()

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Only handle canvas clicks for closing context menus or other UI interactions
      // Action nodes should only be created through connector dragging
      if (contextMenu) {
        closeContextMenu()
      }
    },
    [contextMenu, closeContextMenu]
  )

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full cursor-crosshair overflow-hidden"
      style={{ backgroundColor: "#15171B" }}
      onClick={handleCanvasClick}
    >
      {/* Welcome Screen */}
      {!appStarted && (
        <WelcomeScreen emails={emails} onStart={() => setAppStarted(true)} />
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

          {/* Preview Action Node during connector creation */}
          {isCreatingConnector && currentConnector && (
            <div
              className="absolute z-30 pointer-events-none"
              style={{
                left: currentConnector.currentX - 150,
                top: currentConnector.currentY - 25,
              }}
            >
              <div className="relative">
                <div className="flex w-80 items-center gap-2 rounded-lg border-2 border-gray-600 bg-gray-800 px-3 py-2 shadow-lg opacity-70">
                  <div className="h-4 w-4 text-gray-400">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search actions..."
                    value=""
                    readOnly
                    className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
