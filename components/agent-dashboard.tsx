'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/app/app-context'
import { useStore } from '@/app/store-context'
import { navigateToTickets } from '@/lib/navigation'
import { filterTicketsByRole } from '@/lib/role-permissions'
import { Clock, CheckCircle2, Ticket, CircleCheckBig, Calendar, Info, ChevronRight, AlertTriangle, TrendingUp, TrendingDown, Activity, Zap, Target } from 'lucide-react'
import { KPICard } from '@/components/kpi-card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PerformanceMetric {
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  trendPositive: boolean
}

function MyPerformance({ userId }: { userId: string }) {
  const { state } = useStore()
  const { userRole } = useApp()
  const user = state?.users.get(userId)

  // Only calculate metrics if user has permission to view personal performance
  const userTickets = (state && (userRole === 'agent' || userRole === 'manager' || userRole === 'team-lead')) 
    ? Array.from(state.tickets.values()).filter(t => t.assignedTo === userId) 
    : []
  const resolvedTickets = userTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  const totalTickets = userTickets.length

  const metrics: PerformanceMetric[] = [
    { 
      label: 'CSAT Score', 
      value: `${user?.slaCompliance || 85} / 100`, 
      trend: '↑ 2% this week', 
      trendDirection: 'up', 
      trendPositive: true 
    },
    { 
      label: 'Resolved Tickets', 
      value: `${resolvedTickets}`, 
      trend: `${totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}% resolution rate`, 
      trendDirection: 'up', 
      trendPositive: true 
    },
    { 
      label: 'SLA Compliance', 
      value: `${user?.slaCompliance || 85}%`, 
      trend: 'On target this week', 
      trendDirection: 'up', 
      trendPositive: true 
    },
  ]

  return (
    <Link href="/leaderboard">
      <div className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow" style={{ borderColor: '#E2E0DC', borderWidth: '1px', borderRadius: '12px', padding: '24px' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>My Performance</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded hover:opacity-70" onClick={(e) => e.preventDefault()}>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm max-w-xs">Personal performance metrics based on ticket handling activity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="p-4 rounded-lg" style={{ backgroundColor: '#F8F8F7', border: '1px solid #E2E0DC' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#6B6B6B', letterSpacing: '0.5px' }}>
                {metric.label.toUpperCase()}
              </p>
              <p className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
                {metric.value}
              </p>
              <p className="text-xs font-medium" style={{ color: metric.trendPositive ? '#10B981' : '#DC2626' }}>
                {metric.trend}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}>
          <p className="text-sm font-medium" style={{ color: '#059669' }}>
            Your SLA compliance is {user?.slaCompliance && user.slaCompliance >= 90 ? 'excellent' : 'good'} this period.
          </p>
        </div>
      </div>
    </Link>
  )
}


interface PriorityItem {
  label: string
  count: number
  color: string
  bgColor: string
  filterType: string
}

interface TaskItem {
  count: number
  label: string
  color: string
  bgColor: string
  filterType: string
}


interface ActivityItem {
  ticketId: string
  description: string
  timestamp: string
  priority: 'L1' | 'L2' | 'L3'
}


interface TrendData {
  day: string
  created: number
  resolved: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}


// Enhanced KPI Card with trends and sparkline
function EnhancedKPICard({
  icon,
  label,
  value,
  dailyChange,
  weeklyChange,
  tooltip,
  filterType,
  sparklineData,
  onClick,
  detailBreakdown,
}: {
  icon: React.ReactNode
  label: string
  value: number
  dailyChange: number
  weeklyChange: number
  tooltip: string
  filterType: string
  sparklineData: number[]
  onClick?: () => void
  detailBreakdown?: string
}) {
  const dailyTrend = dailyChange >= 0 ? '+' : ''
  const weeklyTrend = weeklyChange >= 0 ? '-' : '+'
  const dailyColor = dailyChange >= 0 ? '#E69F50' : '#10B981'
  const weeklyColor = weeklyChange >= 0 ? '#DC2626' : '#10B981'

  return (
    <div
      onClick={onClick}
      className="bg-white p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer"
      style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between mb-2">
              <div style={{ color: '#73847B' }}>{icon}</div>
              <button className="p-0.5 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#73847B' }} />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B', letterSpacing: '0.5px' }}>
        {label.toUpperCase()}
      </p>
      <p className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
        {value}
      </p>

      {/* Mini sparkline chart */}
      <div className="h-5 mb-2">
        <ResponsiveContainer width="100%" height={20}>
          <LineChart data={sparklineData.map((v, i) => ({ value: v }))}>
            <Line type="monotone" dataKey="value" stroke="#E69F50" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily, Weekly and Detail info */}
      <div className="flex flex-col gap-0.5 text-xs">
        <div className="flex justify-between">
          <span style={{ color: dailyColor }}>
            {dailyTrend}{Math.abs(dailyChange)} Today
          </span>
          <span style={{ color: weeklyColor }}>
            {weeklyTrend}{Math.abs(weeklyChange)} Week
          </span>
        </div>
        {detailBreakdown && (
          <p style={{ color: '#9CA3AF', fontSize: '11px' }}>
            {detailBreakdown}
          </p>
        )}
      </div>
    </div>
  )
}

// Donut chart for ticket status
function MyTicketStatusChart() {
  const { state } = useStore()
  const { userRole } = useApp()
  
  // Calculate status distribution from store with role-based filtering
  let statusCounts: Record<string, number> = {
    open: 0,
    'in-progress': 0,
    pending: 0,
    resolved: 0,
    closed: 0,
  }

  if (state?.tickets) {
    const currentUserId = state.currentUserId || 'agent1'
    let userTickets = Array.from(state.tickets.values())
    
    // Apply role-based filtering
    userTickets = filterTicketsByRole(userTickets, userRole, currentUserId)
    
    userTickets.forEach(ticket => {
      const status = ticket.status as keyof typeof statusCounts
      if (status in statusCounts) {
        statusCounts[status]++
      }
    })
  }

  const statusData = [
    { name: 'Open', value: statusCounts.open, color: '#E69F50' },
    { name: 'In Progress', value: statusCounts['in-progress'], color: '#3B82F6' },
    { name: 'Pending', value: statusCounts.pending, color: '#F59E0B' },
    { name: 'Resolved', value: statusCounts.resolved, color: '#10B981' },
    { name: 'Closed', value: statusCounts.closed, color: '#0D3133' },
  ].filter(d => d.value > 0)

  const total = statusData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>My Ticket Status</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-4 h-4" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Shows ticket distribution across all statuses.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-6">
        {/* Donut Chart */}
        <div style={{ width: '200px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {statusData.map((status) => {
            const percentage = ((status.value / total) * 100).toFixed(1)
            return (
              <div key={status.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></div>
                  <span style={{ color: '#1a1a1a' }}>{status.name}</span>
                </div>
                <div style={{ color: '#6B6B6B' }}>
                  <span className="font-semibold">{status.value}</span>
                  <span className="text-xs ml-1">({percentage}%)</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Priority breakdown with donut chart
function MyPriorityBreakdownChart() {
  const { state } = useStore()
  
  // Calculate priority distribution from store
  let priorityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  if (state?.tickets) {
    Array.from(state.tickets.values()).forEach(ticket => {
      const priority = ticket.priority as keyof typeof priorityCounts
      if (priority in priorityCounts) {
        priorityCounts[priority]++
      }
    })
  }

  const priorityData = [
    { name: 'Critical', value: priorityCounts.critical, color: '#DC2626' },
    { name: 'High', value: priorityCounts.high, color: '#E69F50' },
    { name: 'Medium', value: priorityCounts.medium, color: '#73847B' },
    { name: 'Low', value: priorityCounts.low, color: '#0D3133' },
  ].filter(d => d.value > 0)

  const total = priorityData.reduce((sum, d) => sum + d.value, 0)
  const criticalAging = priorityCounts.critical
  const highestPriority = priorityData.length > 0 ? priorityData[0].value : 0

  return (
    <div className="bg-white p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold" style={{ color: '#1a1a1a' }}>My Priority Breakdown</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-4 h-4" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Distribution of tickets by priority level.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-6">
        {/* Donut Chart */}
        <div style={{ width: '200px', height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1">
          <div className="space-y-2 mb-4">
            {priorityData.map((priority) => {
              const percentage = ((priority.value / total) * 100).toFixed(1)
              return (
                <div key={priority.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priority.color }}></div>
                    <span style={{ color: '#1a1a1a' }}>{priority.name}</span>
                  </div>
                  <div style={{ color: '#6B6B6B' }}>
                    <span className="font-semibold">{priority.value}</span>
                    <span className="text-xs ml-1">({percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Insights */}
          <div className="pt-4 border-t space-y-2" style={{ borderTopColor: '#E2E0DC' }}>
            <div className="text-xs">
              <p style={{ color: '#6B6B6B' }}>Highest Priority Ticket Count</p>
              <p className="font-semibold" style={{ color: '#DC2626' }}>{highestPriority} Critical</p>
            </div>
            <div className="text-xs">
              <p style={{ color: '#6B6B6B' }}>Critical Aging Count</p>
              <p className="font-semibold" style={{ color: '#DC2626' }}>{criticalAging} Over 4 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Ticket types with horizontal bars
function MyTicketTypesChart() {
  const router = useRouter()
  const { setTicketFilters } = useApp()
  const { state } = useStore()
  const { userRole } = useApp()

  // Calculate ticket types from store with role-based filtering
  let typeCounts: Record<string, number> = {
    'Incident': 0,
    'Service Request': 0,
    'Access Request': 0,
    'Task': 0,
  }

  if (state?.tickets) {
    const currentUserId = state.currentUserId || 'agent1'
    let userTickets = Array.from(state.tickets.values())
    
    // Apply role-based filtering
    userTickets = filterTicketsByRole(userTickets, userRole, currentUserId)
    
    userTickets.forEach(ticket => {
      const category = ticket.category || 'Task'
      if (category in typeCounts) {
        typeCounts[category]++
      }
    })
  }

  if (state?.tickets) {
    Array.from(state.tickets.values()).forEach(ticket => {
      const category = ticket.category || 'Task'
      if (category in typeCounts) {
        typeCounts[category]++
      }
    })
  }

  const ticketTypes = [
    { name: 'Incident', value: typeCounts['Incident'], color: '#DC2626' },
    { name: 'Service Request', value: typeCounts['Service Request'], color: '#E69F50' },
    { name: 'Access Request', value: typeCounts['Access Request'], color: '#3B82F6' },
    { name: 'Task', value: typeCounts['Task'], color: '#10B981' },
  ].filter(d => d.value > 0)

  const total = ticketTypes.reduce((sum, d) => sum + d.value, 0)

  const handleTypeClick = (typeName: string) => {
    const filters = { type: [typeName] }
    setTicketFilters(filters)
    navigateToTickets(router, filters)
  }

  // Ticket Type Insights
  const insights = [
    { label: 'Most Handled', type: 'Incident', value: '32 tickets', color: '#DC2626' },
    { label: 'Fastest Resolved', type: 'Task', value: 'Avg 1.2 hrs', color: '#10B981' },
    { label: 'Highest Backlog', type: 'Incident', value: '8 days old', color: '#DC2626' },
    { label: 'Oldest Active', type: 'Access Request', value: '12 days', color: '#3B82F6' },
  ]

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My Ticket Types</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Ticket type distribution with operational insights.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Ticket Type Bars */}
      <div className="space-y-2 mb-4 pb-4" style={{ borderBottom: '1px solid #E2E0DC' }}>
        {ticketTypes.map((type) => {
          const percentage = ((type.value / total) * 100).toFixed(1)
          return (
            <div key={type.name} onClick={() => handleTypeClick(type.name)} className="cursor-pointer hover:opacity-90 transition-opacity">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{type.name}</span>
                <span className="text-xs font-semibold" style={{ color: type.color }}>
                  {type.value} ({percentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: type.color,
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Insights & Donut Chart */}
      <div className="grid grid-cols-3 gap-4 items-start">
        {/* LEFT: Ticket Type Insights */}
        <div className="col-span-2 space-y-2">
          <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>TICKET TYPE INSIGHTS</p>
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#F8F8F7' }}>
              <div>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>{insight.label}</p>
                <p className="text-xs font-semibold" style={{ color: insight.color }}>{insight.type}</p>
              </div>
              <p className="text-xs font-semibold" style={{ color: insight.color }}>{insight.value}</p>
            </div>
          ))}
        </div>

        {/* RIGHT: Compact Donut Chart */}
        <div className="flex flex-col items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="mb-2">
            {/* Donut segments using SVG */}
            {ticketTypes.map((type, idx) => {
              const circumference = 2 * Math.PI * 30 // radius 30
              const offset = circumference - (type.value / total) * circumference
              const totalOffset = ticketTypes.slice(0, idx).reduce((sum, t) => {
                return sum + (t.value / total) * circumference
              }, 0)
              
              return (
                <circle
                  key={type.name}
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke={type.color}
                  strokeWidth="8"
                  strokeDasharray={`${circumference - offset} ${offset}`}
                  strokeDashoffset={-totalOffset}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50px 50px' }}
                />
              )
            })}
            {/* Inner circle */}
            <circle cx="50" cy="50" r="18" fill="white" />
            <text x="50" y="55" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#0D3133">
              {total}
            </text>
          </svg>
          <p className="text-xs font-medium text-center" style={{ color: '#6B6B6B' }}>Total Assigned</p>
        </div>
      </div>
    </div>
  )
}

// Compact task summary cards
// My SLA Health Widget
function MySLAHealth() {
  const responseSLA = 95
  const resolutionSLA = 88
  const atRiskTickets = 3
  const breachedTickets = 1

  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981'
    if (percentage >= 80) return '#F59E0B'
    return '#DC2626'
  }

  return (
    <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>My SLA Health</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Displays your current SLA performance and tickets approaching breach.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        {/* Response SLA */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: '#6B6B6B' }}>Response SLA</span>
            <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{responseSLA}%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: getHealthColor(responseSLA),
                width: `${responseSLA}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Resolution SLA */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: '#6B6B6B' }}>Resolution SLA</span>
            <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{resolutionSLA}%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: getHealthColor(resolutionSLA),
                width: `${resolutionSLA}%`,
              }}
            ></div>
          </div>
        </div>

        {/* At Risk / Breached */}
        <div className="flex gap-2 pt-2 border-t" style={{ borderTopColor: '#E2E0DC' }}>
          <div className="flex-1">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>At Risk</p>
            <p className="text-lg font-bold" style={{ color: '#F59E0B' }}>{atRiskTickets}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs" style={{ color: '#6B6B6B' }}>Breached</p>
            <p className="text-lg font-bold" style={{ color: '#DC2626' }}>{breachedTickets}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// My Workload Health Widget
function MyWorkloadHealth() {
  const assignedTickets = 24
  const averageDailyLoad = 18
  const closedToday = 8
  const oldestOpen = 3

  const calculateWorkloadScore = () => {
    const ratio = assignedTickets / averageDailyLoad
    if (ratio <= 1) return { score: 'Balanced', color: '#10B981' }
    if (ratio <= 1.5) return { score: 'Heavy', color: '#F59E0B' }
    return { score: 'Overloaded', color: '#DC2626' }
  }

  const workloadStatus = calculateWorkloadScore()

  return (
    <div className="bg-white p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>My Workload Health</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Displays your current workload compared to your average capacity.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2 text-xs mb-3">
        <div className="flex justify-between">
          <span style={{ color: '#6B6B6B' }}>Assigned Tickets</span>
          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{assignedTickets}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#6B6B6B' }}>Avg Daily Load</span>
          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{averageDailyLoad}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#6B6B6B' }}>Closed Today</span>
          <span className="font-semibold" style={{ color: '#10B981' }}>{closedToday}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: '#6B6B6B' }}>Oldest Open</span>
          <span className="font-semibold" style={{ color: '#1a1a1a' }}>{oldestOpen}d</span>
        </div>
      </div>

      <div className="pt-2 border-t flex items-center gap-2" style={{ borderTopColor: '#E2E0DC' }}>
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: workloadStatus.color }}
        ></div>
        <span className="text-xs font-semibold" style={{ color: workloadStatus.color }}>
          {workloadStatus.score}
        </span>
      </div>
    </div>
  )
}



// My Leaderboard Position Widget
function MyLeaderboardPosition() {
  const rank = 3
  const resolved = 42
  const avgResolution = 3.2
  const csatScore = 4.8

  return (
    <div
      className="bg-white p-4 rounded-lg border overflow-hidden relative"
      style={{
        borderColor: '#E69F50',
        borderWidth: '2px',
        background: 'linear-gradient(135deg, #FFFAF5 0%, #FFFBF0 100%)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>My Leaderboard Position</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#E69F50' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Your performance ranking compared to other agents.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded" style={{ backgroundColor: '#FEF3E2', border: '1px solid #E69F50' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Current Rank</p>
          <p className="text-2xl font-bold" style={{ color: '#E69F50' }}>#{rank}</p>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: '#FEF3E2', border: '1px solid #E69F50' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Resolved</p>
          <p className="text-2xl font-bold" style={{ color: '#E69F50' }}>{resolved}</p>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: '#FEF3E2', border: '1px solid #E69F50' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Avg Resolution</p>
          <p className="text-lg font-bold" style={{ color: '#E69F50' }}>{avgResolution}h</p>
        </div>
        <div className="p-3 rounded" style={{ backgroundColor: '#FEF3E2', border: '1px solid #E69F50' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>CSAT Score</p>
          <p className="text-lg font-bold" style={{ color: '#E69F50' }}>{csatScore}/5</p>
        </div>
      </div>
    </div>
  )
}

// My Aging Overview Widget

// My Action Center - THE most important widget
function MyActionCenter() {
  const router = useRouter()
  const { setTicketFilters } = useApp()

  const handleActionClick = (actionType: string) => {
    const filters: any = {}
    if (actionType === 'due-today') filters.dueToday = true
    else if (actionType === 'sla-risk') filters.slaRisk = true
    else if (actionType === 'waiting-customer') filters.waitingCustomer = true
    else if (actionType === 'critical') filters.priority = ['Critical']
    setTicketFilters(filters)
    navigateToTickets(router, filters)
  }

  const actionCards: Array<{
    label: string
    count: number
    type: string
    subtitle: string
    color: string
    bgColor: string
    actionType: string
  }> = [
    { 
      label: 'Due Today', 
      count: 3, 
      type: 'Tickets',
      subtitle: 'Requires completion today',
      color: '#E69F50', 
      bgColor: '#FEF3E2',
      actionType: 'due-today'
    },
    { 
      label: 'SLA Risk', 
      count: 2, 
      type: 'Tickets',
      subtitle: 'Approaching SLA breach',
      color: '#DC2626', 
      bgColor: '#FEE2E2',
      actionType: 'sla-risk'
    },
    { 
      label: 'Waiting Customer', 
      count: 5, 
      type: 'Tickets',
      subtitle: 'Pending customer response',
      color: '#F59E0B', 
      bgColor: '#FEF3E2',
      actionType: 'waiting-customer'
    },
    { 
      label: 'Overdue Tasks', 
      count: 1, 
      type: 'Task',
      subtitle: 'Past due date',
      color: '#DC2626', 
      bgColor: '#FEE2E2',
      actionType: 'overdue-tasks'
    },
    { 
      label: 'Critical Tickets', 
      count: 2, 
      type: 'Tickets',
      subtitle: 'High urgency tickets',
      color: '#DC2626', 
      bgColor: '#FEE2E2',
      actionType: 'critical'
    },
  ]

  const priorityQueue = [
    { ticketId: 'INC-1042', priority: 'Critical', reason: 'Response Due In 45 Minutes', time: 'URGENT' },
    { ticketId: 'INC-1055', priority: 'High', reason: 'Pending Customer', time: 'Waiting 2 Days' },
    { ticketId: 'INC-1068', priority: 'High', reason: 'Due Today', time: 'Resolution Target Today' },
  ]

  const totalAttentionTickets = 13

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return { color: '#DC2626', bg: '#FEE2E2' }
      case 'High':
        return { color: '#E69F50', bg: '#FEF3E2' }
      case 'Medium':
        return { color: '#F59E0B', bg: '#FEF3E2' }
      default:
        return { color: '#10B981', bg: '#F0FDF4' }
    }
  }

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My Action Center</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Tickets and tasks requiring immediate attention.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Action Cards - Single Row */}
      <div className="flex gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid #E2E0DC', overflow: 'auto' }}>
        {actionCards.map((card) => (
          <div
            key={card.label}
            onClick={() => handleActionClick(card.actionType)}
            className="flex-shrink-0 p-3 rounded-lg flex flex-col justify-center text-center min-w-fit cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: card.bgColor, border: `1.5px solid ${card.color}` }}
          >
            {/* Count and Type */}
            <div className="mb-0.5">
              <p className="text-xl font-bold" style={{ color: card.color }}>
                {card.count}
              </p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                {card.type}
              </p>
            </div>

            {/* Label */}
            <p className="text-xs font-semibold mb-1" style={{ color: card.color }}>
              {card.label}
            </p>

            {/* Subtitle */}
            <p className="text-xs leading-tight" style={{ color: '#6B6B6B', fontSize: '10px' }}>
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Today's Priority Queue */}
      <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>TODAY'S PRIORITY QUEUE</p>
        <div className="space-y-1.5">
          {priorityQueue.map((item, idx) => {
            const badgeColor = getPriorityBadgeColor(item.priority)
            return (
              <div
                key={idx}
                className="p-2 rounded flex items-center justify-between text-xs"
                style={{ backgroundColor: '#F8F8F7' }}
              >
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {/* Ticket ID */}
                  <span className="font-mono font-bold" style={{ color: '#0D3133' }}>
                    {item.ticketId}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className="px-1.5 py-0 rounded text-xs font-semibold whitespace-nowrap"
                    style={{ backgroundColor: badgeColor.bg, color: badgeColor.color, fontSize: '10px' }}
                  >
                    {item.priority}
                  </span>

                  {/* Reason */}
                  <span style={{ color: '#6B6B6B', flex: 1 }}>
                    {item.reason}
                  </span>
                </div>

                {/* Time Indicator */}
                <span
                  className="text-xs font-semibold whitespace-nowrap ml-1 px-1.5 py-0 rounded"
                  style={{
                    color: item.time === 'URGENT' ? '#DC2626' : '#6B6B6B',
                    backgroundColor: item.time === 'URGENT' ? '#FEE2E2' : '#E2E0DC20',
                    fontSize: '10px',
                  }}
                >
                  {item.time}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compact Footer Strip */}
      <div className="flex items-center justify-between text-xs" style={{ color: '#6B6B6B' }}>
        <span className="font-medium">Attention Required Today:</span>
        <div className="flex gap-3 ml-auto">
          <span><span className="font-bold" style={{ color: '#E69F50' }}>13</span> total</span>
          <span><span className="font-bold" style={{ color: '#DC2626' }}>2</span> critical</span>
          <span><span className="font-bold" style={{ color: '#DC2626' }}>2</span> SLA risk</span>
          <span><span className="font-bold" style={{ color: '#E69F50' }}>3</span> due today</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced My SLA Health with status indicator
function MySLAHealthEnhanced() {
  const responseSLA = 95
  const resolutionSLA = 88
  const atRiskTickets = 3
  const breachedTickets = 1
  const responseTrend = '+2%'
  const resolutionTrend = '-1%'
  const lastBreach = '2 days ago'
  const oldestAtRisk = 'INC-1055 (45 min)'

  const getHealthColor = (percentage: number) => {
    if (percentage >= 90) return '#10B981'
    if (percentage >= 80) return '#F59E0B'
    return '#DC2626'
  }

  const getHealthStatus = (resp: number, resol: number) => {
    if (resp >= 90 && resol >= 90) return { label: 'Healthy', color: '#10B981' }
    if (resp >= 80 && resol >= 80) return { label: 'Warning', color: '#F59E0B' }
    return { label: 'Critical', color: '#DC2626' }
  }

  const healthStatus = getHealthStatus(responseSLA, resolutionSLA)

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My SLA Health</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">SLA compliance, trends, and at-risk tickets.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* SLA Metrics */}
      <div className="space-y-1.5 mb-3 pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs" style={{ color: '#6B6B6B' }}>Response SLA</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{responseSLA}%</span>
              <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{responseTrend}</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
            <div className="h-full rounded-full" style={{ backgroundColor: getHealthColor(responseSLA), width: `${responseSLA}%` }}></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs" style={{ color: '#6B6B6B' }}>Resolution SLA</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{resolutionSLA}%</span>
              <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>{resolutionTrend}</span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
            <div className="h-full rounded-full" style={{ backgroundColor: getHealthColor(resolutionSLA), width: `${resolutionSLA}%` }}></div>
          </div>
        </div>
      </div>

      {/* Status & Risk Summary */}
      <div className="grid grid-cols-3 gap-2 mb-3 pb-3 text-center" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div className="text-xs">
          <p style={{ color: '#6B6B6B' }}>At Risk</p>
          <p className="font-bold text-sm" style={{ color: '#F59E0B' }}>{atRiskTickets}</p>
        </div>
        <div className="text-xs">
          <p style={{ color: '#6B6B6B' }}>Breached</p>
          <p className="font-bold text-sm" style={{ color: '#DC2626' }}>{breachedTickets}</p>
        </div>
        <div className="text-xs">
          <p style={{ color: '#6B6B6B' }}>Status</p>
          <p className="font-bold text-sm" style={{ color: healthStatus.color }}>{healthStatus.label}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-1 text-xs">
        <div className="flex items-center justify-between">
          <span style={{ color: '#6B6B6B' }}>Last Breach:</span>
          <span className="font-medium" style={{ color: '#0D3133' }}>{lastBreach}</span>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: '#6B6B6B' }}>Oldest At-Risk:</span>
          <span className="font-mono text-xs font-bold" style={{ color: '#DC2626' }}>{oldestAtRisk}</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced My Workload Health with capacity meter
function MyWorkloadHealthEnhanced() {
  const assignedTickets = 24
  const closedToday = 8
  const oldestOpen = 3
  const slaRiskCount = 2

  // Capacity calculation (68% based on requirements)
  const capacityPercentage = 68
  const getCapacityStatus = (percentage: number) => {
    if (percentage <= 60) return { label: 'Balanced', color: '#10B981' }
    if (percentage <= 85) return { label: 'Heavy', color: '#E69F50' }
    return { label: 'Overloaded', color: '#DC2626' }
  }
  const capacityStatus = getCapacityStatus(capacityPercentage)

  // Priority load data
  const priorityLoad = [
    { label: 'Critical', count: 3, color: '#DC2626' },
    { label: 'High', count: 12, color: '#E69F50' },
    { label: 'Medium', count: 8, color: '#F59E0B' },
    { label: 'Low', count: 1, color: '#10B981' },
  ]
  const totalPriority = priorityLoad.reduce((sum, p) => sum + p.count, 0)

  // Attention required items
  const attentionItems = [
    { type: 'oldest', label: 'Oldest Ticket', ticketId: 'INC-1042', detail: 'Open for 5 Days', color: '#E69F50' },
    { type: 'sla', label: 'SLA Risk', ticketId: 'INC-1055', detail: 'Response Due in 45 Minutes', color: '#DC2626' },
    { type: 'critical', label: 'Critical Ticket', ticketId: 'INC-1068', detail: 'Waiting for Update', color: '#DC2626' },
  ]

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My Workload Health</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Capacity, workload, priority distribution, and items requiring attention.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* SECTION 1: CAPACITY UTILIZATION */}
      <div className="mb-3 pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Capacity Utilization</span>
          <span className="text-sm font-bold" style={{ color: capacityStatus.color }}>{capacityPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: capacityStatus.color, width: `${capacityPercentage}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: capacityStatus.color }}></div>
          <span className="text-xs font-medium" style={{ color: capacityStatus.color }}>{capacityStatus.label}</span>
        </div>
      </div>

      {/* SECTION 2: WORKLOAD SNAPSHOT */}
      <div className="mb-3 pb-3 grid grid-cols-4 gap-2" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div className="p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Assigned</p>
          <p className="text-base font-bold" style={{ color: '#0D3133' }}>{assignedTickets}</p>
        </div>
        <div className="p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Closed</p>
          <p className="text-base font-bold" style={{ color: '#10B981' }}>{closedToday}</p>
        </div>
        <div className="p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Oldest</p>
          <p className="text-base font-bold" style={{ color: '#0D3133' }}>{oldestOpen}d</p>
        </div>
        <div className="p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>SLA Risk</p>
          <p className="text-base font-bold" style={{ color: '#DC2626' }}>{slaRiskCount}</p>
        </div>
      </div>

      {/* SECTION 3: PRIORITY LOAD */}
      <div className="mb-3 pb-3 space-y-1.5" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Priority Load</p>
        {priorityLoad.map((priority) => {
          const percentage = (priority.count / totalPriority) * 100
          return (
            <div key={priority.label}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs" style={{ color: '#1a1a1a' }}>{priority.label}</span>
                <span className="text-xs font-semibold" style={{ color: priority.color }}>{priority.count}</span>
              </div>
              <div className="w-full h-1 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                <div
                  className="h-full rounded-full"
                  style={{ backgroundColor: priority.color, width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* SECTION 4: ATTENTION REQUIRED */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: '#6B6B6B' }}>Attention Required</p>
        <div className="space-y-1.5">
          {attentionItems.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded flex items-start gap-2"
              style={{
                backgroundColor: item.color + '10',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{item.label}</p>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="font-mono text-xs font-bold" style={{ color: '#0D3133' }}>
                    {item.ticketId}
                  </span>
                  <span className="text-xs" style={{ color: '#6B6B6B' }}>{item.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Enhanced My Tasks widget
// My Ticket Focus - Work Pattern & Effort Distribution Widget
// My Group Tickets Overview - Agent Support Group Ticket Management Widget
function MyGroupTicketsOverview() {
  const router = useRouter()
  const { setTicketFilters } = useApp()
  const { state } = useStore()
  const { userRole } = useApp()

  const currentUserId = state?.currentUserId || 'agent1'
  const currentUser = state?.users.get(currentUserId)

  // Get user's support groups - filter to only groups assigned to this agent
  const userGroups = currentUser?.supportGroups || ['Infrastructure', 'Network']

  // Calculate group ticket counts
  const groupTicketCounts: Record<string, { open: number; inProgress: number; resolved: number; risk: number }> = {}

  if (state?.tickets) {
    userGroups.forEach(group => {
      groupTicketCounts[group] = { open: 0, inProgress: 0, resolved: 0, risk: 0 }
    })

    Array.from(state.tickets.values()).forEach(ticket => {
      const ticketGroup = ticket.supportGroup || 'Infrastructure'
      if (userGroups.includes(ticketGroup)) {
        const groupData = groupTicketCounts[ticketGroup]
        if (ticket.status === 'open') groupData.open++
        else if (ticket.status === 'in-progress') groupData.inProgress++
        else if (ticket.status === 'resolved' || ticket.status === 'closed') groupData.resolved++

        if (ticket.priority === 'critical' || ticket.atRisk) {
          groupData.risk++
        }
      }
    })
  }

  // Calculate summary
  const totalGroupTickets = Object.values(groupTicketCounts).reduce(
    (sum, group) => sum + group.open + group.inProgress + group.resolved,
    0
  )
  const totalAtRisk = Object.values(groupTicketCounts).reduce((sum, group) => sum + group.risk, 0)
  const groupsAssigned = userGroups.length

  const handleGroupClick = (groupName: string) => {
    const filters = { supportGroup: [groupName], assignedTo: [currentUserId] }
    setTicketFilters(filters)
    navigateToTickets(router, filters)
  }

  const handleRefresh = () => {
    console.log('[v0] Refreshing group tickets...')
    // Refresh logic handled by parent component
  }

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My Group Tickets Overview</h3>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleRefresh}
                  className="p-1 rounded hover:opacity-70 transition-opacity"
                  title="Refresh data"
                >
                  <Activity className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Refresh group ticket data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded hover:opacity-70">
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">View tickets assigned to your support groups for quick operational visibility.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="flex gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Total Group Tickets</p>
          <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{totalGroupTickets}</p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Groups Assigned</p>
          <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{groupsAssigned}</p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#FEF2F2' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>At Risk</p>
          <p className="text-sm font-bold" style={{ color: '#DC2626' }}>{totalAtRisk}</p>
        </div>
      </div>

      {/* Group Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {userGroups.map(groupName => {
          const groupData = groupTicketCounts[groupName]
          if (!groupData) return null

          const groupTotal = groupData.open + groupData.inProgress + groupData.resolved

          return (
            <div
              key={groupName}
              onClick={() => handleGroupClick(groupName)}
              className="p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md"
              style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold" style={{ color: '#1a1a1a' }}>{groupName}</h4>
                <ChevronRight className="w-4 h-4" style={{ color: '#6B6B6B' }} />
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>Open</span>
                  <span className="font-semibold" style={{ color: '#E69F50' }}>{groupData.open}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>In Progress</span>
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>{groupData.inProgress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>Resolved</span>
                  <span className="font-semibold" style={{ color: '#10B981' }}>{groupData.resolved}</span>
                </div>
                {groupData.risk > 0 && (
                  <div className="flex items-center justify-between pt-1.5" style={{ borderTop: '1px solid #E2E0DC' }}>
                    <span style={{ color: '#6B6B6B' }}>Risk</span>
                    <span className="font-semibold" style={{ color: '#DC2626' }}>{groupData.risk}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2" style={{ borderTop: '1px solid #E2E0DC' }}>
                <p className="text-xs font-medium" style={{ color: '#73847B' }}>Total: {groupTotal} ticket{groupTotal !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Enhanced My Tasks widget
// My Ticket Focus - Work Pattern & Effort Distribution Widget
// My Tasks Workspace - Task Management Widget (DEPRECATED - Use MyGroupTicketsOverview)
function MyTasksWorkspace() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = React.useState<'all' | 'open' | 'in-progress' | 'due-today' | 'overdue' | 'completed'>('all')
  const [selectedTaskIdx, setSelectedTaskIdx] = React.useState(0)

  const tasksData = [
    {
      id: 'TSK-1045',
      name: 'Review VPN Access',
      priority: 'High',
      dueDate: 'Due Today',
      status: 'Open',
      description: 'Verify user permissions and update VPN profile access.',
      linkedTicket: { id: 'INC-1045', subject: 'VPN Access Request', status: 'In Progress' },
      createdBy: 'Mike Johnson',
    },
    {
      id: 'TSK-1046',
      name: 'Reset User Account',
      priority: 'Medium',
      dueDate: 'Tomorrow',
      status: 'In Progress',
      description: 'Complete password reset and verify account access.',
      linkedTicket: { id: 'INC-1042', subject: 'Account Reset Request', status: 'Open' },
      createdBy: 'Sarah Wilson',
    },
    {
      id: 'TSK-1047',
      name: 'Update Documentation',
      priority: 'Low',
      dueDate: 'Friday',
      status: 'Open',
      description: 'Update API documentation for latest changes.',
      linkedTicket: { id: 'INC-1038', subject: 'API Documentation', status: 'Closed' },
      createdBy: 'Tom Davis',
    },
    {
      id: 'TSK-1048',
      name: 'Review Access Request',
      priority: 'High',
      dueDate: 'Due Today',
      status: 'Open',
      description: 'Approve or deny pending access requests.',
      linkedTicket: { id: 'INC-1050', subject: 'Database Access', status: 'In Progress' },
      createdBy: 'Lisa Chen',
    },
    {
      id: 'TSK-1049',
      name: 'Deploy Configuration',
      priority: 'Critical',
      dueDate: 'Overdue',
      status: 'Overdue',
      description: 'Deploy configuration changes to production.',
      linkedTicket: { id: 'INC-1051', subject: 'Config Deployment', status: 'In Progress' },
      createdBy: 'John Smith',
    },
    {
      id: 'TSK-1050',
      name: 'Verify User Permissions',
      priority: 'Medium',
      dueDate: 'Today',
      status: 'In Progress',
      description: 'Verify all user permissions are correctly set.',
      linkedTicket: { id: 'INC-1044', subject: 'Permission Verification', status: 'Open' },
      createdBy: 'Mike Johnson',
    },
    {
      id: 'TSK-1051',
      name: 'Test Email Integration',
      priority: 'High',
      dueDate: 'Due Today',
      status: 'Open',
      description: 'Test email integration with new provider.',
      linkedTicket: { id: 'INC-1046', subject: 'Email Provider Upgrade', status: 'In Progress' },
      createdBy: 'Sarah Wilson',
    },
    {
      id: 'TSK-1052',
      name: 'Update Server Logs',
      priority: 'Low',
      dueDate: 'Tomorrow',
      status: 'Open',
      description: 'Archive and compress old server logs.',
      linkedTicket: { id: 'INC-1047', subject: 'Server Maintenance', status: 'Closed' },
      createdBy: 'Tom Davis',
    },
  ]

  // Calculate summary counts
  const openTasks = tasksData.filter(t => t.status === 'Open').length
  const inProgressTasks = tasksData.filter(t => t.status === 'In Progress').length
  const dueTodayTasks = tasksData.filter(t => t.dueDate === 'Due Today' || t.dueDate === 'Today').length
  const overdueTasks = tasksData.filter(t => t.status === 'Overdue').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#6B6B6B'
      case 'In Progress': return '#3B82F6'
      case 'Completed': return '#2A9D8F'
      case 'Overdue': return '#E76F51'
      default: return '#6B6B6B'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return '#E76F51'
      case 'High': return '#E69F50'
      case 'Medium': return '#3B82F6'
      case 'Low': return '#2A9D8F'
      default: return '#6B6B6B'
    }
  }

  const filterOptions = [
    { label: 'All', value: 'all' as const },
    { label: 'Open', value: 'open' as const },
    { label: 'In Progress', value: 'in-progress' as const },
    { label: 'Due Today', value: 'due-today' as const },
    { label: 'Overdue', value: 'overdue' as const },
    { label: 'Completed', value: 'completed' as const },
  ]

  const filteredTasks = activeFilter === 'all'
    ? tasksData
    : tasksData.filter(t => {
        if (activeFilter === 'open') return t.status === 'Open'
        if (activeFilter === 'in-progress') return t.status === 'In Progress'
        if (activeFilter === 'due-today') return t.dueDate === 'Due Today' || t.dueDate === 'Today'
        if (activeFilter === 'overdue') return t.status === 'Overdue'
        if (activeFilter === 'completed') return t.status === 'Completed'
        return true
      })

  const selectedTask = filteredTasks[selectedTaskIdx] || filteredTasks[0]

  return (
    <div className="bg-white p-5 rounded-lg border" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-base" style={{ color: '#1a1a1a' }}>My Tasks Workspace</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded hover:opacity-70">
                <Info className="w-3.5 h-3.5" style={{ color: '#6B6B6B' }} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Displays your active tasks, upcoming work, and task details without leaving the dashboard.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Task Summary Strip */}
      <div className="flex gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Open Tasks</p>
          <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{openTasks}</p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>In Progress</p>
          <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{inProgressTasks}</p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Due Today</p>
          <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{dueTodayTasks}</p>
        </div>
        <div className="px-3 py-1.5 rounded" style={{ backgroundColor: '#F0F0F0' }}>
          <p className="text-xs" style={{ color: '#6B6B6B' }}>Overdue</p>
          <p className="text-sm font-bold" style={{ color: '#E76F51' }}>{overdueTasks}</p>
        </div>
      </div>

      {/* Main Content: Task List + Preview */}
      <div className="grid grid-cols-3 gap-4">
        {/* LEFT SIDE - Task List (65%) */}
        <div className="col-span-2">
          {/* Filter Bar */}
          <div className="flex gap-1.5 mb-2 pb-2 overflow-x-auto" style={{ borderBottom: '1px solid #E2E0DC' }}>
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setActiveFilter(option.value)
                  setSelectedTaskIdx(0)
                }}
                className="px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: activeFilter === option.value ? '#0D3133' : '#F8F8F7',
                  color: activeFilter === option.value ? 'white' : '#6B6B6B',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Task Table */}
          <div className="space-y-0">
            {filteredTasks.slice(0, 8).map((task, idx) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskIdx(idx)}
                className="flex items-center justify-between py-2 px-2 rounded cursor-pointer transition-all hover:opacity-90"
                style={{
                  backgroundColor: idx === selectedTaskIdx ? '#F0F0F0' : 'transparent',
                  borderLeft: idx === selectedTaskIdx ? '3px solid #E69F50' : 'none',
                  borderBottom: idx < Math.min(8, filteredTasks.length) - 1 ? '1px solid #E2E0DC' : 'none',
                }}
              >
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono font-bold" style={{ color: '#0D3133' }}>
                      {task.id}
                    </span>
                    <span style={{ color: '#6B6B6B' }}>{task.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-1.5 py-0 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: getPriorityColor(task.priority) + '20',
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span style={{ color: '#73847B', fontSize: '10px' }}>{task.dueDate}</span>
                    <span
                      className="px-1.5 py-0 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: getStatusColor(task.status) + '20',
                        color: getStatusColor(task.status),
                      }}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Task Preview Panel (35%) */}
        <div className="pl-3" style={{ borderLeft: '1px solid #E2E0DC' }}>
          {selectedTask ? (
            <div className="space-y-2">
              {/* Task Name */}
              <div className="pb-2" style={{ borderBottom: '1px solid #E2E0DC' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>TASK NAME</p>
                <p className="text-sm font-bold" style={{ color: '#0D3133' }}>
                  {selectedTask.name}
                </p>
              </div>

              {/* Task Description */}
              <div className="pb-2" style={{ borderBottom: '1px solid #E2E0DC' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>DESCRIPTION</p>
                <p className="text-xs" style={{ color: '#1a1a1a' }}>
                  {selectedTask.description}
                </p>
              </div>

              {/* Linked Ticket */}
              <div className="pb-2" style={{ borderBottom: '1px solid #E2E0DC' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>LINKED TICKET</p>
                <div
                  onClick={() => router.push(`/tickets/${selectedTask.linkedTicket.id}`)}
                  className="p-2 rounded cursor-pointer transition-opacity hover:opacity-80"
                  style={{ backgroundColor: '#F8F8F7' }}
                >
                  <p className="text-xs font-mono font-bold mb-0.5" style={{ color: '#E69F50' }}>
                    {selectedTask.linkedTicket.id}
                  </p>
                  <p className="text-xs mb-0.5" style={{ color: '#1a1a1a' }}>
                    {selectedTask.linkedTicket.subject}
                  </p>
                  <p className="text-xs font-semibold" style={{ color: '#2A9D8F' }}>
                    {selectedTask.linkedTicket.status}
                  </p>
                </div>
              </div>

              {/* Priority */}
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>PRIORITY</p>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: getPriorityColor(selectedTask.priority) + '20',
                    color: getPriorityColor(selectedTask.priority),
                  }}
                >
                  {selectedTask.priority}
                </span>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>STATUS</p>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: getStatusColor(selectedTask.status) + '20',
                    color: getStatusColor(selectedTask.status),
                  }}
                >
                  {selectedTask.status}
                </span>
              </div>

              {/* Due Date */}
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>DUE DATE</p>
                <p className="text-xs font-semibold" style={{ color: '#0D3133' }}>
                  {selectedTask.dueDate}
                </p>
              </div>

              {/* Created By */}
              <div className="pb-2" style={{ borderBottom: '1px solid #E2E0DC' }}>
                <p className="text-xs font-medium mb-0.5" style={{ color: '#6B6B6B' }}>CREATED BY</p>
                <p className="text-xs" style={{ color: '#0D3133' }}>
                  {selectedTask.createdBy}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 flex gap-1.5">
                <button
                  onClick={() => {
                    console.log('[v0] Start Task clicked:', selectedTask.id)
                    // Update task status to In Progress
                  }}
                  className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#3B82F6', color: 'white' }}
                >
                  Start Task
                </button>
                <button
                  onClick={() => {
                    console.log('[v0] Complete Task clicked:', selectedTask.id)
                    // Update task status to Completed
                  }}
                  className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#2A9D8F', color: 'white' }}
                >
                  Complete
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-center" style={{ color: '#6B6B6B' }}>Select a task to view details</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function AgentDashboard() {
  const router = useRouter()
  const { setTicketFilters } = useApp()
  const { state } = useStore()
  
  // Get current agent user ID (default to agent1 for demo)
  const userId = state?.currentUserId || 'agent1'
  const user = state?.users.get(userId)
  const userTickets = state ? Array.from(state.tickets.values()).filter(t => t.assignedTo === userId) : []

  // Calculate KPI values from store
  const openTickets = userTickets.filter(t => t.status === 'open').length
  const inProgressTickets = userTickets.filter(t => t.status === 'in-progress').length
  const pendingTickets = userTickets.filter(t => t.status === 'pending').length
  const resolvedTickets = userTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

  // Sparkline data for KPI cards (mock 7-day trend)
  const sparklineData = {
    open: [20, 22, 21, 23, 24, 25, openTickets],
    inProgress: [10, 11, 10, 12, 11, 12, inProgressTickets],
    pending: [4, 5, 4, 4, 5, 5, pendingTickets],
    resolved: [5, 6, 7, 6, 8, 8, resolvedTickets],
  }

  const handleKPIClick = (filterType: string) => {
    const filters: any = {}
    if (filterType === 'open') {
      filters.status = ['open']
    } else if (filterType === 'in-progress') {
      filters.status = ['in-progress']
    } else if (filterType === 'pending') {
      filters.status = ['pending']
    } else if (filterType === 'resolved') {
      filters.status = ['resolved', 'closed']
    }
    setTicketFilters(filters)
    navigateToTickets(router, filters)
  }

  return (
    <div className="flex-1 p-8 overflow-auto" style={{ backgroundColor: '#F8F8F7' }}>
      {/* ROW 1 - Personal KPI Cards */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <EnhancedKPICard
            icon={<Ticket className="w-5 h-5" />}
            label="Open Tickets"
            value={openTickets}
            dailyChange={0}
            weeklyChange={0}
            tooltip="Tickets currently assigned to you that are not resolved or closed."
            filterType="open"
            sparklineData={sparklineData.open}
            onClick={() => handleKPIClick('open')}
          />
          <EnhancedKPICard
            icon={<CircleCheckBig className="w-5 h-5" />}
            label="In Progress"
            value={inProgressTickets}
            dailyChange={2}
            weeklyChange={-1}
            tooltip="Tickets actively being worked on."
            filterType="in-progress"
            sparklineData={sparklineData.inProgress}
            onClick={() => handleKPIClick('in-progress')}
          />
          <EnhancedKPICard
            icon={<Calendar className="w-5 h-5" />}
            label="Pending"
            value={pendingTickets}
            dailyChange={0}
            weeklyChange={2}
            tooltip="Tickets awaiting customer or vendor response."
            filterType="pending"
            sparklineData={sparklineData.pending}
            onClick={() => handleKPIClick('pending')}
          />
          <EnhancedKPICard
            icon={<CheckCircle2 className="w-5 h-5" />}
            label="Resolved Today"
            value={resolvedTickets}
            dailyChange={3}
            weeklyChange={-2}
            tooltip="Tickets successfully resolved today."
            filterType="resolved-today"
            sparklineData={sparklineData.resolved}
            onClick={() => handleKPIClick('resolved')}
          />
        </div>
      </div>

      {/* ROW 2 - Ticket Status & Priority Breakdown */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MyTicketStatusChart />
          <MyPriorityBreakdownChart />
        </div>
      </div>

      {/* ROW 3 - My Action Center & My SLA Health */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <MyActionCenter />
          </div>
          <MySLAHealthEnhanced />
        </div>
      </div>

      {/* ROW 4 - My Workload Health & Ticket Type Distribution */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MyWorkloadHealthEnhanced />
          <MyTicketTypesChart />
        </div>
      </div>

      {/* ROW 5 - My Group Tickets Overview (Full Width) */}
      <div className="mb-6">
        <MyGroupTicketsOverview />
      </div>


      {/* End of Dashboard */}

      {/* ROW 7 - My Leaderboard Position & My Performance */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MyLeaderboardPosition />
          <MyPerformance userId={userId} />
        </div>
      </div>

    </div>
  )
}
