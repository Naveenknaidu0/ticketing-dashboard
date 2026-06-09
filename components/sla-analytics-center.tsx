'use client'

import { useState } from 'react'
import { AlertCircle, TrendingDown, TrendingUp, Clock, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from 'recharts'
import { DetailDrawer } from '@/components/detail-drawer'
import { SLARiskQueueDrawer } from '@/components/sla-risk-queue-drawer'

interface SLAAnalyticsCenterProps {
  viewMode?: 'summary' | 'operational' | 'table'
  filters?: {
    dateRange?: string
    group?: string
    agent?: string
    priority?: string
    status?: string
    slaState?: string
  }
}

export function SLAAnalyticsCenter({ viewMode = 'summary', filters = {} }: SLAAnalyticsCenterProps) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  // Sample SLA data
  const slaKPIs = [
    { 
      label: 'Response SLA Compliance', 
      value: '96.4%', 
      trend: 'up 2.3%',
      target: 'Target 95%',
      best: 'Best: Access Management',
      worst: 'Worst: Network',
      icon: <TrendingUp className="w-5 h-5" /> 
    },
    { 
      label: 'Resolution SLA Compliance', 
      value: '93.8%', 
      trend: 'up 1.8%',
      target: 'Target 90%',
      best: 'Best: Access Management',
      worst: 'Worst: L2',
      icon: <CheckCircle2 className="w-5 h-5" /> 
    },
    { 
      label: 'At Risk Tickets', 
      value: '24', 
      trend: 'down 4',
      breakdown: { Critical: 4, High: 8, Medium: 7, Low: 5 },
      icon: <AlertCircle className="w-5 h-5" /> 
    },
    { 
      label: 'Breached Tickets', 
      value: '8', 
      trend: 'down 2',
      breakdown: { Today: 2, ThisWeek: 5, Largest: 'Infrastructure' },
      icon: <AlertTriangle className="w-5 h-5" /> 
    },
    { 
      label: 'Due Within 1 Hour', 
      value: '12', 
      trend: 'up 3',
      breakdown: { Critical: 3, High: 9, TopGroup: 'Infrastructure' },
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      label: 'Overall SLA Health', 
      value: '91/100', 
      trend: 'Healthy',
      status: 'Most Impacted: Infrastructure (35%)',
      icon: <TrendingUp className="w-5 h-5" /> 
    },
  ]

  const healthMetrics = {
    responseSlA: 96.4,
    resolutionSLA: 93.8,
    breaches: 8,
    riskQueue: 24,
    escalations: 12,
  }

  const immediateActions = [
    { type: 'Critical Risk', count: 3, trend: 'up 1', color: '#DC2626' },
    { type: 'High Risk', count: 8, trend: 'down 2', color: '#EA580C' },
    { type: 'Due Within 1 Hour', count: 12, trend: 'up 3', color: '#F59E0B' },
    { type: 'Due Today', count: 45, trend: 'up 8', color: '#FBBF24' },
    { type: 'Already Breached', count: 8, trend: 'down 2', color: '#EF4444' },
  ]

  const slaRiskQueue = [
    { id: 'INC-001245', subject: 'VPN Connection Failed', priority: 'Critical', group: 'Infrastructure', agent: 'John Smith', remaining: '42 mins', risk: 'Critical', status: 'Open' },
    { id: 'INC-001242', subject: 'Email Configuration Issue', priority: 'High', group: 'Application Support', agent: 'Emma Davis', remaining: '2h 15m', risk: 'High', status: 'In Progress' },
    { id: 'INC-001240', subject: 'Network Latency', priority: 'Critical', group: 'Network', agent: 'Mike Chen', remaining: '1h 30m', risk: 'Critical', status: 'Pending User' },
    { id: 'INC-001238', subject: 'Access Request - Database', priority: 'High', group: 'Access Management', agent: 'Sarah Johnson', remaining: '4h 45m', risk: 'High', status: 'Pending Vendor' },
    { id: 'INC-001235', subject: 'System Backup Failed', priority: 'Critical', group: 'Infrastructure', agent: 'James Wilson', remaining: '30 mins', risk: 'Critical', status: 'Open' },
  ]

  const groupSLAMetrics = [
    { name: 'Infrastructure', compliance: 95.2, breaches: 2, atRisk: 3, avgResolution: 2.1 },
    { name: 'Application Support', compliance: 94.8, breaches: 1, atRisk: 5, avgResolution: 2.8 },
    { name: 'Network', compliance: 92.1, breaches: 2, atRisk: 4, avgResolution: 3.2 },
    { name: 'Access Management', compliance: 96.5, breaches: 0, atRisk: 2, avgResolution: 1.9 },
    { name: 'L1', compliance: 94.3, breaches: 1, atRisk: 4, avgResolution: 2.5 },
    { name: 'L2', compliance: 91.8, breaches: 2, atRisk: 4, avgResolution: 3.5 },
    { name: 'L3', compliance: 93.2, breaches: 0, atRisk: 2, avgResolution: 4.1 },
  ]

  const prioritySLAMetrics = [
    { name: 'Critical', compliance: 89.2, breaches: 4, atRisk: 8, avgResolution: 1.2 },
    { name: 'High', compliance: 94.5, breaches: 2, atRisk: 10, avgResolution: 2.3 },
    { name: 'Medium', compliance: 96.8, breaches: 1, atRisk: 4, avgResolution: 3.1 },
    { name: 'Low', compliance: 98.1, breaches: 1, atRisk: 2, avgResolution: 4.5 },
  ]

  const agentWatchlist = [
    { agent: 'John Smith', responseSLA: 98.2, resolutionSLA: 96.5, breaches: 0, riskTickets: 1 },
    { agent: 'Sarah Johnson', responseSLA: 95.8, resolutionSLA: 92.1, breaches: 1, riskTickets: 3 },
    { agent: 'Mike Chen', responseSLA: 93.2, resolutionSLA: 88.9, breaches: 2, riskTickets: 5 },
    { agent: 'Emma Davis', responseSLA: 97.1, resolutionSLA: 94.8, breaches: 0, riskTickets: 2 },
    { agent: 'James Wilson', responseSLA: 91.5, resolutionSLA: 85.2, breaches: 3, riskTickets: 7 },
  ]

  const breachRootCause = [
    { cause: 'Waiting Customer', count: 14, percentage: 35, trend: 'up 2' },
    { cause: 'Waiting Vendor', count: 8, percentage: 20, trend: 'stable' },
    { cause: 'Assignment Delay', count: 10, percentage: 25, trend: 'down 3' },
    { cause: 'Resolution Delay', count: 6, percentage: 15, trend: 'up 1' },
    { cause: 'Escalation Delay', count: 2, percentage: 5, trend: 'stable' },
  ]

  const slaInsights = [
    { icon: <AlertTriangle className="w-4 h-4" />, text: 'Infrastructure owns 35% of current breaches', severity: 'critical', color: '#DC2626' },
    { icon: <AlertCircle className="w-4 h-4" />, text: 'Critical incidents account for 58% of SLA risk', severity: 'high', color: '#EA580C' },
    { icon: <TrendingDown className="w-4 h-4" />, text: 'L2 compliance dropped 4% this week', severity: 'high', color: '#EA580C' },
    { icon: <TrendingUp className="w-4 h-4" />, text: 'Network team improved compliance by 8%', severity: 'positive', color: '#16A34A' },
    { icon: <Clock className="w-4 h-4" />, text: '12 tickets will breach within 1 hour if unaddressed', severity: 'critical', color: '#DC2626' },
  ]

  const healthScore = 91
  const healthStatus = healthScore >= 90 ? 'Healthy' : healthScore >= 70 ? 'Warning' : 'Critical'
  const healthColor = healthScore >= 90 ? '#16A34A' : healthScore >= 70 ? '#F59E0B' : '#DC2626'

  return (
    <>
      <div className="space-y-6">
        {/* ROW 1: SLA Command Center KPI Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            SLA Command Center
          </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slaKPIs.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
              style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
              onClick={() => {
                if (idx === 0) setOpenDrawer('response-sla')
                else if (idx === 1) setOpenDrawer('resolution-sla')
                else if (idx === 2) setOpenDrawer('at-risk')
                else if (idx === 3) setOpenDrawer('breached')
                else if (idx === 4) setOpenDrawer('due-soon')
                else if (idx === 5) setOpenDrawer('health-detail')
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div style={{ color: '#6B6B6B' }}>{kpi.icon}</div>
                <Info className="w-4 h-4" style={{ color: '#B0B0B0' }} />
              </div>
              <p className="text-xs font-medium mb-2" style={{ color: '#6B6B6B' }}>
                {kpi.label}
              </p>
              <p className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
                {kpi.value}
              </p>
              <p className="text-xs font-medium mb-3" style={{ color: kpi.trend.includes('down') || kpi.trend === 'Healthy' ? '#16A34A' : '#F59E0B' }}>
                {kpi.trend}
              </p>
              
              {/* Target and Comparison Info */}
              {kpi.target && (
                <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>
                  {kpi.target}
                </p>
              )}
              {kpi.best && (
                <p className="text-xs mb-1" style={{ color: '#16A34A' }}>
                  {kpi.best}
                </p>
              )}
              {kpi.worst && (
                <p className="text-xs mb-2" style={{ color: '#F59E0B' }}>
                  {kpi.worst}
                </p>
              )}

              {/* Breakdown for At Risk and Breached */}
              {kpi.breakdown && (
                <div className="text-xs space-y-1 mb-2" style={{ color: '#6B6B6B' }}>
                  {Object.entries(kpi.breakdown).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span style={{ color: '#1a1a1a' }} className="font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status for Health */}
              {kpi.status && (
                <p className="text-xs" style={{ color: '#F59E0B' }}>
                  {kpi.status}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2: SLA Health Center with embedded Policy Overview */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          SLA Health Center
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side: Health Score (2/3 width) */}
          <div
            className="lg:col-span-2 p-6 rounded-lg border"
            style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Score Gauge */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-48 h-24 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Health', value: healthScore, fill: healthColor },
                      ]}
                      layout="vertical"
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Bar dataKey="value" fill={healthColor} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                    Overall SLA Health Score
                  </p>
                  <p className="text-3xl font-bold" style={{ color: healthColor }}>
                    {healthScore}/100
                  </p>
                  <p className="text-xs font-medium mt-1" style={{ color: healthColor }}>
                    {healthStatus}
                  </p>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>
                  Contributing Factors
                </h3>
                <div className="space-y-3">
                  {Object.entries(healthMetrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-xs font-medium" style={{ color: '#6B6B6B', width: '140px' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                          <div
                            className="h-2 rounded-full transition-all"
                            style={{
                              width: `${typeof value === 'number' && value > 0 && value < 100 ? value : 60}%`,
                              backgroundColor: '#0D3133',
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs font-semibold ml-2 min-w-fit" style={{ color: '#1a1a1a' }}>
                        {typeof value === 'number' ? (value > 100 ? value : `${value}%`) : value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side: SLA Policy Overview (1/3 width) - embedded */}
          <div
            className="p-6 rounded-lg border"
            style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
          >
            <h3 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>
              SLA Policies
            </h3>
            <div className="space-y-4 text-sm">
              {[
                { priority: 'Critical', response: '15 min', resolution: '4 hrs' },
                { priority: 'High', response: '1 hr', resolution: '24 hrs' },
                { priority: 'Medium', response: '8 hrs', resolution: '48 hrs' },
                { priority: 'Low', response: '24 hrs', resolution: '72 hrs' },
              ].map((policy, idx) => (
                <div key={idx} className="pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
                  <p className="font-medium mb-2" style={{ color: '#1a1a1a' }}>
                    {policy.priority}
                  </p>
                  <div className="ml-2 space-y-1 text-xs" style={{ color: '#6B6B6B' }}>
                    <p>Response: {policy.response}</p>
                    <p>Resolution: {policy.resolution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section: Top Risk Insights */}
        <div
          className="p-4 rounded-lg border mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}
        >
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Top Risk Group
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>
              Infrastructure
            </p>
            <p className="text-xs" style={{ color: '#F59E0B' }}>
              35% of SLA risk • 2 breaches • 3 at risk
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Top Risk Agent
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>
              James Wilson
            </p>
            <p className="text-xs" style={{ color: '#F59E0B' }}>
              91.5% response • 3 breaches • 7 at risk
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Top Risk Priority
            </p>
            <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>
              Critical
            </p>
            <p className="text-xs" style={{ color: '#DC2626' }}>
              58% of risk • 4 breaches • 8 at risk
            </p>
          </div>
        </div>
      </div>

      {/* ROW 3: Immediate Action Required - Enriched with Details */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          Immediate Action Required
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {immediateActions.map((action, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
              style={{ borderColor: action.color, backgroundColor: '#FFFFFF' }}
              onClick={() => {
                if (action.type === 'Critical Risk') setOpenDrawer('critical-risk')
                else if (action.type === 'High Risk') setOpenDrawer('high-risk')
                else if (action.type === 'Due Within 1 Hour') setOpenDrawer('due-soon')
                else if (action.type === 'Due Today') setOpenDrawer('due-today')
                else if (action.type === 'Already Breached') setOpenDrawer('breached')
              }}
            >
              {/* Header with count and badge */}
              <div className="flex items-baseline justify-between mb-3">
                <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {action.count}
                </p>
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: action.color,
                    color: '#FFFFFF',
                  }}
                >
                  {action.type === 'Critical Risk' ? 'CRITICAL' : action.type === 'High Risk' ? 'HIGH' : action.type.split(' ')[0].toUpperCase()}
                </span>
              </div>

              {/* Type label */}
              <p className="text-xs font-medium mb-3" style={{ color: '#6B6B6B' }}>
                {action.type}
              </p>

              {/* Trend indicator */}
              <div className="mb-3" style={{ borderTop: '1px solid #E2E0DC', paddingTop: '8px' }}>
                <p className="text-xs font-medium" style={{ color: action.trend.includes('down') ? '#16A34A' : '#F59E0B' }}>
                  {action.trend}
                </p>
              </div>

              {/* Top ticket preview */}
              {action.type === 'Critical Risk' && (
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  <p className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>Top: INC-001245</p>
                  <p>John Smith</p>
                  <p className="text-red-600 font-semibold">42 mins left</p>
                </div>
              )}
              {action.type === 'High Risk' && (
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  <p className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>Top: INC-001242</p>
                  <p>Emma Davis</p>
                  <p className="text-orange-600 font-semibold">2h 15m left</p>
                </div>
              )}
              {action.type === 'Due Within 1 Hour' && (
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  <p className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>Top: INC-001235</p>
                  <p>James Wilson</p>
                  <p className="text-red-600 font-semibold">30 mins left</p>
                </div>
              )}
              {action.type === 'Due Today' && (
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  <p className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>Critical: 8</p>
                  <p>High: 25</p>
                  <p>Medium: 12</p>
                </div>
              )}
              {action.type === 'Already Breached' && (
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  <p className="font-semibold mb-1" style={{ color: '#1a1a1a' }}>Today: 2</p>
                  <p>This Week: 5</p>
                  <p>Infrastructure: 35%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ROW 4: SLA Risk Queue */}
      {viewMode !== 'summary' && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            SLA Risk Queue
          </h2>
          <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
            <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <thead style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Ticket ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Subject
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Group
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Agent
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Remaining SLA
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {slaRiskQueue.map((ticket, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E0DC' }}>
                    <td className="px-4 py-3">
                      <span
                        className="font-mono text-xs cursor-pointer hover:underline"
                        style={{ color: '#0D3133' }}
                        onClick={() => console.log(`[v0] Opening ticket ${ticket.id}`)}
                      >
                        {ticket.id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{ticket.subject}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          backgroundColor: ticket.priority === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                          color: ticket.priority === 'Critical' ? '#991B1B' : '#92400E',
                        }}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{ticket.group}</td>
                    <td className="px-4 py-3 text-xs">{ticket.agent}</td>
                    <td className="px-4 py-3 text-xs font-semibold" style={{ color: ticket.remaining.includes('mins') ? '#DC2626' : '#F59E0B' }}>
                      {ticket.remaining}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-1 rounded"
                        style={{
                          backgroundColor: ticket.risk === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                          color: ticket.risk === 'Critical' ? '#DC2626' : '#F59E0B',
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
        </div>
      )}

      {/* ROW 5: Group SLA Health - Enhanced */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          Group SLA Health
        </h2>
        <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
          <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
            <thead style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                  Group
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Compliance
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Breaches
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  At Risk
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Avg Response
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Avg Resolution
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Trend
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {groupSLAMetrics.map((group, idx) => {
                const best = Math.max(...groupSLAMetrics.map(g => g.compliance))
                const worst = Math.min(...groupSLAMetrics.map(g => g.compliance))
                const isBest = group.compliance === best
                const isWorst = group.compliance === worst
                return (
                  <tr 
                    key={idx} 
                    style={{ 
                      borderBottom: '1px solid #E2E0DC', 
                      cursor: 'pointer',
                      backgroundColor: isBest ? '#F0FDF4' : isWorst ? '#FEF2F2' : '#FFFFFF'
                    }}
                    onClick={() => setOpenDrawer(`group-${group.name.replace(/\s+/g, '-').toLowerCase()}`)}
                    className="hover:opacity-75 transition"
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>
                      <div className="flex items-center gap-2">
                        {group.name}
                        {isBest && <span className="text-xs font-bold" style={{ color: '#16A34A' }}>★</span>}
                        {isWorst && <span className="text-xs font-bold" style={{ color: '#DC2626' }}>⚠</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-8" style={{ backgroundColor: '#E2E0DC' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${group.compliance}%`,
                              backgroundColor: group.compliance >= 95 ? '#16A34A' : group.compliance >= 90 ? '#F59E0B' : '#DC2626',
                            }}
                          />
                        </div>
                        <span
                          className="font-semibold text-xs"
                          style={{
                            color: group.compliance >= 95 ? '#16A34A' : group.compliance >= 90 ? '#F59E0B' : '#DC2626',
                          }}
                        >
                          {group.compliance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: group.breaches > 0 ? '#DC2626' : '#6B6B6B' }}>
                      {group.breaches}
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: group.atRisk > 3 ? '#F59E0B' : '#6B6B6B' }}>
                      {group.atRisk}
                    </td>
                    <td className="px-4 py-3 text-center text-xs" style={{ color: '#6B6B6B' }}>
                      {(group.avgResolution * 0.5).toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-medium" style={{ color: '#6B6B6B' }}>
                      {group.avgResolution.toFixed(1)}h
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#16A34A' }}>
                      ↑ 1.2%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: group.compliance >= 95 ? '#D1FAE5' : group.compliance >= 90 ? '#FEF3C7' : '#FEE2E2',
                          color: group.compliance >= 95 ? '#065F46' : group.compliance >= 90 ? '#92400E' : '#7F1D1D',
                        }}
                      >
                        {group.compliance >= 95 ? 'Healthy' : group.compliance >= 90 ? 'Warn' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Top Breach and Risk Contributors - Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div
            className="p-4 rounded-lg border flex items-center justify-between"
            style={{ borderColor: '#E2E0DC', backgroundColor: '#FEF2F2' }}
          >
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>
                Top Breach Contributor
              </p>
              <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>
                Network Team
              </p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                12 Breaches • 84% Compliance
              </p>
            </div>
          </div>
          <div
            className="p-4 rounded-lg border flex items-center justify-between"
            style={{ borderColor: '#E2E0DC', backgroundColor: '#FEF9E7' }}
          >
            <div>
              <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>
                Top Risk Contributor
              </p>
              <p className="text-sm font-semibold" style={{ color: '#F59E0B' }}>
                L2 Support
              </p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                4 At Risk • 18 Assigned
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6: Priority SLA Health - Enhanced */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          Priority SLA Health
        </h2>
        <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
          <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
            <thead style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>
                  Priority
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Compliance
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Breaches
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  At Risk
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Avg Resolution
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Trend
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {prioritySLAMetrics.map((priority, idx) => {
                const highestRisk = Math.max(...prioritySLAMetrics.map(p => p.atRisk))
                const highestBreach = Math.max(...prioritySLAMetrics.map(p => p.breaches))
                const isHighestRisk = priority.atRisk === highestRisk
                const isHighestBreach = priority.breaches === highestBreach
                
                return (
                  <tr 
                    key={idx} 
                    style={{
                      borderBottom: '1px solid #E2E0DC',
                      cursor: 'pointer',
                      backgroundColor: isHighestRisk || isHighestBreach ? '#FEF2F2' : '#FFFFFF'
                    }}
                    onClick={() => setOpenDrawer(`priority-${priority.name.toLowerCase()}`)}
                    className="hover:opacity-75 transition"
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>
                      <div className="flex items-center gap-2">
                        {priority.name}
                        {isHighestRisk && <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>⚠ Risk</span>}
                        {isHighestBreach && <span className="text-xs font-bold" style={{ color: '#DC2626' }}>⚠ Breach</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 w-8" style={{ backgroundColor: '#E2E0DC' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${priority.compliance}%`,
                              backgroundColor: priority.compliance >= 90 ? '#16A34A' : priority.compliance >= 80 ? '#F59E0B' : '#DC2626',
                            }}
                          />
                        </div>
                        <span
                          className="font-semibold text-xs"
                          style={{
                            color: priority.compliance >= 90 ? '#16A34A' : priority.compliance >= 80 ? '#F59E0B' : '#DC2626',
                          }}
                        >
                          {priority.compliance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: priority.breaches > 0 ? '#DC2626' : '#6B6B6B' }}>
                      {priority.breaches}
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: priority.atRisk > 5 ? '#F59E0B' : '#6B6B6B' }}>
                      {priority.atRisk}
                    </td>
                    <td className="px-4 py-3 text-center text-xs" style={{ color: '#6B6B6B' }}>
                      {priority.avgResolution || '8h'}
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#16A34A' }}>
                      ↑ 0.5%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: priority.compliance >= 90 ? '#D1FAE5' : priority.compliance >= 80 ? '#FEF3C7' : '#FEE2E2',
                          color: priority.compliance >= 90 ? '#065F46' : priority.compliance >= 80 ? '#92400E' : '#7F1D1D',
                        }}
                      >
                        {priority.compliance >= 90 ? 'Healthy' : priority.compliance >= 80 ? 'Warn' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ROW 7: Agent SLA Watchlist - Three Sections */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          Agent SLA Watchlist
        </h2>
        
        <div className="space-y-6">
          {/* Section A: Top Performers */}
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: '#D1FAE5', backgroundColor: '#F0FDF4' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#16A34A' }}>
              <span>Top Performers</span>
              <span className="text-xs font-bold" style={{ color: '#16A34A' }}>★</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ backgroundColor: 'transparent' }}>
                <thead style={{ borderBottom: '1px solid #D1FAE5' }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#16A34A' }}>Agent</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>Response SLA</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>Resolution SLA</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {agentWatchlist.filter(a => a.responseSLA >= 95 && a.resolutionSLA >= 95 && a.breaches === 0).slice(0, 5).map((agent, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #D1FAE5', cursor: 'pointer' }} onClick={() => setOpenDrawer(`agent-${agent.agent.replace(/\s+/g, '-').toLowerCase()}`)}>
                      <td className="px-3 py-2 font-medium" style={{ color: '#16A34A' }}>{agent.agent}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>{agent.responseSLA}%</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>{agent.resolutionSLA}%</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#16A34A' }}>12</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Needs Attention */}
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: '#FEF3C7', backgroundColor: '#FEF9E7' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#F59E0B' }}>
              <span>Needs Attention</span>
              <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>⚠</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ backgroundColor: 'transparent' }}>
                <thead style={{ borderBottom: '1px solid #FEF3C7' }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#92400E' }}>Agent</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#92400E' }}>Breaches</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#92400E' }}>At Risk</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#92400E' }}>SLA %</th>
                  </tr>
                </thead>
                <tbody>
                  {agentWatchlist.filter(a => (a.breaches > 0 || a.riskTickets > 2) && !(a.responseSLA >= 95 && a.resolutionSLA >= 95 && a.breaches === 0) && !(a.breaches > 1 || a.riskTickets > 5)).slice(0, 5).map((agent, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #FEF3C7', cursor: 'pointer' }} onClick={() => setOpenDrawer(`agent-${agent.agent.replace(/\s+/g, '-').toLowerCase()}`)}>
                      <td className="px-3 py-2 font-medium" style={{ color: '#1a1a1a' }}>{agent.agent}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: agent.breaches > 0 ? '#DC2626' : '#6B6B6B' }}>{agent.breaches}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: agent.riskTickets > 2 ? '#F59E0B' : '#6B6B6B' }}>{agent.riskTickets}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#92400E' }}>{Math.min(agent.responseSLA, agent.resolutionSLA)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section C: Overloaded Agents */}
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: '#FEE2E2', backgroundColor: '#FEF2F2' }}
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#DC2626' }}>
              <span>Overloaded / At Risk</span>
              <span className="text-xs font-bold" style={{ color: '#DC2626' }}>⚠</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ backgroundColor: 'transparent' }}>
                <thead style={{ borderBottom: '1px solid #FEE2E2' }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#7F1D1D' }}>Agent</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#7F1D1D' }}>Assigned</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#7F1D1D' }}>At Risk</th>
                    <th className="px-3 py-2 text-center font-semibold" style={{ color: '#7F1D1D' }}>Critical</th>
                  </tr>
                </thead>
                <tbody>
                  {agentWatchlist.filter(a => a.breaches > 1 || a.riskTickets > 5).slice(0, 5).map((agent, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #FEE2E2', cursor: 'pointer' }} onClick={() => setOpenDrawer(`agent-${agent.agent.replace(/\s+/g, '-').toLowerCase()}`)}>
                      <td className="px-3 py-2 font-medium" style={{ color: '#1a1a1a' }}>{agent.agent}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#6B6B6B' }}>18</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: '#F59E0B' }}>{agent.riskTickets}</td>
                      <td className="px-3 py-2 text-center font-semibold" style={{ color: agent.breaches > 1 ? '#DC2626' : '#F59E0B' }}>{agent.breaches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Summary Strip */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>Best Group</p>
            <p className="text-sm font-bold" style={{ color: '#16A34A' }}>Access Management</p>
            <p className="text-xs" style={{ color: '#6B6B6B' }}>98% Compliance</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>Worst Group</p>
            <p className="text-sm font-bold" style={{ color: '#DC2626' }}>Network</p>
            <p className="text-xs" style={{ color: '#6B6B6B' }}>84% Compliance</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>Highest Risk Priority</p>
            <p className="text-sm font-bold" style={{ color: '#DC2626' }}>Critical</p>
            <p className="text-xs" style={{ color: '#6B6B6B' }}>12 At Risk</p>
          </div>
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>Most At Risk Agent</p>
            <p className="text-sm font-bold" style={{ color: '#DC2626' }}>James Wilson</p>
            <p className="text-xs" style={{ color: '#6B6B6B' }}>6 Risk Tickets</p>
          </div>
        </div>
      </div>

      {/* ROW 8: Breach Root Cause */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          Breach Root Cause Analysis
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div
            className="p-4 rounded-lg border"
            style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={breachRootCause}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${(percentage * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#0D3133"
                  dataKey="count"
                >
                  {breachRootCause.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#DC2626', '#EA580C', '#F59E0B', '#FBBF24', '#93C5FD'][index % 5]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Root Causes List - Enhanced */}
          <div className="lg:col-span-2 space-y-3">
            {breachRootCause.map((cause, idx) => {
              const maxCount = Math.max(...breachRootCause.map(c => c.count))
              return (
                <div key={idx} className="p-3 rounded border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm" style={{ color: '#1a1a1a' }}>
                      {cause.cause}
                    </p>
                    <div className="text-right">
                      <p className="text-xs font-semibold" style={{ color: '#1a1a1a' }}>
                        {cause.count}
                      </p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        {cause.percentage}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Mini bar */}
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5 mb-2" style={{ backgroundColor: '#E2E0DC' }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${(cause.count / maxCount) * 100}%`,
                        backgroundColor: ['#DC2626', '#EA580C', '#F59E0B', '#FBBF24', '#93C5FD'][idx % 5],
                      }}
                    />
                  </div>

                  {/* Trend */}
                  <p className="text-xs font-medium" style={{ color: cause.trend.includes('down') ? '#16A34A' : '#F59E0B' }}>
                    {cause.trend}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ROW 9: SLA Insights - Full Width */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
          SLA Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {slaInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border flex flex-col gap-2"
              style={{
                borderColor: insight.color,
                backgroundColor: '#FFFFFF',
                borderLeft: `4px solid ${insight.color}`,
              }}
            >
              {/* Icon and severity badge */}
              <div className="flex items-center justify-between">
                <div style={{ color: insight.color }}>
                  {insight.icon}
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: insight.severity === 'critical' ? '#FEE2E2' : insight.severity === 'high' ? '#FEF3C7' : insight.severity === 'positive' ? '#D1FAE5' : '#F3F4F6',
                    color: insight.severity === 'critical' ? '#7F1D1D' : insight.severity === 'high' ? '#92400E' : insight.severity === 'positive' ? '#065F46' : '#374151',
                  }}
                >
                  {insight.severity === 'critical' ? 'URGENT' : insight.severity === 'high' ? 'HIGH' : insight.severity === 'positive' ? 'GOOD' : 'INFO'}
                </span>
              </div>

              {/* Insight text */}
              <p className="text-sm font-medium leading-snug" style={{ color: '#1a1a1a' }}>
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Drawers */}
      <SLARiskQueueDrawer
        isOpen={openDrawer === 'at-risk'}
        onClose={() => setOpenDrawer(null)}
        title="At Risk Tickets"
        filterType="at-risk"
      />
      <SLARiskQueueDrawer
        isOpen={openDrawer === 'breached'}
        onClose={() => setOpenDrawer(null)}
        title="Breached Tickets"
        filterType="breached"
      />
      <SLARiskQueueDrawer
        isOpen={openDrawer === 'due-soon'}
        onClose={() => setOpenDrawer(null)}
        title="Due Within 1 Hour"
      />
      <SLARiskQueueDrawer
        isOpen={openDrawer === 'due-today'}
        onClose={() => setOpenDrawer(null)}
        title="Due Today"
      />
      <SLARiskQueueDrawer
        isOpen={openDrawer?.startsWith('group-') ?? false}
        onClose={() => setOpenDrawer(null)}
        title={`${openDrawer?.replace('group-', '').replace(/-/g, ' ')} - SLA Risk Queue`}
        filters={{ group: openDrawer?.replace('group-', '') }}
      />
      <SLARiskQueueDrawer
        isOpen={openDrawer?.startsWith('priority-') ?? false}
        onClose={() => setOpenDrawer(null)}
        title={`${openDrawer?.replace('priority-', '').toUpperCase()} Priority - Risk Queue`}
        filters={{ priority: openDrawer?.replace('priority-', '') }}
      />
      <DetailDrawer
        isOpen={openDrawer?.startsWith('agent-') ?? false}
        onClose={() => setOpenDrawer(null)}
        title={`${openDrawer?.replace('agent-', '').replace(/-/g, ' ')} - SLA Performance`}
      >
        <div className="space-y-4">
          {agentWatchlist.map(agent => 
            openDrawer === `agent-${agent.agent.replace(/\s+/g, '-').toLowerCase()}` ? (
              <div key={agent.agent}>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Response SLA Compliance</p>
                  <p className="text-2xl font-bold" style={{ color: agent.responseSLA >= 95 ? '#16A34A' : '#F59E0B' }}>
                    {agent.responseSLA}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Resolution SLA Compliance</p>
                  <p className="text-2xl font-bold" style={{ color: agent.resolutionSLA >= 95 ? '#16A34A' : '#F59E0B' }}>
                    {agent.resolutionSLA}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Breaches</p>
                  <p className="text-lg font-bold" style={{ color: agent.breaches > 0 ? '#DC2626' : '#16A34A' }}>
                    {agent.breaches}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>At Risk Tickets</p>
                  <p className="text-lg font-bold" style={{ color: agent.riskTickets > 3 ? '#F59E0B' : '#6B6B6B' }}>
                    {agent.riskTickets}
                  </p>
                </div>
              </div>
            ) : null
          )}
        </div>
      </DetailDrawer>
      <DetailDrawer
        isOpen={openDrawer === 'health-detail'}
        onClose={() => setOpenDrawer(null)}
        title="Overall SLA Health"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Health Score</p>
            <p className="text-3xl font-bold" style={{ color: '#16A34A' }}>91/100</p>
            <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>Healthy</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: '#1a1a1a' }}>Key Metrics</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs"><span style={{ color: '#6B6B6B' }}>Response SLA:</span><span style={{ color: '#1a1a1a' }}>96.4%</span></div>
              <div className="flex justify-between text-xs"><span style={{ color: '#6B6B6B' }}>Resolution SLA:</span><span style={{ color: '#1a1a1a' }}>93.8%</span></div>
              <div className="flex justify-between text-xs"><span style={{ color: '#6B6B6B' }}>Breached Tickets:</span><span style={{ color: '#DC2626' }}>8</span></div>
              <div className="flex justify-between text-xs"><span style={{ color: '#6B6B6B' }}>At Risk Tickets:</span><span style={{ color: '#F59E0B' }}>24</span></div>
            </div>
          </div>
        </div>
      </DetailDrawer>
      </div>
    </>
  )
}
