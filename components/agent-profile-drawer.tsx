'use client'

import { X, FileText, Briefcase, CheckSquare, Download } from 'lucide-react'
import type { LeaderboardAgent } from '@/lib/types'

interface AgentProfileDrawerProps {
  agent: LeaderboardAgent
  onClose: () => void
}

export function AgentProfileDrawer({ agent, onClose }: AgentProfileDrawerProps) {
  const getBadgeColor = (badge: 'gold' | 'silver' | 'bronze' | 'none') => {
    switch (badge) {
      case 'gold':
        return { bg: '#FFF8E7', text: '#D4A574' }
      case 'silver':
        return { bg: '#F5F5F5', text: '#9CA3AF' }
      case 'bronze':
        return { bg: '#FFF1E6', text: '#D97706' }
      default:
        return { bg: '#F9F8F6', text: '#6B6B6B' }
    }
  }

  const badgeColor = getBadgeColor(agent.badge)

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
        style={{ borderLeft: '1px solid #E2E0DC' }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ borderBottomColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
        >
          <h2 className="font-bold" style={{ color: '#1a1a1a' }}>
            Agent Profile
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} style={{ color: '#6B6B6B' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Agent Info */}
          <div className="text-center mb-8">
            <img
              src={agent.photo}
              alt={agent.name}
              className="w-24 h-24 rounded-full mb-4 object-cover mx-auto"
            />

            <h3 className="font-bold text-lg" style={{ color: '#1a1a1a' }}>
              {agent.name}
            </h3>
            <p className="text-sm mb-3" style={{ color: '#6B6B6B' }}>
              {agent.role}
            </p>

            {/* Rank and Badge */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="px-3 py-1 rounded-full font-bold text-sm"
                style={{
                  backgroundColor: badgeColor.bg,
                  color: badgeColor.text,
                  border: `1px solid ${badgeColor.text}30`,
                }}
              >
                Rank #{agent.rank}
              </div>
              {agent.badge !== 'none' && (
                <div
                  className="px-3 py-1 rounded-full font-bold text-sm capitalize"
                  style={{
                    backgroundColor: badgeColor.bg,
                    color: badgeColor.text,
                    border: `1px solid ${badgeColor.text}30`,
                  }}
                >
                  {agent.badge} Medal
                </div>
              )}
            </div>

            <p className="font-bold text-2xl" style={{ color: '#1a1a1a' }}>
              {agent.points}
              <span className="text-sm" style={{ color: '#6B6B6B' }}>
                {' '}
                Points
              </span>
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <KPICard
              icon="🎫"
              label="Tickets Resolved"
              value={agent.ticketsResolved}
            />
            <KPICard icon="😊" label="CSAT Score" value={`${agent.csatScore}%`} />
            <KPICard
              icon="⏱"
              label="Response SLA"
              value={`${agent.responseSLA}%`}
            />
            <KPICard
              icon="✅"
              label="Resolution SLA"
              value={`${agent.resolutionSLA}%`}
            />
            <KPICard
              icon="📚"
              label="Knowledge Articles"
              value={agent.knowledgeArticles}
            />
            <KPICard
              icon="☑"
              label="Tasks Completed"
              value={agent.tasksCompleted}
            />
          </div>

          {/* Performance Sections */}
          <div className="space-y-6 mb-8">
            {/* Performance Breakdown */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>
                Performance Metrics
              </h4>
              <div className="space-y-2">
                <MetricBar
                  label="SLA Compliance"
                  value={agent.slaCompliance}
                  color="#6B9E8F"
                />
                <MetricBar
                  label="CSAT Performance"
                  value={agent.csatScore}
                  color="#F59E0B"
                />
                <MetricBar
                  label="First Response Time"
                  value={agent.responseSLA}
                  color="#3B82F6"
                />
              </div>
            </div>

            {/* Workload Summary */}
            <div>
              <h4 className="font-bold mb-3" style={{ color: '#1a1a1a' }}>
                Workload Summary
              </h4>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>
                Average Response Time: <strong>{agent.avgResponseTime}</strong>
              </p>
              <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
                Active Tickets: <strong>12</strong>
              </p>
              <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
                Capacity Utilization: <strong>78%</strong>
              </p>
            </div>
          </div>

          {/* Manager Actions */}
          <div className="space-y-2 border-t pt-6" style={{ borderTopColor: '#E2E0DC' }}>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              style={{ color: '#1a1a1a' }}
            >
              <FileText size={18} style={{ color: '#6B9E8F' }} />
              <span className="font-medium">View Tickets</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              style={{ color: '#1a1a1a' }}
            >
              <Briefcase size={18} style={{ color: '#6B9E8F' }} />
              <span className="font-medium">View Workload</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              style={{ color: '#1a1a1a' }}
            >
              <CheckSquare size={18} style={{ color: '#6B9E8F' }} />
              <span className="font-medium">View SLA</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              style={{ color: '#1a1a1a' }}
            >
              <Download size={18} style={{ color: '#6B9E8F' }} />
              <span className="font-medium">Export Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function KPICard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: string | number
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        backgroundColor: '#F9F8F6',
        border: '1px solid #E2E0DC',
      }}
    >
      <p className="text-2xl mb-2">{icon}</p>
      <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>
        {label}
      </p>
      <p className="font-bold" style={{ color: '#1a1a1a' }}>
        {value}
      </p>
    </div>
  )
}

function MetricBar({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <p className="text-xs" style={{ color: '#6B6B6B' }}>
          {label}
        </p>
        <p className="text-xs font-bold" style={{ color: '#1a1a1a' }}>
          {value}%
        </p>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: '#E2E0DC' }}
      >
        <div
          className="h-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  )
}
