'use client'

import { useState } from 'react'
import { X, Plus, Trash2, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SkillComplete, SkillLevelModel, SkillCertification, UserSkillAssignment } from '@/lib/types'
import { DEFAULT_SKILL_LEVELS, SKILL_CATEGORIES } from '@/lib/skill-engine'
import { UserAssignmentManager } from './user-assignment-manager'
import { CertificationManager } from './certification-manager'

interface SkillConfigurationModalProps {
  isOpen: boolean
  skill?: SkillComplete
  onClose: () => void
  onSave: (skill: SkillComplete) => void
  isNew?: boolean
}

export function SkillConfigurationModal({
  isOpen,
  skill,
  onClose,
  onSave,
  isNew = false,
}: SkillConfigurationModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'proficiency' | 'users' | 'certification' | 'eligibility' | 'queues' | 'rules' | 'automations'>('general')
  
  // General tab state
  const [formData, setFormData] = useState({
    name: skill?.name || '',
    code: skill?.code || '',
    description: skill?.description || '',
    category: skill?.category || '',
    parentSkill: skill?.parentSkill || '',
    status: skill?.status || 'draft' as const,
  })

  // Proficiency levels state
  const [levels, setLevels] = useState<SkillLevelModel[]>(skill?.levelModel || [...DEFAULT_SKILL_LEVELS])
  const [newLevelName, setNewLevelName] = useState('')

  // User assignments state
  const [assignedUsers, setAssignedUsers] = useState<UserSkillAssignment[]>(skill?.assignedUsers || [])

  // Certifications state
  const [certifications, setCertifications] = useState<SkillCertification[]>(skill?.certifications || [])

  const handleSave = () => {
    const updatedSkill: SkillComplete = {
      ...skill || {
        id: `skill-${Date.now()}`,
        assignedUsers: [],
        eligibility: {} as any,
        queueMappings: [],
        ruleMappings: [],
        automationMappings: [],
        usageAnalytics: {} as any,
        versionHistory: [],
        auditLog: [],
      },
      ...formData,
      levelModel: levels,
      certifications,
      assignedUsers,
      totalAssignedUsers: assignedUsers.length,
      version: (skill?.version || 0) + 1,
      updatedAt: new Date().toISOString(),
    }
    onSave(updatedSkill)
    onClose()
  }

  const handleAddLevel = () => {
    if (!newLevelName.trim()) return
    
    const newLevel: SkillLevelModel = {
      id: `level-${Date.now()}`,
      skillId: skill?.id || '',
      name: newLevelName,
      description: '',
      requirements: [],
      order: levels.length + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    setLevels([...levels, newLevel])
    setNewLevelName('')
  }

  const handleRemoveLevel = (levelId: string) => {
    setLevels(levels.filter(l => l.id !== levelId))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create Skill' : `Edit Skill: ${skill?.name}`}</DialogTitle>
          <DialogDescription>
            Configure skill details, proficiency levels, user assignments, and mappings
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-0 border-b flex-wrap" style={{ borderColor: '#E2E0DC' }}>
          {[
            { id: 'general' as const, label: 'General' },
            { id: 'proficiency' as const, label: 'Proficiency Levels' },
            { id: 'users' as const, label: 'User Assignments' },
            { id: 'certification' as const, label: 'Certifications' },
            { id: 'eligibility' as const, label: 'Eligibility' },
            { id: 'queues' as const, label: 'Queues' },
            { id: 'rules' as const, label: 'Rules' },
            { id: 'automations' as const, label: 'Automations' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
                color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="py-6 space-y-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Skill Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                  placeholder="e.g., Network Engineering"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Skill Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                  placeholder="e.g., NETWORK_ENG"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                  rows={3}
                  placeholder="Describe this skill..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                >
                  <option value="">Select a category</option>
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          )}

          {/* Proficiency Levels Tab */}
          {activeTab === 'proficiency' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: '#0D3133' }}>Proficiency Levels</h4>
                <div className="space-y-2">
                  {levels.map((level, idx) => (
                    <div key={level.id} className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                      <div>
                        <p className="font-medium" style={{ color: '#0D3133' }}>{level.name}</p>
                        <p className="text-sm" style={{ color: '#6B6B6B' }}>{level.description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveLevel(level.id)}
                        className="p-2 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Add Custom Level</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLevelName}
                    onChange={(e) => setNewLevelName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg"
                    style={{ borderColor: '#E2E0DC' }}
                    placeholder="e.g., L1 Support"
                  />
                  <Button
                    onClick={handleAddLevel}
                    className="flex items-center gap-2"
                    style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <UserAssignmentManager
              assignedUsers={assignedUsers}
              availableUsers={[]}
              skillLevels={levels}
              onAssignmentChange={setAssignedUsers}
            />
          )}

          {/* Certification Tab */}
          {activeTab === 'certification' && (
            <CertificationManager
              certifications={certifications}
              onCertificationChange={setCertifications}
            />
          )}

          {/* Eligibility Tab */}
          {activeTab === 'eligibility' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Minimum Skill Level for Assignment</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                >
                  <option>Any Level</option>
                  {levels.map(level => (
                    <option key={level.id} value={level.order}>{level.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Required Certifications</label>
                <div className="space-y-2">
                  {certifications.filter(c => c.isRequired).map(cert => (
                    <div key={cert.id} className="flex items-center gap-2 p-2 border rounded" style={{ borderColor: '#E2E0DC' }}>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm" style={{ color: '#0D3133' }}>{cert.name} ({cert.provider})</span>
                    </div>
                  ))}
                  {certifications.filter(c => c.isRequired).length === 0 && (
                    <p className="text-sm" style={{ color: '#9CA3AF' }}>No required certifications</p>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: '#0D3133' }}>
                  <input type="checkbox" className="w-4 h-4" />
                  Automatically verify certification expiry
                </label>
              </div>
            </div>
          )}

          {/* Queues Tab */}
          {activeTab === 'queues' && (
            <div className="p-8 text-center" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.5rem' }}>
              <AlertCircle className="w-12 h-12 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
              <p style={{ color: '#6B6B6B' }}>Configure which queues require this skill. Available after skill creation.</p>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="p-8 text-center" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.5rem' }}>
              <AlertCircle className="w-12 h-12 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
              <p style={{ color: '#6B6B6B' }}>Configure assignment rules that depend on this skill. Available after skill creation.</p>
            </div>
          )}

          {/* Automations Tab */}
          {activeTab === 'automations' && (
            <div className="p-8 text-center" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.5rem' }}>
              <AlertCircle className="w-12 h-12 mx-auto mb-2" style={{ color: '#9CA3AF' }} />
              <p style={{ color: '#6B6B6B' }}>Configure automations that depend on this skill. Available after skill creation.</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 justify-end border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <Button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            Save Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
