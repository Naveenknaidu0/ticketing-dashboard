/**
 * Configuration Details Modal
 * Unified view combining Dependencies, Usage, and Impact Analysis
 */

'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { DependenciesTab } from './dependencies-tab'
import { UsageTab } from './usage-tab'
import { ImpactTab } from './impact-tab'

interface ConfigurationDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  config: {
    id: string
    label: string
    code: string
    category: string
    status: string
  }
  dependencies: any
  usage: any
  impactAnalysis: any
  onDelete?: () => void
  onArchive?: () => void
  canDelete: boolean
}

type TabType = 'dependencies' | 'usage' | 'impact'

export function ConfigurationDetailsModal({
  isOpen,
  onClose,
  config,
  dependencies,
  usage,
  impactAnalysis,
  onDelete,
  onArchive,
  canDelete,
}: ConfigurationDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dependencies')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
                {config.label}
              </h2>
              <div className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                <code>{config.code}</code> • {config.category}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              style={{ backgroundColor: 'transparent' }}
            >
              <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <button
            onClick={() => setActiveTab('dependencies')}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === 'dependencies' ? '#E69F50' : 'transparent',
              color: activeTab === 'dependencies' ? '#E69F50' : '#6B6B6B',
            }}
          >
            Dependencies
            {dependencies?.directCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#E2E0DC' }}>
                {dependencies.directCount + dependencies.transitiveCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === 'usage' ? '#E69F50' : 'transparent',
              color: activeTab === 'usage' ? '#E69F50' : '#6B6B6B',
            }}
          >
            Usage Analytics
            {usage?.totalUsage > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#E2E0DC' }}>
                {usage.totalUsage}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('impact')}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === 'impact' ? '#E69F50' : 'transparent',
              color: activeTab === 'impact' ? '#E69F50' : '#6B6B6B',
            }}
          >
            Impact Analysis
            {impactAnalysis?.severity === 'critical' && (
              <AlertTriangle className="w-4 h-4 ml-1 inline" style={{ color: '#DC2626' }} />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dependencies' && dependencies && (
            <DependenciesTab
              configId={config.id}
              configLabel={config.label}
              configCode={config.code}
              dependencies={dependencies.dependencies || []}
              dependents={dependencies.dependents || []}
              impactChain={dependencies.impactChain || { direct: 0, transitive: 0 }}
            />
          )}

          {activeTab === 'usage' && usage && (
            <UsageTab
              configId={config.id}
              configLabel={config.label}
              totalUsage={usage.totalUsage || 0}
              usageByType={usage.byType || {}}
              usageRecords={usage.records || []}
              trend={usage.trend || 'stable'}
              lastUsedAt={usage.lastUsedAt}
              inactiveFor={usage.inactiveFor}
            />
          )}

          {activeTab === 'impact' && impactAnalysis && (
            <ImpactTab
              configId={config.id}
              configLabel={config.label}
              canDelete={canDelete}
              affectedItems={impactAnalysis.affectedItems || { directCount: 0, transitiveCount: 0, byType: {} }}
              risks={impactAnalysis.risks || []}
              recommendations={impactAnalysis.recommendations || []}
              severity={impactAnalysis.severity || 'low'}
              estimatedTestingTime={impactAnalysis.timeline?.estimatedTestingTime || 15}
              rollbackComplexity={impactAnalysis.timeline?.rollbackComplexity || 'simple'}
              changeType="delete"
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 justify-end" style={{ borderColor: '#E2E0DC' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border"
            style={{ borderColor: '#E2E0DC', color: '#6B6B6B', backgroundColor: '#FFFFFF' }}
          >
            Close
          </button>

          {onArchive && (
            <button
              onClick={onArchive}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
            >
              Archive
            </button>
          )}

          {onDelete && canDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
            >
              Delete
            </button>
          )}

          {onDelete && !canDelete && (
            <button
              disabled
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#D1D5DB', color: '#9CA3AF', cursor: 'not-allowed' }}
              title="Cannot delete: Configuration is in use"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
