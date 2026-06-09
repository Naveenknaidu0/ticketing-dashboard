'use client'

import { useContext } from 'react'
import { StoreContext } from '@/app/store-context'
import { assignmentEngine } from '@/lib/assignment-engine'
import Link from 'next/link'
import { TrendingUp, AlertCircle, CheckCircle, Zap, BarChart3, Clock } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: React.ReactNode
  trend?: number
  href?: string
  onClick?: () => void
}

function MetricCard({ title, value, subtitle, icon, trend, href, onClick }: MetricCardProps) {
  const cardClass = href ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
  const cardContent = (
    <div
      className={`p-6 rounded-lg border transition-all duration-200 ${cardClass}`}
      style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: '#9CA3AF' }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2" style={{ color: '#0D3133' }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{ color: '#E69F50' }}>{icon}</div>
      </div>
      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs" style={{ color: trend > 0 ? '#EF4444' : '#10B981' }}>
          <TrendingUp className="w-3 h-3" />
          {trend > 0 ? '+' : ''}{trend}% from yesterday
        </div>
      )}
    </div>
  )

  return href ? (
    <Link href={href}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  )
}

export default function OverviewPage() {
  const storeContext = useContext(StoreContext)

  if (!storeContext) {
    return <div>Loading...</div>
  }

  const store = storeContext as any

  // Convert Map to array if needed
  let ticketsArray: any[] = []
  if (store.state?.tickets) {
    if (store.state.tickets instanceof Map) {
      ticketsArray = Array.from(store.state.tickets.values())
    } else if (Array.isArray(store.state.tickets)) {
      ticketsArray = store.state.tickets
    }
  }

  // Calculate metrics from ticket dataset
  const unassignedTickets = ticketsArray.filter((t: any) => !t.assignedTo).length
  const assignedTickets = ticketsArray.filter((t: any) => t.assignedTo).length
  const autoAssignedToday = Math.floor(Math.random() * 15) // Simulated
  const manualAssignmentsToday = Math.floor(Math.random() * 10) // Simulated
  const failedAssignments = Math.floor(Math.random() * 3) // Simulated
  const slaRiskTickets = ticketsArray.filter((t: any) => t.slaStatus === 'at-risk' || t.slaStatus === 'breached').length

  // Calculate metrics
  const metrics = assignmentEngine.calculateMetrics(
    ticketsArray.length,
    assignedTickets,
    autoAssignedToday,
    manualAssignmentsToday,
    failedAssignments,
    slaRiskTickets
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-1" style={{ color: '#0D3133' }}>
          Assignment Metrics
        </h2>
        <p className="text-sm" style={{ color: '#6B6B6B' }}>
          Real-time operational assignment metrics from your ticket queue
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Unassigned Tickets */}
        <MetricCard
          title="Unassigned Tickets"
          value={metrics.unassignedTickets}
          subtitle={`${ticketsArray.length > 0 ? ((metrics.unassignedTickets / ticketsArray.length) * 100).toFixed(1) : 0}% of queue`}
          icon={<AlertCircle className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 10) - 5}
          href="/assignment-engine/overview?view=unassigned"
        />

        {/* Auto Assigned Today */}
        <MetricCard
          title="Auto Assigned Today"
          value={metrics.autoAssignedToday}
          subtitle={`${autoAssignedToday > 0 ? 'via automation' : 'waiting to start'}`}
          icon={<Zap className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 20) - 10}
          href="/assignment-engine/overview?view=auto-assigned"
        />

        {/* Manual Assignments Today */}
        <MetricCard
          title="Manual Assignments Today"
          value={metrics.manualAssignmentsToday}
          subtitle="by managers and admins"
          icon={<CheckCircle className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 15) - 5}
          href="/assignment-engine/overview?view=manual-assigned"
        />

        {/* Failed Assignments */}
        <MetricCard
          title="Failed Assignments"
          value={metrics.failedAssignments}
          subtitle="requiring attention"
          icon={<AlertCircle className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 5)}
          href="/assignment-engine/overview?view=failed"
        />

        {/* Assignment Success Rate */}
        <MetricCard
          title="Assignment Success Rate"
          value={`${metrics.assignmentSuccessRate}%`}
          subtitle="of all assignment attempts"
          icon={<BarChart3 className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 10) - 5}
        />

        {/* SLA Risks Due to Assignment */}
        <MetricCard
          title="SLA Risks Due To Assignment"
          value={metrics.slaRisksDueToAssignment}
          subtitle="tickets at risk or breached"
          icon={<Clock className="w-8 h-8" />}
          trend={Math.floor(Math.random() * 8) - 2}
          href="/assignment-engine/overview?view=sla-risks"
        />
      </div>

      {/* Summary Section */}
      <div
        className="p-6 rounded-lg border"
        style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
          Assignment System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs uppercase font-semibold" style={{ color: '#9CA3AF' }}>
              Active Queues
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
              2
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold" style={{ color: '#9CA3AF' }}>
              Active Rules
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
              5
            </p>
          </div>
          <div>
            <p className="text-xs uppercase font-semibold" style={{ color: '#9CA3AF' }}>
              Active Automations
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
              1
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
