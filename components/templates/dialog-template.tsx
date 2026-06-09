'use client'

import { useState } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

/**
 * Generic Dialog Template for Creating New Entities
 * 
 * Usage:
 * 1. Copy this component to your specific module (e.g., SkillDialog)
 * 2. Replace ENTITY_NAME, FORM_FIELDS, and STEPS with your specific data
 * 3. Implement validation and submission logic
 * 4. Follow the multi-step wizard pattern
 */

interface DialogTemplateProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (entity: any) => void
}

export function DialogTemplate({ isOpen, onClose, onCreate }: DialogTemplateProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3 // Customize this

  const [formData, setFormData] = useState({
    // Define your form fields here
    name: '',
    description: '',
    status: 'active',
  })

  if (!isOpen) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
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

    const newEntity = {
      id: `entity-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }

    onCreate(newEntity)
    setFormData({ name: '', description: '', status: 'active' })
    setStep(1)
    onClose()
  }

  const validateForm = () => {
    const errors = []
    if (!formData.name?.trim()) errors.push('Name is required')
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
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#6B6B6B' }}>Description</label>
              <textarea
                className="w-full p-2 border rounded text-sm"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Configuration</h3>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>Configure step 2 fields here</p>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold" style={{ color: '#0D3133' }}>Review</h3>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>Review and confirm your settings</p>
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
          <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Create New Entity</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                style={{
                  backgroundColor: i + 1 <= step ? '#E69F50' : '#E2E0DC',
                  color: i + 1 <= step ? '#FFFFFF' : '#6B6B6B',
                }}
              >
                {i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className="h-1 flex-1 mx-2"
                  style={{ backgroundColor: i + 1 < step ? '#E69F50' : '#E2E0DC' }}
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

          {step === totalSteps ? (
            <Button
              onClick={handleCreate}
              style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              className="font-medium"
            >
              Create Entity
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
