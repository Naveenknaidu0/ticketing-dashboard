'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { Info, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
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
const slaComplianceTrendData = [
  { period: 'Mon', responseSLA: 94, resolutionSLA: 88, atRisk: 12, breached: 5 },
  { period: 'Tue', responseSLA: 92, resolutionSLA: 85, atRisk: 18, breached: 8 },
  { period: 'Wed', responseSLA: 95, resolutionSLA: 89, atRisk: 10, breached: 4 },
  { period: 'Thu', responseSLA: 91, resolutionSLA: 84, atRisk: 22, breached: 10 },
  { period: 'Fri', responseSLA: 89, resolutionSLA: 82, atRisk: 28, breached: 14 },
  { period: 'Sat', responseSLA: 96, resolutionSLA: 91, atRisk: 8, breached: 3 },
  { period: 'Sun', responseSLA: 98, resolutionSLA: 93, atRisk: 5, breached: 2 },
]

const slaByPriorityData = [
  { priority: 'Critical', responseSLA: 88, resolutionSLA: 72, breaches: 28, avgResolution: '4.2h' },
  { priority: 'High', responseSLA: 91, resolutionSLA: 84, breaches: 18, avgResolution: '8.5h' },
  { priority: 'Medium', responseSLA: 94, resolutionSLA: 89, breaches: 12, avgResolution: '24h' },
  { priority: 'Low', responseSLA: 97, resolutionSLA: 95, breaches: 5, avgResolution: '72h' },
]

const slaByGroupData = [
  { group: 'Infrastructure', compliance: 91, breaches: 12, atRisk: 8, avgResolution: '12.5h' },
  { group: 'Application', compliance: 93, breaches: 9, atRisk: 5, avgResolution: '10.2h' },
  { group: 'Network', compliance: 88, breaches: 18, atRisk: 14, avgResolution: '15.8h' },
  { group: 'Access Mgmt', compliance: 95, breaches: 4, atRisk: 2, avgResolution: '8.1h' },
  { group: 'L1', compliance: 92, breaches: 11, atRisk: 7, avgResolution: '6.5h' },
  { group: 'L2', compliance: 90, breaches: 15, atRisk: 10, avgResolution: '14.2h' },
  { group: 'L3', compliance: 86, breaches: 22, atRisk: 16, avgResolution: '18.9h' },
]

const slaByAgentData = [
  { agent: 'John Smith', responseSLA: 96, resolutionSLA: 92, breaches: 2, atRisk: 1, tickets: 145, rank: 1 },
  { agent: 'Sarah Johnson', responseSLA: 95, resolutionSLA: 91, breaches: 3, atRisk: 2, tickets: 152, rank: 2 },
  { agent: 'Mike Chen', responseSLA: 93, resolutionSLA: 88, breaches: 6, atRisk: 4, tickets: 148, rank: 3 },
  { agent: 'Emma Davis', responseSLA: 91, resolutionSLA: 86, breaches: 9, atRisk: 6, tickets: 155, rank: 4 },
  { agent: 'James Wilson', responseSLA: 89, resolutionSLA: 84, breaches: 12, atRisk: 8, tickets: 142, rank: 5 },
  { agent: 'Lisa Anderson', responseSLA: 88, resolutionSLA: 82, breaches: 14, atRisk: 10, tickets: 158, rank: 6 },
  { agent: 'Robert Miller', responseSLA: 87, resolutionSLA: 81, breaches: 16, atRisk: 12, tickets: 150, rank: 7 },
  { agent: 'Jennifer Lee', responseSLA: 86, resolutionSLA: 80, breaches: 18, atRisk: 14, tickets: 147, rank: 8 },
  { agent: 'David Brown', responseSLA: 85, resolutionSLA: 79, breaches: 20, atRisk: 16, tickets: 153, rank: 9 },
  { agent: 'Maria Garcia', responseSLA: 84, resolutionSLA: 78, breaches: 22, atRisk: 18, tickets: 149, rank: 10 },
]

const breachAnalysisData = [
  { category: 'Response', total: 48, percentage: 32 },
  { category: 'Resolution', total: 62, percentage: 42 },
  { category: 'Both', total: 30, percentage: 20 },
  { category: 'Repeated', total: 12, percentage: 8 },
]

const atRiskTicketsData = [
  { ticketId: 'INC-001245', priority: 'Critical', group: 'Infrastructure', agent: 'John Smith', remainingSLA: '45 min', risk: 'Critical' },
  { ticketId: 'INC-001242', priority: 'High', group: 'Network', agent: 'Mike Chen', remainingSLA: '1.5 hrs', risk: 'High' },
  { ticketId: 'INC-001240', priority: 'Medium', group: 'Application', agent: 'Emma Davis', remainingSLA: '4 hrs', risk: 'Medium' },
  { ticketId: 'INC-001238', priority: 'Critical', group: 'L2', agent: 'James Wilson', remainingSLA: '30 min', risk: 'Critical' },
  { ticketId: 'INC-001235', priority: 'High', group: 'Infrastructure', agent: 'Sarah Johnson', remainingSLA: '2 hrs', risk: 'High' },
  { ticketId: 'INC-001232', priority: 'Medium', group: 'Network', agent: 'Lisa Anderson', remainingSLA: '6 hrs', risk: 'Medium' },
  { ticketId: 'INC-001228', priority: 'High', group: 'Access Mgmt', agent: 'Robert Miller', remainingSLA: '1 hr', risk: 'High' },
]

const slaExceptionData = [
  { type: 'Paused SLA', count: 42, percentage: 15 },
  { type: 'Waiting Customer', count: 85, percentage: 31 },
  { type: 'Waiting Vendor', count: 38, percentage: 14 },
  { type: 'Approved Extensions', count: 56, percentage: 20 },
  { type: 'Excluded Tickets', count: 53, percentage: 20 },
]

const escalationData = [
  { type: 'L1 → L2', count: 42, trend: '+5%' },
  { type: 'L2 → L3', count: 18, trend: '+12%' },
  { type: 'Manager', count: 12, trend: '-2%' },
  { type: 'Critical', count: 5, trend: '+8%' },
]

const drilldownData = [
  { ticketId: 'INC-001245', priority: 'Critical', group: 'Infrastructure', agent: 'John Smith', responseSLA: '95%', resolutionSLA: '88%', status: 'In Progress', risk: 'Critical' },
  { ticketId: 'INC-001242', priority: 'High', group: 'Network', agent: 'Mike Chen', responseSLA: '92%', resolutionSLA: '85%', status: 'Resolved', risk: 'High' },
  { ticketId: 'INC-001240', priority: 'Medium', group: 'Application', agent: 'Emma Davis', responseSLA: '94%', resolutionSLA: '89%', status: 'Open', risk: 'Medium' },
]

export function SLAPerformanceReport() {
  const [complianceViewMode, setComplianceViewMode] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('daily')

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return { bg: '#FEE2E2', text: '#DC2626' }
      case 'High':
        return { bg: '#FEF3E2', text: '#D97706' }
      case 'Medium':
        return { bg: '#FEF3C7', text: '#F59E0B' }
      default:
        return { bg: '#F0FDF4', text: '#10B981' }
    }
  }

  const insights = [
    'Network Team generated 42% of SLA breaches',
    'Critical incidents breached 3x more often than service requests',
    'Response SLA compliance improved 8% this period',
    'L2 Support exceeded SLA target by 6%',
    'At-risk tickets increased 15% due to high volume Friday',
  ]

  return (
    <div className="space-y-6">
      {/* Row 1: SLA Executive KPI Cards */}
      <div className="grid grid-cols-6 gap-4">
        <ReportKPICard
          label="Response SLA %"
          value="92%"
          trend="↓ 2%"
          comparison="vs Previous Period"
          icon={<TrendingDown className="w-4 h-4" />}
        />
        <ReportKPICard
          label="Resolution SLA %"
          value="87%"
          trend="↓ 3%"
          comparison="vs Previous Period"
          icon={<TrendingDown className="w-4 h-4" />}
        />
        <ReportKPICard
          label="At Risk Tickets"
          value="124"
          trend="↑ 18%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
        <ReportKPICard
          label="Breached Tickets"
          value="48"
          trend="↑ 12%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
        <ReportKPICard
          label="Avg Response Time"
          value="2.4h"
          trend="↑ 8%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
        <ReportKPICard
          label="Avg Resolution"
          value="18.5h"
          trend="↑ 5%"
          comparison="vs Previous Period"
          icon={<TrendingUp className="w-4 h-4" />}
          warningIndicator={true}
        />
      </div>

      {/* Row 2: Overall SLA Health Score */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Overall SLA Health Score</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Weighted score based on response, resolution, breaches, and at-risk metrics</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {/* Overall Score */}
          <div className="col-span-2 flex flex-col items-center justify-center p-8 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}>
            <div className="text-5xl font-bold mb-2" style={{ color: '#10B981' }}>91</div>
            <div className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Healthy</div>
            <div className="text-xs mt-2" style={{ color: '#6B6B6B' }}>Overall Health</div>
          </div>

          {/* Contributing Factors */}
          <div className="col-span-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Response SLA</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="h-full rounded-full" style={{ width: '92%', backgroundColor: '#10B981' }}></div>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>92%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Resolution SLA</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="h-full rounded-full" style={{ width: '87%', backgroundColor: '#F59E0B' }}></div>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>87%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Breaches & At Risk</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="h-full rounded-full" style={{ width: '82%', backgroundColor: '#EF4444' }}></div>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>18%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Escalations</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="h-full rounded-full" style={{ width: '88%', backgroundColor: '#8B5CF6' }}></div>
                </div>
                <span className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>12%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: SLA Compliance Trend */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>SLA Compliance Trend</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Response and Resolution SLA compliance over time. Periods below target are highlighted.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setComplianceViewMode(mode)}
                className="px-3 py-1 rounded text-xs font-medium transition-colors"
                style={{
                  backgroundColor: complianceViewMode === mode ? '#0D3133' : '#F8F8F7',
                  color: complianceViewMode === mode ? 'white' : '#6B6B6B',
                  border: '1px solid #E2E0DC',
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={slaComplianceTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="period" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Legend />
            <Area type="monotone" dataKey="responseSLA" fill="#0D3133" stroke="#0D3133" opacity={0.3} name="Response SLA %" />
            <Line type="monotone" dataKey="responseSLA" stroke="#0D3133" strokeWidth={2} name="Response SLA %" />
            <Area type="monotone" dataKey="resolutionSLA" fill="#10B981" stroke="#10B981" opacity={0.3} name="Resolution SLA %" />
            <Line type="monotone" dataKey="resolutionSLA" stroke="#10B981" strokeWidth={2} name="Resolution SLA %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4: SLA Risk Overview */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>SLA Risk Overview</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Distribution of tickets by SLA risk level and time remaining</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: '#FCA5A5', backgroundColor: '#FEE2E2' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#7F1D1D' }}>CRITICAL</div>
            <div className="text-2xl font-bold" style={{ color: '#DC2626' }}>24</div>
            <div className="text-xs mt-2" style={{ color: '#7F1D1D' }}>Due within 1 hour</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: '#FBBD08', backgroundColor: '#FEF3E2' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#92400E' }}>WARNING</div>
            <div className="text-2xl font-bold" style={{ color: '#D97706' }}>58</div>
            <div className="text-xs mt-2" style={{ color: '#92400E' }}>Due today</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: '#FBBF24', backgroundColor: '#FFFBEB' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#78350F' }}>AT RISK</div>
            <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>42</div>
            <div className="text-xs mt-2" style={{ color: '#78350F' }}>Due this week</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: '#86EFAC', backgroundColor: '#F0FDF4' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#166534' }}>HEALTHY</div>
            <div className="text-2xl font-bold" style={{ color: '#10B981' }}>285</div>
            <div className="text-xs mt-2" style={{ color: '#166534' }}>On track</div>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: '#E5E7EB', backgroundColor: '#F3F4F6' }}>
            <div className="text-xs font-semibold mb-2" style={{ color: '#374151' }}>OVERDUE</div>
            <div className="text-2xl font-bold" style={{ color: '#6B7280' }}>12</div>
            <div className="text-xs mt-2" style={{ color: '#374151' }}>Breached</div>
          </div>
        </div>
      </div>

      {/* Row 5: SLA by Priority */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>SLA Compliance by Priority</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">SLA performance metrics broken down by ticket priority</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={slaByPriorityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="priority" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
            <Legend />
            <Bar dataKey="responseSLA" fill="#0D3133" name="Response SLA %" />
            <Bar dataKey="resolutionSLA" fill="#10B981" name="Resolution SLA %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 6: SLA by Group */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>SLA Performance by Group</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Compliance metrics for each support group. Lowest performers highlighted.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          {slaByGroupData.map((group, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <div className="w-24">
                <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{group.group}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>Compliance:</div>
                <div className="w-32 h-2 rounded-full" style={{ backgroundColor: '#E2E0DC' }}>
                  <div className="h-full rounded-full" style={{ width: `${group.compliance}%`, backgroundColor: group.compliance >= 92 ? '#10B981' : '#F59E0B' }}></div>
                </div>
                <span className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>{group.compliance}%</span>
              </div>
              <div className="w-20 text-right">
                <div className="text-xs" style={{ color: '#6B6B6B' }}>Breaches: {group.breaches}</div>
                <div className="text-xs" style={{ color: '#6B6B6B' }}>At Risk: {group.atRisk}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 7: SLA by Agent */}
      <div
        className="p-6 rounded-lg border overflow-x-auto"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Top 10 Agent Performance</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">SLA performance ranking for top performing agents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Rank</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Agent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Response SLA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Resolution SLA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Breaches</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>At Risk</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {slaByAgentData.map((agent, idx) => (
              <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1a1a1a' }}>#{agent.rank}</td>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#0D3133' }}>{agent.agent}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#1a1a1a' }}>{agent.responseSLA}%</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#1a1a1a' }}>{agent.resolutionSLA}%</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#1a1a1a' }}>{agent.breaches}</td>
                <td className="px-4 py-3 text-sm" style={{ color: '#1a1a1a' }}>{agent.atRisk}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1a1a1a' }}>{agent.tickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row 8: Breach Analysis */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-6 rounded-lg border"
          style={{ borderColor: '#E2E0DC' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Breach Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Breakdown of SLA breaches by type and frequency</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={breachAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis dataKey="category" stroke="#6B6B6B" />
              <YAxis stroke="#6B6B6B" />
              <RechartsTooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E0DC' }} />
              <Bar dataKey="total" fill="#EF4444" name="Total Breaches" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-6 rounded-lg border"
          style={{ borderColor: '#E2E0DC' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>SLA Exceptions</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4" style={{ color: '#73847B' }} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Tickets with SLA exceptions and special handling</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-3">
            {slaExceptionData.map((exception, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{exception.type}</div>
                  <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{exception.percentage}% of total</div>
                </div>
                <div className="text-lg font-bold" style={{ color: '#0D3133' }}>{exception.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 9: Escalation Analysis */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Escalation Analysis</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Escalation trends and patterns across support levels</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {escalationData.map((escalation, idx) => (
            <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}>
              <div className="text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>{escalation.type}</div>
              <div className="text-2xl font-bold mb-2" style={{ color: '#0D3133' }}>{escalation.count}</div>
              <div className="text-xs font-semibold" style={{ color: escalation.trend.includes('-') ? '#10B981' : '#EF4444' }}>
                {escalation.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 10: At Risk Analysis */}
      <div
        className="p-6 rounded-lg border overflow-x-auto"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>At Risk Tickets</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Tickets likely to breach SLA soon, sorted by risk level</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Group</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Assigned Agent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Remaining SLA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {atRiskTicketsData.map((ticket, idx) => (
              <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#0D3133' }}>{ticket.ticketId}</td>
                <td className="px-4 py-3 text-sm">{ticket.priority}</td>
                <td className="px-4 py-3 text-sm">{ticket.group}</td>
                <td className="px-4 py-3 text-sm">{ticket.agent}</td>
                <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#1a1a1a' }}>{ticket.remainingSLA}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: getRiskColor(ticket.risk).bg,
                      color: getRiskColor(ticket.risk).text,
                    }}
                  >
                    {ticket.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row 11: Key Insights */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Root Cause Insights</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Automated insights highlighting key SLA performance drivers</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#E69F50' }} />
              <p className="text-sm" style={{ color: '#1a1a1a' }}>{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 12: Drilldown Table */}
      <div
        className="p-6 rounded-lg border overflow-x-auto"
        style={{ borderColor: '#E2E0DC' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>Detailed SLA Performance</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4" style={{ color: '#73847B' }} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Sortable table with all SLA metrics. Searchable and exportable.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Ticket ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Group</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Agent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Response SLA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Resolution SLA</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#73847B' }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {drilldownData.map((row, idx) => (
              <tr key={idx} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
                <td className="px-4 py-3 text-sm font-medium" style={{ color: '#0D3133' }}>{row.ticketId}</td>
                <td className="px-4 py-3 text-sm">{row.priority}</td>
                <td className="px-4 py-3 text-sm">{row.group}</td>
                <td className="px-4 py-3 text-sm">{row.agent}</td>
                <td className="px-4 py-3 text-sm font-semibold">{row.responseSLA}</td>
                <td className="px-4 py-3 text-sm font-semibold">{row.resolutionSLA}</td>
                <td className="px-4 py-3 text-sm">{row.status}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: getRiskColor(row.risk).bg,
                      color: getRiskColor(row.risk).text,
                    }}
                  >
                    {row.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
