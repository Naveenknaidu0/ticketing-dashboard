'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Info, TrendingUp, TrendingDown, AlertCircle, ArrowRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ReportKPICardProps {
  label: string
  value: string
  percentage: string
  trend: string
  comparison: string
  icon: React.ReactNode
}

function ReportKPICard({ label, value, percentage, trend, comparison, icon }: ReportKPICardProps) {
  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: '#73847B' }}>{label}</span>
        <div style={{ color: '#6B6B6B' }}>{icon}</div>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{value}</div>
        <div className="text-xs font-medium" style={{ color: '#73847B' }}>{percentage}</div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium" style={{ color: '#10B981' }}>{trend}</span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>{comparison}</span>
      </div>
    </div>
  )
}

// Sample data
const statusKPIData = [
  { label: 'Open Tickets', value: '245', percentage: '18%', trend: 'up 3%', comparison: 'vs last week', icon: <AlertCircle className="w-4 h-4" /> },
  { label: 'In Progress', value: '182', percentage: '13%', trend: 'down 2%', comparison: 'vs last week', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Pending', value: '245', percentage: '18%', trend: 'up 5%', comparison: 'vs last week', icon: <AlertCircle className="w-4 h-4" /> },
  { label: 'Resolved', value: '523', percentage: '39%', trend: 'up 8%', comparison: 'vs last week', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Closed', value: '265', percentage: '20%', trend: 'up 6%', comparison: 'vs last week', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Unassigned', value: '45', percentage: '3%', trend: 'down 1%', comparison: 'vs last week', icon: <TrendingDown className="w-4 h-4" /> },
]

const statusDistributionData = [
  { name: 'Open', value: 245, color: '#E63946' },
  { name: 'In Progress', value: 182, color: '#F77F00' },
  { name: 'Pending User', value: 156, color: '#FCBF49' },
  { name: 'Pending Vendor', value: 89, color: '#9D4EDD' },
  { name: 'Resolved', value: 523, color: '#3A86FF' },
  { name: 'Closed', value: 265, color: '#06D6A0' },
]

const statusTrendData = [
  { period: 'Mon', created: 245, resolved: 189, closed: 145, pending: 89, inProgress: 182 },
  { period: 'Tue', created: 238, resolved: 195, closed: 152, pending: 92, inProgress: 175 },
  { period: 'Wed', created: 252, resolved: 188, closed: 148, pending: 98, inProgress: 185 },
  { period: 'Thu', created: 241, resolved: 192, closed: 155, pending: 95, inProgress: 178 },
  { period: 'Fri', created: 255, resolved: 205, closed: 162, pending: 88, inProgress: 192 },
  { period: 'Sat', created: 156, resolved: 142, closed: 98, pending: 65, inProgress: 112 },
  { period: 'Sun', created: 148, resolved: 135, closed: 92, pending: 58, inProgress: 105 },
]

const workflowMovementData = [
  { transition: 'New → Open', count: 245, percentage: 18 },
  { transition: 'Open → In Progress', count: 189, percentage: 14 },
  { transition: 'In Progress → Pending', count: 156, percentage: 12 },
  { transition: 'Pending → In Progress', count: 98, percentage: 7 },
  { transition: 'In Progress → Resolved', count: 182, percentage: 13 },
  { transition: 'Resolved → Closed', count: 167, percentage: 12 },
]

const groupStatusData = [
  { group: 'Infrastructure', open: 42, inProgress: 28, pending: 18, resolved: 95, closed: 52, total: 235 },
  { group: 'Application Support', open: 58, inProgress: 35, pending: 22, resolved: 128, closed: 68, total: 311 },
  { group: 'Network', open: 35, inProgress: 22, pending: 14, resolved: 85, closed: 45, total: 201 },
  { group: 'Access Management', open: 28, inProgress: 18, pending: 10, resolved: 98, closed: 58, total: 212 },
  { group: 'L1', open: 32, inProgress: 25, pending: 12, resolved: 68, closed: 35, total: 172 },
  { group: 'L2', open: 38, inProgress: 32, pending: 18, resolved: 92, closed: 42, total: 222 },
  { group: 'L3', open: 12, inProgress: 22, pending: 6, resolved: 58, closed: 15, total: 113 },
]

const agentStatusData = Array.from({ length: 15 }, (_, i) => ({
  rank: i + 1,
  agent: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Davis', 'James Wilson', 'Lisa Anderson', 'Robert Miller', 'Jennifer Lee', 'David Brown', 'Maria Garcia', 'Michael Brown', 'Susan Taylor', 'Daniel Johnson', 'Catherine White', 'Richard Moore'][i],
  open: Math.floor(Math.random() * 35) + 5,
  inProgress: Math.floor(Math.random() * 30) + 8,
  pending: Math.floor(Math.random() * 20) + 3,
  resolved: Math.floor(Math.random() * 80) + 40,
  closed: Math.floor(Math.random() * 50) + 20,
}))

const pendingAnalysisData = [
  { type: 'Pending User', count: 156, avgAge: '2.3 days', oldest: '8 days' },
  { type: 'Pending Vendor', count: 89, avgAge: '4.1 days', oldest: '15 days' },
  { type: 'Pending Approval', count: 45, avgAge: '1.8 days', oldest: '5 days' },
  { type: 'Pending Third Party', count: 32, avgAge: '6.2 days', oldest: '22 days' },
]

const statusAgingData = [
  { category: 'Open > 1 Day', count: 245, percentage: 35 },
  { category: 'Open > 3 Days', count: 156, percentage: 23 },
  { category: 'Open > 7 Days', count: 89, percentage: 13 },
  { category: 'Open > 30 Days', count: 32, percentage: 5 },
]

const resolutionFlowData = [
  { period: 'Today', resolved: 156, closed: 98 },
  { period: 'This Week', resolved: 892, closed: 645 },
  { period: 'This Month', resolved: 3245, closed: 2156 },
]

const backlogAnalysisData = [
  { metric: 'Current Backlog', value: 672, trend: 'up 5%', color: '#E63946' },
  { metric: 'Weekly Growth', value: 45, trend: 'up 3%', color: '#F77F00' },
  { metric: 'Monthly Growth', value: 185, trend: 'up 8%', color: '#FCBF49' },
  { metric: 'Reduction %', value: 12, trend: 'up 2%', color: '#06D6A0' },
]

const drilldownData = [
  { ticketId: 'INC-001245', subject: 'VPN Connection Failed', priority: 'High', status: 'Open', group: 'Infrastructure', agent: 'John Smith', created: '2024-01-15', updated: '2024-01-17', age: '2 days' },
  { ticketId: 'INC-001242', subject: 'Email Configuration Issue', priority: 'Medium', status: 'In Progress', group: 'Application Support', agent: 'Emma Davis', created: '2024-01-14', updated: '2024-01-16', age: '3 days' },
  { ticketId: 'INC-001240', subject: 'Network Latency', priority: 'Critical', status: 'Pending User', group: 'Network', agent: 'Mike Chen', created: '2024-01-13', updated: '2024-01-17', age: '4 days' },
  { ticketId: 'INC-001238', subject: 'Access Request - Database', priority: 'High', status: 'Pending Vendor', group: 'Access Management', agent: 'Sarah Johnson', created: '2024-01-12', updated: '2024-01-15', age: '5 days' },
  { ticketId: 'INC-001235', subject: 'System Backup Failed', priority: 'Critical', status: 'Resolved', group: 'Infrastructure', agent: 'James Wilson', created: '2024-01-11', updated: '2024-01-16', age: '6 days' },
]

export function TicketStatusReport() {
  const [trendView, setTrendView] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'>('Weekly')
  const [pendingFilter, setPendingFilter] = useState('All')

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {statusKPIData.map((kpi, idx) => (
            <ReportKPICard key={idx} {...kpi} />
          ))}
        </div>

        {/* Overall Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Overall Status Distribution</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                  </TooltipTrigger>
                  <TooltipContent>Current distribution of tickets across all status categories</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusDistributionData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {statusDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Summary Grid */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Status Summary</h3>
            <div className="space-y-3">
              {statusDistributionData.map((status, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>{status.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: '#1a1a1a' }}>{status.value}</span>
                    <span className="text-xs" style={{ color: '#A0A0A0' }}>({((status.value / 1460) * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status Trend Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Status Trend Analysis</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                  </TooltipTrigger>
                  <TooltipContent>Ticket volume movement by status over time</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex gap-2">
              {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map((view) => (
                <button
                  key={view}
                  onClick={() => setTrendView(view as any)}
                  className="px-3 py-1 rounded text-sm font-medium transition-all"
                  style={{
                    backgroundColor: trendView === view ? '#E69F50' : '#F8F8F7',
                    color: trendView === view ? 'white' : '#6B6B6B',
                    border: trendView === view ? 'none' : '1px solid #E2E0DC',
                  }}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={statusTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="period" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="created" stackId="a" fill="#3A86FF" />
              <Bar dataKey="resolved" stackId="a" fill="#06D6A0" />
              <Bar dataKey="closed" stackId="a" fill="#9D4EDD" />
              <Line type="monotone" dataKey="pending" stroke="#E63946" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Workflow Movement Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Workflow Movement Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                </TooltipTrigger>
                <TooltipContent>Shows ticket transitions between statuses and identifies bottlenecks</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3">
            {workflowMovementData.map((flow, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-medium min-w-32" style={{ color: '#6B6B6B' }}>{flow.transition}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium" style={{ width: `${flow.percentage * 3}%`, backgroundColor: '#3A86FF', color: 'white' }}>
                    {flow.count}
                  </div>
                </div>
                <span className="text-sm font-medium min-w-12 text-right" style={{ color: '#1a1a1a' }}>{flow.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Group-wise Status Breakdown */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Group-wise Status Breakdown</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                </TooltipTrigger>
                <TooltipContent>Status distribution by support group - highlights teams with highest backlog</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Group</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#E63946' }}>Open</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#F77F00' }}>In Progress</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#FCBF49' }}>Pending</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#3A86FF' }}>Resolved</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#06D6A0' }}>Closed</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#1a1a1a' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {groupStatusData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                    <td className="px-3 py-2" style={{ color: '#1a1a1a' }}>{row.group}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#E63946' }}>{row.open}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#F77F00' }}>{row.inProgress}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#FCBF49' }}>{row.pending}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#3A86FF' }}>{row.resolved}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#06D6A0' }}>{row.closed}</td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: '#1a1a1a' }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Agent-wise Status Breakdown */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Top 15 Agent Performance</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                </TooltipTrigger>
                <TooltipContent>Agent workload and status distribution - highlights overloaded agents</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Rank</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Agent</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#6B6B6B' }}>Open</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#6B6B6B' }}>In Progress</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#6B6B6B' }}>Pending</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#6B6B6B' }}>Resolved</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#6B6B6B' }}>Closed</th>
                  <th className="px-3 py-2 text-right font-medium" style={{ color: '#1a1a1a' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {agentStatusData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>#{row.rank}</td>
                    <td className="px-3 py-2" style={{ color: '#1a1a1a' }}>{row.agent}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#6B6B6B' }}>{row.open}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#6B6B6B' }}>{row.inProgress}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#6B6B6B' }}>{row.pending}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#6B6B6B' }}>{row.resolved}</td>
                    <td className="px-3 py-2 text-right" style={{ color: '#6B6B6B' }}>{row.closed}</td>
                    <td className="px-3 py-2 text-right font-medium" style={{ color: '#1a1a1a' }}>{row.open + row.inProgress + row.pending + row.resolved + row.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Pending Analysis</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                  </TooltipTrigger>
                  <TooltipContent>Breakdown of pending tickets by type - highlights oldest pending queues</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-4">
              {pendingAnalysisData.map((pending, idx) => (
                <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium" style={{ color: '#1a1a1a' }}>{pending.type}</span>
                    <span className="text-sm font-bold" style={{ color: '#E69F50' }}>{pending.count}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span style={{ color: '#6B6B6B' }}>Avg Age: </span>
                      <span style={{ color: '#1a1a1a' }} className="font-medium">{pending.avgAge}</span>
                    </div>
                    <div>
                      <span style={{ color: '#6B6B6B' }}>Oldest: </span>
                      <span style={{ color: '#E63946' }} className="font-medium">{pending.oldest}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Aging Analysis */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Status Aging Analysis</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                  </TooltipTrigger>
                  <TooltipContent>Distribution of ticket age for open status tickets</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="space-y-3">
              {statusAgingData.map((aging, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm font-medium min-w-32" style={{ color: '#6B6B6B' }}>{aging.category}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative" style={{ backgroundColor: '#E2E0DC' }}>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center text-xs font-medium" style={{ width: `${aging.percentage * 2}%`, backgroundColor: '#E63946', color: 'white' }}>
                      {aging.count}
                    </div>
                  </div>
                  <span className="text-sm font-medium min-w-12 text-right" style={{ color: '#1a1a1a' }}>{aging.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resolution Flow Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Resolution Flow Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                </TooltipTrigger>
                <TooltipContent>Trend of resolved and closed tickets over different time periods</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {resolutionFlowData.map((flow, idx) => (
              <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <div className="text-sm font-medium mb-3" style={{ color: '#6B6B6B' }}>{flow.period}</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-xs" style={{ color: '#6B6B6B' }}>Resolved</div>
                    <div className="text-2xl font-bold" style={{ color: '#3A86FF' }}>{flow.resolved}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: '#6B6B6B' }}>Closed</div>
                    <div className="text-2xl font-bold" style={{ color: '#06D6A0' }}>{flow.closed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backlog Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Backlog Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                </TooltipTrigger>
                <TooltipContent>Current backlog metrics and trend indicators</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {backlogAnalysisData.map((backlog, idx) => (
              <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
                <div className="text-xs font-medium mb-2" style={{ color: '#73847B' }}>{backlog.metric}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="text-2xl font-bold" style={{ color: backlog.color }}>{backlog.value}</div>
                  <div className="text-xs font-medium" style={{ color: '#10B981' }}>{backlog.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Detection - Auto Insights */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" style={{ color: '#E69F50' }} />
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Bottleneck Detection</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3E2', borderLeftColor: '#E69F50', borderLeftWidth: '3px' }}>
              <div className="font-medium" style={{ color: '#1a1a1a' }}>42 tickets stuck in Pending User</div>
              <div className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Action: Review and follow up with customers</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3E2', borderLeftColor: '#E69F50', borderLeftWidth: '3px' }}>
              <div className="font-medium" style={{ color: '#1a1a1a' }}>L2 Support has highest backlog (222 tickets)</div>
              <div className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Action: Consider escalation or resource allocation</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9', borderLeftColor: '#06D6A0', borderLeftWidth: '3px' }}>
              <div className="font-medium" style={{ color: '#1a1a1a' }}>Infrastructure team reduced backlog by 12%</div>
              <div className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Action: Recognize and document best practices</div>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEF3E2', borderLeftColor: '#E69F50', borderLeftWidth: '3px' }}>
              <div className="font-medium" style={{ color: '#1a1a1a' }}>Network group has oldest open tickets (oldest: 8 days)</div>
              <div className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Action: Prioritize resolution efforts</div>
            </div>
          </div>
        </div>

        {/* Drilldown Table */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Detailed Ticket Data</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4" style={{ color: '#6B6B6B', cursor: 'pointer' }} />
                  </TooltipTrigger>
                  <TooltipContent>Searchable, sortable drilldown table with full ticket details</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Ticket ID</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Subject</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Priority</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Status</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Group</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Agent</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Created</th>
                  <th className="px-3 py-2 text-left font-medium" style={{ color: '#6B6B6B' }}>Age</th>
                </tr>
              </thead>
              <tbody>
                {drilldownData.map((ticket, idx) => (
                  <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                    <td className="px-3 py-2" style={{ color: '#0D3133', fontWeight: 500 }}>{ticket.ticketId}</td>
                    <td className="px-3 py-2" style={{ color: '#1a1a1a' }}>{ticket.subject}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: ticket.priority === 'Critical' ? '#FEF3E2' : '#F8F8F7', color: ticket.priority === 'Critical' ? '#E69F50' : '#6B6B6B' }}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>{ticket.status}</td>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>{ticket.group}</td>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>{ticket.agent}</td>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>{ticket.created}</td>
                    <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>{ticket.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
