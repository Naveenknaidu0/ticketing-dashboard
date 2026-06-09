'use client'

import { useState } from 'react'
import { Save, X, Copy, Archive, Trash2, Plus, Trash } from 'lucide-react'
import { customFieldsEngine, type CustomField, type FieldType, type FieldOption } from '@/lib/custom-fields-engine'

interface CustomFieldEditorProps {
  field: CustomField | null
  onClose: () => void
  onSave: (field: CustomField) => void
}

const FIELD_TYPES: { value: FieldType; label: string; icon: string }[] = [
  { value: 'text', label: 'Text', icon: 'A' },
  { value: 'textarea', label: 'Textarea', icon: 'T' },
  { value: 'dropdown', label: 'Dropdown', icon: 'D' },
  { value: 'multi-select', label: 'Multi-Select', icon: 'M' },
  { value: 'date', label: 'Date', icon: 'C' },
  { value: 'datetime', label: 'DateTime', icon: 'C' },
  { value: 'checkbox', label: 'Checkbox', icon: 'X' },
  { value: 'number', label: 'Number', icon: '#' },
  { value: 'email', label: 'Email', icon: '@' },
  { value: 'phone', label: 'Phone', icon: 'P' },
  { value: 'url', label: 'URL', icon: 'U' },
  { value: 'user-picker', label: 'User Picker', icon: 'U' },
  { value: 'team-picker', label: 'Team Picker', icon: 'T' },
]

export function CustomFieldEditor({ field, onClose, onSave }: CustomFieldEditorProps) {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    description: field?.description || '',
    fieldType: field?.fieldType || ('text' as FieldType),
    isRequired: field?.isRequired ?? false,
    placeholder: field?.placeholder || '',
    applicableTo: field?.applicableTo || ('tickets' as const),
    status: field?.status || ('draft' as const),
  })
  const [options, setOptions] = useState<FieldOption[]>(field?.options || [])
  const [newOption, setNewOption] = useState({ label: '', value: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'options' | 'validation' | 'usage'>('details')

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a field name')
      return
    }

    setIsSaving(true)
    try {
      if (field) {
        // Update
        const updated = customFieldsEngine.updateField(
          field.id,
          {
            name: formData.name,
            description: formData.description,
            fieldType: formData.fieldType,
            isRequired: formData.isRequired,
            placeholder: formData.placeholder,
            applicableTo: formData.applicableTo,
            status: formData.status,
            ...(options.length > 0 && { options }),
          },
          'current-user'
        )
        if (updated) {
          onSave(updated)
          onClose()
        }
      } else {
        // Create
        const newField = customFieldsEngine.createField({
          name: formData.name,
          description: formData.description,
          fieldType: formData.fieldType,
          isRequired: formData.isRequired,
          placeholder: formData.placeholder,
          applicableTo: formData.applicableTo,
          ...(options.length > 0 && { options }),
          userId: 'current-user',
        })
        onSave(newField)
        onClose()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddOption = () => {
    if (!newOption.label.trim() || !newOption.value.trim()) {
      alert('Please enter both label and value')
      return
    }

    const option: FieldOption = {
      id: `opt-${Date.now()}`,
      label: newOption.label,
      value: newOption.value,
    }

    setOptions([...options, option])
    setNewOption({ label: '', value: '' })
  }

  const handleRemoveOption = (optionId: string) => {
    setOptions(options.filter(o => o.id !== optionId))
  }

  const canHaveOptions = ['dropdown', 'multi-select'].includes(formData.fieldType)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {field ? 'Edit' : 'Create'} Custom Field
          </h2>
          {field && <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{field.id}</p>}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
        {['details', 'options', 'validation', 'usage'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap"
            style={{
              borderColor: activeTab === tab ? '#E69F50' : 'transparent',
              color: activeTab === tab ? '#E69F50' : '#6B6B6B',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Field Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Customer Type"
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this field's purpose"
              className="w-full px-3 py-2 border rounded-lg h-20"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Field Type <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FIELD_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, fieldType: type.value }))
                    setOptions([]) // Clear options when changing type
                  }}
                  className="p-3 rounded border text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: formData.fieldType === type.value ? '#FEF3C7' : '#FFFFFF',
                    borderColor: formData.fieldType === type.value ? '#E69F50' : '#E2E0DC',
                    color: formData.fieldType === type.value ? '#92400E' : '#6B6B6B',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Applicable To
              </label>
              <select
                value={formData.applicableTo}
                onChange={e => setFormData(prev => ({ ...prev, applicableTo: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="tickets">Tickets</option>
                <option value="contacts">Contacts</option>
                <option value="companies">Companies</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F4F6' }}>
            <input
              type="checkbox"
              checked={formData.isRequired}
              onChange={e => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
              id="required"
              className="w-4 h-4"
            />
            <label htmlFor="required" style={{ color: '#6B6B6B' }}>
              This field is required
            </label>
          </div>
        </div>
      )}

      {/* Options Tab */}
      {activeTab === 'options' && (
        <div className="space-y-4 max-w-2xl">
          {canHaveOptions ? (
            <>
              <div className="space-y-3">
                {options.map(option => (
                  <div
                    key={option.id}
                    className="flex items-center gap-3 p-3 rounded border"
                    style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
                  >
                    <div className="flex-1">
                      <div style={{ color: '#0D3133', fontWeight: 500 }}>{option.label}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>Value: {option.value}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveOption(option.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4" style={{ borderColor: '#E2E0DC' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>
                  Add New Option
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newOption.label}
                    onChange={e => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Label (e.g., Enterprise)"
                    className="px-3 py-2 border rounded"
                    style={{ borderColor: '#E2E0DC' }}
                  />
                  <input
                    type="text"
                    value={newOption.value}
                    onChange={e => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="Value (e.g., enterprise)"
                    className="px-3 py-2 border rounded"
                    style={{ borderColor: '#E2E0DC' }}
                  />
                </div>
                <button
                  onClick={handleAddOption}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded font-medium"
                  style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Options are only available for dropdown and multi-select fields</p>
          )}
        </div>
      )}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: '#6B6B6B' }}>
              Placeholder Text
            </label>
            <input
              type="text"
              value={formData.placeholder}
              onChange={e => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="e.g., Enter value..."
              className="w-full px-3 py-2 border rounded-lg"
              style={{ borderColor: '#E2E0DC' }}
            />
          </div>

          <p style={{ color: '#9CA3AF', fontSize: '0.875rem' }}>
            Additional validation rules (min length, max length, patterns) can be configured for text and number fields when needed.
          </p>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-4">
          {field ? (
            <div
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold" style={{ color: '#E69F50' }}>
                  {field.usageCount}
                </div>
                <div>
                  <div style={{ color: '#0D3133', fontWeight: 500 }}>Times Used</div>
                  <p style={{ color: '#6B6B6B' }}>In tickets, contacts, or companies</p>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Usage information will appear after creation</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t" style={{ borderColor: '#E2E0DC' }}>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 flex-1 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 rounded-lg font-medium border"
          style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
