'use client'

import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { profileAssignmentEngine } from '@/lib/profile-assignment-engine'
import { profileBuilderEngine } from '@/lib/profile-builder-engine'

const AVAILABLE_ROLES = [
  { id: 'l1-agent', label: 'L1 Agent' },
  { id: 'l2-agent', label: 'L2 Agent' },
  { id: 'l3-agent', label: 'L3 Agent' },
  { id: 'manager', label: 'Manager' },
  { id: 'team-lead', label: 'Team Lead' },
  { id: 'admin', label: 'Admin' },
]

const AVAILABLE_TEAMS = [
  { id: 'network', label: 'Network Team' },
  { id: 'security', label: 'Security Team' },
  { id: 'infrastructure', label: 'Infrastructure Team' },
  { id: 'cloud', label: 'Cloud Team' },
  { id: 'application', label: 'Application Team' },
]

interface ProfileRoleAssignmentProps {
  profileId: string
}

export function ProfileRoleAssignment({ profileId }: ProfileRoleAssignmentProps) {
  const profile = profileBuilderEngine.getProfile(profileId)
  const assignments = profileAssignmentEngine.getAssignmentsForProfile(profileId)

  if (!profile) return <div>Profile not found</div>

  const assignedRoles = assignments.roles.map(a => a.targetId)
  const assignedTeams = assignments.teams.map(a => a.targetId)
  const assignedUsers = assignments.users.map(a => a.targetId)

  const handleAddRole = (roleId: string) => {
    profileAssignmentEngine.assignToRole(profileId, roleId, 'current-user')
  }

  const handleAddTeam = (teamId: string) => {
    profileAssignmentEngine.assignToTeam(profileId, teamId, 'current-user')
  }

  const handleRemoveRole = (assignmentId: string) => {
    profileAssignmentEngine.removeAssignment(assignmentId, 'current-user')
  }

  return (
    <div className="space-y-6">
      {/* Role Assignment */}
      <div className="border rounded-lg p-6" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Role Assignment
        </h3>

        {/* Assigned Roles */}
        {assignedRoles.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Assigned Roles
            </h4>
            <div className="flex flex-wrap gap-2">
              {assignments.roles.map(assignment => {
                const role = AVAILABLE_ROLES.find(r => r.id === assignment.targetId)
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-2 px-3 py-1 rounded"
                    style={{ backgroundColor: '#D1FAE5' }}
                  >
                    <span style={{ color: '#065F46', fontSize: '0.875rem' }}>{role?.label}</span>
                    <button
                      onClick={() => handleRemoveRole(assignment.id)}
                      className="ml-1 p-0.5 hover:bg-white rounded"
                    >
                      <X className="w-3 h-3" style={{ color: '#065F46' }} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Roles to Add */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
            Add Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_ROLES.filter(r => !assignedRoles.includes(r.id)).map(role => (
              <button
                key={role.id}
                onClick={() => handleAddRole(role.id)}
                className="flex items-center gap-2 px-3 py-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC' }}
              >
                <Plus className="w-4 h-4" style={{ color: '#E69F50' }} />
                {role.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Team Assignment */}
      <div className="border rounded-lg p-6" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Team Assignment
        </h3>

        {/* Assigned Teams */}
        {assignedTeams.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Assigned Teams
            </h4>
            <div className="flex flex-wrap gap-2">
              {assignments.teams.map(assignment => {
                const team = AVAILABLE_TEAMS.find(t => t.id === assignment.targetId)
                return (
                  <div
                    key={assignment.id}
                    className="flex items-center gap-2 px-3 py-1 rounded"
                    style={{ backgroundColor: '#DBEAFE' }}
                  >
                    <span style={{ color: '#0C4A6E', fontSize: '0.875rem' }}>{team?.label}</span>
                    <button
                      onClick={() => handleRemoveRole(assignment.id)}
                      className="ml-1 p-0.5 hover:bg-white rounded"
                    >
                      <X className="w-3 h-3" style={{ color: '#0C4A6E' }} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Available Teams to Add */}
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
            Add Team
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_TEAMS.filter(t => !assignedTeams.includes(t.id)).map(team => (
              <button
                key={team.id}
                onClick={() => handleAddTeam(team.id)}
                className="flex items-center gap-2 px-3 py-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC' }}
              >
                <Plus className="w-4 h-4" style={{ color: '#E69F50' }} />
                {team.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Assignment Info */}
      <div className="border rounded-lg p-6" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#0D3133' }}>
          Individual User Assignments
        </h3>
        <p style={{ color: '#6B6B6B', marginBottom: '1rem' }}>
          {assignedUsers.length} user(s) have individual assignments to this profile (highest priority - overrides role/team)
        </p>

        {assignedUsers.length > 0 && (
          <div className="space-y-2">
            {assignments.users.map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between px-3 py-2 rounded border"
                style={{ borderColor: '#FED7AA', backgroundColor: '#FEF3C7' }}
              >
                <span style={{ color: '#92400E', fontSize: '0.875rem' }}>User: {assignment.targetId}</span>
                <button
                  onClick={() => handleRemoveRole(assignment.id)}
                  className="p-0.5 hover:bg-yellow-100 rounded"
                >
                  <X className="w-3 h-3" style={{ color: '#92400E' }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
