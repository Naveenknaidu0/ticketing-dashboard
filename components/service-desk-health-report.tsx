'use client'

import React, { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, RefreshCw, Calendar, Info, Star, TrendingDown, TrendingUp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Mock data for charts and metrics
const ticketVolumeData = [
  { date: 'Mon', created: 42, resolved: 38, closed: 35 },
  { date: 'Tue', created: 52, resolved: 48, closed: 45 },
  { date: 'Wed', created: 48, resolved: 44, closed: 42 },
  { date: 'Thu', created: 61, resolved: 55, closed: 50 },
  { date: 'Fri', created: 45, resolved: 50, closed: 48 },
  { date: 'Sat', created: 38, resolved: 42, closed: 40 },
  { date: 'Sun', created: 35, resolved: 38, closed: 36 },
]

const csatData = [
  { name: '5 Star', value: 45, percentage: 45 },
  { name: '4 Star', value: 25, percentage: 25 },
  { name: '3 Star', value: 18, percentage: 18 },
  { name: '2 Star', value: 8, percentage: 8 },
  { name: '1 Star', value: 4, percentage: 4 },
]

const backlogCategoryData = [
  { name: '0-2 Days', value: 12 },
  { name: '3-7 Days', value: 28 },
  { name: '8-30 Days', value: 45 },
  { name: '30+ Days', value: 18 },
]

const workloadData = [
  { agent: 'Sarah Wilson', tickets: 34 },
  { agent: 'Mike Johnson', tickets: 31 },
  { agent: 'John Davis', tickets: 28 },
  { agent: 'Lisa Chen', tickets: 25 },
  { agent: 'Tom Anderson', tickets: 22 },
]

const drilldownData = [
  { group: 'Infrastructure', open: 24, resolved: 145, sla: '92%', csat: 4.2, backlog: 12 },
  { group: 'Applications', open: 31, resolved: 182, sla: '88%', csat: 3.9, backlog: 18 },
  { group: 'Network', open: 18, resolved: 96, sla: '95%', csat: 4.4, backlog: 8 },
  { group: 'Security', open: 15, resolved: 72, sla: '91%', csat: 4.1, backlog: 6 },
  { group: 'Database', open: 22, resolved: 108, sla: '87%', csat: 3.8, backlog: 14 },
]

const colors = ['#DC2626', '#E69F50', '#3B82F6', '#2A9D8F', '#6B6B6B']

// KPI Card Component
function ReportKPICard({ label, value, trend, comparison, icon }: any) {
  const isPositive = trend.includes('-')
  
  return (
    <div className="bg-white rounded-lg border p-4" style={{ borderColor: '#E2E0DC' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>
            {label}
          </p>
          <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
            {value}
          </p>
        </div>
        <div style={{ color: '#73847B' }}>{icon}</div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: isPositive ? '#10B981' : '#E69F50' }}>
          {trend}
        </span>
        <span className="text-xs" style={{ color: '#73847B' }}>
          {comparison}
        </span>
      </div>
    </div>
  )
}

// Health Score Component
function HealthScoreWidget() {
  const factors = [
    { label: 'SLA', value: 92, weight: 25 },
    { label: 'CSAT', value: 81, weight: 20 },
    { label: 'Backlog', value: 78, weight: 20 },
    { label: 'Resolution Time', value: 85, weight: 20 },
    { label: 'Workload', value: 88, weight: 15 },
  ]

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Service Desk Health Score</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 cursor-pointer" style={{ color: '#73847B' }} />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm max-w-xs">Overall health score based on SLA compliance, customer satisfaction, backlog status, resolution time, and workload balance.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Score Display */}
        <div className="col-span-1 flex flex-col items-center justify-center border-r" style={{ borderColor: '#E2E0DC' }}>
          <div className="text-5xl font-bold mb-2" style={{ color: '#2A9D8F' }}>87</div>
          <div className="text-sm font-medium mb-3" style={{ color: '#6B6B6B' }}>Healthy</div>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
            <span style={{ color: '#2A9D8F' }}>✓</span>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="col-span-2 space-y-3">
          {factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: '#6B6B6B' }}>
                  {factor.label}
                </span>
                <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>
                  {factor.value}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${factor.value}%`,
                    backgroundColor: factor.value >= 90 ? '#2A9D8F' : factor.value >= 80 ? '#3B82F6' : '#E69F50',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// SLA Health Widget
function SLAHealthWidget() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Response SLA %', value: 94, trend: '+2%' },
        { label: 'Resolution SLA %', value: 88, trend: '-1%' },
      ].map((item) => (
        <div key={item.label} className="bg-white rounded-lg border p-4" style={{ borderColor: '#E2E0DC' }}>
          <p className="text-xs font-medium mb-3" style={{ color: '#6B6B6B' }}>
            {item.label}
          </p>
          <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: '#F3F4F6' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.value >= 90 ? '#2A9D8F' : '#E69F50',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{item.value}%</span>
            <span className="text-xs font-semibold" style={{ color: item.trend.includes('+') ? '#10B981' : '#E69F50' }}>
              {item.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Top Risks Widget
function TopRisksWidget() {
  const risks = [
    { risk: 'Critical Ticket Backlog', level: 'High', impact: '45 tickets aging 30+ days', action: 'Allocate additional resources' },
    { risk: 'CSAT Decline', level: 'Medium', impact: 'Down 0.3 points from last week', action: 'Review feedback and improve response time' },
    { risk: 'Workload Imbalance', level: 'Medium', impact: 'Sarah: 34, Tom: 22 tickets', action: 'Redistribute ticket assignments' },
    { risk: 'SLA Response Risk', level: 'Low', impact: '8 tickets at risk of breaching', action: 'Monitor escalations' },
    { risk: 'Team Capacity', level: 'Low', impact: 'Operating at 87% capacity', action: 'Plan for hiring or overtime' },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'High': return '#DC2626'
      case 'Medium': return '#E69F50'
      case 'Low': return '#3B82F6'
      default: return '#6B6B6B'
    }
  }

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Top Risks</h3>
      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 pb-3" style={{ borderBottom: idx < risks.length - 1 ? '1px solid #E2E0DC' : 'none' }}>
            <div className="w-1 h-12 rounded-full flex-shrink-0" style={{ backgroundColor: getLevelColor(item.level) }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>
                  {item.risk}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: getLevelColor(item.level) + '20', color: getLevelColor(item.level) }}
                >
                  {item.level}
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: '#6B6B6B' }}>
                Impact: {item.impact}
              </p>
              <p className="text-xs font-medium" style={{ color: '#2A9D8F' }}>
                Action: {item.action}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Drilldown Table
function DrilldownTable() {
  return (
    <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Group</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Open</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Resolved</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>SLA %</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>CSAT</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Backlog</th>
            </tr>
          </thead>
          <tbody>
            {drilldownData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: idx < drilldownData.length - 1 ? '1px solid #E2E0DC' : 'none' }}>
                <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{row.group}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{row.open}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{row.resolved}</td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#2A9D8F' }}>{row.sla}</td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1a1a1a' }}>{row.csat}</td>
                <td className="px-4 py-3 text-center" style={{ color: '#E69F50' }}>{row.backlog}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ServiceDeskHealthReport() {
  const [viewMode, setViewMode] = useState('summary')

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F7' }}>
      {/* Header */}
      <div className="bg-white border-b p-6" style={{ borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Service Desk Health Report</h1>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>
                Comprehensive overview of service desk performance, SLA compliance, customer satisfaction, workload, and ticket health.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded hover:opacity-70" title="Refresh">
                <RefreshCw className="w-5 h-5" style={{ color: '#73847B' }} />
              </button>
              <button className="p-2 rounded hover:opacity-70" title="Export PDF">
                <Download className="w-5 h-5" style={{ color: '#73847B' }} />
              </button>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            {['Summary', 'Chart', 'Table'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode.toLowerCase())}
                className="px-3 py-1 rounded text-sm font-medium transition-all"
                style={{
                  backgroundColor: viewMode === mode.toLowerCase() ? '#0D3133' : '#F3F4F6',
                  color: viewMode === mode.toLowerCase() ? 'white' : '#6B6B6B',
                }}
              >
                {mode} View
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Global Filters */}
      <div className="bg-white border-b p-4" style={{ borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            {['Last 7 Days', 'Group', 'Agent', 'Priority', 'Status', 'Type', 'SLA State'].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1.5 rounded text-xs font-medium border"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B', backgroundColor: '#FFFFFF' }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Row 1: Executive KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportKPICard label="Total Tickets" value="445" trend="↑ 8%" comparison="vs Last Month" icon={<Calendar className="w-5 h-5" />} />
            <ReportKPICard label="Open Tickets" value="87" trend="↓ 12%" comparison="vs Last Month" icon={<TrendingDown className="w-5 h-5" />} />
            <ReportKPICard label="Resolved Tickets" value="312" trend="↑ 5%" comparison="vs Last Month" icon={<TrendingUp className="w-5 h-5" />} />
            <ReportKPICard label="SLA Compliance %" value="90%" trend="↑ 3%" comparison="vs Last Month" icon={<Info className="w-5 h-5" />} />
            <ReportKPICard label="CSAT Score" value="4.1" trend="↑ 0.2" comparison="vs Last Month" icon={<Star className="w-5 h-5" />} />
            <ReportKPICard label="Backlog Count" value="103" trend="↓ 8%" comparison="vs Last Month" icon={<TrendingDown className="w-5 h-5" />} />
          </div>

          {/* Row 2: Health Score */}
          <HealthScoreWidget />

          {/* Row 3: Ticket Volume Trend */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Ticket Volume Trend</h3>
              <div className="flex gap-2">
                {['Daily', 'Weekly', 'Monthly'].map((period) => (
                  <button key={period} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F3F4F6', color: '#6B6B6B' }}>
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ticketVolumeData}>
                <CartesianGrid stroke="#E2E0DC" />
                <XAxis dataKey="date" stroke="#6B6B6B" />
                <YAxis stroke="#6B6B6B" />
                <RechartsTooltip />
                <Legend />
                <Line type="monotone" dataKey="created" stroke="#3B82F6" />
                <Line type="monotone" dataKey="resolved" stroke="#2A9D8F" />
                <Line type="monotone" dataKey="closed" stroke="#E69F50" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Row 4: SLA Health */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>SLA Health Overview</h3>
            <SLAHealthWidget />
          </div>

          {/* Row 5: Customer Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>CSAT Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#6B6B6B' }}>Average CSAT</span>
                  <span className="font-bold" style={{ color: '#1a1a1a' }}>4.1 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: '#6B6B6B' }}>Response Rate</span>
                  <span className="font-bold" style={{ color: '#1a1a1a' }}>68%</span>
                </div>
                {csatData.map((rating) => (
                  <div key={rating.name} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>{rating.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
                        <div className="h-full rounded-full" style={{ width: `${rating.percentage}%`, backgroundColor: colors[csatData.indexOf(rating)] }} />
                      </div>
                      <span className="text-xs font-semibold min-w-fit">{rating.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Rating Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={csatData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                    {csatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 6: Backlog Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Backlog Health</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>Open Backlog: 87</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>Priority Backlog: 12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>Aging Backlog: 18</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Backlog by Age</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={backlogCategoryData}>
                  <CartesianGrid stroke="#E2E0DC" />
                  <XAxis dataKey="name" stroke="#6B6B6B" />
                  <YAxis stroke="#6B6B6B" />
                  <RechartsTooltip />
                  <Bar dataKey="value" fill="#E69F50" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 7: Workload Summary */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Workload Summary</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={workloadData} layout="vertical">
                <CartesianGrid stroke="#E2E0DC" />
                <XAxis type="number" stroke="#6B6B6B" />
                <YAxis dataKey="agent" type="category" stroke="#6B6B6B" width={100} />
                <RechartsTooltip />
                <Bar dataKey="tickets" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Row 8: Top Risks */}
          <TopRisksWidget />

          {/* Row 9: Drilldown Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Group Performance Details</h3>
            <DrilldownTable />
          </div>
        </div>
      </div>
    </div>
  )
}
