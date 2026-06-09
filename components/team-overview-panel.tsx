'use client'

import { useState } from 'react'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  role: string
  photo: string
  assigned: number
}

interface TeamOverviewPanelProps {
  selectedPerson: string | null
  onPersonSelect: (personName: string | null) => void
}

const teamMembers: TeamMember[] = [
  { id: 'sj', name: 'Sarah Johnson', role: 'L2 Support Engineer', photo: '/avatars/sarah.jpg', assigned: 18 },
  { id: 'mc', name: 'Michael Chen', role: 'L2 Support Engineer', photo: '/avatars/michael.jpg', assigned: 21 },
  { id: 'ew', name: 'Emma Williams', role: 'L1 Support Agent', photo: '/avatars/emma.jpg', assigned: 15 },
  { id: 'jr', name: 'James Rodriguez', role: 'L2 Support Engineer', photo: '/avatars/james.jpg', assigned: 25 },
  { id: 'om', name: 'Olivia Martinez', role: 'L1 Support Agent', photo: '/avatars/olivia.jpg', assigned: 19 },
]

export function TeamOverviewPanel({ selectedPerson, onPersonSelect }: TeamOverviewPanelProps) {
  // Calculate totals
  const totalWorkload = teamMembers.reduce((sum, m) => sum + m.assigned, 0)
  const openTickets = Math.round(totalWorkload * 0.6)
  const inProgress = Math.round(totalWorkload * 0.25)
  const resolved = Math.round(totalWorkload * 0.15)

  return (
    <div
      className="w-64 border-r flex flex-col overflow-hidden"
      style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}
    >
      {/* Team Overview Stats */}
      <div className="p-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
          Team Overview
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: '#6B6B6B' }}>Total Workload</span>
            <span className="font-semibold" style={{ color: '#1a1a1a' }}>
              {totalWorkload}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: '#6B6B6B' }}>Open</span>
            <span style={{ color: '#DC2626' }}>{openTickets}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: '#6B6B6B' }}>In Progress</span>
            <span style={{ color: '#F59E0B' }}>{inProgress}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span style={{ color: '#6B6B6B' }}>Resolved</span>
            <span style={{ color: '#16A34A' }}>{resolved}</span>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
            Team Members
          </h3>

          {/* All Team Button */}
          <button
            onClick={() => onPersonSelect(null)}
            className="w-full text-left px-3 py-2 rounded-lg mb-2 transition-colors text-xs"
            style={{
              backgroundColor: selectedPerson === null ? '#1a1a1a' : 'transparent',
              color: selectedPerson === null ? '#FFFFFF' : '#1a1a1a',
            }}
          >
            <div className="font-medium">All Team</div>
            <div style={{ color: selectedPerson === null ? 'rgba(255,255,255,0.7)' : '#6B6B6B' }} className="text-xs">
              View all agents
            </div>
          </button>

          {/* Team Members List */}
          <div className="space-y-1">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => onPersonSelect(member.name)}
                className="w-full text-left px-3 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: selectedPerson === member.name ? '#E2E0DC' : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: '#D4A574', color: '#FFFFFF' }}
                  >
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: '#1a1a1a' }}>
                      {member.name}
                    </div>
                    <div className="text-xs" style={{ color: '#6B6B6B' }}>
                      {member.role}
                    </div>
                  </div>
                </div>
                <div className="text-xs mt-1 ml-10" style={{ color: '#6B6B6B' }}>
                  {member.assigned} Assigned
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
