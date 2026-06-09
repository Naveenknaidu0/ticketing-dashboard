'use client'

import { useState } from 'react'
import { Plus, Edit2, Archive, Trash2 } from 'lucide-react'
import { profileBuilderEngine, type DashboardProfile } from '@/lib/profile-builder-engine'
import { ProfileEditor } from './profile-editor'

type ViewMode = 'list' | 'edit' | 'create'

export function DashboardProfileManager() {
  const [profiles, setProfiles] = useState(profileBuilderEngine.getAllProfiles())
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)

  const handleCreateNew = () => {
    setViewMode('create')
    setSelectedProfileId(null)
  }

  const handleEditProfile = (profileId: string) => {
    setSelectedProfileId(profileId)
    setViewMode('edit')
  }

  const handleSaveProfile = (profile: DashboardProfile) => {
    setProfiles(profileBuilderEngine.getAllProfiles())
  }

  const handleCloseEditor = () => {
    setViewMode('list')
    setSelectedProfileId(null)
    setProfiles(profileBuilderEngine.getAllProfiles())
  }

  const handleArchiveProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Archive this profile?')) {
      profileBuilderEngine.archiveProfile(profileId)
      setProfiles(profileBuilderEngine.getAllProfiles())
    }
  }

  const handleDeleteProfile = (profileId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Permanently delete this profile?')) {
      profileBuilderEngine.deleteProfile(profileId)
      setProfiles(profileBuilderEngine.getAllProfiles())
    }
  }

  const dashboards = profileBuilderEngine.getAvailableDashboards()
  const getDashboardName = (dashboardId: string) => {
    return dashboards.find(d => d.id === dashboardId)?.name || dashboardId
  }

  const activeProfiles = profiles.filter(p => p.status !== 'archived')
  const archivedProfiles = profiles.filter(p => p.status === 'archived')

  // Show editor when in edit or create mode
  if (viewMode === 'create') {
    return <ProfileCreator onClose={handleCloseEditor} onSave={handleSaveProfile} />
  }

  if (viewMode === 'edit' && selectedProfileId) {
    return <ProfileEditor profileId={selectedProfileId} onClose={handleCloseEditor} onSave={handleSaveProfile} />
  }

  // Show list view
  return (
    <div className="space-y-6">
      {/* Create Button */}
      <button
        onClick={handleCreateNew}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
        style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
      >
        <Plus className="w-4 h-4" />
        Create New Profile
      </button>

      {/* Active Profiles */}
      {activeProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
            Active Profiles ({activeProfiles.length})
          </h3>
          <div className="grid gap-3">
            {activeProfiles.map(profile => (
              <div
                key={profile.id}
                onClick={() => handleEditProfile(profile.id)}
                className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-shadow"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold" style={{ color: '#0D3133' }}>
                      {profile.name}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                      {profile.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditProfile(profile.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit profile"
                    >
                      <Edit2 className="w-4 h-4" style={{ color: '#E69F50' }} />
                    </button>
                    <button
                      onClick={e => handleArchiveProfile(profile.id, e)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Archive profile"
                    >
                      <Archive className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </button>
                    <button
                      onClick={e => handleDeleteProfile(profile.id, e)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs mt-3" style={{ color: '#9CA3AF' }}>
                  <span>Dashboard: {getDashboardName(profile.dashboardId)}</span>
                  <span>Widgets: {profile.widgets.length}</span>
                  <span>Status: {profile.status === 'active' ? '✓ Published' : 'Draft'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archived Profiles */}
      {archivedProfiles.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
            Archived Profiles ({archivedProfiles.length})
          </h3>
          <div className="grid gap-3 opacity-60">
            {archivedProfiles.map(profile => (
              <div
                key={profile.id}
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold" style={{ color: '#0D3133' }}>
                      {profile.name}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                      {profile.description}
                    </p>
                  </div>
                  <button
                    onClick={e => handleDeleteProfile(profile.id, e)}
                    className="p-2 hover:bg-red-50 rounded-lg"
                    title="Delete profile"
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {profiles.length === 0 && (
        <div className="p-12 text-center rounded-lg border" style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}>
          <p style={{ color: '#9CA3AF' }}>No profiles yet. Create one to get started.</p>
        </div>
      )}
    </div>
  )
}

/**
 * Profile Creator - Modal-like component for creating new profiles
 */
function ProfileCreator({ onClose, onSave }: { onClose: () => void; onSave: (profile: DashboardProfile) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dashboardId: 'agent-personal',
  })
  const [isCreating, setIsCreating] = useState(false)

  const dashboards = profileBuilderEngine.getAvailableDashboards()

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a profile name')
      return
    }

    setIsCreating(true)
    try {
      const newProfile = profileBuilderEngine.createProfile({
        name: formData.name,
        description: formData.description,
        dashboardId: formData.dashboardId as any,
        userId: 'current-user',
      })

      onSave(newProfile)
      onClose()
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
          Create New Profile
        </h2>
      </div>

      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
            Profile Name <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Support Team Dashboard"
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
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the purpose of this profile"
            className="w-full px-3 py-2 border rounded-lg h-24"
            style={{ borderColor: '#E2E0DC' }}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
            Dashboard Type <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <select
            value={formData.dashboardId}
            onChange={e => setFormData(prev => ({ ...prev, dashboardId: e.target.value }))}
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

        <div className="flex gap-3 pt-4">
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex-1 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            {isCreating ? 'Creating...' : 'Create Profile'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg font-medium border"
            style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
