'use client'

import { useApp } from '@/app/app-context'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { AgentDashboard } from '@/components/agent-dashboard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Plus, RotateCcw, Calendar, Download, Info } from 'lucide-react'

export default function DashboardPage() {
  const { userRole, dashboardView, setDashboardView } = useApp()

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header - NOT Sticky */}
        <div className="bg-white border-b" style={{ borderBottomColor: '#E2E0DC' }}>
          <div className="px-8 py-4">
            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold leading-tight" style={{ color: '#1a1a1a' }}>Dashboard</h1>
                <p className="text-sm mt-1 line-clamp-1" style={{ color: '#6B6B6B' }}>
                  {userRole === 'agent' 
                    ? 'Monitor your assigned tickets, priorities, tasks, and daily performance.'
                    : 'Monitor team operations, workload, SLA health, and performance.'}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {userRole === 'manager' ? (
                  <>
                    {/* Date Range Filter */}
                    <Select defaultValue="7d">
                      <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}>
                        <Calendar className="w-4 h-4 mr-2" style={{ color: '#6B6B6B' }} />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Refresh Button */}
                    <button 
                      className="p-2 rounded-lg transition-all" 
                      style={{ backgroundColor: '#F8F8F7', color: '#6B6B6B' }} 
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E0DC'} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8F8F7'}
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    
                    {/* Export Dashboard Button */}
                    <button 
                      className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2" 
                      style={{ backgroundColor: '#F8F8F7', color: '#1a1a1a', border: '1px solid #E2E0DC' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E0DC'} 
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8F8F7'}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </>
                ) : (
                  <>
                    <button className="p-2 rounded-lg transition-all" style={{ backgroundColor: '#F8F8F7', color: '#6B6B6B' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E0DC'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F8F8F7'}>
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center gap-2" style={{ backgroundColor: '#0D3133' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                      <Plus className="w-4 h-4" />
                      New Ticket
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Dashboard Switcher - Manager Only */}
            {userRole === 'manager' && (
              <div className="mt-4 flex items-center gap-3">
                <div 
                  className="inline-flex rounded-lg p-1" 
                  style={{ backgroundColor: '#F8F8F7', border: '1px solid #E2E0DC' }}
                >
                  <button
                    onClick={() => setDashboardView('my')}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      backgroundColor: dashboardView === 'my' ? '#E69F50' : 'transparent',
                      color: dashboardView === 'my' ? 'white' : '#6B6B6B',
                    }}
                  >
                    Personal View
                  </button>
                  <button
                    onClick={() => setDashboardView('team')}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all"
                    style={{
                      backgroundColor: dashboardView === 'team' ? '#E69F50' : 'transparent',
                      color: dashboardView === 'team' ? 'white' : '#6B6B6B',
                    }}
                  >
                    Team View
                  </button>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 rounded hover:opacity-70">
                        <Info className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm max-w-xs">Personal View: Your own tickets and tasks. Team View: Team operations and performance.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Content - Agent or Manager View */}
        {userRole === 'agent' ? (
          <AgentDashboard />
        ) : (
          <div className="flex-1 overflow-auto">
            {/* Personal View - Reuse Agent Dashboard */}
            {dashboardView === 'my' && (
              <AgentDashboard />
            )}

            {/* Team View - Manager-specific operational dashboard */}
            {dashboardView === 'team' && (
              <ManagerTeamDashboard />
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

import Link from 'next/link'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { AlertTriangle, Users, Clock, TrendingUp, Star, ChevronRight } from 'lucide-react'

// Widget wrapper with info tooltip
function WidgetCard({ 
  title, 
  tooltip, 
  children, 
  className = '',
  action,
}: { 
  title: string
  tooltip: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div 
      className={`bg-white ${className}`}
      style={{ borderColor: '#E2E0DC', borderWidth: '1px', borderRadius: '12px', padding: '20px' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-0.5 rounded hover:opacity-70">
                  <Info className="w-3.5 h-3.5" style={{ color: '#73847B' }} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function ManagerTeamDashboard() {
  const [leaderboardTab, setLeaderboardTab] = useState<'resolved' | 'csat' | 'response'>('resolved')

  // Row 1 - Executive KPIs
  const executiveKPIs = [
    { label: 'Total Tickets', value: 124, trend: '+12 vs last week', href: '/tickets', tooltip: 'Total tickets managed by team. Click to view all.' },
    { label: 'Open Tickets', value: 48, trend: '+5 vs yesterday', href: '/tickets?status=open', tooltip: 'Awaiting work. High count may need attention.' },
    { label: 'In Progress', value: 32, trend: '+3 vs yesterday', href: '/tickets?status=in-progress', tooltip: 'Actively being worked. Monitor for stalls.' },
    { label: 'Resolved', value: 44, trend: '+8 vs yesterday', href: '/tickets?status=resolved', tooltip: 'Completed this period. Track team productivity.' },
    { label: 'At Risk SLA', value: 7, trend: '3 critical', isWarning: true, href: '/sla-analytics', tooltip: 'Tickets at risk of breach. Immediate action required.' },
  ]

  // Row 2 - Ticket Flow Data with summary
  const ticketFlowData = [
    { day: 'Mon', created: 18, resolved: 15, backlog: 45 },
    { day: 'Tue', created: 22, resolved: 20, backlog: 47 },
    { day: 'Wed', created: 16, resolved: 24, backlog: 39 },
    { day: 'Thu', created: 25, resolved: 19, backlog: 45 },
    { day: 'Fri', created: 20, resolved: 22, backlog: 43 },
    { day: 'Sat', created: 8, resolved: 12, backlog: 39 },
    { day: 'Sun', created: 5, resolved: 8, backlog: 36 },
  ]
  const totalCreated = ticketFlowData.reduce((sum, d) => sum + d.created, 0)
  const totalResolved = ticketFlowData.reduce((sum, d) => sum + d.resolved, 0)
  const backlogChange = totalResolved - totalCreated

  // Row 2 - SLA Health Data with risk owners
  const slaHealth = {
    response: { met: 92, total: 100 },
    resolution: { met: 87, total: 100 },
    breached: 3,
    atRisk: 7,
    riskOwners: [
      { name: 'Sarah Chen', count: 3 },
      { name: 'Mike Johnson', count: 2 },
      { name: 'Emily Davis', count: 2 },
    ],
  }

  // Row 3 - Workload Distribution with capacity %
  const workloadData = [
    { name: 'Sarah C.', tickets: 18, capacity: 15, pct: 120 },
    { name: 'Mike J.', tickets: 12, capacity: 15, pct: 80 },
    { name: 'Emily D.', tickets: 8, capacity: 15, pct: 53 },
    { name: 'John S.', tickets: 14, capacity: 15, pct: 93 },
    { name: 'Lisa M.', tickets: 6, capacity: 15, pct: 40 },
  ]
  const getCapacityColor = (pct: number) => pct > 90 ? '#DC2626' : pct > 70 ? '#E69F50' : '#10B981'

  // Row 3 - Agent Availability with names
  const agentAvailability = [
    { name: 'Available', value: 5, color: '#10B981', agents: ['Sarah Chen', 'Mike Johnson', 'Emily Davis', 'John Smith', 'Lisa Martinez'] },
    { name: 'Busy', value: 3, color: '#E69F50', agents: ['Tom Wilson', 'Anna Brown', 'Chris Lee'] },
    { name: 'Away', value: 1, color: '#73847B', agents: ['David Kim'] },
    { name: 'Offline', value: 1, color: '#DC2626', agents: ['Rachel Green'] },
  ]
  const totalAgents = agentAvailability.reduce((sum, a) => sum + a.value, 0)

  // Row 4 - Leaderboard with multiple rankings
  const leaderboardData = {
    resolved: [
      { rank: 1, name: 'Sarah Chen', value: 28, label: 'resolved' },
      { rank: 2, name: 'Mike Johnson', value: 24, label: 'resolved' },
      { rank: 3, name: 'Emily Davis', value: 22, label: 'resolved' },
    ],
    csat: [
      { rank: 1, name: 'Emily Davis', value: 4.9, label: 'csat' },
      { rank: 2, name: 'Sarah Chen', value: 4.8, label: 'csat' },
      { rank: 3, name: 'Lisa Martinez', value: 4.7, label: 'csat' },
    ],
    response: [
      { rank: 1, name: 'John Smith', value: '8m', label: 'avg' },
      { rank: 2, name: 'Emily Davis', value: '12m', label: 'avg' },
      { rank: 3, name: 'Mike Johnson', value: '15m', label: 'avg' },
    ],
  }

  // Row 4 - CSAT Distribution with survey stats
  const csatData = [
    { rating: '5 Stars', count: 45, color: '#10B981' },
    { rating: '4 Stars', count: 28, color: '#73847B' },
    { rating: '3 Stars', count: 12, color: '#E69F50' },
    { rating: '1-2 Stars', count: 5, color: '#DC2626' },
  ]
  const totalResponses = csatData.reduce((sum, c) => sum + c.count, 0)
  const positiveCount = csatData[0].count + csatData[1].count
  const neutralCount = csatData[2].count
  const negativeCount = csatData[3].count
  const surveyResponseRate = 68
  const csatTrend = { direction: 'up', value: 0.2 }
  const highestRatedGroup = { name: 'IT Support', score: 4.8 }
  const lowestRatedGroup = { name: 'Facilities', score: 3.9 }

  // New: Group Distribution
  const groupDistribution = [
    { name: 'IT', count: 48, pct: 39, href: '/tickets?group=IT' },
    { name: 'HR', count: 28, pct: 23, href: '/tickets?group=HR' },
    { name: 'Facility', count: 22, pct: 18, href: '/tickets?group=Facility' },
    { name: 'Finance', count: 16, pct: 13, href: '/tickets?group=Finance' },
    { name: 'Admin', count: 10, pct: 8, href: '/tickets?group=Admin' },
  ]

  // New: Level Distribution
  const levelDistribution = [
    { name: 'L1', count: 72, pct: 58, color: '#10B981', href: '/tickets?level=L1' },
    { name: 'L2', count: 38, pct: 31, color: '#E69F50', href: '/tickets?level=L2' },
    { name: 'L3', count: 14, pct: 11, color: '#DC2626', href: '/tickets?level=L3' },
  ]

  // New: Status Intelligence
  const statusDistribution = [
    { name: 'New', count: 18, pct: 15, color: '#3B82F6', href: '/tickets?status=new' },
    { name: 'Assigned', count: 22, pct: 18, color: '#8B5CF6', href: '/tickets?status=assigned' },
    { name: 'In Progress', count: 32, pct: 26, color: '#E69F50', href: '/tickets?status=in-progress' },
    { name: 'Pending', count: 8, pct: 6, color: '#73847B', href: '/tickets?status=pending' },
    { name: 'Resolved', count: 28, pct: 23, color: '#10B981', href: '/tickets?status=resolved' },
    { name: 'Closed', count: 16, pct: 13, color: '#0D3133', href: '/tickets?status=closed' },
  ]

  // Row 5 - Priority Distribution with insights
  const priorityData = [
    { name: 'Critical', value: 8, color: '#DC2626' },
    { name: 'High', value: 22, color: '#E69F50' },
    { name: 'Medium', value: 45, color: '#73847B' },
    { name: 'Low', value: 49, color: '#0D3133' },
  ]
  const mostCritical = priorityData[0]
  const highestGrowth = { name: 'High', change: '+18%' }
  const mostDelayed = { name: 'Critical', avgDelay: '2.4h' }

  // Row 5 - Category Distribution with insights
  const categoryData = [
    { name: 'Hardware', count: 32, growth: '+12%', breaches: 2 },
    { name: 'Software', count: 28, growth: '+8%', breaches: 1 },
    { name: 'Network', count: 24, growth: '+22%', breaches: 3 },
    { name: 'Access', count: 18, growth: '-5%', breaches: 0 },
    { name: 'Other', count: 22, growth: '+3%', breaches: 1 },
  ]
  const topCategory = categoryData[0]
  const fastestGrowing = categoryData.reduce((max, c) => parseInt(c.growth) > parseInt(max.growth) ? c : max)
  const mostBreaches = categoryData.reduce((max, c) => c.breaches > max.breaches ? c : max)

  // Row 6 - Attention Required with severity and primary cause
  const attentionItems = [
    { label: 'SLA Breaches', value: 3, icon: AlertTriangle, color: '#DC2626', bgColor: '#FEF2F2', severity: 'Critical', primaryCause: 'Response SLA', tooltip: 'Tickets that missed SLA. Requires immediate escalation.' },
    { label: 'Unassigned', value: 12, icon: Users, color: '#E69F50', bgColor: '#FFFBEB', severity: 'High', primaryCause: 'IT Group', tooltip: 'Tickets without owner. Assign to available agents.' },
    { label: 'Overloaded Agents', value: 2, icon: TrendingUp, color: '#DC2626', bgColor: '#FEF2F2', severity: 'High', primaryCause: 'Sarah Chen', tooltip: 'Agents over capacity. Redistribute workload.' },
    { label: 'Due Today', value: 8, icon: Clock, color: '#E69F50', bgColor: '#FFFBEB', severity: 'Medium', primaryCause: 'Network Issues', tooltip: 'Tickets due today. Monitor for on-time completion.' },
  ]

  return (
    <div className="p-6" style={{ backgroundColor: '#F8F8F7' }}>
      {/* ROW 1 - Executive Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {executiveKPIs.map((kpi) => (
          <Link key={kpi.label} href={kpi.href}>
            <div 
              className="bg-white cursor-pointer transition-shadow hover:shadow-md"
              style={{ 
                borderColor: kpi.isWarning ? '#FCA5A5' : '#E2E0DC', 
                borderWidth: '1px', 
                borderRadius: '12px', 
                padding: '15px',
                backgroundColor: kpi.isWarning ? '#FEF2F2' : 'white',
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium" style={{ color: '#73847B', letterSpacing: '0.3px' }}>
                  {kpi.label.toUpperCase()}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-0.5 rounded hover:opacity-70" onClick={(e) => e.preventDefault()}>
                        <Info className="w-3 h-3" style={{ color: '#73847B' }} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">{kpi.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: kpi.isWarning ? '#DC2626' : '#0D3133' }}>
                {kpi.value}
              </p>
              <p className="text-xs" style={{ color: kpi.isWarning ? '#DC2626' : '#73847B' }}>
                {kpi.trend}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ROW 2 - Team Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        {/* Ticket Flow Trend - 3 cols */}
        <div className="lg:col-span-3">
          <WidgetCard 
            title="Ticket Flow Trend" 
            tooltip="Track inflow vs outflow. Green backlog = healthy. Red = growing queue needs attention."
          >
            {/* Summary Strip */}
            <div className="flex gap-4 mb-4 p-2 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: '#E69F50' }}>+{totalCreated}</p>
                <p className="text-xs" style={{ color: '#73847B' }}>Created</p>
              </div>
              <div className="flex-1 text-center" style={{ borderLeftColor: '#E2E0DC', borderLeftWidth: '1px', borderRightColor: '#E2E0DC', borderRightWidth: '1px' }}>
                <p className="text-lg font-bold" style={{ color: '#10B981' }}>+{totalResolved}</p>
                <p className="text-xs" style={{ color: '#73847B' }}>Resolved</p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: backlogChange >= 0 ? '#10B981' : '#DC2626' }}>
                  {backlogChange >= 0 ? `-${backlogChange}` : `+${Math.abs(backlogChange)}`}
                </p>
                <p className="text-xs" style={{ color: '#73847B' }}>Backlog</p>
              </div>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ticketFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#73847B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#73847B' }} />
                  <RechartsTooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="created" stroke="#E69F50" strokeWidth={2} dot={{ r: 3 }} name="Created" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </WidgetCard>
        </div>

        {/* SLA Health - 2 cols */}
        <div className="lg:col-span-2">
          <WidgetCard 
            title="SLA Health" 
            tooltip="Monitor compliance. Below 90% needs process review. Risk owners need workload check."
            action={<Link href="/sla-analytics" className="text-xs font-medium" style={{ color: '#0D3133' }}>View Details</Link>}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>Response SLA</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                    <div className="h-2 rounded-full" style={{ width: `${slaHealth.response.met}%`, backgroundColor: '#10B981' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#10B981' }}>{slaHealth.response.met}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>Resolution SLA</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                    <div className="h-2 rounded-full" style={{ width: `${slaHealth.resolution.met}%`, backgroundColor: '#E69F50' }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#E69F50' }}>{slaHealth.resolution.met}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-lg font-bold" style={{ color: '#DC2626' }}>{slaHealth.breached}</p>
                  <p className="text-xs" style={{ color: '#DC2626' }}>Breached</p>
                </div>
                <div className="p-2 rounded-lg text-center" style={{ backgroundColor: '#FFFBEB' }}>
                  <p className="text-lg font-bold" style={{ color: '#B45309' }}>{slaHealth.atRisk}</p>
                  <p className="text-xs" style={{ color: '#B45309' }}>At Risk</p>
                </div>
              </div>
              {/* Top SLA Risk Owners */}
              <div className="pt-2" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#73847B' }}>TOP RISK OWNERS</p>
                <div className="flex gap-2">
                  {slaHealth.riskOwners.map((owner) => (
                    <div key={owner.name} className="flex-1 text-center p-1.5 rounded" style={{ backgroundColor: '#FEF2F2' }}>
                      <p className="text-xs font-medium truncate" style={{ color: '#1a1a1a' }}>{owner.name.split(' ')[0]}</p>
                      <p className="text-xs font-bold" style={{ color: '#DC2626' }}>{owner.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </WidgetCard>
        </div>
      </div>

      {/* ROW 3 - Workload & Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Workload Distribution */}
        <WidgetCard 
          title="Workload Distribution" 
          tooltip="Shows current ticket distribution across team members. Green = Balanced (Under 70%). Amber = Near Capacity (71-90%). Red = Overloaded (Over 90%). Agents above 90% capacity are flagged."
          action={<Link href="/workload" className="text-xs font-medium" style={{ color: '#0D3133' }}>Manage</Link>}
        >
          {/* Workload Bars */}
          <div className="space-y-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
            {workloadData.map((agent) => (
              <div key={agent.name} className="flex items-center gap-3 group">
                <span className="text-xs w-16 truncate" style={{ color: '#1a1a1a' }}>{agent.name}</span>
                <div className="flex-1 h-5 rounded cursor-pointer transition-all group-hover:shadow-sm" style={{ backgroundColor: '#F8F8F7' }}>
                  <div 
                    className="h-5 rounded flex items-center justify-end pr-2" 
                    style={{ 
                      width: `${Math.min(agent.pct, 100)}%`, 
                      backgroundColor: getCapacityColor(agent.pct),
                    }} 
                  >
                    <span className="text-xs text-white font-medium">{agent.tickets}</span>
                  </div>
                </div>
                <div className="w-14 text-right">
                  <span className="text-xs font-semibold" style={{ color: getCapacityColor(agent.pct) }}>{agent.pct}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Team Workload Summary - 3 Column KPI Strip */}
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
            <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Avg Tickets Per Agent</p>
              <p className="text-lg font-bold" style={{ color: '#0D3133' }}>11.6</p>
            </div>
            <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Team Balance Score</p>
              <p className="text-lg font-bold" style={{ color: '#10B981' }}>82%</p>
            </div>
            <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Available Capacity</p>
              <p className="text-lg font-bold" style={{ color: '#0D3133' }}>18 Tickets</p>
            </div>
          </div>

          {/* Operational Insights Row */}
          <div className="grid grid-cols-3 gap-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
            <div className="p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Highest Workload</p>
              <p className="text-sm font-bold" style={{ color: '#0D3133' }}>Sarah C.</p>
              <p className="text-xs mt-1" style={{ color: '#E69F50' }}>18 Tickets</p>
            </div>
            <div className="p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Lowest Workload</p>
              <p className="text-sm font-bold" style={{ color: '#0D3133' }}>Lisa M.</p>
              <p className="text-xs mt-1" style={{ color: '#10B981' }}>6 Tickets</p>
            </div>
            <div className="p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Overloaded Agents</p>
              <p className="text-sm font-bold" style={{ color: '#DC2626' }}>2</p>
              <p className="text-xs mt-1" style={{ color: '#DC2626' }}>Action Required</p>
            </div>
          </div>

          {/* Capacity Status Distribution */}
          <div className="flex items-center justify-center gap-6 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span className="text-xs font-medium" style={{ color: '#0D3133' }}>Balanced: 3</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FFFBEB' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E69F50' }} />
              <span className="text-xs font-medium" style={{ color: '#0D3133' }}>Near Capacity: 1</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FEF2F2' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }} />
              <span className="text-xs font-medium" style={{ color: '#0D3133' }}>Overloaded: 2</span>
            </div>
          </div>

          {/* Workload Risk Summary Footer */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
            <p className="text-xs font-medium mb-2" style={{ color: '#DC2626' }}>⚠ Workload Risk Summary</p>
            <div className="space-y-1">
              <p className="text-xs" style={{ color: '#73847B' }}>{'• 2 agents above capacity threshold (>90%)'}</p>
              <p className="text-xs" style={{ color: '#73847B' }}>• 18 tickets can be reassigned without overload</p>
              <p className="text-xs mt-2" style={{ color: '#DC2626' }}>Recommended: Rebalance workload to maintain team health</p>
            </div>
          </div>
        </WidgetCard>

        {/* Agent Availability - Modern Service Desk Panel */}
        <WidgetCard 
          title="Agent Availability" 
          tooltip="Shows real-time agent availability, active workload, and ticket ownership."
          action={<Link href="/workload" className="text-xs font-medium" style={{ color: '#0D3133' }}>View All</Link>}
        >
          <div className="space-y-3">
            {/* Agent Cards Grid */}
            <div className="space-y-2">
              {/* Available Agents */}
              {agentAvailability[0].agents.slice(0, 3).map((agentName, idx) => {
                const ticketsResolved = [85, 92, 78][idx]
                const capacity = [45, 52, 38][idx]
                const statusColor = '#10B981'
                return (
                  <div 
                    key={agentName} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm"
                    style={{ backgroundColor: '#F8F8F7', border: '1px solid #E2E0DC' }}
                  >
                    {/* Avatar */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#0D3133' }}
                    >
                      {agentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{agentName}</p>
                      <p className="text-xs" style={{ color: '#73847B' }}>{ticketsResolved} tickets resolved</p>
                    </div>
                    
                    {/* Capacity Bar */}
                    <div className="flex items-center gap-2 min-w-max">
                      <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${capacity}%`, 
                            backgroundColor: capacity > 70 ? '#E69F50' : '#10B981'
                          }} 
                        />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right" style={{ color: capacity > 70 ? '#E69F50' : '#10B981' }}>
                        {capacity}%
                      </span>
                    </div>
                    
                    {/* Status Pill */}
                    <div 
                      className="px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: statusColor, color: 'white' }}
                    >
                      <span className="text-xs font-medium">Available</span>
                    </div>
                  </div>
                )
              })}
              
              {/* Busy Agents */}
              {agentAvailability[1].agents.slice(0, 2).map((agentName, idx) => {
                const activeTickets = [8, 6][idx]
                const capacity = [95, 88][idx]
                const statusColor = '#E69F50'
                return (
                  <div 
                    key={agentName} 
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm"
                    style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}
                  >
                    {/* Avatar */}
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: '#E69F50' }}
                    >
                      {agentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{agentName}</p>
                      <p className="text-xs" style={{ color: '#73847B' }}>{activeTickets} active tickets</p>
                    </div>
                    
                    {/* Capacity Bar */}
                    <div className="flex items-center gap-2 min-w-max">
                      <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                        <div 
                          className="h-1.5 rounded-full" 
                          style={{ 
                            width: `${capacity}%`, 
                            backgroundColor: capacity > 90 ? '#DC2626' : '#E69F50'
                          }} 
                        />
                      </div>
                      <span className="text-xs font-semibold w-8 text-right" style={{ color: capacity > 90 ? '#DC2626' : '#E69F50' }}>
                        {capacity}%
                      </span>
                    </div>
                    
                    {/* Status Pill */}
                    <div 
                      className="px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: statusColor, color: 'white' }}
                    >
                      <span className="text-xs font-medium">Busy</span>
                    </div>
                  </div>
                )
              })}
              
              {/* Away Agent */}
              {agentAvailability[2].agents.map((agentName) => (
                <div 
                  key={agentName} 
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:shadow-sm"
                  style={{ backgroundColor: '#F3F4F3', border: '1px solid #E2E0DC' }}
                >
                  {/* Avatar */}
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 opacity-60"
                    style={{ backgroundColor: '#73847B' }}
                  >
                    {agentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  
                  {/* Agent Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{agentName}</p>
                    <p className="text-xs" style={{ color: '#73847B' }}>Away for 2h</p>
                  </div>
                  
                  {/* Capacity Bar */}
                  <div className="flex items-center gap-2 min-w-max">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                      <div 
                        className="h-1.5 rounded-full" 
                        style={{ width: '0%', backgroundColor: '#73847B' }} 
                      />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right" style={{ color: '#73847B' }}>
                      0%
                    </span>
                  </div>
                  
                  {/* Status Pill */}
                  <div 
                    className="px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: '#73847B', color: 'white' }}
                  >
                    <span className="text-xs font-medium">Away</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Footer Summary */}
            <div 
              className="flex gap-2 pt-3 mt-2"
              style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}
            >
              {agentAvailability.map((status) => (
                <div 
                  key={status.name}
                  className="flex-1 text-center py-2 rounded-lg cursor-pointer transition-all hover:opacity-80"
                  style={{ backgroundColor: '#F8F8F7' }}
                >
                  <p className="text-sm font-bold" style={{ color: '#0D3133' }}>{status.value}</p>
                  <p className="text-xs" style={{ color: '#73847B' }}>{status.name}</p>
                </div>
              ))}
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* ROW 3B - Queue & SLA Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Team Queue Health */}
        <WidgetCard 
          title="Team Queue Health" 
          tooltip="Current ticket distribution by status. Shows aging and queue health metrics."
        >
          <div className="space-y-2">
            {[
              { label: 'Open Tickets', count: 24, trend: '+3', color: '#0D3133', backgroundColor: '#E8E8E6', secondary: 'Oldest: 2 Days' },
              { label: 'In Progress', count: 18, trend: '+2', color: '#0D3133', backgroundColor: '#E8E8E6', secondary: 'Avg Age: 1.4 Days' },
              { label: 'Pending User', count: 12, trend: '-1', color: '#E69F50', backgroundColor: '#FFFBEB', secondary: '2 Waiting > 3 Days' },
              { label: 'Pending Vendor', count: 8, trend: '0', color: '#73847B', backgroundColor: '#F3F4F3', secondary: 'Oldest: 5 Days' },
              { label: 'Escalated', count: 3, trend: '+1', color: '#DC2626', backgroundColor: '#FEF2F2', secondary: '1 Critical' },
              { label: 'Resolved Today', count: 42, trend: '+8', color: '#10B981', backgroundColor: '#F0FDF4', secondary: '↑ 18% vs Yesterday' },
            ].map((item) => (
              <div 
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: item.backgroundColor }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.label}</span>
                  </div>
                  <div className="text-xs" style={{ color: '#73847B' }}>{item.secondary}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
                  <span className="text-xs font-semibold w-10 text-right" style={{ 
                    color: item.trend.startsWith('+') ? '#10B981' : item.trend.startsWith('-') ? '#10B981' : '#73847B'
                  }}>
                    {item.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Queue Health Summary Footer */}
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
            <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Avg Queue Age</p>
              <p className="text-sm font-semibold" style={{ color: '#0D3133' }}>1.8 Days</p>
            </div>
            <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Oldest Ticket</p>
              <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>8 Days</p>
            </div>
            <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Resolution Rate</p>
              <p className="text-sm font-semibold" style={{ color: '#10B981' }}>92%</p>
            </div>
          </div>
        </WidgetCard>

        {/* SLA Risk Queue */}
        <WidgetCard 
          title="SLA Risk Queue" 
          tooltip="Tickets at risk of SLA breach. Shows support level and priority distribution."
        >
          {/* Top Risk Cards */}
          <div className="space-y-2 mb-4">
            {[
              { label: 'Breached', count: 3, breakdown: 'L1: 1 | L2: 2', backgroundColor: '#FEF2F2', color: '#DC2626' },
              { label: 'At Risk', count: 7, breakdown: 'Critical: 2 | High: 5', backgroundColor: '#FFFBEB', color: '#E69F50' },
              { label: 'Due Today', count: 11, breakdown: 'High: 4 | Medium: 7', backgroundColor: '#FEF3C7', color: '#B45309' },
              { label: 'Overdue', count: 2, breakdown: 'Oldest: 6 Hours', backgroundColor: '#FEF2F2', color: '#DC2626' },
            ].map((item) => (
              <div 
                key={item.label}
                className="p-3 rounded-lg"
                style={{ backgroundColor: item.backgroundColor }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
                </div>
                <div className="text-xs" style={{ color: '#73847B' }}>{item.breakdown}</div>
              </div>
            ))}
          </div>

          {/* Risk Breakdown Section */}
          <div className="mb-4 pt-4" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Risk By Support Level */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#73847B' }}>By Support Level</p>
                <div className="space-y-1">
                  {[{ level: 'L1', tickets: 3 }, { level: 'L2', tickets: 5 }, { level: 'L3', tickets: 1 }].map((item) => (
                    <div key={item.level} className="flex items-center justify-between text-xs p-1.5 rounded" style={{ backgroundColor: '#F8F8F7' }}>
                      <span style={{ color: '#73847B' }}>{item.level}</span>
                      <span className="font-semibold" style={{ color: '#0D3133' }}>{item.tickets}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Risk By Group */}
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#73847B' }}>By Group</p>
                <div className="space-y-1">
                  {[{ group: 'Infrastructure', count: 4 }, { group: 'Apps', count: 3 }, { group: 'Network', count: 2 }].map((item) => (
                    <div key={item.group} className="flex items-center justify-between text-xs p-1.5 rounded" style={{ backgroundColor: '#F8F8F7' }}>
                      <span style={{ color: '#73847B' }}>{item.group}</span>
                      <span className="font-semibold" style={{ color: '#0D3133' }}>{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Most Critical Ticket */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', borderColor: '#FECACA', borderWidth: '1px' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#73847B' }}>Most Critical</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#73847B' }}>Ticket</span>
                <span className="text-sm font-bold" style={{ color: '#DC2626' }}>INC-1045</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#73847B' }}>Group</span>
                <span className="text-xs font-medium" style={{ color: '#0D3133' }}>Infrastructure</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: '#73847B' }}>Assigned</span>
                <span className="text-xs font-medium" style={{ color: '#0D3133' }}>Mike Johnson</span>
              </div>
              <div className="flex items-center justify-between pt-1" style={{ borderTopColor: '#FECACA', borderTopWidth: '1px' }}>
                <span className="text-xs" style={{ color: '#73847B' }}>Overdue</span>
                <span className="text-xs font-bold" style={{ color: '#DC2626' }}>4 Hours</span>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* ROW 4 - Performance Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Leaderboard Snapshot */}
        <WidgetCard 
          title="Leaderboard Snapshot" 
          tooltip="Top performers this week. Use tabs to view different metrics."
          action={<Link href="/leaderboard" className="text-xs font-medium" style={{ color: '#0D3133' }}>Full Board</Link>}
        >
          {/* Tabs */}
          <div className="flex gap-1 mb-3 p-1 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
            {(['resolved', 'csat', 'response'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setLeaderboardTab(tab)}
                className="flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all"
                style={{ 
                  backgroundColor: leaderboardTab === tab ? '#0D3133' : 'transparent',
                  color: leaderboardTab === tab ? 'white' : '#73847B',
                }}
              >
                {tab === 'resolved' ? 'Resolved' : tab === 'csat' ? 'CSAT' : 'Response'}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {leaderboardData[leaderboardTab].map((agent) => (
              <div 
                key={agent.rank} 
                className="flex items-center justify-between p-2.5 rounded-lg"
                style={{ backgroundColor: agent.rank === 1 ? '#FFFBEB' : '#F8F8F7' }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: agent.rank === 1 ? '#E69F50' : '#E2E0DC',
                      color: agent.rank === 1 ? 'white' : '#1a1a1a'
                    }}
                  >
                    {agent.rank}
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{agent.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {leaderboardTab === 'csat' && <Star className="w-3 h-3" style={{ color: '#E69F50', fill: '#E69F50' }} />}
                  <span className="text-sm font-semibold" style={{ color: '#0D3133' }}>{agent.value}</span>
                  <span className="text-xs" style={{ color: '#73847B' }}>{agent.label}</span>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>

        {/* CSAT Health */}
        <WidgetCard 
          title="CSAT Health" 
          tooltip="Customer satisfaction breakdown. Low response rate needs follow-up. Track trends weekly."
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1">
              {csatData.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-xs w-14" style={{ color: '#73847B' }}>{item.rating}</span>
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: '#F8F8F7' }}>
                    <div 
                      className="h-3 rounded-full" 
                      style={{ width: `${(item.count / 90) * 100}%`, backgroundColor: item.color }} 
                    />
                  </div>
                  <span className="text-xs font-semibold w-6" style={{ color: '#1a1a1a' }}>{item.count}</span>
                </div>
              ))}
              {/* Survey Stats Row 1 */}
              <div className="flex gap-1.5 pt-2 mt-1" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
                <div className="flex-1 text-center p-1 rounded" style={{ backgroundColor: '#F8F8F7' }}>
                  <p className="text-xs font-bold" style={{ color: '#0D3133' }}>{surveyResponseRate}%</p>
                  <p className="text-xs" style={{ color: '#73847B' }}>Response</p>
                </div>
                <div className="flex-1 text-center p-1 rounded" style={{ backgroundColor: '#F0FDF4' }}>
                  <p className="text-xs font-bold" style={{ color: '#10B981' }}>{Math.round((positiveCount / totalResponses) * 100)}%</p>
                  <p className="text-xs" style={{ color: '#10B981' }}>Positive</p>
                </div>
                <div className="flex-1 text-center p-1 rounded" style={{ backgroundColor: '#FFFBEB' }}>
                  <p className="text-xs font-bold" style={{ color: '#B45309' }}>{Math.round((neutralCount / totalResponses) * 100)}%</p>
                  <p className="text-xs" style={{ color: '#B45309' }}>Neutral</p>
                </div>
                <div className="flex-1 text-center p-1 rounded" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-xs font-bold" style={{ color: '#DC2626' }}>{Math.round((negativeCount / totalResponses) * 100)}%</p>
                  <p className="text-xs" style={{ color: '#DC2626' }}>Negative</p>
                </div>
              </div>
              {/* Group Performance */}
              <div className="flex gap-1.5 mt-1">
                <div className="flex-1 p-1 rounded" style={{ backgroundColor: '#F0FDF4' }}>
                  <p className="text-xs" style={{ color: '#73847B' }}>Highest</p>
                  <p className="text-xs font-semibold truncate" style={{ color: '#10B981' }}>{highestRatedGroup.name}: {highestRatedGroup.score}</p>
                </div>
                <div className="flex-1 p-1 rounded" style={{ backgroundColor: '#FEF2F2' }}>
                  <p className="text-xs" style={{ color: '#73847B' }}>Lowest</p>
                  <p className="text-xs font-semibold truncate" style={{ color: '#DC2626' }}>{lowestRatedGroup.name}: {lowestRatedGroup.score}</p>
                </div>
              </div>
            </div>
            {/* Avg CSAT with Trend */}
            <div className="text-center p-2 rounded-lg" style={{ backgroundColor: '#F0FDF4', minWidth: '70px' }}>
              <p className="text-2xl font-bold" style={{ color: '#10B981' }}>4.6</p>
              <p className="text-xs" style={{ color: '#10B981' }}>Avg CSAT</p>
              <p className="text-xs font-medium mt-1" style={{ color: csatTrend.direction === 'up' ? '#10B981' : '#DC2626' }}>
                {csatTrend.direction === 'up' ? '↑' : '↓'} {csatTrend.value}
              </p>
              <p className="text-xs" style={{ color: '#73847B' }}>{totalResponses} total</p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* ROW 5 - Ticket Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Priority Distribution */}
        <WidgetCard 
          title="Priority Distribution" 
          tooltip="Current breakdown. Rising critical/high counts need capacity planning."
        >
          <div className="flex items-center justify-between">
            <div className="w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" outerRadius={45} dataKey="value">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 ml-4 space-y-1.5">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs" style={{ color: '#1a1a1a' }}>{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Insights Footer */}
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
            <div className="flex-1 p-2 rounded" style={{ backgroundColor: '#FEF2F2' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Most Critical</p>
              <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>{mostCritical.name}: {mostCritical.value}</p>
            </div>
            <div className="flex-1 p-2 rounded" style={{ backgroundColor: '#FFFBEB' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Highest Growth</p>
              <p className="text-xs font-semibold" style={{ color: '#B45309' }}>{highestGrowth.name}: {highestGrowth.change}</p>
            </div>
          </div>
        </WidgetCard>

        {/* Category Distribution */}
        <WidgetCard 
          title="Category Distribution" 
          tooltip="Volume by type. Trending categories may need specialist assignment."
        >
          <div className="space-y-2">
            {categoryData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-xs w-16" style={{ color: '#73847B' }}>{item.name}</span>
                <div className="flex-1 h-5 rounded" style={{ backgroundColor: '#F8F8F7' }}>
                  <div 
                    className="h-5 rounded flex items-center justify-end pr-2" 
                    style={{ 
                      width: `${(item.count / 35) * 100}%`, 
                      backgroundColor: '#0D3133',
                      opacity: 1 - (idx * 0.15)
                    }} 
                  >
                    <span className="text-xs text-white font-medium">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Insights Footer */}
          <div className="flex gap-2 mt-3 pt-3" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
            <div className="flex-1 p-2 rounded" style={{ backgroundColor: '#F8F8F7' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Top Category</p>
              <p className="text-xs font-semibold" style={{ color: '#0D3133' }}>{topCategory.name}: {topCategory.count}</p>
            </div>
            <div className="flex-1 p-2 rounded" style={{ backgroundColor: '#F0FDF4' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Fastest Growing</p>
              <p className="text-xs font-semibold" style={{ color: '#10B981' }}>{fastestGrowing.name}: {fastestGrowing.growth}</p>
            </div>
            <div className="flex-1 p-2 rounded" style={{ backgroundColor: '#FEF2F2' }}>
              <p className="text-xs" style={{ color: '#73847B' }}>Most Breaches</p>
              <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>{mostBreaches.name}: {mostBreaches.breaches}</p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* ROW 5.5 - GROUP PERFORMANCE ANALYTICS */}
      <div className="mb-6">
        {/* Section Title */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Group Performance Analytics</h2>
        
        {/* Group Performance Overview - Full Width Table */}
        <div className="mb-4">
          <WidgetCard 
            title="Group Performance Overview" 
            tooltip="Performance summary by support group. Shows workload, SLA compliance, and resolution efficiency."
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                    <th className="text-left py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>Group</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>Active</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>Resolved</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>SLA %</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>Avg Resolution</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>1st Response</th>
                    <th className="text-right py-2 px-2" style={{ color: '#73847B', fontWeight: '600' }}>Backlog</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { group: 'L1 Support', active: 24, resolved: 68, sla: 94, avgRes: '2.3h', firstRes: '8m', backlog: 12 },
                    { group: 'L2 Support', active: 18, resolved: 42, sla: 88, avgRes: '4.1h', firstRes: '14m', backlog: 8 },
                    { group: 'L3 Support', active: 8, resolved: 18, sla: 82, avgRes: '6.2h', firstRes: '22m', backlog: 3 },
                    { group: 'Infrastructure', active: 12, resolved: 28, sla: 91, avgRes: '3.5h', firstRes: '11m', backlog: 6 },
                    { group: 'Application Support', active: 14, resolved: 35, sla: 85, avgRes: '5.1h', firstRes: '18m', backlog: 9 },
                    { group: 'Access Management', active: 6, resolved: 22, sla: 96, avgRes: '1.8h', firstRes: '5m', backlog: 2 },
                    { group: 'Network Team', active: 10, resolved: 16, sla: 79, avgRes: '7.2h', firstRes: '28m', backlog: 7 },
                  ].map((row, idx) => (
                    <tr 
                      key={row.group}
                      className="cursor-pointer transition-colors hover:opacity-80"
                      style={{ 
                        borderBottomColor: '#E2E0DC', 
                        borderBottomWidth: '1px',
                        backgroundColor: idx % 2 === 0 ? '#F8F8F7' : 'white'
                      }}
                    >
                      <td className="py-3 px-2">
                        <span className="font-medium" style={{ color: '#0D3133' }}>{row.group}</span>
                      </td>
                      <td className="text-right py-3 px-2" style={{ color: '#1a1a1a' }}>{row.active}</td>
                      <td className="text-right py-3 px-2" style={{ color: '#1a1a1a' }}>{row.resolved}</td>
                      <td className="text-right py-3 px-2">
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: row.sla >= 90 ? '#D1FAE5' : row.sla >= 80 ? '#FEF3C7' : '#FECACA',
                            color: row.sla >= 90 ? '#10B981' : row.sla >= 80 ? '#B45309' : '#DC2626'
                          }}
                        >
                          {row.sla}%
                        </span>
                      </td>
                      <td className="text-right py-3 px-2" style={{ color: '#1a1a1a' }}>{row.avgRes}</td>
                      <td className="text-right py-3 px-2" style={{ color: '#73847B' }}>{row.firstRes}</td>
                      <td className="text-right py-3 px-2" style={{ color: '#1a1a1a' }}>{row.backlog}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </WidgetCard>
        </div>

        {/* Group Ticket Distribution & Group SLA Health - 2 cols */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Group Ticket Distribution - Enhanced with SLA and Health */}
          <WidgetCard 
            title="Group Distribution" 
            tooltip="Shows workload ownership and performance by support group. Health indicator based on SLA compliance."
          >
            <div className="space-y-3">
              {[
                { group: 'Infrastructure', count: 32, pct: 100, sla: 94, avgTime: '5.2h', health: 'Healthy' },
                { group: 'Applications', count: 24, pct: 75, sla: 97, avgTime: '2.8h', health: 'Best Performer' },
                { group: 'Network', count: 18, pct: 56, sla: 89, avgTime: '8.4h', health: 'At Risk' },
                { group: 'Finance', count: 16, pct: 50, sla: 92, avgTime: '3.1h', health: 'Healthy' },
                { group: 'Admin', count: 10, pct: 31, sla: 97, avgTime: '1.9h', health: 'Healthy' },
              ].map((item) => {
                const healthColor = item.health === 'Healthy' ? '#10B981' : item.health === 'Best Performer' ? '#E69F50' : '#DC2626'
                const healthBg = item.health === 'Healthy' ? '#F0FDF4' : item.health === 'Best Performer' ? '#FFFBEB' : '#FEF2F2'
                return (
                  <div key={item.group} className="p-3 rounded-lg" style={{ backgroundColor: healthBg }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.group}</p>
                        <p className="text-xs" style={{ color: '#73847B' }}>{item.count} Tickets • {item.pct}% of Total</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: healthColor, color: 'white' }}>
                        {item.health}
                      </span>
                    </div>
                    <div className="flex-1 h-4 rounded-full" style={{ backgroundColor: '#E8E8E6' }}>
                      <div 
                        className="h-4 rounded-full" 
                        style={{ width: `${item.pct}%`, backgroundColor: '#0D3133' }} 
                      />
                    </div>
                    <div className="flex gap-3 mt-2 text-xs">
                      <div>
                        <span style={{ color: '#73847B' }}>SLA</span>
                        <p className="font-semibold" style={{ color: '#0D3133' }}>{item.sla}%</p>
                      </div>
                      <div>
                        <span style={{ color: '#73847B' }}>Avg Resolution</span>
                        <p className="font-semibold" style={{ color: '#0D3133' }}>{item.avgTime}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Group Insights Footer */}
            <div className="flex gap-2 mt-4 pt-4" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
              <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Highest Volume</p>
                <p className="text-xs font-semibold" style={{ color: '#0D3133' }}>Infrastructure</p>
              </div>
              <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Best SLA</p>
                <p className="text-xs font-semibold" style={{ color: '#10B981' }}>Applications</p>
              </div>
              <div className="flex-1 p-2 rounded text-center" style={{ backgroundColor: '#F8F8F7' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>At Risk</p>
                <p className="text-xs font-semibold" style={{ color: '#DC2626' }}>Network</p>
              </div>
            </div>
          </WidgetCard>

          {/* Group SLA Health - Compact SLA Cards */}
          <WidgetCard 
            title="Group SLA Health" 
            tooltip="Shows SLA compliance by support group. Green = Healthy (≥90%). Amber = Attention Required (80-89%). Red = Critical (<80%). Groups below SLA target should be reviewed."
          >
            {/* SLA Group List */}
            <div className="space-y-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              {[
                { group: 'Access Management', sla: 96, status: 'green' },
                { group: 'L1 Support', sla: 94, status: 'green' },
                { group: 'Infrastructure', sla: 91, status: 'green' },
                { group: 'L2 Support', sla: 88, status: 'amber' },
                { group: 'Application Support', sla: 85, status: 'amber' },
                { group: 'L3 Support', sla: 82, status: 'amber' },
                { group: 'Network Team', sla: 79, status: 'red' },
              ].map((item) => (
                <div 
                  key={item.group}
                  className="flex items-center justify-between p-2.5 rounded-lg transition-all hover:shadow-sm cursor-pointer"
                  style={{
                    backgroundColor: item.status === 'green' ? '#F0FDF4' : item.status === 'amber' ? '#FFFBEB' : '#FEF2F2',
                    border: `1px solid ${item.status === 'green' ? '#D1FAE5' : item.status === 'amber' ? '#FEF3C7' : '#FECACA'}`
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: item.status === 'green' ? '#10B981' : item.status === 'amber' ? '#E69F50' : '#DC2626'
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.group}</span>
                  </div>
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-semibold transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: item.status === 'green' ? '#D1FAE5' : item.status === 'amber' ? '#FEF3C7' : '#FECACA',
                      color: item.status === 'green' ? '#10B981' : item.status === 'amber' ? '#B45309' : '#DC2626'
                    }}
                  >
                    {item.sla}%
                  </span>
                </div>
              ))}
            </div>

            {/* SLA Status Summary - 3 Column KPI */}
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Healthy Groups</p>
                <p className="text-lg font-bold" style={{ color: '#10B981' }}>3</p>
              </div>
              <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Needs Attention</p>
                <p className="text-lg font-bold" style={{ color: '#E69F50' }}>3</p>
              </div>
              <div className="p-3 rounded-lg text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <p className="text-xs font-medium mb-1" style={{ color: '#73847B' }}>Critical Groups</p>
                <p className="text-lg font-bold" style={{ color: '#DC2626' }}>1</p>
              </div>
            </div>

            {/* Best & Most At Risk - 2 Column Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <div className="p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#73847B' }}>🏆 Best SLA Group</p>
                <p className="text-sm font-bold" style={{ color: '#0D3133' }}>Access Management</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: '#10B981' }}>96%</p>
              </div>
              <div className="p-3 rounded-lg transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#73847B' }}>⚠ Most At-Risk Group</p>
                <p className="text-sm font-bold" style={{ color: '#0D3133' }}>Network Team</p>
                <p className="text-xs mt-1 font-semibold" style={{ color: '#DC2626' }}>79%</p>
              </div>
            </div>

            {/* Overall Team SLA Footer */}
            <div className="grid grid-cols-3 gap-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <div className="p-2 rounded text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Overall SLA</p>
                <p className="text-sm font-bold" style={{ color: '#0D3133' }}>88%</p>
              </div>
              <div className="p-2 rounded text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Target SLA</p>
                <p className="text-sm font-bold" style={{ color: '#0D3133' }}>90%</p>
              </div>
              <div className="p-2 rounded text-center transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Variance</p>
                <p className="text-sm font-bold" style={{ color: '#DC2626' }}>-2%</p>
              </div>
            </div>

            {/* SLA Trend Indicators */}
            <div className="space-y-2 mb-4 pb-4" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <p className="text-xs font-semibold" style={{ color: '#73847B' }}>SLA Trend This Week</p>
              <div className="flex items-center justify-between text-xs p-2 rounded transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
                <span style={{ color: '#0D3133' }}>Infrastructure</span>
                <span style={{ color: '#10B981' }}>↑ +4%</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
                <span style={{ color: '#0D3133' }}>Access Management</span>
                <span style={{ color: '#10B981' }}>↑ +2%</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded transition-all hover:shadow-sm cursor-pointer" style={{ backgroundColor: '#F8F8F7' }}>
                <span style={{ color: '#0D3133' }}>Network Team</span>
                <span style={{ color: '#DC2626' }}>↓ -3%</span>
              </div>
            </div>

            {/* Manager Action Insight */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#DC2626' }}>🔴 Manager Action Required</p>
              <div className="space-y-1">
                <p className="text-xs" style={{ color: '#73847B' }}>• Network Team requires immediate review</p>
                <p className="text-xs" style={{ color: '#73847B' }}>• 3 SLA breaches occurred this week</p>
                <p className="text-xs mt-2" style={{ color: '#DC2626' }}>Recommended: Review backlog and assignment distribution</p>
              </div>
            </div>
          </WidgetCard>
        </div>

        {/* Group Risk Monitor - Highlights groups needing attention */}
        <WidgetCard 
          title="Group Risk Monitor" 
          tooltip="Highlights groups requiring manager attention."
        >
          <div className="space-y-2">
            {[
              { group: 'Network Team', breached: 2, atRisk: 3, oldestAge: '28h', severity: 'high' },
              { group: 'L3 Support', breached: 1, atRisk: 2, oldestAge: '22h', severity: 'medium' },
              { group: 'Application Support', breached: 0, atRisk: 3, oldestAge: '18h', severity: 'medium' },
            ].map((item) => (
              <div 
                key={item.group}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{
                  backgroundColor: item.severity === 'high' ? '#FEF2F2' : '#FFFBEB',
                  border: `1px solid ${item.severity === 'high' ? '#FECACA' : '#FEF3C7'}`
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.group}</p>
                  <p className="text-xs" style={{ color: '#73847B' }}>Oldest ticket: {item.oldestAge}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: '#73847B' }}>Breached</p>
                    <p className="text-sm font-bold" style={{ color: '#DC2626' }}>{item.breached}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs" style={{ color: '#73847B' }}>At Risk</p>
                    <p className="text-sm font-bold" style={{ color: '#E69F50' }}>{item.atRisk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>

      {/* PHASE 2N - OPERATIONAL INTELLIGENCE LAYER */}

      {/* SECTION 1 - TICKET STATUS DISTRIBUTION */}
      <div className="mb-6">
        <WidgetCard 
          title="Ticket Status Distribution" 
          tooltip="Displays ticket distribution across all workflow stages. High Pending values may indicate process bottlenecks."
        >
          <div className="space-y-3">
            {[
              { status: 'Open', count: 42, pct: 12 },
              { status: 'Assigned', count: 18, pct: 5 },
              { status: 'In Progress', count: 29, pct: 8 },
              { status: 'Pending User', count: 12, pct: 3 },
              { status: 'Pending Vendor', count: 8, pct: 2 },
              { status: 'Resolved', count: 55, pct: 16 },
              { status: 'Closed', count: 146, pct: 42 },
            ].map((item) => (
              <div key={item.status} className="flex items-center gap-3">
                <span className="text-xs font-medium w-24" style={{ color: '#73847B' }}>{item.status}</span>
                <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ backgroundColor: '#F8F8F7' }}>
                  <div 
                    className="h-6 rounded-full flex items-center justify-end pr-2 transition-all" 
                    style={{ 
                      width: `${item.pct * 6}%`,
                      backgroundColor: item.status === 'Open' ? '#0D3133' : item.status === 'Closed' ? '#10B981' : '#E69F50'
                    }}
                  >
                    {item.pct >= 3 && <span className="text-xs text-white font-semibold">{item.count}</span>}
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-xs font-semibold" style={{ color: '#0D3133' }}>{item.count} ({item.pct}%)</span>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-3" style={{ borderTopColor: '#E2E8F0', borderTopWidth: '1px' }}>
              <p className="text-xs font-semibold" style={{ color: '#73847B' }}>Largest Queue: <span style={{ color: '#10B981' }}>Closed (146)</span></p>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* SECTION 2 & 3 - ESCALATION OVERVIEW & TEAM BACKLOG HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Escalation Overview */}
        <WidgetCard 
          title="Escalation Overview" 
          tooltip="Tracks ticket escalation movement. High escalation rates may indicate training, staffing or workload issues."
        >
          <div className="space-y-3">
            {[
              { label: 'L1 → L2 Escalations', count: 14, color: '#0D3133' },
              { label: 'L2 → L3 Escalations', count: 5, color: '#0D3133' },
              { label: 'Manager Escalated', count: 3, color: '#E69F50' },
              { label: 'SLA Escalated', count: 2, color: '#E69F50' },
              { label: 'Critical Escalated', count: 1, color: '#DC2626' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <span className="text-xs font-medium" style={{ color: '#1a1a1a' }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
            <div className="mt-3 pt-3 text-center" style={{ borderTopColor: '#E2E8F0', borderTopWidth: '1px' }}>
              <p className="text-xs font-semibold" style={{ color: '#10B981' }}>↑ 12% from last week</p>
            </div>
          </div>
        </WidgetCard>

        {/* Team Backlog Health */}
        <WidgetCard 
          title="Team Backlog Health" 
          tooltip="Displays age distribution of unresolved tickets. Older tickets represent operational risk."
        >
          <div className="flex gap-6">
            {/* Donut Chart - Simple circular representation */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  {/* 0-2 Days */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="70.97 251.33" strokeDashoffset="0" />
                  {/* 3-7 Days */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E69F50" strokeWidth="8" strokeDasharray="125.04 251.33" strokeDashoffset="-70.97" />
                  {/* 8-30 Days */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F4A261" strokeWidth="8" strokeDasharray="234.67 251.33" strokeDashoffset="-196.01" />
                  {/* 30+ Days */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#DC2626" strokeWidth="8" strokeDasharray="52.23 251.33" strokeDashoffset="-430.68" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm font-bold" style={{ color: '#0D3133' }}>124</p>
                    <p className="text-xs" style={{ color: '#73847B' }}>Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10B981' }} />
                <span className="text-xs" style={{ color: '#1a1a1a' }}>0–2 Days <span style={{ color: '#73847B' }}>22</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E69F50' }} />
                <span className="text-xs" style={{ color: '#1a1a1a' }}>3–7 Days <span style={{ color: '#73847B' }}>31</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F4A261' }} />
                <span className="text-xs" style={{ color: '#1a1a1a' }}>8–30 Days <span style={{ color: '#73847B' }}>58</span></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#DC2626' }} />
                <span className="text-xs" style={{ color: '#1a1a1a' }}>30+ Days <span style={{ color: '#73847B' }}>13</span></span>
              </div>
              <div className="mt-3 pt-3 space-y-1" style={{ borderTopColor: '#E2E8F0', borderTopWidth: '1px' }}>
                <p className="text-xs" style={{ color: '#73847B' }}>Oldest Ticket: <span style={{ color: '#DC2626', fontWeight: '600' }}>42 Days</span></p>
                <p className="text-xs" style={{ color: '#73847B' }}>Average Ticket Age: <span style={{ color: '#0D3133', fontWeight: '600' }}>8.6 Days</span></p>
              </div>
            </div>
          </div>
        </WidgetCard>
      </div>

      {/* SECTION 4 - TEAM ACTION CENTER */}
      <div className="mb-6">
        <WidgetCard 
          title="Team Action Center" 
          tooltip="Shows items requiring immediate manager attention."
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: '3 SLA Breaches', severity: 'Critical', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
              { label: '2 Overloaded Agents', severity: 'Critical', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
              { label: '5 Tickets Pending User > 5 Days', severity: 'Attention', color: '#E69F50', bgColor: '#FFFBEB', borderColor: '#FEF3C7' },
              { label: '1 Critical Escalation', severity: 'Critical', color: '#DC2626', bgColor: '#FEF2F2', borderColor: '#FECACA' },
              { label: '8 Due Today', severity: 'Attention', color: '#E69F50', bgColor: '#FFFBEB', borderColor: '#FEF3C7' },
              { label: '4 High Priority Open', severity: 'Attention', color: '#E69F50', bgColor: '#FFFBEB', borderColor: '#FEF3C7' },
            ].map((item) => (
              <div 
                key={item.label}
                className="p-3 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                style={{ backgroundColor: item.bgColor, borderColor: item.borderColor }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-medium flex-1" style={{ color: '#1a1a1a' }}>{item.label}</p>
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: item.color, color: 'white' }}>
                    {item.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </div>
  )
}
