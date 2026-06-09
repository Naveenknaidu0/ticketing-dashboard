'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface CapacityDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (profile: any) => void
}

const PROFILE_ROLES = ['l1-agent', 'l2-specialist', 'l3-expert', 'custom']

export function CapacityDialog({ isOpen, onClose, onCreate }: CapacityDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    role: 'l1-agent',
    description: '',
    maxOpenTickets: 15,
    maxCritical: 2,
    maxHigh: 5,
    maxSlaRisk: 3,
    maxDailyAssignments: 50,
    maxConcurrent: 3,
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleCreate = () => {
    const validation = validateForm()
    if (!validation.valid) {
      alert(`Validation Error: ${validation.errors.join(', ')}`)
      return
    }

    const newProfile = {
      id: `profile-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      description: formData.description,
      maxOpenTickets: formData.maxOpenTickets,
      maxCritical: formData.maxCritical,
      maxHigh: formData.maxHigh,
      maxSlaRisk: formData.maxSlaRisk,
      maxDailyAssignments: formData.maxDailyAssignments,
      maxConcurrent: formData.maxConcurrent,
      appliedCount: 0,
      isPreset: false,
      version: 1,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
    }

    onCreate(newProfile)
    setFormData({
      name: '',
      role: 'l1-agent',
      description: '',
      maxOpenTickets: 15,
      maxCritical: 2,
      maxHigh: 5,
      maxSlaRisk: 3,
      maxDailyAssignments: 50,
      maxConcurrent: 3,
    })
    setStep(1)
    onClose()
  }

  const validateForm = () => {
    const errors = []
    if (!formData.name?.trim()) errors.push('Profile name is required')
    if (!formData.description?.trim()) errors.push('Description is required')
    if (formData.maxOpenTickets <= 0) errors.push('Max open tickets must be positive')
    return { valid: errors.length === 0, errors }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Basic Information</h3>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Profile Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., L2 Engineer"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Role</label>
              <select
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
              >
                {PROFILE_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Description</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Profile description"
                rows={3}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Capacity Thresholds</h3>
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
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Review & Publish</h3>
            <div className="p-4 rounded" style={{ backgroundColor: '#F9FAFB', borderColor: '#E2E0DC' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#0D3133' }}>Summary</p>
              <div className="space-y-1 text-xs" style={{ color: '#6B6B6B' }}>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Role:</strong> {formData.role}</p>
                <p><strong>Max Open:</strong> {formData.maxOpenTickets}</p>
                <p><strong>Max Critical:</strong> {formData.maxCritical}</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Create New Capacity Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: i <= step ? '#E69F50' : '#E2E0DC',
                  color: i <= step ? '#FFFFFF' : '#6B6B6B',
                }}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className="h-1 flex-1 mx-2"
                  style={{ backgroundColor: i < step ? '#E69F50' : '#E2E0DC' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {step === 3 ? (
            <Button
              onClick={handleCreate}
              style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              className="font-medium"
            >
              Create Profile
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              className="flex items-center gap-2 font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
