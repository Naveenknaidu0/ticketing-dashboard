'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, X, Users, User, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserSkillAssignment, SkillLevelModel } from '@/lib/types'

interface UserAssignmentManagerProps {
  assignedUsers: UserSkillAssignment[]
  availableUsers: any[]
  skillLevels: SkillLevelModel[]
  onAssignmentChange: (assignments: UserSkillAssignment[]) => void
}

// Sample users for demo
const SAMPLE_USERS = [
  { id: 'user-1', name: 'Sarah Johnson', email: 'sarah@company.com', department: 'Infrastructure' },
  { id: 'user-2', name: 'Michael Chen', email: 'michael@company.com', department: 'Security' },
  { id: 'user-3', name: 'Emma Williams', email: 'emma@company.com', department: 'Cloud' },
  { id: 'user-4', name: 'James Rodriguez', email: 'james@company.com', department: 'Network' },
  { id: 'user-5', name: 'David Kumar', email: 'david@company.com', department: 'Infrastructure' },
]

export function UserAssignmentManager({
  assignedUsers = [],
  availableUsers = SAMPLE_USERS,
  skillLevels,
  onAssignmentChange,
}: UserAssignmentManagerProps) {
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  const [isPrimary, setIsPrimary] = useState(true)

  const handleAssignUser = () => {
    if (!selectedUser) return

    const newAssignment: UserSkillAssignment = {
      id: `assign-${Date.now()}`,
      userId: selectedUser,
      userName: availableUsers.find(u => u.id === selectedUser)?.name || selectedUser,
      skillId: '',
      skillName: '',
      skillLevel: selectedLevel,
      isPrimary,
      isSecondary: !isPrimary,
      yearsExperience: 1,
      certifications: [],
      assignedDate: new Date().toISOString(),
      assignedBy: 'admin',
      lastReviewedDate: new Date().toISOString(),
      lastReviewedBy: 'admin',
      status: 'active',
    }

    onAssignmentChange([...assignedUsers, newAssignment])
    setSelectedUser('')
    setSelectedLevel(1)
    setIsPrimary(true)
    setShowAssignForm(false)
  }

  const handleRemoveAssignment = (assignmentId: string) => {
    onAssignmentChange(assignedUsers.filter(a => a.id !== assignmentId))
  }

  const handleUpdateLevel = (assignmentId: string, newLevel: number) => {
    onAssignmentChange(
      assignedUsers.map(a =>
        a.id === assignmentId ? { ...a, skillLevel: newLevel } : a
      )
    )
  }

  const unassignedUsers = availableUsers.filter(u => !assignedUsers.some(a => a.userId === u.id))

  const getLevelName = (level: number) => {
    return skillLevels.find(l => l.order === level)?.name || `Level ${level}`
  }

  return (
    <div className="space-y-4">
      {/* Assigned Users */}
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#0D3133' }}>
          <Users className="w-4 h-4" />
          Assigned Users ({assignedUsers.length})
        </h4>

        {assignedUsers.length === 0 ? (
          <p className="text-sm" style={{ color: '#9CA3AF' }}>No users assigned yet</p>
        ) : (
          <div className="space-y-2">
            {assignedUsers.map(assignment => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 border rounded-lg"
                style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="w-4 h-4" style={{ color: '#0D3133' }} />
                    </div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: '#0D3133' }}>
                        {assignment.userName}
                      </p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        {assignment.isPrimary ? 'Primary' : 'Secondary'} • {assignment.yearsExperience} years experience
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={assignment.skillLevel}
                    onChange={(e) => handleUpdateLevel(assignment.id, parseInt(e.target.value))}
                    className="px-2 py-1 border rounded text-sm"
                    style={{ borderColor: '#E2E0DC' }}
                  >
                    {skillLevels.map(level => (
                      <option key={level.id} value={level.order}>
                        {level.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRemoveAssignment(assignment.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Form */}
      {!showAssignForm ? (
        <Button
          onClick={() => setShowAssignForm(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Assign User
        </Button>
      ) : (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Select User</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="">Choose a user...</option>
                {unassignedUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Proficiency Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                {skillLevels.map(level => (
                  <option key={level.id} value={level.order}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isPrimary" className="text-sm" style={{ color: '#0D3133' }}>
                Mark as Primary Skill
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAssignUser}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Check className="w-4 h-4" />
                Assign
              </Button>
              <Button
                onClick={() => {
                  setShowAssignForm(false)
                  setSelectedUser('')
                  setSelectedLevel(1)
                  setIsPrimary(true)
                }}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {assignedUsers.length > 0 && (
        <div className="border-t pt-4 flex gap-2" style={{ borderColor: '#E2E0DC' }}>
          <Button
            className="flex-1 text-xs"
            style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
          >
            Bulk Update Level
          </Button>
          <Button
            className="flex-1 text-xs"
            style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
          >
            Bulk Remove
          </Button>
        </div>
      )}
    </div>
  )
}
