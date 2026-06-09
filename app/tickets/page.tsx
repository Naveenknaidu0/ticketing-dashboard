'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApp } from '@/app/app-context'
import { useStore } from '@/app/store-context'
import { AppShell } from '@/components/app-shell'
import { PageHeader } from '@/components/page-header'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'
import { filterTicketsByRole } from '@/lib/role-permissions'
import { applicationStore } from '@/lib/store'
import { TEAM_MEMBERS } from '@/lib/ticket-filters'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Plus,
  RotateCcw,
  Download,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react'

interface Ticket {
  id: string
  title: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed'
  createdBy: string
  assignedTo?: string
  category: string
  createdAt: string
  dueDate?: string
  slaStatus: 'met' | 'at-risk' | 'breached'
  age: number
  updatedAt: string
}



export default function TicketsPage() {
  const { userRole } = useApp()
  const { state } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Initialize from search params on mount
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '')
    setActiveFilter(searchParams.get('filter') || 'all')
    setCurrentPage(parseInt(searchParams.get('page') || '1'))
  }, [searchParams])

  // Dropdown filter states
  const [filterByValue, setFilterByValue] = useState('') // For agent: Priority, Status, Category, etc.
  const [teamMemberFilter, setTeamMemberFilter] = useState('all') // For manager: specific agent
  const [dateRangeFilter, setDateRangeFilter] = useState('all') // For manager: date range

  // Get tickets from store
  useEffect(() => {
    if (!state) return

    // Start with store tickets directly
    let tickets = Array.from(state.tickets.values())

    // Apply role-based visibility filtering first
    const currentUserId = state.currentUserId || 'manager1'
    tickets = filterTicketsByRole(tickets, userRole, currentUserId)

    // Convert to display format
    let displayTickets = tickets.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority as 'critical' | 'high' | 'medium' | 'low',
      status: t.status as 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed',
      createdBy: t.createdBy,
      assignedTo: t.assignedTo,
      category: t.category || 'General',
      createdAt: t.createdAt,
      dueDate: t.dueDate,
      slaStatus: 'met' as 'met' | 'at-risk' | 'breached',
      age: Math.floor((Date.now() - new Date(t.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      updatedAt: t.updatedAt,
    }))

    // Apply quick filter chips (same for agents and managers)
    if (activeFilter === 'mine') {
      displayTickets = displayTickets.filter(t => t.assignedTo === currentUserId)
    } else if (activeFilter === 'team-tickets' && userRole === 'manager') {
      // Team Tickets: Show all team member tickets, exclude manager's own tickets
      const teamMemberIds = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Rodriguez', 'David Kumar']
      displayTickets = displayTickets.filter(t => t.assignedTo && teamMemberIds.includes(t.assignedTo))
    } else if (activeFilter === 'open') {
      displayTickets = displayTickets.filter(t => t.status === 'open')
    } else if (activeFilter === 'in-progress') {
      displayTickets = displayTickets.filter(t => t.status === 'in-progress')
    } else if (activeFilter === 'pending') {
      displayTickets = displayTickets.filter(t => t.status === 'pending')
    } else if (activeFilter === 'resolved') {
      displayTickets = displayTickets.filter(t => t.status === 'resolved')
    } else if (activeFilter === 'due-today') {
      const today = new Date().toISOString().split('T')[0]
      displayTickets = displayTickets.filter(t => t.dueDate === today)
    } else if (activeFilter === 'sla-risk') {
      displayTickets = displayTickets.filter(t => t.slaStatus === 'at-risk' || t.slaStatus === 'breached')
    } else if (activeFilter === 'unassigned' && userRole === 'manager') {
      displayTickets = displayTickets.filter(t => !t.assignedTo)
    }

    // Apply search
    if (searchTerm) {
      displayTickets = displayTickets.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredTickets(displayTickets)
    setCurrentPage(1)
  }, [state, activeFilter, searchTerm, userRole])

  // Build return URL with preserved state
  const buildReturnUrl = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (activeFilter !== 'all') params.set('filter', activeFilter)
    if (currentPage > 1) params.set('page', currentPage.toString())
    return `/tickets?${params.toString()}`
  }

  const handleTicketClick = (ticketId: string) => {
    // Navigate to workspace with return URL encoded
    router.push(`/tickets/workspace/${ticketId}?return=${encodeURIComponent(buildReturnUrl())}`)
  }

  const filters = [
    { id: 'all', label: 'All Tickets' },
    { id: 'mine', label: 'My Tickets' },
    { id: 'open', label: 'Open' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'pending', label: 'Pending' },
    { id: 'resolved', label: 'Resolved' },
    { id: 'due-today', label: 'Due Today' },
    { id: 'sla-risk', label: 'SLA Risk' },
    { id: 'unassigned', label: 'Unassigned' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' }
      case 'high':
        return { bg: '#FFFBEB', border: '#FEF3C7', text: '#E69F50' }
      case 'medium':
        return { bg: '#F3F4F3', border: '#E2E0DC', text: '#73847B' }
      default:
        return { bg: '#F0FDF4', border: '#D1FAE5', text: '#10B981' }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return { bg: '#F8F8F7', text: '#0D3133' }
      case 'in-progress':
        return { bg: '#FEF3C7', text: '#B45309' }
      case 'pending':
        return { bg: '#F3E8FF', text: '#7C3AED' }
      case 'resolved':
        return { bg: '#D1FAE5', text: '#059669' }
      case 'closed':
        return { bg: '#E5E7EB', text: '#6B7280' }
      default:
        return { bg: '#F8F8F7', text: '#0D3133' }
    }
  }

  const getSLAIndicator = (slaStatus: string) => {
    switch (slaStatus) {
      case 'met':
        return { bg: '#D1FAE5', text: '#059669', label: 'SLA Met' }
      case 'at-risk':
        return { bg: '#FEF3C7', text: '#B45309', label: 'At Risk' }
      case 'breached':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Breached' }
      default:
        return { bg: '#F8F8F7', text: '#0D3133', label: 'Unknown' }
    }
  }

  // Pagination logic
  const totalItems = filteredTickets.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex)

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header - Compact, Not Sticky */}
        <PageHeader
          title="Ticket List"
          description="Manage, monitor and take action on tickets."
          actions={
            <div className="flex items-center gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                      style={{ backgroundColor: '#0D3133' }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      <Plus className="w-4 h-4" />
                      Create Ticket
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Create a new ticket</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="p-2 rounded-lg transition-all"
                      style={{ backgroundColor: '#F8F8F7', color: '#6B6B6B' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E0DC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F8F7')}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh list</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: '#F8F8F7',
                        color: '#1a1a1a',
                        border: '1px solid #E2E0DC',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E0DC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F8F7')}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Export tickets</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          }
        />

        {/* Quick Filter Bar - Original Chip UI */}
        <div
          className="bg-white px-8 py-4 overflow-x-auto flex gap-2"
          style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}
        >
          {/* All Tickets */}
          <button
            onClick={() => setActiveFilter('all')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'all' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'all' ? 'white' : '#1a1a1a',
              border: activeFilter === 'all' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            All Tickets
          </button>

          {/* My Tickets */}
          <button
            onClick={() => setActiveFilter('mine')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'mine' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'mine' ? 'white' : '#1a1a1a',
              border: activeFilter === 'mine' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            My Tickets
          </button>

          {/* Manager: Team Tickets (after My Tickets) */}
          {userRole === 'manager' && (
            <button
              onClick={() => setActiveFilter('team-tickets')}
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeFilter === 'team-tickets' ? '#E69F50' : '#F8F8F7',
                color: activeFilter === 'team-tickets' ? 'white' : '#1a1a1a',
                border: activeFilter === 'team-tickets' ? 'none' : '1px solid #E2E0DC',
              }}
            >
              Team Tickets
            </button>
          )}

          {/* Status filters */}
          <button
            onClick={() => setActiveFilter('open')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'open' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'open' ? 'white' : '#1a1a1a',
              border: activeFilter === 'open' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            Open
          </button>

          <button
            onClick={() => setActiveFilter('in-progress')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'in-progress' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'in-progress' ? 'white' : '#1a1a1a',
              border: activeFilter === 'in-progress' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            In Progress
          </button>

          <button
            onClick={() => setActiveFilter('pending')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'pending' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'pending' ? 'white' : '#1a1a1a',
              border: activeFilter === 'pending' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            Pending
          </button>

          <button
            onClick={() => setActiveFilter('resolved')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'resolved' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'resolved' ? 'white' : '#1a1a1a',
              border: activeFilter === 'resolved' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            Resolved
          </button>

          {/* Additional filters */}
          <button
            onClick={() => setActiveFilter('due-today')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'due-today' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'due-today' ? 'white' : '#1a1a1a',
              border: activeFilter === 'due-today' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            Due Today
          </button>

          <button
            onClick={() => setActiveFilter('sla-risk')}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={{
              backgroundColor: activeFilter === 'sla-risk' ? '#E69F50' : '#F8F8F7',
              color: activeFilter === 'sla-risk' ? 'white' : '#1a1a1a',
              border: activeFilter === 'sla-risk' ? 'none' : '1px solid #E2E0DC',
            }}
          >
            SLA Risk
          </button>

          {/* Unassigned: Managers only */}
          {userRole === 'manager' && (
            <button
              onClick={() => setActiveFilter('unassigned')}
              className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeFilter === 'unassigned' ? '#E69F50' : '#F8F8F7',
                color: activeFilter === 'unassigned' ? 'white' : '#1a1a1a',
                border: activeFilter === 'unassigned' ? 'none' : '1px solid #E2E0DC',
              }}
            >
              Unassigned
            </button>
          )}
        </div>

        {/* Global Search & Dropdown Filters */}
        <div className="bg-white px-8 py-4 space-y-3" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 relative min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#73847B' }} />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
              />
            </div>

            {/* Agent: Filter By Dropdown */}
            {userRole === 'agent' && (
              <select
                value={filterByValue}
                onChange={(e) => setFilterByValue(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F8F8F7' }}
              >
                <option value="">Filter By</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="category">Category</option>
                <option value="type">Ticket Type</option>
                <option value="sla">SLA Status</option>
                <option value="created-date">Created Date</option>
                <option value="due-date">Due Date</option>
              </select>
            )}

            {/* Manager: Team Member Dropdown */}
            {userRole === 'manager' && (
              <select
                value={teamMemberFilter}
                onChange={(e) => setTeamMemberFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F8F8F7' }}
              >
                <option value="all">Team Member</option>
                <option value="all">All Team Members</option>
                {TEAM_MEMBERS.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            )}

            {/* Manager: Date Range Dropdown */}
            {userRole === 'manager' && (
              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F8F8F7' }}
              >
                <option value="all">Date Range</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="last-quarter">Last Quarter</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            )}

            {/* Advanced Filter Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                    style={{
                      backgroundColor: showAdvanced ? '#E69F50' : '#F8F8F7',
                      color: showAdvanced ? 'white' : '#1a1a1a',
                      border: showAdvanced ? 'none' : '1px solid #E2E0DC',
                    }}
                  >
                    <Filter className="w-4 h-4" />
                    Advanced
                  </button>
                </TooltipTrigger>
                <TooltipContent>Advanced filtering options</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Advanced Filter Panel */}
          {showAdvanced && userRole !== 'manager' && (
            <div
              className="p-4 rounded-lg space-y-3"
              style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC', borderWidth: '1px' }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <label style={{ color: '#73847B' }} className="font-medium">
                    Status
                  </label>
                  <select
                    className="w-full mt-1 px-2 py-1 rounded border"
                    style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
                  >
                    <option>All Statuses</option>
                    <option>New</option>
                    <option>Open</option>
                    <option>In Progress</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#73847B' }} className="font-medium">
                    Priority
                  </label>
                  <select
                    className="w-full mt-1 px-2 py-1 rounded border"
                    style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
                  >
                    <option>All Priorities</option>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#73847B' }} className="font-medium">
                    Group
                  </label>
                  <select
                    className="w-full mt-1 px-2 py-1 rounded border"
                    style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
                  >
                    <option>All Groups</option>
                    <option>Infrastructure</option>
                    <option>Applications</option>
                    <option>Network</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  className="px-4 py-2 rounded-lg font-medium text-sm"
                  style={{
                    backgroundColor: '#0D3133',
                    color: 'white',
                  }}
                >
                  Apply Filters
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-medium text-sm border"
                  style={{
                    backgroundColor: 'white',
                    color: '#1a1a1a',
                    borderColor: '#E2E0DC',
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Action Bar (when rows selected) */}
        {selectedTickets.length > 0 && (
          <div
            className="bg-white px-8 py-3 flex items-center justify-between"
            style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}
          >
            <p className="text-sm font-medium" style={{ color: '#73847B' }}>
              {selectedTickets.length} ticket(s) selected
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs rounded-lg" style={{ backgroundColor: '#F8F8F7', color: '#1a1a1a', border: '1px solid #E2E0DC' }}>
                Assign
              </button>
              <button className="px-3 py-1 text-xs rounded-lg" style={{ backgroundColor: '#F8F8F7', color: '#1a1a1a', border: '1px solid #E2E0DC' }}>
                Change Status
              </button>
              <button className="px-3 py-1 text-xs rounded-lg" style={{ backgroundColor: '#F8F8F7', color: '#1a1a1a', border: '1px solid #E2E0DC' }}>
                Add Note
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Ticket Table Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Area */}
            <div className="flex-1 overflow-auto">
              {filteredTickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <p style={{ color: '#73847B' }} className="text-lg font-medium">
                    No tickets found
                  </p>
                  <p style={{ color: '#A0A0A0' }} className="text-sm mt-2">
                    Try changing filters or create a new ticket.
                  </p>
                </div>
              ) : (
                <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Ticket ID
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Requester
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Assigned To
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Group
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      Due
                    </th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>
                      SLA
                    </th>
                    <th className="px-4 py-3 text-center" style={{ color: '#73847B' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket) => {
                    const priorityColor = getPriorityColor(ticket.priority)
                    const statusColor = getStatusColor(ticket.status)
                    const slaColor = getSLAIndicator(ticket.slaStatus)
                    const isSelected = selectedTickets.includes(ticket.id)

                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket.id)}
                        className="transition-all cursor-pointer"
                        style={{
                          borderBottomColor: '#E2E0DC',
                          borderBottomWidth: '1px',
                          backgroundColor: isSelected ? '#F0FDF4' : 'white',
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = '#F8F8F7'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isSelected ? '#F0FDF4' : 'white'
                        }}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              if (isSelected) {
                                setSelectedTickets(selectedTickets.filter((id) => id !== ticket.id))
                              } else {
                                setSelectedTickets([...selectedTickets, ticket.id])
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#0D3133' }}>
                          {ticket.id}
                        </td>
                        <td className="px-4 py-3" style={{ color: '#1a1a1a' }}>
                          {ticket.title}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: priorityColor.bg, color: priorityColor.text }}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#1a1a1a' }}>
                          {ticket.createdBy}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#1a1a1a' }}>
                          {ticket.assignedTo ? applicationStore.getUserName(ticket.assignedTo) : 'Unassigned'}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#1a1a1a' }}>
                          {ticket.category}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#1a1a1a' }}>
                          {ticket.dueDate}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="px-2 py-1 rounded text-xs font-medium"
                            style={{ backgroundColor: slaColor.bg, color: slaColor.text }}
                          >
                            {slaColor.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <ChevronRight className="w-4 h-4 mx-auto" style={{ color: '#E2E0DC' }} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              )}
            </div>

            {/* Pagination Footer - Below Table */}
            {filteredTickets.length > 0 && (
              <div
                className="px-8 py-4 flex items-center justify-between"
                style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px', backgroundColor: '#F8F8F7' }}
              >
                <div className="text-sm" style={{ color: '#73847B' }}>
                  Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} tickets
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentPage === 1 ? '#E2E0DC' : '#F8F8F7',
                      color: '#1a1a1a',
                      border: '1px solid #E2E0DC',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage > 1) {
                        e.currentTarget.style.backgroundColor = '#E2E0DC'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8F8F7'
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className="px-3 py-2 rounded text-sm font-medium transition-all"
                          style={{
                            backgroundColor: currentPage === pageNumber ? '#E69F50' : '#F8F8F7',
                            color: currentPage === pageNumber ? 'white' : '#1a1a1a',
                            border: currentPage === pageNumber ? 'none' : '1px solid #E2E0DC',
                          }}
                          onMouseEnter={(e) => {
                            if (currentPage !== pageNumber) {
                              e.currentTarget.style.backgroundColor = '#E2E0DC'
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentPage === pageNumber ? '#E69F50' : '#F8F8F7'
                          }}
                        >
                          {pageNumber}
                        </button>
                      )
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <span className="px-2 py-2 text-xs" style={{ color: '#73847B' }}>
                        ...
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentPage === totalPages ? '#E2E0DC' : '#F8F8F7',
                      color: '#1a1a1a',
                      border: '1px solid #E2E0DC',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage < totalPages) {
                        e.currentTarget.style.backgroundColor = '#E2E0DC'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8F8F7'
                    }}
                  >
                    <span className="text-xs">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
