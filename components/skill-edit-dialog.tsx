'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Save, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SkillEditDialogProps {
  isOpen: boolean
  skill: any
  onClose: () => void
  onSave: (updatedSkill: any, isDraft: boolean) => void
}

const SKILL_CATEGORIES = ['Technical', 'Soft Skills', 'Certification', 'Domain Expertise']
const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

export function SkillEditDialog({ isOpen, skill, onClose, onSave }: SkillEditDialogProps) {
  const [step, setStep] = useState(1)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState(skill ? {
    name: skill.name || '',
    skillCode: skill.skillCode || '',
    description: skill.description || '',
    category: skill.category || 'Technical',
    status: skill.status || 'active',
    levels: skill.levels || ['Beginner', 'Intermediate', 'Advanced'],
    requiredCertifications: skill.requiredCertifications || [],
    prequisiteSkills: skill.prequisiteSkills || [],
  } : {})

  if (!isOpen || !skill) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSave = (isDraft: boolean) => {
    const validation = validateForm()
    if (!validation.valid) {
      alert(`Validation Error: ${validation.errors.join(', ')}`)
      return
    }

    const updatedSkill = {
      ...skill,
      name: formData.name,
      skillCode: formData.skillCode,
      description: formData.description,
      category: formData.category,
      status: isDraft ? 'draft' : formData.status,
      levels: formData.levels,
      requiredCertifications: formData.requiredCertifications,
      prequisiteSkills: formData.prequisiteSkills,
      version: (skill.version || 1) + 1,
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    }

    onSave(updatedSkill, isDraft)
  }

  const validateForm = () => {
    const errors = []
    if (!formData.name?.trim()) errors.push('Skill name is required')
    if (!formData.skillCode?.trim()) errors.push('Skill code is required')
    if (!formData.description?.trim()) errors.push('Description is required')
    return { valid: errors.length === 0, errors }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Basic Information</h3>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Skill Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Technical Support"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Skill Code</label>
              <Input
                value={formData.skillCode}
                onChange={(e) => handleInputChange('skillCode', e.target.value)}
                placeholder="e.g., TECH_001"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Description</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Skill description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Category</label>
                <select
                  className="w-full p-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {SKILL_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                  {['active', 'draft', 'disabled', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Skill Levels</h3>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>Define the proficiency levels for this skill</p>
            <div className="space-y-2">
              {SKILL_LEVELS.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.levels.includes(level)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('levels', [...formData.levels, level])
                      } else {
                        handleInputChange('levels', formData.levels.filter((l: string) => l !== level))
                      }
                    }}
                  />
                  <span className="text-sm" style={{ color: '#0D3133' }}>{level}</span>
                </label>
              ))}
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Review Changes</h3>
            {hasChanges && (
              <div className="flex items-start gap-2 p-3 rounded" style={{ backgroundColor: '#FEF3C7', borderColor: '#FCD34D' }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#D97706' }} />
                <p className="text-sm" style={{ color: '#92400E' }}>You have unsaved changes</p>
              </div>
            )}
            <div className="p-4 rounded" style={{ backgroundColor: '#F9FAFB', borderColor: '#E2E0DC' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#0D3133' }}>Summary</p>
              <div className="space-y-1 text-xs" style={{ color: '#6B6B6B' }}>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Code:</strong> {formData.skillCode}</p>
                <p><strong>Category:</strong> {formData.category}</p>
                <p><strong>Levels:</strong> {formData.levels.join(', ')}</p>
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
          <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Edit Skill</h2>
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
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
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
                onClick={() => handleSave(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
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

          {step === 3 && (
            <Button
              onClick={() => handleSave(false)}
              style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
              className="flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Publish Changes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
