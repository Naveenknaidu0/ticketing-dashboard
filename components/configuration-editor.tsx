'use client'

import { useState } from 'react'
import { Save, X, Copy, Archive, Trash2, AlertCircle } from 'lucide-react'
import { systemConfigurationEngine, type ConfigEntity, type ConfigEntityType } from '@/lib/system-configuration-engine'

interface ConfigurationEditorProps {
  entity: ConfigEntity | null
  entityType: ConfigEntityType
  onClose: () => void
  onSave: (entity: ConfigEntity) => void
}

export function ConfigurationEditor({ entity, entityType, onClose, onSave }: ConfigurationEditorProps) {
  const [formData, setFormData] = useState({
    name: entity?.name || '',
    description: entity?.description || '',
    status: entity?.status || 'active' as const,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'usage' | 'dependencies' | 'audit'>('details')

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a name')
      return
    }

    setIsSaving(true)
    try {
      if (entity) {
        // Update existing
        const updated = systemConfigurationEngine.updateEntity(
          entity.id,
          {
            name: formData.name,
            description: formData.description,
            status: formData.status,
          },
          'current-user'
        )
        if (updated) {
          onSave(updated)
          onClose()
        }
      } else {
        // Create new
        const newEntity = systemConfigurationEngine.createEntity({
          type: entityType,
          name: formData.name,
          description: formData.description,
          userId: 'current-user',
        })
        onSave(newEntity)
        onClose()
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleClone = () => {
    if (entity) {
      const cloned = systemConfigurationEngine.cloneEntity(entity.id, 'current-user')
      if (cloned) {
        onSave(cloned)
        onClose()
      }
    }
  }

  const handleArchive = () => {
    if (entity && confirm('Archive this entity?')) {
      systemConfigurationEngine.archiveEntity(entity.id, 'current-user')
      onClose()
    }
  }

  const handleDelete = () => {
    if (entity && confirm('Permanently delete this entity?')) {
      systemConfigurationEngine.deleteEntity(entity.id)
      onClose()
    }
  }

  const typeLabel = {
    'department': 'Department',
    'team': 'Team',
    'business-unit': 'Business Unit',
    'location': 'Location',
    'support-group': 'Support Group',
    'vendor-group': 'Vendor Group',
    'customer-segment': 'Customer Segment',
    'tag': 'Tag',
    'custom-field': 'Custom Field',
  }[entityType]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: '#E2E0DC' }}>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {entity ? 'Edit' : 'Create'} {typeLabel}
          </h2>
          {entity && <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>{entity.id}</p>}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: '#E2E0DC' }}>
        {['details', 'usage', 'dependencies', 'audit'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize"
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
              Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={`Enter ${typeLabel.toLowerCase()} name`}
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
              placeholder="Enter description"
              className="w-full px-3 py-2 border rounded-lg h-24"
              style={{ borderColor: '#E2E0DC' }}
            />
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {entity && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ backgroundColor: '#F3F4F6', borderColor: '#E2E0DC', border: '1px solid #E2E0DC' }}
            >
              <div style={{ color: '#6B6B6B' }}>
                <div>Created: {new Date(entity.createdAt).toLocaleDateString()} by {entity.createdBy}</div>
                <div>Updated: {new Date(entity.updatedAt).toLocaleDateString()} by {entity.updatedBy}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="space-y-4">
          {entity ? (
            <>
              <div
                className="p-4 rounded-lg border"
                style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold" style={{ color: '#E69F50' }}>
                    {entity.usageCount}
                  </div>
                  <div>
                    <div style={{ color: '#0D3133', fontWeight: 500 }}>Usage Count</div>
                    <p style={{ color: '#6B6B6B' }}>Times this entity is referenced</p>
                  </div>
                </div>
              </div>

              {entity.dependencies.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
                    Dependent Entities
                  </h3>
                  <div className="space-y-2">
                    {entity.dependencies.map(depId => (
                      <div
                        key={depId}
                        className="p-2 rounded border text-sm"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', color: '#6B6B6B' }}
                      >
                        {depId}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Usage information will appear after creation</p>
          )}
        </div>
      )}

      {/* Dependencies Tab */}
      {activeTab === 'dependencies' && (
        <div className="space-y-4">
          {entity && entity.dependencies.length > 0 ? (
            <div className="space-y-2">
              {entity.dependencies.map(depId => {
                const dep = systemConfigurationEngine.getEntity(depId)
                return (
                  <div
                    key={depId}
                    className="p-3 rounded border"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
                  >
                    <div style={{ color: '#0D3133', fontWeight: 500 }}>{dep?.name || depId}</div>
                    <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                      Type: {dep?.type}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p style={{ color: '#9CA3AF' }}>No dependencies</p>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {entity ? (
            <div
              className="p-4 rounded-lg border space-y-3"
              style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}
            >
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Created:</span>
                <span style={{ color: '#0D3133', fontWeight: 500 }}>
                  {new Date(entity.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Created By:</span>
                <span style={{ color: '#0D3133', fontWeight: 500 }}>{entity.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Last Updated:</span>
                <span style={{ color: '#0D3133', fontWeight: 500 }}>
                  {new Date(entity.updatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B6B6B' }}>Updated By:</span>
                <span style={{ color: '#0D3133', fontWeight: 500 }}>{entity.updatedBy}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: '#9CA3AF' }}>Audit information will appear after creation</p>
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

        {entity && (
          <>
            <button
              onClick={handleClone}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
              style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
              title="Clone this entity"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleArchive}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border"
              style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
              title="Archive this entity"
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium border hover:bg-red-50"
              style={{ borderColor: '#E2E0DC', color: '#EF4444' }}
              title="Delete this entity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}

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
