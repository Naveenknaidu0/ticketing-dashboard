'use client'

import { BarChart3, TrendingUp, Users, Zap } from 'lucide-react'
import { SkillUsageAnalytics } from '@/lib/types'

interface SkillUsageAnalyticsProps {
  analytics: SkillUsageAnalytics
}

export function SkillUsageAnalyticsComponent({
  analytics,
}: SkillUsageAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Assigned Users */}
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Assigned Users</p>
            <Users className="w-4 h-4" style={{ color: '#0D3133' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {analytics.totalAssignedUsers}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            {analytics.activeUsers} active
          </p>
        </div>

        {/* Active Queues */}
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Active Queues</p>
            <Zap className="w-4 h-4" style={{ color: '#0D3133' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {analytics.queuesUsing.length}
          </p>
        </div>

        {/* Active Rules */}
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Active Rules</p>
            <TrendingUp className="w-4 h-4" style={{ color: '#0D3133' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {analytics.rulesUsing.length}
          </p>
        </div>

        {/* Assignment Frequency */}
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>Assignments (30d)</p>
            <BarChart3 className="w-4 h-4" style={{ color: '#0D3133' }} />
          </div>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {analytics.assignmentFrequency}
          </p>
        </div>
      </div>

      {/* Queues Using This Skill */}
      {analytics.queuesUsing.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Queues Using This Skill</h4>
          <div className="space-y-1">
            {analytics.queuesUsing.map(queue => (
              <div key={queue.queueId} className="flex items-center justify-between p-2 text-xs" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.375rem' }}>
                <span style={{ color: '#0D3133' }}>{queue.queueName}</span>
                <span style={{ color: '#6B6B6B' }}>{queue.count} connections</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rules Using This Skill */}
      {analytics.rulesUsing.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Rules Using This Skill</h4>
          <div className="space-y-1">
            {analytics.rulesUsing.map(rule => (
              <div key={rule.ruleId} className="flex items-center justify-between p-2 text-xs" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.375rem' }}>
                <span style={{ color: '#0D3133' }}>{rule.ruleName}</span>
                <span style={{ color: '#6B6B6B' }}>{rule.count} matches</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Automations Using This Skill */}
      {analytics.automationsUsing.length > 0 && (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Automations Using This Skill</h4>
          <div className="space-y-1">
            {analytics.automationsUsing.map(automation => (
              <div key={automation.automationId} className="flex items-center justify-between p-2 text-xs" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.375rem' }}>
                <span style={{ color: '#0D3133' }}>{automation.automationName}</span>
                <span style={{ color: '#6B6B6B' }}>{automation.count} triggers</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Used */}
      <div className="border-t pt-4 text-xs" style={{ borderColor: '#E2E0DC', color: '#9CA3AF' }}>
        <p>Last used: {new Date(analytics.lastUsedDate).toLocaleString()}</p>
        <p>Average proficiency level: {(analytics.averageProficiency || 0).toFixed(1)}/5</p>
      </div>
    </div>
  )
}
