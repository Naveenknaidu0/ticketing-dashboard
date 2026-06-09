/**
 * Configuration Usage Analytics Tab Component
 * Displays usage patterns, trends, and inactive configurations
 */

'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Clock, AlertCircle } from 'lucide-react'

interface UsageRecord {
  type: 'rule' | 'automation' | 'dashboard' | 'report'
  entityName: string
  usageCount: number
  lastUsedAt: string
  severity: 'critical' | 'high' | 'medium' | 'low'
}

interface UsageTabProps {
  configId: string
  configLabel: string
  totalUsage: number
  usageByType: Record<string, number>
  usageRecords: UsageRecord[]
  trend: 'increasing' | 'decreasing' | 'stable'
  lastUsedAt?: string
  inactiveFor?: number // days
}

export function UsageTab({ configId, configLabel, totalUsage, usageByType, usageRecords, trend, lastUsedAt, inactiveFor }: UsageTabProps) {
  const [expandedType, setExpandedType] = useState<string | null>(null)

  const getUsageLevel = (count: number) => {
    if (count > 100) return { level: 'Very High', color: '#DC2626' }
    if (count >= 50) return { level: 'High', color: '#EA580C' }
    if (count >= 10) return { level: 'Medium', color: '#F59E0B' }
    if (count > 0) return { level: 'Low', color: '#10B981' }
    return { level: 'Unused', color: '#9CA3AF' }
  }

  const usageLevel = getUsageLevel(totalUsage)

  const getTrendIcon = () => {
    if (trend === 'increasing') return <TrendingUp className="w-5 h-5" style={{ color: '#10B981' }} />
    if (trend === 'decreasing') return <TrendingDown className="w-5 h-5" style={{ color: '#EF4444' }} />
    return <TrendingDown className="w-5 h-5" style={{ color: '#9CA3AF' }} />
  }

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4" style={{ color: '#E69F50' }} />
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              Total Usage
            </span>
          </div>
          <div className="text-3xl font-bold" style={{ color: usageLevel.color }}>
            {totalUsage}
          </div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            {usageLevel.level} usage
          </div>
        </div>

        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            {getTrendIcon()}
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              Usage Trend
            </span>
          </div>
          <div className="text-xl font-bold" style={{ color: '#0D3133' }}>
            {trend === 'increasing' && '↑ Increasing'}
            {trend === 'decreasing' && '↓ Decreasing'}
            {trend === 'stable' && '→ Stable'}
          </div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            Over last 30 days
          </div>
        </div>

        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4" style={{ color: '#8B5CF6' }} />
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              Last Used
            </span>
          </div>
          <div className="text-xl font-bold" style={{ color: '#0D3133' }}>
            {lastUsedAt ? new Date(lastUsedAt).toLocaleDateString() : 'Never'}
          </div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            {inactiveFor ? `${inactiveFor} days ago` : 'Active'}
          </div>
        </div>
      </div>

      {/* Usage by Type */}
      <div className="border rounded-lg p-4" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
        <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
          Usage by Type
        </h3>
        <div className="space-y-3">
          {Object.entries(usageByType).map(([type, count]) => (
            <div key={type} className="flex items-center gap-3">
              <div className="w-20 text-sm capitalize" style={{ color: '#6B6B6B' }}>
                {type}s
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden" style={{ backgroundColor: '#E2E0DC' }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${Math.min((count / Math.max(1, Math.max(...Object.values(usageByType)))) * 100, 100)}%`,
                    backgroundColor: count > 50 ? '#EA580C' : count > 10 ? '#F59E0B' : '#10B981',
                  }}
                />
              </div>
              <div className="w-12 text-right font-semibold" style={{ color: '#0D3133' }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Records */}
      <div className="border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
        <div className="px-4 py-3" style={{ backgroundColor: '#FAFAF9' }}>
          <h3 className="font-semibold" style={{ color: '#0D3133' }}>
            Used By ({usageRecords.length})
          </h3>
        </div>

        {usageRecords.length === 0 ? (
          <div className="px-4 py-8 text-center" style={{ color: '#9CA3AF' }}>
            <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
            <div className="text-sm">No usage records found</div>
            <div className="text-xs mt-1">This configuration may be unused and safe to archive</div>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#E2E0DC' }}>
            {usageRecords.map((record, idx) => (
              <div key={idx} className="px-4 py-3 flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: '#0D3133' }}>
                    {record.entityName}
                  </div>
                  <div className="text-xs" style={{ color: '#9CA3AF' }}>
                    {record.type} · Last used {new Date(record.lastUsedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: '#0D3133' }}>
                      {record.usageCount}x
                    </div>
                    <div
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          record.severity === 'critical'
                            ? '#FEE2E2'
                            : record.severity === 'high'
                              ? '#FEF3C7'
                              : record.severity === 'medium'
                                ? '#DBEAFE'
                                : '#F3F4F6',
                        color:
                          record.severity === 'critical'
                            ? '#991B1B'
                            : record.severity === 'high'
                              ? '#92400E'
                              : record.severity === 'medium'
                                ? '#1E40AF'
                                : '#6B7280',
                      }}
                    >
                      {record.severity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Warning */}
      {inactiveFor && inactiveFor > 30 && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: '#92400E' }}>
                Inactive for {inactiveFor} days
              </div>
              <div className="text-sm mt-1" style={{ color: '#92400E' }}>
                Consider archiving this configuration if no longer needed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
