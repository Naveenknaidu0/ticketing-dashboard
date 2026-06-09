'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, Clock, AlertCircle, Users } from 'lucide-react'

interface Ticket {
  id: string
  subject: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  agent: string
  dueDate: Date
  status: 'open' | 'in-progress' | 'pending'
  slaRisk?: boolean
  escalated?: boolean
  waitingCustomer?: boolean
  waitingVendor?: boolean
}

interface AgentCapacity {
  name: string
  current: number
  group: string
}

const priorityColors = {
  critical: '#DC2626',
  high: '#F59E0B',
  medium: '#3B82F6',
  low: '#10B981',
}

const priorityBgColors = {
  critical: '#FEE2E2',
  high: '#FEF3C7',
  medium: '#DBEAFE',
  low: '#DCFCE7',
}

const statusColors = {
  open: '#6B7280',
  'in-progress': '#3B82F6',
  pending: '#F59E0B',
}

export function WorkloadPlanner() {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [draggingTicket, setDraggingTicket] = useState<Ticket | null>(null)
  const [reassignmentPreview, setReassignmentPreview] = useState<{
    from: string
    to: string
    fromCapacity: number
    toCapacity: number
  } | null>(null)

  // Sample data
  const tickets: Ticket[] = [
    { id: 'INC-1042', subject: 'VPN Access Issue', priority: 'critical', agent: 'John Smith', dueDate: new Date(currentDate.getTime() + 86400000), status: 'in-progress', slaRisk: true },
    { id: 'INC-1043', subject: 'Email Configuration', priority: 'high', agent: 'Sarah Chen', dueDate: new Date(currentDate.getTime() + 172800000), status: 'open', escalated: true },
    { id: 'INC-1044', subject: 'Printer Connectivity', priority: 'medium', agent: 'Emma Davis', dueDate: new Date(currentDate.getTime() + 0), status: 'in-progress' },
    { id: 'INC-1045', subject: 'Password Reset', priority: 'low', agent: 'Mike Chen', dueDate: new Date(currentDate.getTime() + 259200000), status: 'open', waitingCustomer: true },
    { id: 'INC-1046', subject: 'Network Issue', priority: 'critical', agent: 'John Smith', dueDate: new Date(currentDate.getTime() + 86400000), status: 'pending', waitingVendor: true },
    { id: 'INC-1047', subject: 'License Renewal', priority: 'high', agent: 'Sarah Chen', dueDate: new Date(currentDate.getTime() + 0), status: 'open' },
    { id: 'INC-1048', subject: 'System Update', priority: 'medium', agent: 'Emma Davis', dueDate: new Date(currentDate.getTime() + 172800000), status: 'in-progress' },
    { id: 'INC-1049', subject: 'Backup Verification', priority: 'low', agent: 'Mike Chen', dueDate: new Date(currentDate.getTime() + 345600000), status: 'open' },
  ]

  const agentCapacities: AgentCapacity[] = [
    { name: 'John Smith', current: 125, group: 'Network' },
    { name: 'Sarah Chen', current: 78, group: 'L2 Support' },
    { name: 'Emma Davis', current: 68, group: 'L1 Support' },
    { name: 'Mike Chen', current: 82, group: 'Infrastructure' },
  ]

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAgent = selectedAgent === 'all' || ticket.agent === selectedAgent
      const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
      const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus

      return matchesSearch && matchesAgent && matchesPriority && matchesStatus
    })
  }, [searchTerm, selectedAgent, selectedPriority, selectedStatus])

  // Get days to display based on view mode
  const getDaysToDisplay = () => {
    const days = []
    let startDate = new Date(currentDate)
    startDate.setHours(0, 0, 0, 0)

    if (viewMode === 'day') {
      days.push(new Date(startDate))
    } else if (viewMode === 'week') {
      const dayOfWeek = startDate.getDay()
      startDate.setDate(startDate.getDate() - dayOfWeek)
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        days.push(date)
      }
    } else {
      const firstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      const lastDay = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0)
      for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
        if (days.length % 7 === 0 || days.length === 0) {
          days.push(new Date(d))
        }
      }
    }

    return days
  }

  const daysToDisplay = getDaysToDisplay()

  const getTicketsForDay = (date: Date) => {
    return filteredTickets.filter(ticket => {
      const ticketDate = new Date(ticket.dueDate)
      ticketDate.setHours(0, 0, 0, 0)
      const compareDate = new Date(date)
      compareDate.setHours(0, 0, 0, 0)
      return ticketDate.getTime() === compareDate.getTime()
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return today.getTime() === compareDate.getTime()
  }

  const handleDragStart = (ticket: Ticket) => {
    setDraggingTicket(ticket)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (agent: string) => {
    if (draggingTicket && draggingTicket.agent !== agent) {
      const fromCapacity = agentCapacities.find(a => a.name === draggingTicket.agent)?.current || 0
      const toCapacity = agentCapacities.find(a => a.name === agent)?.current || 0
      
      setReassignmentPreview({
        from: draggingTicket.agent,
        to: agent,
        fromCapacity: Math.max(0, fromCapacity - 8),
        toCapacity: Math.min(150, toCapacity + 8),
      })
      
      setDraggingTicket(null)
      setTimeout(() => setReassignmentPreview(null), 3000)
    }
  }

  const handlePrevPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const getDateRangeLabel = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    } else if (viewMode === 'week') {
      const end = new Date(currentDate)
      end.setDate(end.getDate() + 6)
      return `${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
  }

  const summaryStats = {
    scheduledToday: getTicketsForDay(new Date()).length,
    dueToday: filteredTickets.filter(t => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const ticketDate = new Date(t.dueDate)
      ticketDate.setHours(0, 0, 0, 0)
      return ticketDate.getTime() === today.getTime()
    }).length,
    dueThisWeek: filteredTickets.filter(t => {
      const daysUntilDue = Math.floor((new Date(t.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return daysUntilDue >= 0 && daysUntilDue <= 7
    }).length,
    critical: filteredTickets.filter(t => t.priority === 'critical').length,
    suggestedReassignments: 3,
  }

  const insights = [
    'John Smith exceeds capacity by 25%',
    'Sarah Chen can accept 6 more tickets',
    'Network team has highest upcoming workload',
    '3 critical tickets due tomorrow',
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: '#1a1a1a' }}>
          Workload Planner
        </h2>
        <p className="text-sm" style={{ color: '#6B6B6B' }}>
          Visualize ticket assignments, workload distribution and upcoming due dates.
        </p>
      </div>

      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC', borderWidth: '1px' }}>
        {/* View Mode */}
        <div className="flex gap-2">
          {(['day', 'week', 'month'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition"
              style={{
                backgroundColor: viewMode === mode ? '#0D3133' : '#FFFFFF',
                color: viewMode === mode ? '#FFFFFF' : '#6B6B6B',
                border: `1px solid ${viewMode === mode ? '#0D3133' : '#E2E0DC'}`,
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-3">
          <button onClick={handlePrevPeriod} className="p-2 rounded hover:bg-white transition">
            <ChevronLeft className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
          <span className="text-sm font-medium min-w-48 text-center" style={{ color: '#1a1a1a' }}>
            {getDateRangeLabel()}
          </span>
          <button onClick={handleNextPeriod} className="p-2 rounded hover:bg-white transition">
            <ChevronRight className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by ID or subject"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', borderWidth: '1px', color: '#1a1a1a' }}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap items-center p-4 rounded-lg" style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC', borderWidth: '1px' }}>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', borderWidth: '1px', color: '#1a1a1a' }}
        >
          <option value="all">All Groups</option>
          <option value="network">Network</option>
          <option value="l2">L2 Support</option>
          <option value="l1">L1 Support</option>
          <option value="infrastructure">Infrastructure</option>
        </select>

        <select
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', borderWidth: '1px', color: '#1a1a1a' }}
        >
          <option value="all">All Agents</option>
          <option value="John Smith">John Smith</option>
          <option value="Sarah Chen">Sarah Chen</option>
          <option value="Emma Davis">Emma Davis</option>
          <option value="Mike Chen">Mike Chen</option>
        </select>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', borderWidth: '1px', color: '#1a1a1a' }}
        >
          <option value="all">All Priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', borderWidth: '1px', color: '#1a1a1a' }}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Calendar Board */}
        <div className="flex-1 overflow-x-auto">
          <div className="inline-flex gap-4 min-w-full pb-4">
            {daysToDisplay.map((date, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-64 rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: isToday(date) ? '#FEF9E7' : '#FFFFFF',
                  borderColor: isToday(date) ? '#F59E0B' : '#E2E0DC',
                }}
              >
                {/* Date Header */}
                <div
                  className="px-4 py-3 font-semibold text-sm border-b"
                  style={{
                    backgroundColor: isToday(date) ? '#FEF3C7' : '#F8F8F7',
                    borderColor: '#E2E0DC',
                    color: '#1a1a1a',
                  }}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>

                {/* Tickets */}
                <div
                  className="p-3 space-y-2 min-h-96"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop('any-agent')}
                >
                  {getTicketsForDay(date).map(ticket => (
                    <div
                      key={ticket.id}
                      draggable
                      onDragStart={() => handleDragStart(ticket)}
                      className="p-3 rounded-lg border cursor-move hover:shadow-md transition"
                      style={{
                        backgroundColor: priorityBgColors[ticket.priority],
                        borderColor: priorityColors[ticket.priority],
                        borderWidth: '2px',
                      }}
                    >
                      {/* Ticket ID and Priority */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-semibold text-xs" style={{ color: '#1a1a1a' }}>
                          {ticket.id}
                        </span>
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: priorityColors[ticket.priority],
                            color: '#FFFFFF',
                          }}
                        >
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </div>

                      {/* Subject */}
                      <p className="text-xs font-medium mb-2" style={{ color: '#1a1a1a' }}>
                        {ticket.subject}
                      </p>

                      {/* Agent and Due Date */}
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#6B6B6B' }}>
                        <span>{ticket.agent}</span>
                        <span>
                          {isToday(ticket.dueDate) ? 'Due Today' : 
                           Math.floor((new Date(ticket.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) === 1 ? 'Due Tomorrow' :
                           'Due Soon'}
                        </span>
                      </div>

                      {/* Status and Badges */}
                      <div className="flex items-center gap-1 flex-wrap">
                        <span
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: statusColors[ticket.status] + '33',
                            color: statusColors[ticket.status],
                          }}
                        >
                          {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </span>
                        {ticket.slaRisk && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100" style={{ color: '#DC2626' }}>
                            SLA Risk
                          </span>
                        )}
                        {ticket.escalated && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                            Escalated
                          </span>
                        )}
                        {ticket.waitingCustomer && (
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {getTicketsForDay(date).length === 0 && (
                    <div className="h-full flex items-center justify-center" style={{ color: '#9CA3AF' }}>
                      <span className="text-xs">No tickets scheduled</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workload Impact Panel */}
        <div className="flex-shrink-0 w-72 space-y-4">
          {reassignmentPreview && (
            <div className="p-4 rounded-lg border bg-blue-50" style={{ borderColor: '#3B82F6' }}>
              <h4 className="font-semibold text-sm mb-3" style={{ color: '#1a1a1a' }}>
                Workload Reassignment Preview
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>{reassignmentPreview.from}</span>
                  <span style={{ color: '#DC2626', fontWeight: 'bold' }}>
                    {reassignmentPreview.fromCapacity}%
                  </span>
                </div>
                <div className="flex items-center justify-center">
                  <span style={{ color: '#6B6B6B' }}>→</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>{reassignmentPreview.to}</span>
                  <span style={{ color: reassignmentPreview.toCapacity > 100 ? '#F59E0B' : '#16A34A', fontWeight: 'bold' }}>
                    {reassignmentPreview.toCapacity}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Capacity Warnings */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }}>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#DC2626' }}>
              <AlertCircle className="w-4 h-4" />
              Capacity Alerts
            </h4>
            <div className="space-y-2 text-xs">
              <div style={{ color: '#6B6B6B' }}>Moving ticket will overload Sarah Chen</div>
              <div style={{ color: '#16A34A' }}>Moving ticket reduces SLA risk by 25%</div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC' }}>
            <h4 className="font-semibold text-sm mb-3" style={{ color: '#1a1a1a' }}>
              Workload Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Today</span>
                <span className="font-semibold" style={{ color: '#1a1a1a' }}>{summaryStats.scheduledToday}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Due Today</span>
                <span className="font-semibold" style={{ color: '#DC2626' }}>{summaryStats.dueToday}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Due This Week</span>
                <span className="font-semibold" style={{ color: '#F59E0B' }}>{summaryStats.dueThisWeek}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Critical</span>
                <span className="font-semibold" style={{ color: '#DC2626' }}>{summaryStats.critical}</span>
              </div>
              <div className="flex justify-between border-t pt-2" style={{ borderColor: '#E2E0DC' }}>
                <span style={{ color: '#6B6B6B' }}>Reassignments Suggested</span>
                <span className="font-semibold" style={{ color: '#16A34A' }}>{summaryStats.suggestedReassignments}</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' }}>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: '#16A34A' }}>
              <TrendingUp className="w-4 h-4" />
              Insights
            </h4>
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="text-xs" style={{ color: '#6B6B6B' }}>
                  • {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Import TrendingUp if not available
const TrendingUp = ({ className }: { className: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8L5.257 19.393M5.25 6.75h.008v.008H5.25V6.75z" />
  </svg>
)
