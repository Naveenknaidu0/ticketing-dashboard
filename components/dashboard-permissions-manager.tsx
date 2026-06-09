'use client'

import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import { profileBuilderEngine } from '@/lib/profile-builder-engine'
import { widgetAssignmentEngine } from '@/lib/widget-assignment-engine'

const AVAILABLE_WIDGETS = [
  { id: 'my-ticket-status', name: 'My Ticket Status' },
  { id: 'priority-breakdown', name: 'Priority Breakdown' },
  { id: 'sla-health', name: 'SLA Health' },
  { id: 'csat', name: 'CSAT' },
  { id: 'leaderboard', name: 'Leaderboard' },
  { id: 'workload', name: 'Workload' },
  { id: 'reports', name: 'Reports' },
  { id: 'team-to-do', name: 'Team To Do' },
  { id: 'group-wise-tickets', name: 'Group Wise Tickets' },
  { id: 'queue-health', name: 'Queue Health' },
]

const AVAILABLE_ROLES = [
  { id: 'l1-agent', label: 'L1 Agent' },
  { id: 'l2-agent', label: 'L2 Agent' },
  { id: 'l3-agent', label: 'L3 Agent' },
  { id: 'manager', label: 'Manager' },
  { id: 'admin', label: 'Admin' },
]

export function DashboardPermissionsManager() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null)
  const [profiles] = useState(profileBuilderEngine.getAllProfiles())

  const profile = selectedProfile ? profileBuilderEngine.getProfile(selectedProfile) : null
  const widget = selectedWidget && selectedProfile ? widgetAssignmentEngine.getWidgetVisibility(selectedProfile, selectedWidget) : null

  const handleToggleRoleVisibility = (roleId: string) => {
    if (!selectedProfile || !selectedWidget) return

    if (widget?.visibleToRoles.includes(roleId)) {
      const newRoles = widget.visibleToRoles.filter(r => r !== roleId)
      widgetAssignmentEngine.restrictWidgetToRoles(selectedProfile, selectedWidget, newRoles)
    } else {
      const newRoles = [...(widget?.visibleToRoles || []), roleId]
      widgetAssignmentEngine.restrictWidgetToRoles(selectedProfile, selectedWidget, newRoles)
    }
  }

  const handleMakeVisibleToAll = () => {
    if (!selectedProfile || !selectedWidget) return
    widgetAssignmentEngine.makeWidgetVisibleToAll(selectedProfile, selectedWidget)
  }

  return (
    <div className="space-y-6">
      {/* Profile Selection */}
      <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
          Select Profile
        </label>
        <select
          value={selectedProfile || ''}
          onChange={e => {
            setSelectedProfile(e.target.value || null)
            setSelectedWidget(null)
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

      {selectedProfile && (
        <div className="grid grid-cols-2 gap-6">
          {/* Widget Selection */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
              Widgets
            </h3>

            <div className="space-y-2">
              {AVAILABLE_WIDGETS.map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWidget(w.id)}
                  className="w-full text-left px-3 py-2 rounded border text-sm"
                  style={{
                    backgroundColor: selectedWidget === w.id ? '#FEF3C7' : '#FFFFFF',
                    borderColor: selectedWidget === w.id ? '#E69F50' : '#E2E0DC',
                    color: '#0D3133',
                  }}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          {/* Permission Configuration */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
              {selectedWidget
                ? `${AVAILABLE_WIDGETS.find(w => w.id === selectedWidget)?.name} - Visible To:`
                : 'Select a widget'}
            </h3>

            {selectedWidget && widget ? (
              <div className="space-y-3">
                {/* Visibility Options */}
                <div className="space-y-2">
                  <button
                    onClick={handleMakeVisibleToAll}
                    className="w-full text-left px-3 py-2 rounded border text-sm"
                    style={{
                      backgroundColor: widget.visibleToRoles.length === 0 ? '#D1FAE5' : '#FFFFFF',
                      borderColor: widget.visibleToRoles.length === 0 ? '#10B981' : '#E2E0DC',
                      color: '#0D3133',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {widget.visibleToRoles.length === 0 && <Check className="w-4 h-4" style={{ color: '#10B981' }} />}
                      <span>Visible to All Roles</span>
                    </div>
                  </button>
                </div>

                {/* Role-based Visibility */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                    Restrict to Specific Roles:
                  </label>
                  <div className="space-y-2">
                    {AVAILABLE_ROLES.map(role => {
                      const isVisible = widget.visibleToRoles.length === 0 || widget.visibleToRoles.includes(role.id)
                      return (
                        <button
                          key={role.id}
                          onClick={() => handleToggleRoleVisibility(role.id)}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded border"
                          style={{
                            backgroundColor: isVisible ? '#D1FAE5' : '#FEE2E2',
                            borderColor: isVisible ? '#10B981' : '#FECACA',
                          }}
                        >
                          {isVisible ? (
                            <Eye className="w-4 h-4" style={{ color: '#10B981' }} />
                          ) : (
                            <EyeOff className="w-4 h-4" style={{ color: '#EF4444' }} />
                          )}
                          <span style={{ color: isVisible ? '#065F46' : '#7F1D1D' }}>{role.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Summary */}
                <div
                  className="p-3 rounded text-sm"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', border: '1px solid #E2E0DC' }}
                >
                  <div style={{ color: '#0D3133', fontWeight: 500 }}>Current Settings:</div>
                  {widget.visibleToRoles.length === 0 ? (
                    <div style={{ color: '#6B6B6B', marginTop: '0.5rem' }}>Visible to all roles</div>
                  ) : (
                    <div style={{ color: '#6B6B6B', marginTop: '0.5rem' }}>
                      Visible only to: {widget.visibleToRoles.map(r => AVAILABLE_ROLES.find(role => role.id === r)?.label).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: '#9CA3AF' }}>Select a widget to configure permissions</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
