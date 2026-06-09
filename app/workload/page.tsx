'use client'

import { useState, useEffect } from 'react'
import { Download, Search } from 'lucide-react'
import { useStore } from '@/app/store-context'
import { applicationStore } from '@/lib/store'
import { TeamOverviewPanel } from '@/components/team-overview-panel'
import { WorkloadCalendar } from '@/components/workload-calendar'
import { WorkloadBalancerDrawer } from '@/components/workload-balancer-drawer'
import { Breadcrumb } from '@/components/breadcrumb'

interface Ticket {
  id: string
  title: string
  assignee: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending'
  dueDate: string
}

export default function WorkloadPage() {
  const { state } = useStore()
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 2, 16))
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null)
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; ticketCount: number }>>([])

  // Calculate team workload from store
  useEffect(() => {
    if (!state?.users) return

    const members = Array.from(state.users.values())
      .filter(u => u.role === 'agent')
      .map(u => {
        const assignedTickets = Array.from(state.tickets.values()).filter(t => t.assignedTo === u.id)
        return {
          id: u.id,
          name: u.name,
          ticketCount: assignedTickets.length,
        }
      })

    setTeamMembers(members)
  }, [state?.users, state?.tickets])

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDrawerOpen(true)
  }

  const handleReassign = (agentId: string) => {
    if (!selectedTicket) return
    
    // Update ticket using store API
    applicationStore.assignTicket(selectedTicket.id, agentId)
    
    setIsDrawerOpen(false)
    setSelectedTicket(null)
  }

  const handleExport = () => {
    console.log('[v0] Exporting workload data')
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Team Dashboard', href: '/team-dashboard' },
    { label: 'Workload', href: '/workload' },
    ...(selectedPerson ? [{ label: selectedPerson }] : []),
  ]

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b p-4 px-6" style={{ borderColor: '#E2E0DC' }}>
          {/* Breadcrumb */}
          <div className="mb-3 overflow-x-auto">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                Workload
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                {selectedPerson ? `Showing workload for ${selectedPerson}` : 'Showing workload for all team members'}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 px-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B6B6B' }} />
            <input
              type="text"
              placeholder="Search by ID or subject"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Team Overview */}
          <TeamOverviewPanel
            selectedPerson={selectedPerson}
            onPersonSelect={setSelectedPerson}
          />

          {/* Right Content - Workload Calendar */}
          <WorkloadCalendar
            onTicketClick={handleTicketClick}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            searchQuery={searchQuery}
            selectedPerson={selectedPerson}
          />
        </div>
      </div>

      {/* Workload Balancer Drawer */}
      <WorkloadBalancerDrawer
        ticket={selectedTicket}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false)
          setSelectedTicket(null)
        }}
        onReassign={handleReassign}
      />
    </>
  )
}
