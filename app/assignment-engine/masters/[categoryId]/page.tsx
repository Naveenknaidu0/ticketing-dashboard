'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Plus, Edit2, Archive, Copy, Trash2, MoreVertical, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MASTER_CATEGORIES, getMasterCategoryConfig, createMasterValue, cloneMasterValue, canDeleteMasterValue } from '@/lib/masters-engine'

export default function MasterDetailPage({ params }: { params: { categoryId: string } }) {
  const router = useRouter()
  const category = MASTER_CATEGORIES.find(c => c.id === params.categoryId)
  const config = getMasterCategoryConfig(params.categoryId)
  
  const [isEditing, setIsEditing] = useState(false)
  const [values, setValues] = useState(config.values)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'disabled' | 'archived'>('all')

  if (!category) {
    return (
      <div className="p-8" style={{ backgroundColor: '#FFFFFF' }}>
        <p style={{ color: '#EF4444' }}>Category not found</p>
      </div>
    )
  }

  const filteredValues = values
    .filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || v.status === filterStatus)
    )

  const handleAddValue = () => {
    const newValue = createMasterValue(category.id, {
      name: `New ${category.name}`,
      code: `new-${Date.now()}`,
    })
    setValues([...values, newValue])
  }

  const handleDeleteValue = (valueId: string) => {
    const canDelete = canDeleteMasterValue(category.id, valueId)
    if (!canDelete.canDelete) {
      alert(`Cannot delete: ${canDelete.reason}`)
      return
    }
    setValues(values.filter(v => v.id !== valueId))
  }

  const handleCloneValue = (value: any) => {
    const clonedValue = cloneMasterValue(value, category.id)
    setValues([...values, clonedValue])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10B981'
      case 'draft':
        return '#8B5CF6'
      case 'disabled':
        return '#F59E0B'
      case 'archived':
        return '#9CA3AF'
      default:
        return '#6B6B6B'
    }
  }

  return (
    <div className="space-y-6 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div
                className="p-2 rounded"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
                {category.name}
              </h2>
            </div>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              {category.description}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={() => setIsEditing(false)}
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                className="text-sm font-medium"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="text-sm font-medium"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                className="text-sm font-medium flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Total Values</p>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {values.length}
          </p>
        </div>
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Active</p>
          <p className="text-2xl font-bold" style={{ color: '#10B981' }}>
            {values.filter(v => v.status === 'active').length}
          </p>
        </div>
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <p className="text-xs mb-1" style={{ color: '#9CA3AF' }}>Field Definitions</p>
          <p className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {config.fieldDefinitions.length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search values..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
          style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border rounded-lg text-sm"
          style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="disabled">Disabled</option>
          <option value="archived">Archived</option>
        </select>
        {isEditing && (
          <Button
            onClick={handleAddValue}
            className="flex items-center gap-2 text-sm font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add Value
          </Button>
        )}
      </div>

      {/* Values Table */}
      <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                Code
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                Description
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                Status
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                Dependencies
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredValues.map((value, idx) => (
              <tr
                key={value.id}
                style={{
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                  borderBottom: '1px solid #E2E0DC',
                }}
              >
                <td className="px-4 py-3">
                  <span className="font-medium" style={{ color: '#0D3133' }}>
                    {value.name}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                  <code className="text-xs">{value.code}</code>
                </td>
                <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                  {value.description || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(value.status)}20`,
                      color: getStatusColor(value.status),
                    }}
                  >
                    {value.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>
                  {value.dependencies?.totalUsageCount || 0}
                </td>
                <td className="px-4 py-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isEditing && (
                        <>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleCloneValue(value)}
                          >
                            <Copy className="w-4 h-4" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Archive className="w-4 h-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => handleDeleteValue(value.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Field Definitions */}
      {config.fieldDefinitions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0D3133' }}>
            Field Definitions
          </h3>
          <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                    Field Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                    Required
                  </th>
                </tr>
              </thead>
              <tbody>
                {config.fieldDefinitions.map((field, idx) => (
                  <tr
                    key={field.id}
                    style={{
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                      borderBottom: '1px solid #E2E0DC',
                    }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#0D3133' }}>
                      {field.name}
                    </td>
                    <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                      <code className="text-xs">{field.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: field.required ? '#D1FAE5' : '#FEE2E2',
                          color: field.required ? '#065F46' : '#991B1B',
                        }}
                      >
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
