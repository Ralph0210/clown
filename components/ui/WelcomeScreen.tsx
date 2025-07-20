"use client"

import React from "react"
import { Email } from "@/types/email"

interface WelcomeScreenProps {
  emails: Email[]
  onStart: () => void
}

export function WelcomeScreen({ emails, onStart }: WelcomeScreenProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Envelope */}
      <div className="relative mb-10">
        {/* Envelope Icon */}
        <div className="w-32 h-24 rounded-lg shadow-lg relative cursor-pointer transform transition-transform hover:scale-105" style={{ backgroundColor: '#1751CF' }}>
          {/* Envelope flap */}
          <div className="absolute top-0 left-0 w-full h-0 border-l-16 border-r-16 border-b-12 border-transparent" style={{ borderBottomColor: '#1751CF' }}></div>
          {/* Envelope body */}
          <div className="absolute bottom-0 left-0 w-full h-12 rounded-b-lg" style={{ backgroundColor: '#1751CF' }}></div>
          {/* Envelope icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        </div>

        {/* Scaled-down emails that appear when envelope is clicked */}
        <div className="absolute top-0 left-0 w-32 h-24 pointer-events-none">
          {emails.slice(0, 3).map((email, index) => (
            <div
              key={email.id}
              className="absolute bg-white rounded shadow-sm border border-gray-200 transform scale-75 opacity-80"
              style={{
                left: index * 8,
                top: index * 6,
                width: '80px',
                height: '60px',
                zIndex: 10 - index,
              }}
            >
              <div className="p-1">
                <div className="text-xs font-semibold truncate">{email.sender}</div>
                <div className="text-xs text-gray-600 truncate">{email.subject}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="px-8 py-3 text-white font-semibold rounded-lg shadow-lg transform transition-all hover:scale-105"
        style={{ backgroundColor: '#1751CF' }}
      >
        Start
      </button>
    </div>
  )
} 