'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QueueDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (queue: any) => void
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
  { id: 'skill-infrastructure', name: 'Infrastructure' },
  { id: 'skill-development', name: 'Development Support' },
  { id: 'skill-vip', name: 'VIP Support' },
  { id: 'skill-premium', name: 'Premium Services' },
]
const ASSIGNMENT_STRATEGIES = [
  'round-robin', 'least-workload', 'skill-based', 'capacity-based', 'availability', 'hybrid'
]

export function QueueDialog({ isOpen, onClose, onCreate }: QueueDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // General Information
    name: '',
    queueCode: '',
    description: '',
    queueType: 'support' as const,
    department: 'Support',
    businessUnit: 'Operations',
    owner: 'Sarah Johnson',
    backupOwner: '',
    status: 'active' as const,

    // Members
    members: [] as { userId: string; name: string; role: 'queue-lead' | 'senior-agent' | 'agent' }[],

    // Capacity
    maxOpenTickets: 50,
    maxCritical: 5,
    maxHigh: 10,
    maxSlaRisk: 8,
    maxDailyAssignments: 100,
    maxConcurrent: 10,
    overflowQueue: '',

    // Business Hours
    businessHoursMode: '24x7' as '24x7' | 'business-hours' | 'custom',
    startTime: '09:00',
    endTime: '17:00',
    timezone: 'UTC',

    // Skills
    selectedSkills: [] as { skillId: string; skillName: string; minimumLevel: number; required: boolean }[],

    // Routing
    assignmentStrategy: 'round-robin' as const,

    // Escalation
    escalationQueue: '',
    escalationTeam: '',
    escalationOwner: '',
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddMember = (agentName: string, role: 'queue-lead' | 'senior-agent' | 'agent') => {
    const newMember = {
      userId: `user-${Date.now()}`,
      name: agentName,
      role,
    }
    handleInputChange('members', [...formData.members, newMember])
  }

  const handleRemoveMember = (userId: string) => {
    handleInputChange('members', formData.members.filter(m => m.userId !== userId))
  }

  const handleAddSkill = (skill: any) => {
    if (!formData.selectedSkills.find(s => s.skillId === skill.id)) {
      handleInputChange('selectedSkills', [...formData.selectedSkills, {
        skillId: skill.id,
        skillName: skill.name,
        minimumLevel: 1,
        required: true,
      }])
    }
  }

  const handleRemoveSkill = (skillId: string) => {
    handleInputChange('selectedSkills', formData.selectedSkills.filter(s => s.skillId !== skillId))
  }

  const handleUpdateSkillLevel = (skillId: string, level: number) => {
    handleInputChange('selectedSkills', formData.selectedSkills.map(s =>
      s.skillId === skillId ? { ...s, minimumLevel: level } : s
    ))
  }

  const handleSubmit = () => {
    const queueCode = formData.queueCode || `Q-${Date.now().toString().slice(-6)}`
    
    const newQueue = {
      id: `queue-${Date.now()}`,
      queueCode,
      name: formData.name,
      description: formData.description,
      queueType: formData.queueType,
      department: formData.department,
      businessUnit: formData.businessUnit,
      owner: formData.owner,
      backupOwner: formData.backupOwner,
      members: formData.members,
      capacity: {
        maxOpenTickets: formData.maxOpenTickets,
        maxCritical: formData.maxCritical,
        maxHigh: formData.maxHigh,
        maxSlaRisk: formData.maxSlaRisk,
        maxDailyAssignments: formData.maxDailyAssignments,
        maxConcurrent: formData.maxConcurrent,
        overflowQueue: formData.overflowQueue,
      },
      businessHours: {
        mode: formData.businessHoursMode,
        startTime: formData.businessHoursMode === 'custom' ? formData.startTime : undefined,
        endTime: formData.businessHoursMode === 'custom' ? formData.endTime : undefined,
        timezone: formData.timezone,
      },
      skills: formData.selectedSkills,
      assignmentStrategy: formData.assignmentStrategy,
      escalation: {
        escalationQueue: formData.escalationQueue,
        escalationTeam: formData.escalationTeam,
        escalationOwner: formData.escalationOwner,
        escalationConditions: [],
      },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: formData.status,
      isActive: formData.status === 'active',
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-${Date.now()}`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    }

    onCreate(newQueue)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      name: '', queueCode: '', description: '', queueType: 'support', department: 'Support',
      businessUnit: 'Operations', owner: 'Sarah Johnson', backupOwner: '', status: 'active',
      members: [], maxOpenTickets: 50, maxCritical: 5, maxHigh: 10, maxSlaRisk: 8,
      maxDailyAssignments: 100, maxConcurrent: 10, overflowQueue: '',
      businessHoursMode: '24x7', startTime: '09:00', endTime: '17:00', timezone: 'UTC',
      selectedSkills: [], assignmentStrategy: 'round-robin',
      escalationQueue: '', escalationTeam: '', escalationOwner: '',
    })
    setStep(1)
  }

  if (!isOpen) return null

  const steps = ['General', 'Members', 'Capacity', 'Business Hours', 'Skills', 'Routing', 'Escalation']
  const canProceed = step === 1 ? formData.name.length > 0 : true
  const canSubmit = formData.name && formData.members.length > 0 && formData.selectedSkills.length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Create Assignment Queue</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-6">
          <div className="flex gap-2">
            {steps.map((s, idx) => (
              <div key={idx} className="flex-1">
                <button
                  onClick={() => setStep(idx + 1)}
                  className="w-full py-2 rounded text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: idx + 1 <= step ? '#E69F50' : '#F3F4F3',
                    color: idx + 1 <= step ? '#FFFFFF' : '#6B6B6B',
                  }}
                >
                  {s}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Queue Name</label>
                <Input
                  placeholder="e.g., General Support Queue"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Queue Code</label>
                <Input
                  placeholder="e.g., GEN-001 (auto-generated if left blank)"
                  value={formData.queueCode}
                  onChange={(e) => handleInputChange('queueCode', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Description</label>
                <textarea
                  placeholder="Queue description and purpose"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Queue Type</label>
                  <select
                    value={formData.queueType}
                    onChange={(e) => handleInputChange('queueType', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    {QUEUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Business Unit</label>
                  <select
                    value={formData.businessUnit}
                    onChange={(e) => handleInputChange('businessUnit', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    {BUSINESS_UNITS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Queue Owner</label>
                  <select
                    value={formData.owner}
                    onChange={(e) => handleInputChange('owner', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    {AVAILABLE_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Backup Owner</label>
                  <select
                    value={formData.backupOwner}
                    onChange={(e) => handleInputChange('backupOwner', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                  >
                    <option value="">None</option>
                    {AVAILABLE_AGENTS.filter(a => a !== formData.owner).map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Add Team Members</label>
                <div className="mt-2 space-y-2">
                  {AVAILABLE_AGENTS.map(agent => (
                    <div key={agent} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={agent}
                        checked={formData.members.some(m => m.name === agent)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleAddMember(agent, formData.members.length === 0 ? 'queue-lead' : 'agent')
                          } else {
                            handleRemoveMember(formData.members.find(m => m.name === agent)?.userId || '')
                          }
                        }}
                      />
                      <label htmlFor={agent} className="flex-1 text-sm" style={{ color: '#0D3133' }}>
                        {agent}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {formData.members.length > 0 && (
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Member Roles</label>
                  <div className="mt-2 space-y-2">
                    {formData.members.map(member => (
                      <div key={member.userId} className="flex items-center gap-2">
                        <span className="text-sm flex-1" style={{ color: '#0D3133' }}>{member.name}</span>
                        <select
                          value={member.role}
                          onChange={(e) => {
                            const updated = formData.members.map(m =>
                              m.userId === member.userId ? { ...m, role: e.target.value as any } : m
                            )
                            handleInputChange('members', updated)
                          }}
                          className="px-2 py-1 text-sm border rounded" style={{ borderColor: '#E2E0DC' }}
                        >
                          <option value="queue-lead">Queue Lead</option>
                          <option value="senior-agent">Senior Agent</option>
                          <option value="agent">Agent</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max Open Tickets</label>
                  <Input type="number" min="1" value={formData.maxOpenTickets} onChange={(e) => handleInputChange('maxOpenTickets', parseInt(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max Critical</label>
                  <Input type="number" min="1" value={formData.maxCritical} onChange={(e) => handleInputChange('maxCritical', parseInt(e.target.value))} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max High Priority</label>
                  <Input type="number" min="1" value={formData.maxHigh} onChange={(e) => handleInputChange('maxHigh', parseInt(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max SLA Risk</label>
                  <Input type="number" min="1" value={formData.maxSlaRisk} onChange={(e) => handleInputChange('maxSlaRisk', parseInt(e.target.value))} className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max Daily Assignments</label>
                  <Input type="number" min="1" value={formData.maxDailyAssignments} onChange={(e) => handleInputChange('maxDailyAssignments', parseInt(e.target.value))} className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Max Concurrent</label>
                  <Input type="number" min="1" value={formData.maxConcurrent} onChange={(e) => handleInputChange('maxConcurrent', parseInt(e.target.value))} className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Overflow Queue</label>
                <Input placeholder="Queue ID for overflow (optional)" value={formData.overflowQueue} onChange={(e) => handleInputChange('overflowQueue', e.target.value)} className="mt-1" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Business Hours Mode</label>
                <select
                  value={formData.businessHoursMode}
                  onChange={(e) => handleInputChange('businessHoursMode', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                >
                  <option value="24x7">24/7</option>
                  <option value="business-hours">Business Hours</option>
                  <option value="custom">Custom Schedule</option>
                </select>
              </div>

              {formData.businessHoursMode === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Start Time</label>
                    <Input type="time" value={formData.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>End Time</label>
                    <Input type="time" value={formData.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)} className="mt-1" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                </select>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Available Skills</label>
                <div className="mt-2 space-y-2">
                  {AVAILABLE_SKILLS.map(skill => (
                    <button
                      key={skill.id}
                      onClick={() => handleAddSkill(skill)}
                      disabled={formData.selectedSkills.some(s => s.skillId === skill.id)}
                      className="w-full text-left px-3 py-2 border rounded text-sm transition-colors"
                      style={{
                        borderColor: '#E2E0DC',
                        backgroundColor: formData.selectedSkills.some(s => s.skillId === skill.id) ? '#F0F0F0' : '#FFFFFF',
                        color: '#0D3133',
                        opacity: formData.selectedSkills.some(s => s.skillId === skill.id) ? 0.5 : 1,
                      }}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              {formData.selectedSkills.length > 0 && (
                <div>
                  <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Selected Skills & Minimum Levels</label>
                  <div className="mt-2 space-y-3">
                    {formData.selectedSkills.map(skill => (
                      <div key={skill.skillId} className="p-3 border rounded" style={{ borderColor: '#E2E0DC' }}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium" style={{ color: '#0D3133' }}>{skill.skillName}</span>
                          <button
                            onClick={() => handleRemoveSkill(skill.skillId)}
                            className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <label className="text-sm" style={{ color: '#6B6B6B' }}>Min Level:</label>
                          <select
                            value={skill.minimumLevel}
                            onChange={(e) => handleUpdateSkillLevel(skill.skillId, parseInt(e.target.value))}
                            className="px-2 py-1 text-sm border rounded" style={{ borderColor: '#E2E0DC' }}
                          >
                            {[1, 2, 3, 4, 5].map(l => <option key={l} value={l}>Level {l}</option>)}
                          </select>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={skill.required}
                              onChange={(e) => {
                                const updated = formData.selectedSkills.map(s =>
                                  s.skillId === skill.skillId ? { ...s, required: e.target.checked } : s
                                )
                                handleInputChange('selectedSkills', updated)
                              }}
                            />
                            Required
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Assignment Strategy</label>
                <div className="mt-2 space-y-2">
                  {ASSIGNMENT_STRATEGIES.map(strategy => (
                    <label key={strategy} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value={strategy}
                        checked={formData.assignmentStrategy === strategy}
                        onChange={(e) => handleInputChange('assignmentStrategy', e.target.value)}
                      />
                      <span style={{ color: '#0D3133' }}>{strategy.replace('-', ' ').toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Escalation Queue</label>
                <Input placeholder="Queue ID" value={formData.escalationQueue} onChange={(e) => handleInputChange('escalationQueue', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Escalation Team</label>
                <Input placeholder="Team name" value={formData.escalationTeam} onChange={(e) => handleInputChange('escalationTeam', e.target.value)} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: '#0D3133' }}>Escalation Owner</label>
                <select
                  value={formData.escalationOwner}
                  onChange={(e) => handleInputChange('escalationOwner', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }}
                >
                  <option value="">Select owner</option>
                  {AVAILABLE_AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between p-6 border-t bg-white" style={{ borderColor: '#E2E0DC' }}>
          <Button
            variant="outline"
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Cancel' : 'Previous'}
          </Button>

          {step < 7 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="flex items-center gap-2"
              style={{ backgroundColor: canProceed ? '#E69F50' : '#D1D5DB', color: '#FFFFFF' }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{ backgroundColor: canSubmit ? '#E69F50' : '#D1D5DB', color: '#FFFFFF' }}
            >
              Create Queue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
