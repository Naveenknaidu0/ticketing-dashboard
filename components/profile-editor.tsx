'use client'

import { useState } from 'react'
import { Plus, Save, Trash2, Copy, ArrowLeft, Check, Clock } from 'lucide-react'
import { profileBuilderEngine, type DashboardProfile, type WidgetConfig } from '@/lib/profile-builder-engine'
import { DASHBOARD_TABS, type WidgetId } from '@/lib/dashboard-constants'

interface ProfileEditorProps {
  profileId?: string
  onClose?: () => void
  onSave?: (profile: DashboardProfile) => void
}

type EditorTab = 'details' | 'widgets' | 'preview'

export function ProfileEditor({ profileId, onClose, onSave }: ProfileEditorProps) {
  const existingProfile = profileId ? profileBuilderEngine.getProfile(profileId) : null
  const [profile, setProfile] = useState<DashboardProfile | null>(existingProfile)
  const [activeTab, setActiveTab] = useState<EditorTab>('details')
  const [selectedWidgetTab, setSelectedWidgetTab] = useState<string>(DASHBOARD_TABS[0])
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    description: profile?.description || '',
    dashboardId: profile?.dashboardId || 'agent-personal',
  })

  const dashboards = profileBuilderEngine.getAvailableDashboards()
  const availableWidgets = profileBuilderEngine.getAvailableWidgets()
  const tabs = DASHBOARD_TABS

  if (!profile) {
    return (
      <div className="p-8 text-center" style={{ color: '#9CA3AF' }}>
        <p>Profile not found</p>
      </div>
    )
  }

  const handleUpdateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const updated = profileBuilderEngine.updateProfile(
        profile.id,
        {
          name: formData.name,
          description: formData.description,
          dashboardId: formData.dashboardId as any,
        },
        'current-user'
      )

      if (updated) {
        setProfile(updated)
        setHasChanges(false)
        onSave?.(updated)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloneProfile = () => {
    const cloned = profileBuilderEngine.cloneProfile(profile.id, 'current-user')
    if (cloned && onSave) {
      onSave(cloned)
    }
  }

  const handleArchiveProfile = () => {
    if (confirm('Archive this profile? It can be restored later.')) {
      const archived = profileBuilderEngine.archiveProfile(profile.id)
      if (archived && onClose) {
        onClose()
      }
    }
  }

  const handleDeleteProfile = () => {
    if (confirm('Permanently delete this profile? This cannot be undone.')) {
      profileBuilderEngine.deleteProfile(profile.id)
      if (onClose) onClose()
    }
  }

  const handleAddWidget = (widgetId: WidgetId) => {
    const updated = profileBuilderEngine.addWidget(profile.id, widgetId, selectedWidgetTab as any)
    if (updated) {
      setProfile(updated)
      setHasChanges(true)
    }
  }

  const handleRemoveWidget = (widgetId: WidgetId) => {
    const updated = profileBuilderEngine.removeWidget(profile.id, widgetId)
    if (updated) {
      setProfile(updated)
      setHasChanges(true)
    }
  }

  const handleUpdateWidgetSize = (widgetId: WidgetId, size: 'small' | 'medium' | 'large') => {
    const updated = profileBuilderEngine.updateWidgetConfig(profile.id, widgetId, { size })
    if (updated) {
      setProfile(updated)
      setHasChanges(true)
    }
  }

  const handleMoveWidget = (widgetId: WidgetId, newTab: string) => {
    const updated = profileBuilderEngine.moveWidgetToTab(profile.id, widgetId, newTab as any)
    if (updated) {
      setProfile(updated)
      setHasChanges(true)
    }
  }

  const widgetsInTab = profile.widgets.filter(w => w.tab === selectedWidgetTab).sort((a, b) => a.position - b.position)
  const usedWidgetIds = new Set(profile.widgets.map(w => w.widgetId))
  const availableForTab = availableWidgets.filter(w => !usedWidgetIds.has(w.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
              {profileId ? 'Edit Profile' : 'New Profile'}
            </h2>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
              {profile.status === 'draft' ? 'Draft - Not published' : profile.status === 'active' ? 'Published' : 'Archived'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <div className="flex items-center gap-1 px-3 py-1 rounded-lg" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Unsaved changes</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleSaveProfile}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={handleCloneProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
          style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
        >
          <Copy className="w-4 h-4" />
          Clone
        </button>

        {profile.status !== 'archived' && (
          <button
            onClick={handleArchiveProfile}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
            style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
          >
            Archive
          </button>
        )}

        <button
          onClick={handleDeleteProfile}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
          style={{ borderColor: '#FCA5A5', color: '#EF4444' }}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: '#E2E0DC' }}>
        {(['details', 'widgets', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium border-b-2 capitalize"
            style={{
              borderColor: activeTab === tab ? '#E69F50' : 'transparent',
              color: activeTab === tab ? '#E69F50' : '#6B6B6B',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Profile Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleUpdateForm('name', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleUpdateForm('description', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg h-24"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Dashboard Type
            </label>
            <select
              value={formData.dashboardId}
              onChange={e => handleUpdateForm('dashboardId', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: '#E2E0DC' }}
            >
              {dashboards.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              <strong>Created:</strong> {new Date(profile.createdAt).toLocaleString()}
            </p>
            <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
              <strong>Last updated:</strong> {new Date(profile.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Widgets Tab */}
      {activeTab === 'widgets' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Current Widgets */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
              Widgets on {selectedWidgetTab}
            </h3>

            {/* Tab Selector */}
            <div className="mb-4 flex gap-2 flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setSelectedWidgetTab(tab)}
                  className="px-2 py-1 text-xs rounded border"
                  style={{
                    backgroundColor: selectedWidgetTab === tab ? '#E69F50' : '#FFFFFF',
                    borderColor: '#E2E0DC',
                    color: selectedWidgetTab === tab ? '#FFFFFF' : '#6B6B6B',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {widgetsInTab.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No widgets on this tab</p>
            ) : (
              <div className="space-y-2">
                {widgetsInTab.map(widget => {
                  const widgetInfo = availableWidgets.find(w => w.id === widget.widgetId)
                  return (
                    <div
                      key={widget.widgetId}
                      className="p-3 rounded-lg border space-y-2"
                      style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
                    >
                      <div className="flex items-center justify-between">
                        <span style={{ color: '#0D3133', fontWeight: 500 }}>
                          {widgetInfo?.name}
                        </span>
                        <button
                          onClick={() => handleRemoveWidget(widget.widgetId)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <select
                          value={widget.size}
                          onChange={e => handleUpdateWidgetSize(widget.widgetId, e.target.value as any)}
                          className="flex-1 text-xs px-2 py-1 border rounded"
                          style={{ borderColor: '#E2E0DC' }}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>

                        <select
                          value={widget.tab}
                          onChange={e => handleMoveWidget(widget.widgetId, e.target.value)}
                          className="flex-1 text-xs px-2 py-1 border rounded"
                          style={{ borderColor: '#E2E0DC' }}
                        >
                          {tabs.map(tab => (
                            <option key={tab} value={tab}>
                              {tab}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Available Widgets */}
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
              Add Widgets
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableForTab.length === 0 ? (
                <p style={{ color: '#9CA3AF' }}>All available widgets are added</p>
              ) : (
                availableForTab.map(widget => (
                  <button
                    key={widget.id}
                    onClick={() => handleAddWidget(widget.id)}
                    className="w-full text-left px-3 py-2 rounded border hover:bg-gray-50"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    <div className="font-medium text-sm">{widget.name}</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      {widget.category}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <div className="p-6 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
              Profile Preview
            </h3>

            <div className="space-y-4">
              {tabs.map(tab => {
                const tabWidgets = profile.widgets.filter(w => w.tab === tab).sort((a, b) => a.position - b.position)
                return (
                  <div key={tab}>
                    <h4 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
                      {tab}
                    </h4>
                    {tabWidgets.length === 0 ? (
                      <p className="text-sm" style={{ color: '#9CA3AF' }}>
                        No widgets
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {tabWidgets.map(widget => {
                          const widgetInfo = availableWidgets.find(w => w.id === widget.widgetId)
                          const sizeClass = widget.size === 'small' ? 'col-span-1' : widget.size === 'large' ? 'col-span-3' : 'col-span-2'
                          return (
                            <div
                              key={widget.widgetId}
                              className={`${sizeClass} p-3 rounded-lg border`}
                              style={{ backgroundColor: '#F3F4F6', borderColor: '#E2E0DC' }}
                            >
                              <div className="text-sm font-medium" style={{ color: '#0D3133' }}>
                                {widgetInfo?.name}
                              </div>
                              <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                                Position {widget.position + 1} • {widget.size}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
