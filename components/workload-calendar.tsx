'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  assignee: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending'
  dueDate: string
}

interface WorkloadCalendarProps {
  onTicketClick: (ticket: Ticket) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
  searchQuery: string
  selectedPerson: string | null
}

const ticketData: Ticket[] = [
  { id: 'ABG-101', title: 'Give access to internal teams for evaluation', assignee: 'Sarah Johnson', priority: 'high', status: 'open', dueDate: '2026-03-16' },
  { id: 'ABG-1203', title: 'Give access to internal teams', assignee: 'Michael Chen', priority: 'critical', status: 'open', dueDate: '2026-03-18' },
  { id: 'ABG-102', title: 'Give access to internal teams', assignee: 'Emma Williams', priority: 'high', status: 'in-progress', dueDate: '2026-03-17' },
  { id: 'ABG-404', title: 'Give access to internal teams for evaluation', assignee: 'James Rodriguez', priority: 'medium', status: 'open', dueDate: '2026-03-17' },
  { id: 'ABG-777', title: 'Give access to internal teams for evaluation', assignee: 'Olivia Martinez', priority: 'high', status: 'open', dueDate: '2026-03-17' },
  { id: 'ABG-245', title: 'Give access to internal teams', assignee: 'Sarah Johnson', priority: 'medium', status: 'pending', dueDate: '2026-03-16' },
  { id: 'ABG-210', title: 'Give access to internal teams for evaluation', assignee: 'Michael Chen', priority: 'high', status: 'open', dueDate: '2026-03-19' },
  { id: 'ABG-103', title: 'Give access to internal teams for evaluation', assignee: 'Emma Williams', priority: 'medium', status: 'in-progress', dueDate: '2026-03-20' },
  { id: 'ABG-248', title: 'Give access to internal teams for evaluation', assignee: 'Sarah Johnson', priority: 'high', status: 'pending', dueDate: '2026-03-15' },
  { id: 'ABG-1250', title: 'Give access to internal teams', assignee: 'Michael Chen', priority: 'critical', status: 'open', dueDate: '2026-03-18' },
  { id: 'ABG-001', title: 'Give access to internal teams for evaluation', assignee: 'Sarah Johnson', priority: 'medium', status: 'open', dueDate: '2026-03-16' },
  { id: 'ABG-089', title: 'Give access to internal teams for evaluation', assignee: 'James Rodriguez', priority: 'low', status: 'pending', dueDate: '2026-03-15' },
  { id: 'ABG-225', title: 'Give access to internal teams for evaluation', assignee: 'Olivia Martinez', priority: 'low', status: 'open', dueDate: '2026-03-17' },
  { id: 'ABG-567', title: 'Give access to internal teams for evaluation', assignee: 'Emma Williams', priority: 'medium', status: 'open', dueDate: '2026-03-16' },
  { id: 'ABG-1105', title: 'Give access to internal teams for evaluation', assignee: 'Michael Chen', priority: 'high', status: 'open', dueDate: '2026-03-18' },
  { id: 'ABG-1023', title: 'Give access to internal teams', assignee: 'James Rodriguez', priority: 'medium', status: 'open', dueDate: '2026-03-18' },
]

const getColorByPriority = (priority: Ticket['priority']): { bg: string; border: string; text: string } => {
  switch (priority) {
    case 'critical':
      return { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D' }
    case 'high':
      return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' }
    case 'medium':
      return { bg: '#DBEAFE', border: '#0EA5E9', text: '#0C4A6E' }
    case 'low':
      return { bg: '#DCFCE7', border: '#16A34A', text: '#166534' }
  }
}

const getWeekDates = (selectedDate: Date): Date[] => {
  const dates: Date[] = []
  const current = new Date(selectedDate)
  const first = new Date(current)
  const day = first.getDay()
  const diff = first.getDate() - day
  first.setDate(diff)

  for (let i = 0; i < 7; i++) {
    const date = new Date(first)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
}

const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const year = date.getFullYear()
  return `${year}-${month}-${day}`
}

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function WorkloadCalendar({
  onTicketClick,
  selectedDate,
  onDateChange,
  searchQuery,
  selectedPerson,
}: WorkloadCalendarProps) {
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const filteredTickets = useMemo(() => {
    let result = ticketData.filter((ticket) => {
      if (searchQuery === '') return true
      const query = searchQuery.toLowerCase()
      return ticket.id.toLowerCase().includes(query) || ticket.title.toLowerCase().includes(query)
    })

    // Filter by person (if selected)
    if (selectedPerson !== null) {
      result = result.filter((ticket) => ticket.assignee === selectedPerson)
    }

    return result
  }, [searchQuery, selectedPerson])

  const ticketsByDate = useMemo(() => {
    const map: Record<string, Ticket[]> = {}
    filteredTickets.forEach((ticket) => {
      const dateKey = ticket.dueDate
      if (!map[dateKey]) map[dateKey] = []
      map[dateKey].push(ticket)
    })
    return map
  }, [filteredTickets])

  const prevWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() - 7)
    onDateChange(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + 7)
    onDateChange(newDate)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Week Navigation */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <button
          onClick={prevWeek}
          className="p-1 hover:bg-gray-100 rounded"
          style={{ color: '#1a1a1a' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>
          Week of {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
          {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <button
          onClick={nextWeek}
          className="p-1 hover:bg-gray-100 rounded"
          style={{ color: '#1a1a1a' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 gap-3 min-w-full">
          {weekDates.map((date, idx) => {
            const isWeekend = date.getDay() === 0 || date.getDay() === 6
            const dateKey = formatDate(date)
            const dayTickets = ticketsByDate[dateKey] || []

            return (
              <div
                key={idx}
                className="rounded-lg border min-h-96 flex flex-col"
                style={{
                  borderColor: '#E2E0DC',
                  backgroundColor: isWeekend ? '#F9F8F6' : '#FFFFFF',
                }}
              >
                {/* Day Header */}
                <div className="p-3 border-b" style={{ borderColor: '#E2E0DC' }}>
                  <div className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>
                    {dayLabels[date.getDay()]}
                  </div>
                  <div className="text-lg font-bold" style={{ color: '#1a1a1a' }}>
                    {date.getDate()}
                  </div>
                </div>

                {/* Tickets Container */}
                <div className="flex-1 p-2 overflow-y-auto space-y-2">
                  {dayTickets.map((ticket) => {
                    const colors = getColorByPriority(ticket.priority)
                    return (
                      <button
                        key={ticket.id}
                        onClick={() => onTicketClick(ticket)}
                        className="w-full text-left p-2 rounded-lg border-2 hover:shadow-md transition-shadow text-xs cursor-pointer"
                        style={{
                          backgroundColor: colors.bg,
                          borderColor: colors.border,
                        }}
                      >
                        <div className="font-semibold" style={{ color: colors.text }}>
                          {ticket.id}
                        </div>
                        <div className="line-clamp-2 text-xs mt-1" style={{ color: colors.text }}>
                          {ticket.title}
                        </div>
                        <div className="text-xs mt-1 opacity-75" style={{ color: colors.text }}>
                          {ticket.assignee.split(' ')[0]}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
