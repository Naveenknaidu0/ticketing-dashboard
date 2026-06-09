'use client'

import { useState } from 'react'
import { BarChart3, Users, Edit2, History } from 'lucide-react'
import { DashboardProfileManager } from '@/components/dashboard-profile-manager'
import { LiveDashboardRenderer } from '@/components/live-dashboard-renderer'
import { dashboardAuditEngine } from '@/lib/dashboard-audit-engine'

type GovernanceTab = 'profiles' | 'agent-dashboard' | 'manager-dashboard' | 'audit'

export default function DashboardGovernancePage() {
  const [activeTab, setActiveTab] = useState<GovernanceTab>('profiles')
  const [auditEvents] = useState(dashboardAuditEngine.getAllEvents())
  const [isEditMode, setIsEditMode] = useState(false)

  const tabs = [
    { id: 'profiles', label: 'Dashboard Profiles', icon: BarChart3, description: 'Create and manage dashboard profiles' },
    { id: 'agent-dashboard', label: 'Agent Dashboard', icon: Users, description: 'Configure agent dashboard widgets' },
    { id: 'manager-dashboard', label: 'Manager Dashboard', icon: Users, description: 'Configure manager dashboard widgets' },
    { id: 'audit', label: 'Audit History', icon: History, description: 'Track all governance changes' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D3133' }}>
            Dashboard Governance
          </h1>
          <p style={{ color: '#6B6B6B' }}>
            Configure and manage dashboards, profiles, and widget layouts
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b sticky top-20 z-30" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as GovernanceTab)
                    setIsEditMode(false)
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
                  title={tab.description}
                  style={{
                    borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
                    color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'profiles' && (
          <div className="p-8">
            <DashboardProfileManager />
          </div>
        )}

        {activeTab === 'agent-dashboard' && (
          <div>
            <div className="sticky top-32 z-20 p-4 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <div>
                <h2 className="font-semibold" style={{ color: '#0D3133' }}>Agent Personal Dashboard</h2>
                <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Customize widgets and layout for agents</p>
              </div>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: isEditMode ? '#E69F50' : '#F3F1EE',
                  color: isEditMode ? '#FFFFFF' : '#6B6B6B',
                }}
              >
                <Edit2 className="w-4 h-4" />
                {isEditMode ? 'Done Editing' : 'Edit Dashboard'}
              </button>
            </div>
            <div className="p-8">
              <LiveDashboardRenderer dashboardType="agent-personal" isEditMode={isEditMode} />
            </div>
          </div>
        )}

        {activeTab === 'manager-dashboard' && (
          <div>
            <div className="sticky top-32 z-20 p-4 border-b flex items-center justify-between" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <div>
                <h2 className="font-semibold" style={{ color: '#0D3133' }}>Manager Personal Dashboard</h2>
                <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Customize widgets and layout for managers</p>
              </div>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: isEditMode ? '#E69F50' : '#F3F1EE',
                  color: isEditMode ? '#FFFFFF' : '#6B6B6B',
                }}
              >
                <Edit2 className="w-4 h-4" />
                {isEditMode ? 'Done Editing' : 'Edit Dashboard'}
              </button>
            </div>
            <div className="p-8">
              <LiveDashboardRenderer dashboardType="manager-personal" isEditMode={isEditMode} />
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="p-8">
            <div className="space-y-3">
              {auditEvents.length === 0 ? (
                <div className="p-8 text-center rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
                  <p style={{ color: '#9CA3AF' }}>No audit events recorded</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {auditEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border"
                      style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="font-semibold" style={{ color: '#0D3133' }}>
                            {event.action}
                          </span>
                          <span className="mx-2" style={{ color: '#9CA3AF' }}>
                            on
                          </span>
                          <span style={{ color: '#6B6B6B' }}>{event.targetName}</span>
                        </div>
                        <span style={{ color: '#9CA3AF' }} className="text-sm">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#9CA3AF' }}>
                        by {event.userName} ({event.userRole})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
