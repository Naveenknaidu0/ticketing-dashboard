'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QueueEditDialogProps {
  isOpen: boolean
  queue: any
  onClose: () => void
  onSave: (updatedQueue: any, isDraft: boolean) => void
}

const QUEUE_TYPES = ['support', 'assignment', 'escalation', 'vip', 'overflow', 'approval', 'custom']
const DEPARTMENTS = ['Support', 'Billing', 'Technical', 'Management', 'Operations', 'Sales']
const BUSINESS_UNITS = ['Operations', 'Finance', 'Engineering', 'Customer Success']
const AVAILABLE_AGENTS = [
  'Sarah Johnson', 'John Smith', 'Michael Chen', 'Lisa Anderson',
  'James Rodriguez', 'Emma Williams', 'David Kumar', 'Alex Taylor'
]
const AVAILABLE_SKILLS = [
  { id: 'skill-general', name: 'General Support' },
  { id: 'skill-technical', name: 'Technical Support' },
  { id: 'skill-billing', name: 'Billing Management' },
  { id: 'skill-network', name: 'Network Support' },
  { id: 'skill-security', name: 'Security Operations' },
  { id: 'skill-database', name: 'Database Support' },
  { id: 'skill-cloud', name: 'Cloud Services' },
  { id: 'skill-application', name: 'Application Support' },
]
const ASSIGNMENT_STRATEGIES = ['round-robin', 'least-workload', 'skill-based', 'capacity-based', 'availability', 'hybrid']
const STATUS_OPTIONS = ['draft', 'active', 'disabled', 'archived']

export function QueueEditDialog({ isOpen, queue, onClose, onSave }: QueueEditDialogProps) {
  const [step, setStep] = useState(1)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState(queue ? {
    name: queue.name || '',
    queueCode: queue.queueCode || '',
    description: queue.description || '',
    queueType: queue.queueType || 'support',
    department: queue.department || 'Support',
    businessUnit: queue.businessUnit || 'Operations',
    owner: queue.owner || 'Sarah Johnson',
    backupOwner: queue.backupOwner || '',
    status: queue.status || 'active',
    members: queue.members || [],
    maxOpenTickets: queue.capacity?.maxOpenTickets || 50,
    maxCritical: queue.capacity?.maxCritical || 5,
    maxHigh: queue.capacity?.maxHigh || 10,
    maxSlaRisk: queue.capacity?.maxSlaRisk || 8,
    maxDailyAssignments: queue.capacity?.maxDailyAssignments || 100,
    maxConcurrent: queue.capacity?.maxConcurrent || 10,
    businessHoursMode: queue.businessHours?.mode || '24x7',
    startTime: queue.businessHours?.startTime || '09:00',
    endTime: queue.businessHours?.endTime || '17:00',
    selectedSkills: queue.skills || [],
    assignmentStrategy: queue.assignmentStrategy || 'round-robin',
    escalationQueue: queue.escalation?.escalationQueue || '',
    escalationTeam: queue.escalation?.escalationTeam || '',
    escalationOwner: queue.escalation?.escalationOwner || '',
  } : {})

  if (!isOpen || !queue) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleAddMember = (agentName: string) => {
    const newMember = {
      userId: `user-${Date.now()}`,
      name: agentName,
      role: 'agent' as const,
    }
    handleInputChange('members', [...formData.members, newMember])
  }

  const handleRemoveMember = (userId: string) => {
    handleInputChange('members', formData.members.filter((m: any) => m.userId !== userId))
  }

  const handleAddSkill = (skill: any) => {
    const newSkill = {
      skillId: skill.id,
      skillName: skill.name,
      minimumLevel: 1,
      required: false,
    }
    handleInputChange('selectedSkills', [...formData.selectedSkills, newSkill])
  }

  const handleRemoveSkill = (skillId: string) => {
    handleInputChange('selectedSkills', formData.selectedSkills.filter((s: any) => s.skillId !== skillId))
  }

  const handleSave = (isDraft: boolean) => {
    const validation = validateForm()
    if (!validation.valid) {
      alert(`Validation Error: ${validation.errors.join(', ')}`)
      return
    }

    const updatedQueue = {
      ...queue,
      name: formData.name,
      queueCode: formData.queueCode,
      description: formData.description,
      queueType: formData.queueType,
      department: formData.department,
      businessUnit: formData.businessUnit,
      owner: formData.owner,
      backupOwner: formData.backupOwner,
      status: isDraft ? 'draft' : formData.status,
      members: formData.members,
      capacity: {
        maxOpenTickets: formData.maxOpenTickets,
        maxCritical: formData.maxCritical,
        maxHigh: formData.maxHigh,
        maxSlaRisk: formData.maxSlaRisk,
        maxDailyAssignments: formData.maxDailyAssignments,
        maxConcurrent: formData.maxConcurrent,
      },
      businessHours: {
        mode: formData.businessHoursMode,
        startTime: formData.startTime,
        endTime: formData.endTime,
        timezone: 'UTC',
      },
      skills: formData.selectedSkills,
      assignmentStrategy: formData.assignmentStrategy,
      escalation: {
        escalationQueue: formData.escalationQueue,
        escalationTeam: formData.escalationTeam,
        escalationOwner: formData.escalationOwner,
        escalationConditions: [],
      },
      version: (queue.version || 1) + 1,
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedQueue, isDraft)
  }

  const validateForm = () => {
    const errors = []
    if (!formData.name?.trim()) errors.push('Queue name is required')
    if (!formData.queueCode?.trim()) errors.push('Queue code is required')
    if (formData.maxOpenTickets <= 0) errors.push('Max open tickets must be positive')
    if (formData.maxCritical <= 0) errors.push('Max critical must be positive')
    return { valid: errors.length === 0, errors }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>General Information</h3>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Queue Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Technical Support"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Queue Code</label>
              <Input
                value={formData.queueCode}
                onChange={(e) => handleInputChange('queueCode', e.target.value)}
                placeholder="e.g., TECH-001"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Description</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Queue description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Type</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.queueType}
                  onChange={(e) => handleInputChange('queueType', e.target.value)}
                >
                  {QUEUE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Status</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {STATUS_OPTIONS.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Department</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                >
                  {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Business Unit</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.businessUnit}
                  onChange={(e) => handleInputChange('businessUnit', e.target.value)}
                >
                  {BUSINESS_UNITS.map(bu => <option key={bu} value={bu}>{bu}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Queue Owner</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.owner}
                  onChange={(e) => handleInputChange('owner', e.target.value)}
                >
                  {AVAILABLE_AGENTS.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Backup Owner</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.backupOwner}
                  onChange={(e) => handleInputChange('backupOwner', e.target.value)}
                >
                  <option value="">None</option>
                  {AVAILABLE_AGENTS.map(agent => <option key={agent} value={agent}>{agent}</option>)}
                </select>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Membership</h3>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#6B6B6B' }}>Add Members</label>
              <select
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddMember(e.target.value)
                    e.target.value = ''
                  }
                }}
              >
                <option value="">Select agent to add...</option>
                {AVAILABLE_AGENTS.filter(a => !formData.members.some((m: any) => m.name === a)).map(agent => 
                  <option key={agent} value={agent}>{agent}</option>
                )}
              </select>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Current Members ({formData.members.length})</p>
              {formData.members.map((member: any) => (
                <div key={member.userId} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: '#E2E0DC' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0D3133' }}>{member.name}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{member.role}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member.userId)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max Open Tickets</label>
                <Input
                  type="number"
                  value={formData.maxOpenTickets}
                  onChange={(e) => handleInputChange('maxOpenTickets', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max Critical</label>
                <Input
                  type="number"
                  value={formData.maxCritical}
                  onChange={(e) => handleInputChange('maxCritical', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max High Priority</label>
                <Input
                  type="number"
                  value={formData.maxHigh}
                  onChange={(e) => handleInputChange('maxHigh', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max SLA Risk</label>
                <Input
                  type="number"
                  value={formData.maxSlaRisk}
                  onChange={(e) => handleInputChange('maxSlaRisk', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max Daily Assignments</label>
                <Input
                  type="number"
                  value={formData.maxDailyAssignments}
                  onChange={(e) => handleInputChange('maxDailyAssignments', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Max Concurrent</label>
                <Input
                  type="number"
                  value={formData.maxConcurrent}
                  onChange={(e) => handleInputChange('maxConcurrent', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Business Hours</h3>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#6B6B6B' }}>Mode</label>
              <div className="space-y-2">
                {(['24x7', 'business-hours', 'custom'] as const).map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={mode}
                      checked={formData.businessHoursMode === mode}
                      onChange={(e) => handleInputChange('businessHoursMode', e.target.value)}
                    />
                    <span className="text-sm" style={{ color: '#0D3133' }}>{mode === '24x7' ? '24/7' : mode === 'business-hours' ? 'Business Hours' : 'Custom'}</span>
                  </label>
                ))}
              </div>
            </div>
            {(formData.businessHoursMode === 'business-hours' || formData.businessHoursMode === 'custom') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Start Time</label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>End Time</label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Skills & Routing</h3>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#6B6B6B' }}>Required Skills</label>
              <select
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                onChange={(e) => {
                  const skill = AVAILABLE_SKILLS.find(s => s.id === e.target.value)
                  if (skill) handleAddSkill(skill)
                  e.target.value = ''
                }}
              >
                <option value="">Add a skill...</option>
                {AVAILABLE_SKILLS.filter(s => !formData.selectedSkills.some((sk: any) => sk.skillId === s.id)).map(skill =>
                  <option key={skill.id} value={skill.id}>{skill.name}</option>
                )}
              </select>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {formData.selectedSkills.map((skill: any) => (
                <div key={skill.skillId} className="flex items-center justify-between p-2 rounded border" style={{ borderColor: '#E2E0DC' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#0D3133' }}>{skill.skillName}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.skillId)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 block" style={{ color: '#6B6B6B' }}>Assignment Strategy</label>
              <select
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.assignmentStrategy}
                onChange={(e) => handleInputChange('assignmentStrategy', e.target.value)}
              >
                {ASSIGNMENT_STRATEGIES.map(strat => <option key={strat} value={strat}>{strat}</option>)}
              </select>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Escalation</h3>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Escalation Queue</label>
              <Input
                value={formData.escalationQueue}
                onChange={(e) => handleInputChange('escalationQueue', e.target.value)}
                placeholder="e.g., queue-escalation"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Escalation Team</label>
              <Input
                value={formData.escalationTeam}
                onChange={(e) => handleInputChange('escalationTeam', e.target.value)}
                placeholder="e.g., Level 3 Support"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Escalation Owner</label>
              <select
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.escalationOwner}
                onChange={(e) => handleInputChange('escalationOwner', e.target.value)}
              >
                <option value="">None</option>
                {AVAILABLE_AGENTS.map(agent => <option key={agent} value={agent}>{agent}</option>)}
              </select>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Edit Queue</h2>
            <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Editing: {queue.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
        </div>

        <div className="p-6">
          {hasChanges && (
            <div className="mb-4 p-3 rounded flex items-center gap-2" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">You have unsaved changes</span>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div
                  key={s}
                  className="flex-1 h-1 rounded"
                  style={{ backgroundColor: s <= step ? '#E69F50' : '#E2E0DC' }}
                />
              ))}
            </div>
            <p className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Step {step} of 6</p>
          </div>

          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: '#E2E0DC' }}>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              style={{ color: '#E69F50' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={() => setStep(Math.min(6, step + 1))}
              disabled={step === 6}
              className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium disabled:opacity-50"
              style={{ color: '#E69F50' }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="text-sm font-medium"
              style={{ backgroundColor: '#F3F4F3', color: '#0D3133' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSave(true)}
              className="text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: '#F59E0B', color: '#FFFFFF' }}
            >
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave(false)}
              className="text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
            >
              <Save className="w-4 h-4" />
              Publish Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
