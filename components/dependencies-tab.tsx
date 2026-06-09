/**
 * Configuration Dependencies Tab Component
 * Displays dependency graph, usage chains, and impact relationships
 */

'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, Network, AlertTriangle, CheckCircle } from 'lucide-react'

interface DependencyTabProps {
  configId: string
  configLabel: string
  configCode: string
  dependencies: Array<{
    id: string
    code: string
    label: string
    category: string
    type: 'configuration' | 'rule' | 'automation'
  }>
  dependents: Array<{
    id: string
    code: string
    label: string
    category: string
    type: 'configuration' | 'rule' | 'automation'
  }>
  impactChain: {
    direct: number
    transitive: number
  }
}

export function DependenciesTab({
  configId,
  configLabel,
  configCode,
  dependencies,
  dependents,
  impactChain,
}: DependencyTabProps) {
  const [expandedSection, setExpandedSection] = useState<'dependencies' | 'dependents' | null>('dependencies')

  const hasUpstreamDeps = dependencies.length > 0
  const hasDownstreamDeps = dependents.length > 0

  const dependencyInfo = useMemo(
    () => ({
      upstream: {
        direct: dependencies.filter(d => d.type === 'configuration').length,
        rules: dependencies.filter(d => d.type === 'rule').length,
        automations: dependencies.filter(d => d.type === 'automation').length,
      },
      downstream: {
        direct: dependents.filter(d => d.type === 'configuration').length,
        rules: dependents.filter(d => d.type === 'rule').length,
        automations: dependents.filter(d => d.type === 'automation').length,
      },
    }),
    [dependencies, dependents],
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            <Network className="w-4 h-4" style={{ color: '#E69F50' }} />
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              This Configuration
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {configCode}
          </div>
          <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
            {configLabel}
          </div>
        </div>

        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            <ChevronDown className="w-4 h-4" style={{ color: '#10B981' }} />
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              Upstream Dependencies
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {dependencies.length}
          </div>
          <div className="text-xs mt-1 space-y-0.5" style={{ color: '#9CA3AF' }}>
            <div>{dependencyInfo.upstream.direct} configurations</div>
            <div>{dependencyInfo.upstream.rules} rules, {dependencyInfo.upstream.automations} automations</div>
          </div>
        </div>

        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="flex items-center gap-2 mb-2">
            <ChevronDown className="w-4 h-4" style={{ color: '#F59E0B', transform: 'rotate(180deg)' }} />
            <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
              Downstream Impact
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {dependents.length}
          </div>
          <div className="text-xs mt-1 space-y-0.5" style={{ color: '#9CA3AF' }}>
            <div>{dependencyInfo.downstream.direct} direct, {impactChain.transitive} transitive</div>
            <div>{dependencyInfo.downstream.rules} rules, {dependencyInfo.downstream.automations} automations</div>
          </div>
        </div>
      </div>

      {/* Upstream Dependencies Section */}
      <div className="border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
        <button
          onClick={() => setExpandedSection(expandedSection === 'dependencies' ? null : 'dependencies')}
          className="w-full px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: '#FAFAF9' }}
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                color: '#9CA3AF',
                transform: expandedSection === 'dependencies' ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
            <span className="font-semibold" style={{ color: '#0D3133' }}>
              Upstream Dependencies ({dependencies.length})
            </span>
            {hasUpstreamDeps && (
              <AlertTriangle className="w-4 h-4" style={{ color: '#F59E0B' }} />
            )}
          </div>
        </button>

        {expandedSection === 'dependencies' && (
          <div className="px-4 py-3 border-t" style={{ borderColor: '#E2E0DC' }}>
            {dependencies.length === 0 ? (
              <div style={{ color: '#9CA3AF' }} className="text-sm text-center py-4">
                <CheckCircle className="w-5 h-5 mx-auto mb-2" style={{ color: '#10B981' }} />
                No dependencies - this is a leaf node
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dependencies.map(dep => (
                  <div
                    key={dep.id}
                    className="p-3 rounded border flex items-start justify-between"
                    style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: '#0D3133' }}>
                        {dep.label}
                      </div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        <code>{dep.code}</code> · {dep.category}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#E2E0DC', color: '#6B6B6B' }}>
                      {dep.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Downstream Dependents Section */}
      <div className="border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
        <button
          onClick={() => setExpandedSection(expandedSection === 'dependents' ? null : 'dependents')}
          className="w-full px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: '#FAFAF9' }}
        >
          <div className="flex items-center gap-2">
            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                color: '#9CA3AF',
                transform: expandedSection === 'dependents' ? 'rotate(0deg)' : 'rotate(-90deg)',
              }}
            />
            <span className="font-semibold" style={{ color: '#0D3133' }}>
              Downstream Dependents ({dependents.length})
            </span>
            {hasDownstreamDeps && (
              <AlertTriangle className="w-4 h-4" style={{ color: '#EF4444' }} />
            )}
          </div>
        </button>

        {expandedSection === 'dependents' && (
          <div className="px-4 py-3 border-t" style={{ borderColor: '#E2E0DC' }}>
            {dependents.length === 0 ? (
              <div style={{ color: '#9CA3AF' }} className="text-sm text-center py-4">
                <CheckCircle className="w-5 h-5 mx-auto mb-2" style={{ color: '#10B981' }} />
                No dependents - safe to delete
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dependents.map(dep => (
                  <div
                    key={dep.id}
                    className="p-3 rounded border flex items-start justify-between"
                    style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: '#0D3133' }}>
                        {dep.label}
                      </div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        <code>{dep.code}</code> · {dep.category}
                      </div>
                    </div>
                    <div
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: dep.type === 'automation' ? '#FEE2E2' : dep.type === 'rule' ? '#FEF3C7' : '#E2E0DC',
                        color: dep.type === 'automation' ? '#991B1B' : dep.type === 'rule' ? '#92400E' : '#6B6B6B',
                      }}
                    >
                      {dep.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Warning if high impact */}
      {hasDownstreamDeps && dependents.length > 5 && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }}>
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
            <div>
              <div className="font-semibold text-sm" style={{ color: '#92400E' }}>
                High Impact Configuration
              </div>
              <div className="text-sm mt-1" style={{ color: '#92400E' }}>
                This configuration is critical to the system. Changes or deletion would affect {dependents.length} items downstream. Archive with caution.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
