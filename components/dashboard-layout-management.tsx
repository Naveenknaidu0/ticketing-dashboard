'use client'

import { useState } from 'react'
import { GripVertical, Trash2, Copy } from 'lucide-react'
import { widgetAssignmentEngine } from '@/lib/widget-assignment-engine'
import { profileBuilderEngine } from '@/lib/profile-builder-engine'

const TABS = ['Overview', 'Operations', 'Performance', 'SLA & Compliance', 'Workload', 'Reports']

const AVAILABLE_WIDGETS = [
  { id: 'my-ticket-status', name: 'My Ticket Status', category: 'Personal' },
  { id: 'priority-breakdown', name: 'Priority Breakdown', category: 'Analysis' },
  { id: 'sla-health', name: 'SLA Health', category: 'Performance' },
  { id: 'csat', name: 'CSAT', category: 'Quality' },
  { id: 'leaderboard', name: 'Leaderboard', category: 'Performance' },
  { id: 'workload', name: 'Workload', category: 'Operations' },
  { id: 'reports', name: 'Reports', category: 'Analytics' },
  { id: 'team-to-do', name: 'Team To Do', category: 'Operations' },
  { id: 'group-wise-tickets', name: 'Group Wise Tickets', category: 'Analysis' },
  { id: 'queue-health', name: 'Queue Health', category: 'Performance' },
]

interface LayoutManagementProps {
  profileId?: string
}

export function DashboardLayoutManagement({ profileId }: LayoutManagementProps) {
  const [selectedTab, setSelectedTab] = useState('Overview')
  const [profiles] = useState(profileBuilderEngine.getAllProfiles())
  const [selectedProfile, setSelectedProfile] = useState(profileId || profiles[0]?.id || '')

  const profile = profileId
    ? profileBuilderEngine.getProfile(profileId)
    : selectedProfile
      ? profileBuilderEngine.getProfile(selectedProfile)
      : null

  const visibleWidgets = selectedProfile ? widgetAssignmentEngine.getWidgetsForTab(selectedProfile, selectedTab) : []
  const allWidgets = selectedProfile ? widgetAssignmentEngine.getAllWidgetsForProfile(selectedProfile) : []

  const handleAddWidget = (widgetId: string) => {
    if (!selectedProfile) return

    const maxPosition = Math.max(
      ...visibleWidgets.map(w => w.position),
      -1
    )

    widgetAssignmentEngine.enableWidget(selectedProfile, widgetId, selectedTab, maxPosition + 1)
  }

  const handleRemoveWidget = (widgetId: string) => {
    if (!selectedProfile) return
    widgetAssignmentEngine.disableWidget(selectedProfile, widgetId)
  }

  const handleMoveWidget = (widgetId: string, direction: 'up' | 'down') => {
    if (!selectedProfile) return
    const widget = visibleWidgets.find(w => w.widgetId === widgetId)
    if (!widget) return

    const newPosition = direction === 'up' ? widget.position - 1 : widget.position + 1
    if (newPosition < 0 || newPosition >= visibleWidgets.length) return

    widgetAssignmentEngine.setWidgetPosition(selectedProfile, widgetId, newPosition, selectedTab)
  }

  const handleChangeSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    if (!selectedProfile) return
    widgetAssignmentEngine.setWidgetSize(selectedProfile, widgetId, size)
  }

  const handleChangeTab = (widgetId: string, newTab: string) => {
    if (!selectedProfile) return
    const widget = visibleWidgets.find(w => w.widgetId === widgetId)
    if (!widget) return
    widgetAssignmentEngine.moveWidget(selectedProfile, widgetId, newTab, 0)
  }

  return (
    <div className="space-y-6">
      {/* Profile Selection (if not pre-selected) */}
      {!profileId && (
        <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
            Select Profile
          </label>
          <select
            value={selectedProfile}
            onChange={e => {
              setSelectedProfile(e.target.value)
              setSelectedTab('Overview')
            }}
            className="w-full px-3 py-2 border rounded-lg"
            style={{ borderColor: '#E2E0DC' }}
          >
            <option value="">Choose profile...</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProfile && (
        <>
          {/* Tab Navigation */}
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <label className="block text-sm font-semibold mb-3" style={{ color: '#6B6B6B' }}>
              Select Tab
            </label>
            <div className="flex flex-wrap gap-2">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className="px-3 py-1 rounded text-sm font-medium border"
                  style={{
                    backgroundColor: selectedTab === tab ? '#E69F50' : '#FFFFFF',
                    color: selectedTab === tab ? '#FFFFFF' : '#6B6B6B',
                    borderColor: '#E2E0DC',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Current Widgets */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
                Current Widgets on {selectedTab}
              </h3>

              {visibleWidgets.length === 0 ? (
                <p style={{ color: '#9CA3AF' }}>No widgets on this tab</p>
              ) : (
                <div className="space-y-3">
                  {visibleWidgets.map((widget, idx) => {
                    const widgetInfo = AVAILABLE_WIDGETS.find(w => w.id === widget.widgetId)
                    return (
                      <div
                        key={widget.widgetId}
                        className="p-3 rounded border"
                        style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
                      >
                        <div className="flex items-start gap-3">
                          <GripVertical className="w-4 h-4 mt-0.5" style={{ color: '#9CA3AF' }} />
                          <div className="flex-1">
                            <div style={{ color: '#0D3133', fontWeight: 500 }}>{widgetInfo?.name}</div>
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <select
                                value={widget.size}
                                onChange={e => handleChangeSize(widget.widgetId, e.target.value as 'small' | 'medium' | 'large')}
                                className="text-xs px-2 py-1 rounded border"
                                style={{ borderColor: '#E2E0DC' }}
                              >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                              </select>

                              <select
                                value={widget.tab}
                                onChange={e => handleChangeTab(widget.widgetId, e.target.value)}
                                className="text-xs px-2 py-1 rounded border"
                                style={{ borderColor: '#E2E0DC' }}
                              >
                                {TABS.map(tab => (
                                  <option key={tab} value={tab}>
                                    {tab}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => handleRemoveWidget(widget.widgetId)}
                                className="text-xs px-2 py-1 rounded border hover:bg-red-50"
                                style={{ borderColor: '#E2E0DC', color: '#EF4444' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Available Widgets */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
            >
              <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
                Add Widgets
              </h3>

              <div className="space-y-2">
                {AVAILABLE_WIDGETS.map(widget => {
                  const isAdded = visibleWidgets.some(w => w.widgetId === widget.id)
                  return (
                    <button
                      key={widget.id}
                      onClick={() => handleAddWidget(widget.id)}
                      disabled={isAdded}
                      className="w-full text-left px-3 py-2 rounded border text-sm disabled:opacity-50"
                      style={{
                        backgroundColor: isAdded ? '#F3F4F6' : '#FFFFFF',
                        borderColor: '#E2E0DC',
                        color: isAdded ? '#9CA3AF' : '#0D3133',
                      }}
                    >
                      <div>{widget.name}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        {widget.category}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
