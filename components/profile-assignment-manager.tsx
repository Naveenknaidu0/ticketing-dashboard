'use client'

import { useState } from 'react'
import { Plus, Edit2, Copy, Archive, Trash2, Users, AlertCircle } from 'lucide-react'
import { profileBuilderEngine, type DashboardProfile } from '@/lib/profile-builder-engine'
import { profileAssignmentEngine } from '@/lib/profile-assignment-engine'
import { profileDependencyEngine } from '@/lib/profile-dependency-engine'

export function ProfileAssignmentManager() {
  const [profiles, setProfiles] = useState<DashboardProfile[]>(profileBuilderEngine.getAllProfiles())
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [newProfileData, setNewProfileData] = useState({
    name: '',
    description: '',
    defaultDashboard: 'default',
  })

  const handleCreateProfile = () => {
    if (!newProfileData.name) {
      alert('Profile name is required')
      return
    }

    profileBuilderEngine.createProfile({
      name: newProfileData.name,
      description: newProfileData.description,
      defaultDashboard: newProfileData.defaultDashboard,
      userId: 'current-user',
    })

    setProfiles(profileBuilderEngine.getAllProfiles())
    setNewProfileData({ name: '', description: '', defaultDashboard: 'default' })
    setShowCreateModal(false)
  }

  const handlePublishProfile = (profileId: string) => {
    profileBuilderEngine.publishProfile(profileId, 'current-user')
    setProfiles(profileBuilderEngine.getAllProfiles())
  }

  const handleArchiveProfile = (profileId: string) => {
    profileBuilderEngine.archiveProfile(profileId, 'current-user')
    setProfiles(profileBuilderEngine.getAllProfiles())
  }

  const handleCloneProfile = (profileId: string) => {
    const newName = prompt('Enter new profile name:')
    if (newName) {
      profileBuilderEngine.cloneProfile(profileId, newName, 'current-user')
      setProfiles(profileBuilderEngine.getAllProfiles())
    }
  }

  const handleDeleteProfile = (profileId: string) => {
    const validation = profileDependencyEngine.canDeleteProfile(profileId)

    if (!validation.canDelete) {
      alert(`Cannot delete: ${validation.reason}`)
      return
    }

    if (confirm('Delete this profile? This action cannot be undone.')) {
      profileBuilderEngine.archiveProfile(profileId, 'current-user')
      setProfiles(profileBuilderEngine.getAllProfiles())
    }
  }

  const getAssignmentCounts = (profileId: string) => {
    const assignments = profileAssignmentEngine.getAssignmentsForProfile(profileId)
    return {
      roles: assignments.roles.length,
      teams: assignments.teams.length,
      users: assignments.users.length,
      total: assignments.roles.length + assignments.teams.length + assignments.users.length,
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            Dashboard Profiles
          </h2>
          <p style={{ color: '#6B6B6B' }}>Manage dashboard profiles and assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Create Profile
        </button>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full space-y-4"
            style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
          >
            <h3 className="text-lg font-bold" style={{ color: '#0D3133' }}>
              Create New Profile
            </h3>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>
                Profile Name
              </label>
              <input
                type="text"
                value={newProfileData.name}
                onChange={e => setNewProfileData({ ...newProfileData, name: e.target.value })}
                placeholder="e.g., L1 Agent Dashboard"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>
                Description
              </label>
              <textarea
                value={newProfileData.description}
                onChange={e => setNewProfileData({ ...newProfileData, description: e.target.value })}
                placeholder="Describe this profile..."
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleCreateProfile}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                Create
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profiles Table */}
      <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <table className="w-full">
          <thead style={{ backgroundColor: '#F9F7F4' }}>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>
                Profile Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>
                Assignments
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>
                Created
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold" style={{ color: '#0D3133' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile, idx) => {
              const counts = getAssignmentCounts(profile.id)
              const validation = profileDependencyEngine.canDeleteProfile(profile.id)

              return (
                <tr key={profile.id} style={{ borderTop: idx > 0 ? '1px solid #E2E0DC' : 'none' }}>
                  <td className="px-6 py-3" style={{ color: '#0D3133' }}>
                    <div>
                      <div className="font-medium">{profile.name}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>
                        {profile.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: profile.status === 'active' ? '#D1FAE5' : '#FEF3C7',
                        color: profile.status === 'active' ? '#065F46' : '#92400E',
                      }}
                    >
                      {profile.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: '#6B6B6B' }}>
                    <div className="flex items-center gap-3">
                      <div>Roles: {counts.roles}</div>
                      <div>Teams: {counts.teams}</div>
                      <div>Users: {counts.users}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: '#9CA3AF' }}>
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 flex gap-2 justify-center">
                    {profile.status === 'draft' && (
                      <button
                        onClick={() => handlePublishProfile(profile.id)}
                        className="px-3 py-1 rounded text-xs font-medium"
                        style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                        title="Publish"
                      >
                        Publish
                      </button>
                    )}

                    <button
                      onClick={() => handleCloneProfile(profile.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Clone"
                    >
                      <Copy className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                    </button>

                    <button
                      onClick={() => {
                        if (!validation.canDelete && validation.dependencies.length > 0) {
                          alert(`Cannot delete: ${validation.reason}`)
                        } else {
                          handleArchiveProfile(profile.id)
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Archive"
                    >
                      <Archive className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    </button>

                    {validation.canDelete && (
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="p-2 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* No Profiles Message */}
      {profiles.length === 0 && (
        <div className="text-center py-16 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#D1D5DB' }} />
          <p style={{ color: '#9CA3AF' }}>No profiles created yet. Create one to get started.</p>
        </div>
      )}
    </div>
  )
}
