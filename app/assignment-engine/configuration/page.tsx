'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Clock, AlertCircle, Zap, Grid3x3 } from 'lucide-react'
import { getAuditSummary, getRecentActivity } from '@/lib/audit-log-engine'
import { getStatistics as getConfigStats } from '@/lib/configuration-registry'

interface WorkspaceCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  route: string
}

const WORKSPACE_CARDS: WorkspaceCard[] = [
  {
    id: 'queues',
    title: 'Queue Configuration',
    description: 'Manage queue types, statuses, priorities, routing and ownership settings.',
    icon: <Grid3x3 className="w-6 h-6" />,
    color: '#3B82F6',
    route: '/assignment-engine/configuration/queues',
  },
  {
    id: 'skills',
    title: 'Skill Configuration',
    description: 'Define skill levels, categories, proficiency requirements and skill trees.',
    icon: <Zap className="w-6 h-6" />,
    color: '#10B981',
    route: '/assignment-engine/configuration/skills',
  },
  {
    id: 'rules',
    title: 'Rule Configuration',
    description: 'Create routing rules, conditions, actions, and rule priorities for assignment logic.',
    icon: <AlertCircle className="w-6 h-6" />,
    color: '#EF4444',
    route: '/assignment-engine/configuration/rules',
  },
  {
    id: 'automations',
    title: 'Automation Configuration',
    description: 'Define automation triggers, actions, workflows, and business process automation.',
    icon: <Zap className="w-6 h-6" />,
    color: '#0EA5E9',
    route: '/assignment-engine/configuration/automations',
  },
  {
    id: 'dashboard',
    title: 'Dashboard Governance',
    description: 'Configure dashboard layouts, widgets, panels, and team-specific configurations.',
    icon: <Grid3x3 className="w-6 h-6" />,
    color: '#8B5CF6',
    route: '/assignment-engine/configuration/dashboard',
  },
  {
    id: 'system',
    title: 'System Configuration',
    description: 'Manage system settings, departments, permissions, global preferences and integrations.',
    icon: <Grid3x3 className="w-6 h-6" />,
    color: '#6B7280',
    route: '/assignment-engine/configuration/system',
  },
]

export default function ConfigurationStudioPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const configStats = getConfigStats()
  const recentChanges = getRecentActivity(10)

  const filteredCards = WORKSPACE_CARDS.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCardClick = (route: string) => {
    try {
      setError(null)
      router.push(route)
    } catch (err) {
      setError('Failed to navigate to workspace. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <div className="w-8 h-8 border-4 rounded-full" style={{ borderColor: '#E2E0DC', borderTopColor: '#E69F50' }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: '#0D3133' }}>
            Loading Configuration Studio
          </h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <div className="text-center max-w-md">
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
            <AlertCircle className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: '#0D3133' }}>
            Configuration Workspace Unavailable
          </h2>
          <p style={{ color: '#6B6B6B' }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D3133' }}>
            Configuration Studio
          </h1>
          <p className="text-base" style={{ color: '#6B6B6B' }}>
            Centralized no-code platform for managing Assignment Engine behavior. Control forms, workflows, actions, statuses, and system configurations without code.
          </p>
        </div>

        {/* Top Actions: Global Search, Recent Changes, Audit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Global Search */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#0D3133' }}>
              Global Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search all configurations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              />
            </div>
          </div>

          {/* Recent Changes Panel */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: '#E69F50' }} />
              <h3 className="font-semibold" style={{ color: '#0D3133' }}>
                Recent Changes
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              {recentChanges.slice(0, 3).map((change, idx) => (
                <div key={idx} className="text-xs" style={{ color: '#6B6B6B' }}>
                  <div className="font-medium" style={{ color: '#0D3133' }}>
                    {change.entityName}
                  </div>
                  <div>{change.action.toUpperCase()} by {change.userName}</div>
                  <div style={{ color: '#9CA3AF' }}>
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {recentChanges.length === 0 && (
                <p style={{ color: '#9CA3AF' }}>No recent changes</p>
              )}
            </div>
          </div>

          {/* Configuration Summary */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>
              Configuration Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Total Groups</span>
                <span className="font-semibold" style={{ color: '#0D3133' }}>
                  6
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Active Configs</span>
                <span className="font-semibold" style={{ color: '#10B981' }}>
                  {configStats.byStatus.active || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Draft Configs</span>
                <span className="font-semibold" style={{ color: '#F59E0B' }}>
                  {configStats.byStatus.draft || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Pending Changes</span>
                <span className="font-semibold" style={{ color: '#EF4444' }}>
                  {(configStats.byStatus.draft || 0) + (configStats.byStatus.disabled || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#0D3133' }}>
            Workspaces
          </h2>
          
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
              <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
                No Configurations Available
              </h3>
              <p style={{ color: '#6B6B6B' }}>
                No workspaces match your search. Try adjusting your search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCards.map(card => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.route)}
                  className="text-left p-6 rounded-lg border hover:shadow-lg transition-all hover:-translate-y-1"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E0DC',
                  }}
                >
                  {/* Card Header with Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                      {card.icon}
                    </div>
                  </div>

                  {/* Card Title and Description */}
                  <h3 className="font-semibold text-base mb-2" style={{ color: '#0D3133' }}>
                    {card.title}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
                    {card.description}
                  </p>

                  {/* Card Footer */}
                  <div className="pt-4 border-t" style={{ borderColor: '#E2E0DC' }}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex gap-4">
                        <div>
                          <div className="font-semibold" style={{ color: '#0D3133' }}>
                            {configStats.byCategory[card.id] || 0}
                          </div>
                          <div style={{ color: '#9CA3AF' }}>Active</div>
                        </div>
                      </div>
                      <div style={{ color: '#9CA3AF' }} className="text-xs">
                        Last Updated
                        <br />
                        2 Hours Ago
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recently Edited */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
              Recently Edited
            </h3>
            <div className="space-y-2 text-sm">
              {recentChanges.filter(c => c.action === 'update').slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-2 rounded hover:bg-gray-50 cursor-pointer" style={{ color: '#6B6B6B' }}>
                  {item.entityName}
                </div>
              ))}
              {recentChanges.filter(c => c.action === 'update').length === 0 && (
                <p style={{ color: '#9CA3AF' }}>No recent edits</p>
              )}
            </div>
          </div>

          {/* Most Used */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
              Most Used
            </h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded hover:bg-gray-50 cursor-pointer" style={{ color: '#6B6B6B' }}>
                Queue Status
              </div>
              <div className="p-2 rounded hover:bg-gray-50 cursor-pointer" style={{ color: '#6B6B6B' }}>
                Skill Level
              </div>
              <div className="p-2 rounded hover:bg-gray-50 cursor-pointer" style={{ color: '#6B6B6B' }}>
                Rule Action
              </div>
            </div>
          </div>

          {/* Recently Created */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
              Recently Created
            </h3>
            <div className="space-y-2 text-sm">
              {recentChanges.filter(c => c.action === 'create').slice(0, 3).map((item, idx) => (
                <div key={idx} className="p-2 rounded hover:bg-gray-50 cursor-pointer" style={{ color: '#6B6B6B' }}>
                  {item.entityName}
                </div>
              ))}
              {recentChanges.filter(c => c.action === 'create').length === 0 && (
                <p style={{ color: '#9CA3AF' }}>No recent creations</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

