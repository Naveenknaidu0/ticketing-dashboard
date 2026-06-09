'use client'

import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts'
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
        <span className="text-xs font-medium" style={{ color: trend.includes('up') ? '#10B981' : '#E63946' }}>{trend}</span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>{comparison}</span>
      </div>
    </div>
  )
}

// Sample data
const priorityKPIData = [
  { label: 'Critical Tickets', value: '42', percentage: '3.2%', trend: 'up 18%', comparison: 'vs last week', icon: <AlertCircle className="w-4 h-4" /> },
  { label: 'High Priority', value: '185', percentage: '14%', trend: 'up 6%', comparison: 'vs last week', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Medium Priority', value: '542', percentage: '41%', trend: 'down 3%', comparison: 'vs last week', icon: <TrendingDown className="w-4 h-4" /> },
  { label: 'Low Priority', value: '625', percentage: '47%', trend: 'down 2%', comparison: 'vs last week', icon: <TrendingDown className="w-4 h-4" /> },
  { label: 'Critical Breaches', value: '8', percentage: '19%', trend: 'down 9%', comparison: 'vs last week', icon: <TrendingDown className="w-4 h-4" /> },
  { label: 'Priority Escalations', value: '23', percentage: '5.4%', trend: 'up 12%', comparison: 'vs last week', icon: <TrendingUp className="w-4 h-4" /> },
]

const priorityDistributionData = [
  { name: 'Critical', value: 42, color: '#E63946' },
  { name: 'High', value: 185, color: '#F77F00' },
  { name: 'Medium', value: 542, color: '#FCBF49' },
  { name: 'Low', value: 625, color: '#06D6A0' },
]

const priorityTrendData = [
  { period: 'Mon', critical: 38, high: 175, medium: 510, low: 615 },
  { period: 'Tue', critical: 40, high: 180, medium: 520, low: 625 },
  { period: 'Wed', critical: 45, high: 190, medium: 535, low: 630 },
  { period: 'Thu', critical: 41, high: 185, medium: 540, low: 628 },
  { period: 'Fri', critical: 42, high: 185, medium: 545, low: 635 },
  { period: 'Sat', critical: 25, high: 120, medium: 380, low: 480 },
  { period: 'Sun', critical: 22, high: 115, medium: 360, low: 450 },
]

const priorityStatusMatrixData = [
  { priority: 'Critical', open: 28, inProgress: 8, pending: 4, resolved: 2, closed: 0 },
  { priority: 'High', open: 58, inProgress: 45, pending: 32, resolved: 40, closed: 10 },
  { priority: 'Medium', open: 156, inProgress: 125, pending: 98, resolved: 145, closed: 18 },
  { priority: 'Low', open: 198, inProgress: 142, pending: 85, resolved: 185, closed: 15 },
]

const prioritySLAData = [
  { priority: 'Critical', responseSLA: 92, resolutionSLA: 78, atRisk: 8, breached: 2 },
  { priority: 'High', responseSLA: 95, resolutionSLA: 85, atRisk: 12, breached: 5 },
  { priority: 'Medium', responseSLA: 98, resolutionSLA: 92, atRisk: 18, breached: 8 },
  { priority: 'Low', responseSLA: 99, resolutionSLA: 96, atRisk: 5, breached: 2 },
]

const groupPriorityData = [
  { group: 'Infrastructure', critical: 15, high: 42, medium: 85, low: 93, total: 235 },
  { group: 'Application Support', critical: 12, high: 58, medium: 125, low: 116, total: 311 },
  { group: 'Network', critical: 8, high: 35, medium: 95, low: 63, total: 201 },
  { group: 'Access Management', critical: 4, high: 28, medium: 98, low: 82, total: 212 },
  { group: 'L1', critical: 2, high: 18, medium: 75, low: 77, total: 172 },
  { group: 'L2', critical: 1, high: 4, medium: 98, low: 119, total: 222 },
]

const agentPriorityData = Array.from({ length: 15 }, (_, i) => ({
  rank: i + 1,
  agent: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Davis', 'James Wilson', 'Lisa Anderson', 'Robert Miller', 'Jennifer Lee', 'David Brown', 'Maria Garcia', 'Michael Brown', 'Susan Taylor', 'Daniel Johnson', 'Catherine White', 'Richard Moore'][i],
  critical: Math.floor(Math.random() * 5) + 1,
  high: Math.floor(Math.random() * 15) + 5,
  medium: Math.floor(Math.random() * 35) + 15,
  low: Math.floor(Math.random() * 45) + 20,
}))

const priorityAgingData = [
  { category: 'Critical > 4 Hours', count: 15, percentage: 36 },
  { category: 'Critical > 8 Hours', count: 8, percentage: 19 },
  { category: 'High > 1 Day', count: 42, percentage: 23 },
  { category: 'High > 3 Days', count: 28, percentage: 15 },
  { category: 'Medium > 7 Days', count: 85, percentage: 16 },
  { category: 'Low > 30 Days', count: 142, percentage: 23 },
]

const escalationData = [
  { type: 'Critical Escalations', count: 8, trend: 'up 18%' },
  { type: 'Manager Escalations', count: 12, trend: 'down 5%' },
  { type: 'L1 → L2', count: 32, trend: 'up 8%' },
  { type: 'L2 → L3', count: 14, trend: 'down 3%' },
  { type: 'Emergency Escalations', count: 3, trend: 'stable' },
]

const criticalIncidentData = [
  { metric: 'Total Critical', value: 42 },
  { metric: 'Open Critical', value: 28 },
  { metric: 'At Risk Critical', value: 8 },
  { metric: 'Breached Critical', value: 2 },
  { metric: 'Resolved Critical', value: 4 },
  { metric: 'Avg Resolution Time', value: '2.4 hours' },
]

const businessImpactData = [
  { impact: 'Critical Tickets Impact', score: 92, color: '#E63946' },
  { impact: 'High Priority Impact', score: 78, color: '#F77F00' },
  { impact: 'Most Affected Groups', groups: ['Infrastructure', 'Application Support'], color: '#3A86FF' },
  { impact: 'Most Affected Services', services: ['VPN', 'Email', 'Active Directory'], color: '#06D6A0' },
]

const insightsData = [
  { text: 'Critical incidents increased by 18% compared to last week', severity: 'high', color: '#E63946' },
  { text: 'Infrastructure team owns 42% of critical tickets', severity: 'warning', color: '#F77F00' },
  { text: 'Critical SLA breaches reduced by 9% due to faster response times', severity: 'success', color: '#10B981' },
  { text: 'High-priority backlog increased 12% this week - escalation recommended', severity: 'warning', color: '#F77F00' },
]

const drilldownData = [
  { ticketId: 'INC-001245', subject: 'VPN Connection Failed', priority: 'Critical', status: 'Open', group: 'Infrastructure', agent: 'John Smith', age: '2 days', responseSLA: '92%', resolutionSLA: '78%' },
  { ticketId: 'INC-001242', subject: 'Email Configuration Issue', priority: 'High', status: 'In Progress', group: 'Application Support', agent: 'Emma Davis', age: '3 days', responseSLA: '95%', resolutionSLA: '85%' },
  { ticketId: 'INC-001240', subject: 'Network Latency', priority: 'Critical', status: 'Pending User', group: 'Network', agent: 'Mike Chen', age: '4 days', responseSLA: '89%', resolutionSLA: '72%' },
  { ticketId: 'INC-001238', subject: 'Access Request - Database', priority: 'High', status: 'Pending Vendor', group: 'Access Management', agent: 'Sarah Johnson', age: '5 days', responseSLA: '94%', resolutionSLA: '82%' },
  { ticketId: 'INC-001235', subject: 'System Backup Failed', priority: 'Critical', status: 'Resolved', group: 'Infrastructure', agent: 'James Wilson', age: '6 days', responseSLA: '96%', resolutionSLA: '88%' },
]

export function PriorityAnalysisReport() {
  const [trendView, setTrendView] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'>('Weekly')

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Row 1: Priority KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {priorityKPIData.map((kpi, idx) => (
            <ReportKPICard key={idx} {...kpi} />
          ))}
        </div>

        {/* Row 2: Priority Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={priorityDistributionData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {priorityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority Breakdown</h3>
            <div className="space-y-3">
              {priorityDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Priority Trend Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Priority Trend Analysis</h3>
            <div className="flex gap-2">
              {(['Daily', 'Weekly', 'Monthly', 'Quarterly'] as const).map((view) => (
                <button key={view} onClick={() => setTrendView(view)} className="px-3 py-1 rounded text-sm font-medium transition-colors" style={{
                  backgroundColor: trendView === view ? '#0D3133' : '#F8F8F7',
                  color: trendView === view ? 'white' : '#6B6B6B',
                  border: `1px solid ${trendView === view ? '#0D3133' : '#E2E0DC'}`,
                }}>
                  {view}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priorityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="period" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke="#E63946" name="Critical" strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke="#F77F00" name="High" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#FCBF49" name="Medium" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#06D6A0" name="Low" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Row 4: Priority vs Status Matrix */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority vs Status Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Open</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>In Progress</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Pending</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Resolved</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Closed</th>
                </tr>
              </thead>
              <tbody>
                {priorityStatusMatrixData.map((row) => (
                  <tr key={row.priority} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: '#1a1a1a' }}>{row.priority}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.open}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.inProgress}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.pending}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.resolved}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.closed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 5: Priority vs SLA Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority vs SLA Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Response SLA %</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Resolution SLA %</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>At Risk</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Breached</th>
                </tr>
              </thead>
              <tbody>
                {prioritySLAData.map((row) => (
                  <tr key={row.priority} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: '#1a1a1a' }}>{row.priority}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#10B981' }}>{row.responseSLA}%</td>
                    <td className="text-center py-2 px-4" style={{ color: row.resolutionSLA < 85 ? '#E63946' : '#10B981' }}>{row.resolutionSLA}%</td>
                    <td className="text-center py-2 px-4" style={{ color: '#F77F00' }}>{row.atRisk}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#E63946' }}>{row.breached}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 6: Group-wise Priority Distribution */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Group-wise Priority Distribution</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Group</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#E63946' }}>Critical</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#F77F00' }}>High</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#FCBF49' }}>Medium</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#06D6A0' }}>Low</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {groupPriorityData.map((row) => (
                  <tr key={row.group} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: '#1a1a1a' }}>{row.group}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.critical}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.high}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.medium}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.low}</td>
                    <td className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 7: Agent Priority Workload */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Top Agents - Priority Workload</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Agent</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#E63946' }}>Critical</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#F77F00' }}>High</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#FCBF49' }}>Medium</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#06D6A0' }}>Low</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#6B6B6B' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {agentPriorityData.map((row) => (
                  <tr key={row.agent} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: '#1a1a1a' }}>{row.rank}. {row.agent}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.critical}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.high}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.medium}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.low}</td>
                    <td className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>{row.critical + row.high + row.medium + row.low}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Row 8: Priority Aging Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority Aging Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityAgingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="count" fill="#3A86FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Row 9: Escalation Analysis */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Escalation Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {escalationData.map((item) => (
              <div key={item.type} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>{item.type}</h4>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{item.count}</div>
                  <span className="text-xs font-medium" style={{ color: item.trend.includes('up') ? '#E63946' : '#10B981' }}>{item.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 10: Critical Incident Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Critical Incident Analysis</h3>
            <div className="space-y-3">
              {criticalIncidentData.map((item) => (
                <div key={item.metric} className="flex items-center justify-between py-2">
                  <span className="text-sm" style={{ color: '#6B6B6B' }}>{item.metric}</span>
                  <span className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 11: Business Impact Analysis */}
          <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Business Impact Analysis</h3>
            <div className="space-y-3">
              {businessImpactData.map((item) => (
                <div key={item.impact}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>{item.impact}</span>
                    {item.score && <span className="text-sm font-bold" style={{ color: item.color }}>{item.score}/100</span>}
                  </div>
                  {item.score && (
                    <div className="w-full h-2 bg-gray-200 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                      <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }}></div>
                    </div>
                  )}
                  {item.groups && <div className="text-xs" style={{ color: '#6B6B6B' }}>{item.groups.join(', ')}</div>}
                  {item.services && <div className="text-xs" style={{ color: '#6B6B6B' }}>{item.services.join(', ')}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 12: Auto-generated Insights */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Priority Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insightsData.map((insight, idx) => (
              <div key={idx} className="p-4 rounded-lg border-l-4" style={{ borderLeftColor: insight.color, backgroundColor: '#FAFAF9' }}>
                <p className="text-sm" style={{ color: '#1a1a1a' }}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Row 13: Drilldown Table */}
        <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#E2E0DC' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>Detailed Ticket Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                  <th className="text-left py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Subject</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Status</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Group</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Agent</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Age</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Response SLA</th>
                  <th className="text-center py-2 px-4 font-semibold" style={{ color: '#1a1a1a' }}>Resolution SLA</th>
                </tr>
              </thead>
              <tbody>
                {drilldownData.map((row) => (
                  <tr key={row.ticketId} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="py-2 px-4 font-medium" style={{ color: '#3A86FF' }}>{row.ticketId}</td>
                    <td className="py-2 px-4" style={{ color: '#6B6B6B' }}>{row.subject}</td>
                    <td className="text-center py-2 px-4"><span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: row.priority === 'Critical' ? '#FFE0E0' : row.priority === 'High' ? '#FFF3E0' : '#FFFCE0', color: row.priority === 'Critical' ? '#E63946' : row.priority === 'High' ? '#F77F00' : '#1a1a1a' }}>{row.priority}</span></td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.status}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.group}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.agent}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#6B6B6B' }}>{row.age}</td>
                    <td className="text-center py-2 px-4" style={{ color: '#10B981' }}>{row.responseSLA}</td>
                    <td className="text-center py-2 px-4" style={{ color: row.resolutionSLA < '80%' ? '#E63946' : '#10B981' }}>{row.resolutionSLA}</td>
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
