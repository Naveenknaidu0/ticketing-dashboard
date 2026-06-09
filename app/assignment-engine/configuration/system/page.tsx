'use client'

import { useState } from 'react'
import { Plus, Edit2, Archive, Trash2, Search, Download, Upload, Building2, Users, Briefcase, MapPin, Shield, Truck, BarChart3, Tag, Sliders } from 'lucide-react'
import { systemConfigurationEngine, type ConfigEntity, type ConfigEntityType } from '@/lib/system-configuration-engine'
import { customFieldsEngine, type CustomField } from '@/lib/custom-fields-engine'
import { ConfigurationEditor } from '@/components/configuration-editor'
import { CustomFieldEditor } from '@/components/custom-field-editor'

type TabId = 'departments' | 'teams' | 'business-units' | 'locations' | 'support-groups' | 'vendor-groups' | 'customer-segments' | 'tags' | 'custom-fields'

interface TabConfig {
  id: TabId
  label: string
  icon: any
  entityType?: ConfigEntityType
  description: string
}

const TABS: TabConfig[] = [
  { id: 'departments', label: 'Departments', icon: Building2, entityType: 'department', description: 'Organizational departments' },
  { id: 'teams', label: 'Teams', icon: Users, entityType: 'team', description: 'Support teams' },
  { id: 'business-units', label: 'Business Units', icon: Briefcase, entityType: 'business-unit', description: 'Business units' },
  { id: 'locations', label: 'Locations', icon: MapPin, entityType: 'location', description: 'Office locations' },
  { id: 'support-groups', label: 'Support Groups', icon: Shield, entityType: 'support-group', description: 'Support group configurations' },
  { id: 'vendor-groups', label: 'Vendor Groups', icon: Truck, entityType: 'vendor-group', description: 'Vendor groups' },
  { id: 'customer-segments', label: 'Customer Segments', icon: BarChart3, entityType: 'customer-segment', description: 'Customer segments' },
  { id: 'tags', label: 'Tags', icon: Tag, entityType: 'tag', description: 'System tags' },
  { id: 'custom-fields', label: 'Custom Fields', icon: Sliders, description: 'Custom fields' },
]

export default function SystemConfigurationPage() {
  const [activeTab, setActiveTab] = useState<TabId>('departments')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingEntityId, setEditingEntityId] = useState<string | null>(null)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [stats] = useState(systemConfigurationEngine.getStatistics())

  const currentTab = TABS.find(t => t.id === activeTab)!
  const isCustomFields = activeTab === 'custom-fields'

  // Get data based on current tab
  let items: (ConfigEntity | CustomField)[] = []
  if (isCustomFields) {
    items = customFieldsEngine.getAllFields()
  } else if (currentTab.entityType) {
    items = systemConfigurationEngine.getEntitiesByType(currentTab.entityType)
  }

  // Filter by search
  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase()
    return item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
  })

  const handleSave = (item: ConfigEntity | CustomField) => {
    setEditingEntityId(null)
    setEditingFieldId(null)
    setIsCreating(false)
  }

  const handleClose = () => {
    setEditingEntityId(null)
    setEditingFieldId(null)
    setIsCreating(false)
  }

  const handleDelete = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Permanently delete this item?')) {
      if (isCustomFields) {
        customFieldsEngine.deleteField(itemId)
      } else {
        systemConfigurationEngine.deleteEntity(itemId)
      }
    }
  }

  const handleArchive = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Archive this item?')) {
      if (!isCustomFields) {
        systemConfigurationEngine.archiveEntity(itemId, 'current-user')
      }
    }
  }

  // Show editor if editing
  if (editingEntityId && !isCustomFields) {
    const entity = systemConfigurationEngine.getEntity(editingEntityId)
    return (
      <ConfigurationEditor
        entity={entity}
        entityType={currentTab.entityType!}
        onClose={handleClose}
        onSave={handleSave}
      />
    )
  }

  if (isCreating && !isCustomFields) {
    return (
      <ConfigurationEditor
        entity={null}
        entityType={currentTab.entityType!}
        onClose={handleClose}
        onSave={handleSave}
      />
    )
  }

  if (editingFieldId) {
    const field = customFieldsEngine.getField(editingFieldId)
    return (
      <CustomFieldEditor
        field={field}
        onClose={handleClose}
        onSave={handleSave}
      />
    )
  }

  if (isCreating && isCustomFields) {
    return (
      <CustomFieldEditor
        field={null}
        onClose={handleClose}
        onSave={handleSave}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D3133' }}>
            System Configuration
          </h1>
          <p style={{ color: '#6B6B6B' }}>
            Master data layer: manage {activeTab === 'custom-fields' ? 'custom fields' : 'entities'} that power the entire system
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b sticky top-20 z-30" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSearchQuery('')
                  }}
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
                  title={tab.description}
                  style={{
                    borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
                    color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Actions Bar */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
            <Search className="w-4 h-4" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#0D3133' }}
            />
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Create New
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center rounded-lg border" style={{ backgroundColor: '#F9F7F4', borderColor: '#E2E0DC' }}>
              <p style={{ color: '#9CA3AF' }}>
                {searchQuery ? 'No items match your search' : `No ${currentTab.label.toLowerCase()} yet`}
              </p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  if (isCustomFields) {
                    setEditingFieldId(item.id)
                  } else {
                    setEditingEntityId(item.id)
                  }
                }}
                className="p-4 rounded-lg border hover:shadow-md cursor-pointer transition-all"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: '#0D3133' }}>
                      {item.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                      {item.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        if (isCustomFields) {
                          setEditingFieldId(item.id)
                        } else {
                          setEditingEntityId(item.id)
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" style={{ color: '#E69F50' }} />
                    </button>
                    {!isCustomFields && (
                      <button
                        onClick={e => handleArchive(item.id, e)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Archive"
                      >
                        <Archive className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                    )}
                    <button
                      onClick={e => handleDelete(item.id, e)}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs mt-3" style={{ color: '#9CA3AF' }}>
                  {!isCustomFields && (
                    <>
                      <span>Status: {('status' in item) ? item.status : 'N/A'}</span>
                      <span>Usage: {('usageCount' in item) ? item.usageCount : 0}</span>
                    </>
                  )}
                  {isCustomFields && 'fieldType' in item && (
                    <>
                      <span>Type: {item.fieldType}</span>
                      <span>Usage: {item.usageCount}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
