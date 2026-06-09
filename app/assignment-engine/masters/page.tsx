'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Plus, Download, Upload, Settings, Search, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MASTER_CATEGORIES, getMasterCategoryConfig, exportMasters, createMasterCategory, getAllMasterCategories } from '@/lib/masters-engine'

export default function MastersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    allowCustomValues: true,
    allowHierarchy: false,
  })
  const [categories, setCategories] = useState(getAllMasterCategories())

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateCategory = () => {
    if (!createFormData.name.trim()) {
      alert('Please enter a category name')
      return
    }

    const newCategory = createMasterCategory({
      name: createFormData.name,
      description: createFormData.description,
      color: createFormData.color,
      allowCustomValues: createFormData.allowCustomValues,
      allowHierarchy: createFormData.allowHierarchy,
    })

    setCategories(getAllMasterCategories())
    setShowCreateModal(false)
    setCreateFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      allowCustomValues: true,
      allowHierarchy: false,
    })

    router.push(`/assignment-engine/masters/${newCategory.id}`)
  }

  const handleExport = () => {
    const dataStr = exportMasters()
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `masters-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getCategoryStats = (categoryId: string) => {
    const config = getMasterCategoryConfig(categoryId)
    return {
      totalValues: config.stats.totalValues,
      activeValues: config.stats.activeValues,
      dependencies: config.totalDependencies,
    }
  }

  return (
    <div className="space-y-8 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: '#0D3133' }}>
            Masters Engine
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
            Enterprise Configuration Platform • {MASTER_CATEGORIES.length} categories • Single Source of Truth
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" />
            New Category
          </Button>
          <Button
            className="flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            className="flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Search and View Options */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search masters..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
          />
        </div>
        <div className="flex border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <button
            onClick={() => setViewMode('grid')}
            className="p-2 transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? '#F3F4F3' : 'transparent',
              color: viewMode === 'grid' ? '#E69F50' : '#6B6B6B',
            }}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="p-2 transition-colors border-l"
            style={{
              borderLeftColor: '#E2E0DC',
              backgroundColor: viewMode === 'list' ? '#F3F4F3' : 'transparent',
              color: viewMode === 'list' ? '#E69F50' : '#6B6B6B',
            }}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Masters Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => {
            const stats = getCategoryStats(category.id)
            return (
              <button
                key={category.id}
                onClick={() => router.push(`/assignment-engine/masters/${category.id}`)}
                className="text-left p-6 border rounded-lg hover:shadow-lg transition-all"
                style={{
                  borderColor: '#E2E0DC',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    <Settings className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                </div>

                <h3 className="font-semibold text-base mb-1" style={{ color: '#0D3133' }}>
                  {category.name}
                </h3>
                <p className="text-xs mb-4" style={{ color: '#6B6B6B' }}>
                  {category.description}
                </p>

                <div className="flex gap-4 pt-4 border-t" style={{ borderColor: '#E2E0DC' }}>
                  <div>
                    <div className="text-lg font-bold" style={{ color: '#0D3133' }}>
                      {stats.totalValues}
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      Values
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: '#10B981' }}>
                      {stats.activeValues}
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      Active
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold" style={{ color: stats.dependencies > 0 ? '#F59E0B' : '#9CA3AF' }}>
                      {stats.dependencies}
                    </div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>
                      Dependencies
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                  Category
                </th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                  Description
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  Values
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  Active
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  Dependencies
                </th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category, idx) => {
                const stats = getCategoryStats(category.id)
                return (
                  <tr
                    key={category.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                      borderBottom: '1px solid #E2E0DC',
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded"
                          style={{ backgroundColor: `${category.color}20`, color: category.color }}
                        >
                          <Settings className="w-4 h-4" />
                        </div>
                        <span className="font-medium" style={{ color: '#0D3133' }}>
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                      {category.description}
                    </td>
                    <td className="px-4 py-3 text-center font-medium" style={{ color: '#0D3133' }}>
                      {stats.totalValues}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                        {stats.activeValues}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: stats.dependencies > 0 ? '#FEF3C7' : '#F3F4F3',
                          color: stats.dependencies > 0 ? '#92400E' : '#9CA3AF',
                        }}
                      >
                        {stats.dependencies}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => router.push(`/assignment-engine/masters/${category.id}`)}
                        className="text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: '#E69F50' }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
            Central Configuration
          </h4>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>
            Manage all system configurations in one place without hardcoded values.
          </p>
        </div>
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
            Real-Time Propagation
          </h4>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>
            Changes instantly propagate to all connected systems without requiring refreshes.
          </p>
        </div>
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#0D3133' }}>
            Dependency Tracking
          </h4>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>
            Prevent accidental deletions with complete dependency analysis and audit trails.
          </p>
        </div>
      </div>

      {/* Create Category Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#0D3133' }}>
              Create New Master Category
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={createFormData.name}
                  onChange={e => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="e.g., Priority Levels"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>
                  Description
                </label>
                <textarea
                  value={createFormData.description}
                  onChange={e => setCreateFormData({ ...createFormData, description: e.target.value })}
                  placeholder="Describe this master category..."
                  className="w-full px-3 py-2 border rounded-lg text-sm h-20 resize-none"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>
                  Color
                </label>
                <div className="flex gap-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 transition-all ${createFormData.color === color ? 'border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCreateFormData({ ...createFormData, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm" style={{ color: '#0D3133' }}>
                  <input
                    type="checkbox"
                    checked={createFormData.allowCustomValues}
                    onChange={e => setCreateFormData({ ...createFormData, allowCustomValues: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Allow custom values</span>
                </label>
                <label className="flex items-center gap-2 text-sm" style={{ color: '#0D3133' }}>
                  <input
                    type="checkbox"
                    checked={createFormData.allowHierarchy}
                    onChange={e => setCreateFormData({ ...createFormData, allowHierarchy: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span>Allow hierarchy</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium transition-colors"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCategory}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

