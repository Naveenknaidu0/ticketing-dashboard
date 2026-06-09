'use client'

import { useState } from 'react'
import { Users, Plus, Trash2, Copy, Check } from 'lucide-react'
import { profileAssignmentEngine } from '@/lib/profile-assignment-engine'
import { profileBuilderEngine } from '@/lib/profile-builder-engine'

const AVAILABLE_ROLES = [
  { id: 'agent', label: 'Agent' },
  { id: 'l1-agent', label: 'L1 Agent' },
  { id: 'l2-agent', label: 'L2 Agent' },
  { id: 'l3-agent', label: 'L3 Agent' },
  { id: 'manager', label: 'Manager' },
  { id: 'admin', label: 'Admin' },
]

const AVAILABLE_TEAMS = [
  { id: 'network', label: 'Network Team' },
  { id: 'security', label: 'Security Team' },
  { id: 'infrastructure', label: 'Infrastructure Team' },
  { id: 'cloud', label: 'Cloud Team' },
  { id: 'application', label: 'Application Team' },
]

export function DashboardProfileAssignment() {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [assignmentType, setAssignmentType] = useState<'role' | 'team' | 'user'>('role')
  const [targetId, setTargetId] = useState('')
  const [profiles, setProfiles] = useState(profileBuilderEngine.getAllProfiles())

  const handleAssign = () => {
    if (!selectedProfile || !targetId) {
      alert('Please select a profile and target')
      return
    }

    if (assignmentType === 'role') {
      profileAssignmentEngine.assignToRole(selectedProfile, targetId, 'current-user')
    } else if (assignmentType === 'team') {
      profileAssignmentEngine.assignToTeam(selectedProfile, targetId, 'current-user')
    }

    setTargetId('')
    setProfiles(profileBuilderEngine.getAllProfiles())
  }

  const getAssignmentCounts = (profileId: string) => {
    const assignments = profileAssignmentEngine.getAssignmentsForProfile(profileId)
    return {
      roles: assignments.roles.length,
      teams: assignments.teams.length,
      users: assignments.users.length,
    }
  }

  const selectedProfileData = profiles.find(p => p.id === selectedProfile)
  const selectedAssignments = selectedProfile ? profileAssignmentEngine.getAssignmentsForProfile(selectedProfile) : null

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Profile Selection */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Select Profile
        </h3>
        <div className="space-y-2">
          {profiles.map(profile => {
            const counts = getAssignmentCounts(profile.id)
            return (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className="w-full text-left px-4 py-3 rounded-lg border-2 transition-all"
                style={{
                  borderColor: selectedProfile === profile.id ? '#E69F50' : '#E2E0DC',
                  backgroundColor: selectedProfile === profile.id ? '#FEF3C7' : '#FFFFFF',
                }}
              >
                <div style={{ color: '#0D3133', fontWeight: 500 }}>{profile.name}</div>
                <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  Roles: {counts.roles} | Teams: {counts.teams} | Users: {counts.users}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Assignment Configuration */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Assign Profile
        </h3>

        {!selectedProfile ? (
          <p style={{ color: '#9CA3AF' }}>Select a profile first</p>
        ) : (
          <div className="space-y-4">
            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Assignment Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['role', 'team'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setAssignmentType(type as 'role' | 'team')
                      setTargetId('')
                    }}
                    className="px-3 py-2 rounded text-sm font-medium border"
                    style={{
                      backgroundColor: assignmentType === type ? '#E69F50' : '#FFFFFF',
                      color: assignmentType === type ? '#FFFFFF' : '#6B6B6B',
                      borderColor: '#E2E0DC',
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Select Target
              </label>
              <select
                value={targetId}
                onChange={e => setTargetId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="">Choose {assignmentType}...</option>
                {(assignmentType === 'role' ? AVAILABLE_ROLES : AVAILABLE_TEAMS).map(item => {
                  const isAssigned =
                    assignmentType === 'role'
                      ? selectedAssignments?.roles.some(a => a.targetId === item.id)
                      : selectedAssignments?.teams.some(a => a.targetId === item.id)

                  return (
                    <option key={item.id} value={item.id} disabled={isAssigned}>
                      {item.label} {isAssigned ? '(Assigned)' : ''}
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Assign Button */}
            <button
              onClick={handleAssign}
              className="w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
            >
              <Plus className="w-4 h-4" />
              Assign Profile
            </button>
          </div>
        )}
      </div>

      {/* Current Assignments */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
      >
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Current Assignments
        </h3>

        {!selectedProfile ? (
          <p style={{ color: '#9CA3AF' }}>Select a profile to view assignments</p>
        ) : (
          <div className="space-y-4">
            {/* Roles */}
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Roles ({selectedAssignments?.roles.length || 0})
              </h4>
              {selectedAssignments?.roles.length === 0 ? (
                <p className="text-xs" style={{ color: '#D1D5DB' }}>
                  No role assignments
                </p>
              ) : (
                <div className="space-y-1">
                  {selectedAssignments?.roles.map(assignment => {
                    const role = AVAILABLE_ROLES.find(r => r.id === assignment.targetId)
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between px-2 py-1 rounded text-sm"
                        style={{ backgroundColor: '#F3F4F6' }}
                      >
                        <span style={{ color: '#0D3133' }}>{role?.label}</span>
                        <button
                          onClick={() => {
                            profileAssignmentEngine.removeAssignment(assignment.id, 'current-user')
                            setProfiles(profileBuilderEngine.getAllProfiles())
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3" style={{ color: '#EF4444' }} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Teams */}
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Teams ({selectedAssignments?.teams.length || 0})
              </h4>
              {selectedAssignments?.teams.length === 0 ? (
                <p className="text-xs" style={{ color: '#D1D5DB' }}>
                  No team assignments
                </p>
              ) : (
                <div className="space-y-1">
                  {selectedAssignments?.teams.map(assignment => {
                    const team = AVAILABLE_TEAMS.find(t => t.id === assignment.targetId)
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between px-2 py-1 rounded text-sm"
                        style={{ backgroundColor: '#F3F4F6' }}
                      >
                        <span style={{ color: '#0D3133' }}>{team?.label}</span>
                        <button
                          onClick={() => {
                            profileAssignmentEngine.removeAssignment(assignment.id, 'current-user')
                            setProfiles(profileBuilderEngine.getAllProfiles())
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3" style={{ color: '#EF4444' }} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Users */}
            <div>
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Users ({selectedAssignments?.users.length || 0})
              </h4>
              {selectedAssignments?.users.length === 0 ? (
                <p className="text-xs" style={{ color: '#D1D5DB' }}>
                  No user assignments
                </p>
              ) : (
                <div className="space-y-1">
                  {selectedAssignments?.users.map(assignment => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between px-2 py-1 rounded text-sm"
                      style={{ backgroundColor: '#FEF3C7' }}
                    >
                      <span style={{ color: '#92400E' }}>User: {assignment.targetId}</span>
                      <button
                        onClick={() => {
                          profileAssignmentEngine.removeAssignment(assignment.id, 'current-user')
                          setProfiles(profileBuilderEngine.getAllProfiles())
                        }}
                        className="p-1 hover:bg-yellow-100 rounded"
                      >
                        <Trash2 className="w-3 h-3" style={{ color: '#EF4444' }} />
                      </button>
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
