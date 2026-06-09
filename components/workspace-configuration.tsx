'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, Plus, Download, Upload, Search, Filter, RefreshCw, Copy, Archive, Trash2 } from 'lucide-react'
import { ConfigurationValue, getConfigurationsByCategory, updateConfigurationValue, deleteConfigurationValue, cloneConfigurationValue, createConfigurationValue, checkDependencies, canDeleteValue } from '@/lib/configuration-registry'
import { useRegistryUpdates } from '@/hooks/use-registry-updates'
import { filterConfigurations, sortConfigurations, calculateWorkspaceStats, exportConfigurationsToCSV, SortOptions } from '@/lib/workspace-engine'

interface WorkspaceConfigurationProps {
  title: string
  description: string
  systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'dashboard' | 'system'
  categories: Array<{ id: string; name: string; description: string }>
  onBack: () => void
}

export function WorkspaceConfiguration({
  title,
  description,
  systemCategory,
  categories,
  onBack,
}: WorkspaceConfigurationProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<string>(categories[0]?.id || '')
  const [selectedConfigs, setSelectedConfigs] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'name', direction: 'asc' })
  const [showFilters, setShowFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [createMode, setCreateMode] = useState(false)
  const [newConfigData, setNewConfigData] = useState({ label: '', code: '', description: '' })
  const [refreshKey, setRefreshKey] = useState(0)
  
  // Listen for registry changes to trigger re-renders
  const registryUpdate = useRegistryUpdates(activeTab)

  // Force re-fetch when registry updates
  useEffect(() => {
    if (registryUpdate) {
      setRefreshKey(k => k + 1)
    }
  }, [registryUpdate])

  let allConfigs = getConfigurationsByCategory(activeTab)
  const stats = calculateWorkspaceStats(allConfigs)

  const filteredConfigs = useMemo(() => {
    let result = filterConfigurations(allConfigs, {
      searchTerm,
      status: (filterStatus as any) || undefined,
    })
    return sortConfigurations(result, sortOptions)
  }, [allConfigs, searchTerm, filterStatus, sortOptions, refreshKey])

  const handleCreate = () => {
    if (newConfigData.label && newConfigData.code) {
      createConfigurationValue({
        label: newConfigData.label,
        code: newConfigData.code,
        description: newConfigData.description,
        category: activeTab,
        systemCategory,
      })
      setNewConfigData({ label: '', code: '', description: '' })
      setCreateMode(false)
    }
  }

  const handleClone = (id: string) => {
    cloneConfigurationValue(id)
  }

  const handleArchive = (id: string) => {
    const config = allConfigs.find(c => c.id === id)
    if (config) {
      updateConfigurationValue(id, { status: config.status === 'archived' ? 'active' : 'archived' })
    }
  }

  const handleDelete = (id: string) => {
    const canDelete = canDeleteValue(id)
    if (canDelete.canDelete) {
      if (confirm('Are you sure? This action cannot be undone.')) {
        deleteConfigurationValue(id)
      }
    } else {
      alert(`Cannot delete: ${canDelete.reason}`)
    }
  }

  const handleExport = () => {
    exportConfigurationsToCSV(filteredConfigs, `${systemCategory}-configurations`)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Header */}
        <div>
          <button onClick={onBack} className="flex items-center gap-2 mb-4 text-sm font-medium" style={{ color: '#E69F50' }}>
            <ChevronLeft className="w-4 h-4" />
            Back to Configuration Studio
          </button>

          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D3133' }}>
            {title}
          </h1>
          <p style={{ color: '#6B6B6B' }}>
            {description}
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="flex gap-2 items-center flex-wrap">
          <button onClick={() => setCreateMode(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}>
            <Plus className="w-4 h-4" />
            Create Configuration
          </button>

          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}>
            <Download className="w-4 h-4" />
            Export
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}>
            <Upload className="w-4 h-4" />
            Import
          </button>

          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}>
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium" style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: '#E2E0DC' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className="px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap"
              style={{
                borderColor: activeTab === cat.id ? '#E69F50' : 'transparent',
                color: activeTab === cat.id ? '#E69F50' : '#6B6B6B',
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search configurations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
          />
        </div>

        {/* Create Configuration Panel */}
        {createMode && (
          <div className="p-6 border rounded-lg" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
              Create New Configuration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input type="text" placeholder="Name" value={newConfigData.label} onChange={e => setNewConfigData({ ...newConfigData, label: e.target.value })} className="px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }} />
              <input type="text" placeholder="Code" value={newConfigData.code} onChange={e => setNewConfigData({ ...newConfigData, code: e.target.value })} className="px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }} />
              <input type="text" placeholder="Description" value={newConfigData.description} onChange={e => setNewConfigData({ ...newConfigData, description: e.target.value })} className="px-3 py-2 border rounded" style={{ borderColor: '#E2E0DC' }} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleCreate} className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}>
                Create
              </button>
              <button onClick={() => setCreateMode(false)} className="px-4 py-2 border rounded text-sm font-medium" style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Configurations Table */}
        {filteredConfigs.length === 0 ? (
          <div className="text-center py-16 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <p style={{ color: '#9CA3AF' }}>No configurations found. Create one to get started.</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9F7F4' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>Usage</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: '#0D3133' }}>Last Modified</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: '#0D3133' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredConfigs.map((config, idx) => (
                  <tr key={config.id} style={{ borderTop: idx > 0 ? '1px solid #E2E0DC' : 'none' }}>
                    <td className="px-4 py-3 text-sm" style={{ color: '#0D3133' }}>
                      {config.label}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <code style={{ color: '#9CA3AF' }}>{config.code}</code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: config.status === 'active' ? '#D1FAE5' : '#FEF3C7', color: config.status === 'active' ? '#065F46' : '#92400E' }}>
                        {config.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#6B6B6B' }}>
                      {config.dependencies?.usedIn?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#9CA3AF' }}>
                      {new Date(config.metadata?.updatedAt || '').toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-1 justify-center">
                      <button onClick={() => handleClone(config.id)} className="p-2 hover:bg-gray-100 rounded" title="Clone">
                        <Copy className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                      <button onClick={() => handleArchive(config.id)} className="p-2 hover:bg-gray-100 rounded" title="Archive">
                        <Archive className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      </button>
                      <button onClick={() => handleDelete(config.id)} className="p-2 hover:bg-gray-100 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
              {stats.total}
            </div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>Total Configurations</div>
          </div>
          <div className="p-4 border rounded-lg" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="text-2xl font-bold" style={{ color: '#10B981' }}>
              {stats.byStatus.active || 0}
            </div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>Active</div>
          </div>
          <div className="p-4 border rounded-lg" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="text-2xl font-bold" style={{ color: '#F59E0B' }}>
              {stats.byStatus.draft || 0}
            </div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>Draft</div>
          </div>
          <div className="p-4 border rounded-lg" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="text-2xl font-bold" style={{ color: '#6B7280' }}>
              {stats.byStatus.archived || 0}
            </div>
            <div className="text-sm" style={{ color: '#9CA3AF' }}>Archived</div>
          </div>
        </div>
      </div>
    </div>
  )
}
