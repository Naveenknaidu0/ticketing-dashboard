'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart } from 'recharts'
import { Info, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ReportKPICardProps {
  label: string
  value: string
  trend: string
  comparison: string
  icon: React.ReactNode
  warningIndicator?: boolean
}

function ReportKPICard({ label, value, trend, comparison, icon, warningIndicator }: ReportKPICardProps) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ borderColor: '#E2E0DC', backgroundColor: warningIndicator ? '#FEF3E2' : '#FFFFFF' }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: '#73847B' }}>{label}</span>
        <div style={{ color: '#6B6B6B' }}>{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
        {value}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium" style={{ color: warningIndicator ? '#E69F50' : '#10B981' }}>
          {trend}
        </span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>
          {comparison}
        </span>
      </div>
    </div>
  )
}

// Sample data
const ticketFlowData = [
  { date: 'Mon', created: 420, resolved: 380, closed: 320, reopened: 45 },
  { date: 'Tue', created: 485, resolved: 415, closed: 350, reopened: 52 },
  { date: 'Wed', created: 510, resolved: 445, closed: 380, reopened: 58 },
  { date: 'Thu', created: 490, resolved: 460, closed: 390, reopened: 48 },
  { date: 'Fri', created: 620, resolved: 520, closed: 440, reopened: 65 },
  { date: 'Sat', created: 240, resolved: 320, closed: 270, reopened: 28 },
  { date: 'Sun', created: 180, resolved: 280, closed: 240, reopened: 20 },
]

const inflowOutflowData = [
  { date: 'Mon', inflow: 420, resolved: 380 },
  { date: 'Tue', inflow: 485, resolved: 415 },
  { date: 'Wed', inflow: 510, resolved: 445 },
  { date: 'Thu', inflow: 490, resolved: 460 },
  { date: 'Fri', inflow: 620, resolved: 520 },
  { date: 'Sat', inflow: 240, resolved: 320 },
  { date: 'Sun', inflow: 180, resolved: 280 },
]

const channelData = [
  { name: 'Email', value: 1245, percentage: 44 },
  { name: 'Portal', value: 895, percentage: 31 },
  { name: 'Manual', value: 520, percentage: 18 },
  { name: 'API', value: 185, percentage: 7 },
]

const typeVolumeData = [
  { type: 'Incident', created: 1245, percentage: 44, trend: 12 },
  { type: 'Service Request', created: 895, percentage: 31, trend: 8 },
  { type: 'Access Request', created: 520, percentage: 18, trend: -2 },
  { type: 'Task', created: 185, percentage: 7, trend: 5 },
]

const groupVolumeData = [
  { group: 'Infrastructure', created: 620, resolved: 580, open: 85, backlog: 42 },
  { group: 'Applications', created: 520, resolved: 480, open: 72, backlog: 38 },
  { group: 'Network', created: 450, resolved: 425, open: 58, backlog: 28 },
  { group: 'Access Mgmt', created: 320, resolved: 305, open: 42, backlog: 22 },
  { group: 'L1', created: 280, resolved: 270, open: 35, backlog: 18 },
  { group: 'L2', created: 420, resolved: 395, open: 58, backlog: 31 },
  { group: 'L3', created: 255, resolved: 240, open: 32, backlog: 19 },
]

const priorityVolumeData = [
  { priority: 'Critical', created: 145, resolved: 128, open: 28 },
  { priority: 'High', created: 520, resolved: 480, open: 85 },
  { priority: 'Medium', created: 1245, resolved: 1180, open: 165 },
  { priority: 'Low', created: 935, resolved: 890, open: 95 },
]

const backlogTrendData = [
  { period: 'Start', value: 280 },
  { period: 'Created', value: 2845 },
  { period: 'Resolved', value: -2621 },
  { period: 'End', value: 504 },
]

const peakLoadData = [
  { metric: 'Highest Day', date: 'Friday', volume: 620, trend: '+8%' },
  { metric: 'Highest Week', date: 'Week 12', volume: 3625, trend: '+12%' },
  { metric: 'Highest Month', date: 'March', volume: 14280, trend: '+5%' },
  { metric: 'Lowest Day', date: 'Sunday', volume: 180, trend: '-25%' },
]

const drilldownData = [
  { date: '2024-03-01', created: 420, resolved: 380, closed: 320, reopened: 45, netGrowth: 40, backlog: 312 },
  { date: '2024-03-02', created: 485, resolved: 415, closed: 350, reopened: 52, netGrowth: 70, backlog: 382 },
  { date: '2024-03-03', created: 510, resolved: 445, closed: 380, reopened: 58, netGrowth: 65, backlog: 447 },
  { date: '2024-03-04', created: 490, resolved: 460, closed: 390, reopened: 48, netGrowth: 30, backlog: 477 },
  { date: '2024-03-05', created: 620, resolved: 520, closed: 440, reopened: 65, netGrowth: 100, backlog: 504 },
]

const COLORS = ['#0D3133', '#10B981', '#F59E0B', '#EF4444']

export function TicketVolumeReport() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('daily')

  const insights = [
    'Ticket volume increased 12% compared to previous month',
    'Infrastructure group generated 42% of all tickets',
    'Service Requests represent 35% of total volume',
    'Backlog increased by 8% week-over-week',
    'Email channel accounts for 44% of incoming tickets',
  ]

  return (
    <div className="space-y-6">
      {/* Row 1: Volume KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        <ReportKPICard
          label="Tickets Created"
          value="2,845"
          trend="↑ 12%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <ReportKPICard
          label="Tickets Resolved"
          value="2,621"
          trend="↑ 8%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <ReportKPICard
          label="Net Ticket Growth"
          value="+224"
          trend="Warning"
          comparison="Backlog Rising"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
        <ReportKPICard
          label="Average Daily Volume"
          value="406"
          trend="↑ 4%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <ReportKPICard
          label="Peak Volume Day"
          value="620"
          trend="Friday"
          comparison="Highest Day"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <ReportKPICard
          label="Backlog Change"
          value="↑ 8%"
          trend="↑ 45"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
      </div>

      {/* Row 2: Ticket Flow Overview */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Ticket Flow Overview</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Shows the daily flow of tickets created, resolved, closed, and reopened</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="px-3 py-1 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: viewMode === mode ? '#0D3133' : '#F8F8F7',
                  color: viewMode === mode ? 'white' : '#6B6B6B',
                  border: '1px solid #E2E0DC',
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ticketFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="date" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#0D3133" strokeWidth={2} name="Created" />
            <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
            <Line type="monotone" dataKey="closed" stroke="#F59E0B" strokeWidth={2} name="Closed" />
            <Line type="monotone" dataKey="reopened" stroke="#EF4444" strokeWidth={2} name="Reopened" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row 3: Ticket Inflow vs Outflow */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-6 rounded-lg border"
          style={{ borderColor: '#E2E0DC' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Incoming Tickets</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tickets entering the system daily</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={inflowOutflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="date" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
              <Area type="monotone" dataKey="inflow" fill="#0D3133" stroke="#0D3133" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{ borderColor: '#E2E0DC' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Resolved Tickets</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tickets resolved daily</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={inflowOutflowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="date" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
              <Area type="monotone" dataKey="resolved" fill="#10B981" stroke="#10B981" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 4: Ticket Creation Channels */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Ticket Creation Channels</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Distribution of tickets by creation source</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center justify-center gap-8">
          <ResponsiveContainer width="40%" height={250}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label>
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-3">
            {channelData.map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: COLORS[idx] }}></div>
                  <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{channel.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{channel.value}</div>
                  <div className="text-xs" style={{ color: '#6B6B6B' }}>{channel.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: Ticket Type Volume */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Ticket Type Volume</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ticket volumes by type with trends</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={typeVolumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="type" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Bar dataKey="created" fill="#0D3133" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 6: Group Volume Distribution */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Group Volume Distribution</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ticket distribution across support groups</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-3">
          {groupVolumeData.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{group.group}</span>
                <div className="flex gap-4 text-xs" style={{ color: '#6B6B6B' }}>
                  <span>Created: {group.created}</span>
                  <span>Resolved: {group.resolved}</span>
                  <span>Open: {group.open}</span>
                  <span>Backlog: {group.backlog}</span>
                </div>
              </div>
              <div className="flex gap-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div style={{ width: '40%', backgroundColor: '#0D3133' }}></div>
                <div style={{ width: '35%', backgroundColor: '#10B981' }}></div>
                <div style={{ width: '15%', backgroundColor: '#F59E0B' }}></div>
                <div style={{ width: '10%', backgroundColor: '#EF4444' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 7: Priority Volume Analysis */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Priority Volume Analysis</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Ticket volumes analyzed by priority level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={priorityVolumeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="priority" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Bar dataKey="created" fill="#0D3133" name="Created" />
            <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
            <Bar dataKey="open" fill="#EF4444" name="Open" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 8: Backlog Growth Trend */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Backlog Growth Trend</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Waterfall view of backlog changes</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={backlogTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="period" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Bar dataKey="value" fill="#0D3133" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Row 9: Peak Load Analysis */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Peak Load Analysis</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Highest and lowest ticket volume periods</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {peakLoadData.map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <p className="text-xs font-medium mb-2" style={{ color: '#6B6B6B' }}>{item.metric}</p>
              <p className="text-lg font-bold mb-1" style={{ color: '#1a1a1a' }}>{item.date}</p>
              <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>{item.volume}</p>
              <p className="text-xs font-medium" style={{ color: '#10B981' }}>{item.trend}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 10: Drilldown Table */}
      <div
        className="p-6 rounded-lg border overflow-x-auto"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Daily Ticket Summary</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Detailed daily metrics with sorting and filtering</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Date</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Created</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Resolved</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Closed</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Reopened</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Net Growth</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Backlog</th>
            </tr>
          </thead>
          <tbody>
            {drilldownData.map((row, idx) => (
              <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                <td className="px-4 py-3" style={{ color: '#1a1a1a' }}>{row.date}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#1a1a1a' }}>{row.created}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#1a1a1a' }}>{row.resolved}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#1a1a1a' }}>{row.closed}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#1a1a1a' }}>{row.reopened}</td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: row.netGrowth > 50 ? '#EF4444' : '#10B981' }}>
                  +{row.netGrowth}
                </td>
                <td className="px-4 py-3 text-center" style={{ color: '#1a1a1a' }}>{row.backlog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights Panel */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Key Insights</h3>
        <div className="grid grid-cols-1 gap-3">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0D3133', color: 'white' }}>
                ✓
              </div>
              <p className="text-sm" style={{ color: '#1a1a1a' }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
