"use client"

import React from "react"
import { FilterType } from "@/types/email"

interface FilterChipsProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  const filters = [
    { id: 'all' as const, label: 'All', color: 'blue' },
    { id: 'unread' as const, label: 'Unread', color: 'purple' },
    { id: 'read' as const, label: 'Read', color: 'green' },
    { id: 'starred' as const, label: 'Starred', color: 'yellow' },
  ]

  return (
    <div className="absolute left-[60px] top-[60px] z-40 flex gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? `bg-${filter.color}-600 text-white`
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
} 