'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Download,
  Copy,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Archive,
  Trash2,
  Eye,
  Edit2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AutomationComplete } from '@/lib/types'
import { DEFAULT_AUTOMATIONS, exportAutomations, AUTOMATION_CATEGORIES } from '@/lib/automation-engine'

export default function AutomationsPage() {
  const router = useRouter()
  const [automations, setAutomations] = useState<AutomationComplete[]>(DEFAULT_AUTOMATIONS)
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('priority')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'disabled' | 'archived'>('all')

  const filteredAutomations = automations
    .filter(auto => {
      const matchesSearch = auto.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || auto.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortColumn as keyof AutomationComplete]
      let bValue: any = b[sortColumn as keyof AutomationComplete]

      if (sortColumn === 'successRate') {
        aValue = a.successRate || 0
        bValue = b.successRate || 0
      } else if (sortColumn === 'totalExecutions') {
        aValue = a.totalExecutions || 0
        bValue = b.totalExecutions || 0
      } else if (sortColumn === 'tasksCreated') {
        aValue = a.tasksCreated || 0
        bValue = b.tasksCreated || 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const handleCreateAutomation = () => {
    const newAutomation: AutomationComplete = {
      id: `automation-${Date.now()}`,
      name: 'New Automation',
      description: '',
      category: 'ticket',
      priority: 2,
      status: 'draft',
      enabled: false,
      triggers: [],
      conditionGroups: [],
      actions: [],
      executionConfig: {
        strategy: 'first-match',
        maxActionsPerAutomation: 10,
        continueOnError: false,
        parallelExecution: false,
        timeoutSeconds: 30,
        rollbackOnError: false,
      },
      relatedQueues: [],
      relatedSkills: [],
      relatedAgents: [],
      dependentAutomations: [],
      testCases: [],
      lastTestResults: [],
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      successRate: 100,
      tasksCreated: 0,
      averageExecutionTime: 0,
      version: 1,
      versionHistory: [],
      auditLog: [],
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    }
    setAutomations([...automations, newAutomation])
    router.push(`/assignment-engine/automations/${newAutomation.id}`)
  }

  const handleCloneAutomation = (automation: AutomationComplete, e: React.MouseEvent) => {
    e.stopPropagation()
    const clonedAutomation: AutomationComplete = {
      ...automation,
      id: `automation-${Date.now()}`,
      name: `${automation.name} (Copy)`,
      version: 1,
      versionHistory: [],
      auditLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      enabled: false,
    }
    setAutomations([...automations, clonedAutomation])
  }

  const handleDisableAutomation = (automationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAutomations(automations.map(a =>
      a.id === automationId
        ? { ...a, status: a.status === 'active' ? 'disabled' : 'active', enabled: !a.enabled }
        : a
    ))
  }

  const handleArchiveAutomation = (automationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAutomations(automations.map(a =>
      a.id === automationId ? { ...a, status: 'archived' } : a
    ))
  }

  const handleDeleteAutomation = (automationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAutomations(automations.filter(a => a.id !== automationId))
  }

  const handleExport = () => {
    const dataStr = exportAutomations(filteredAutomations)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `automations-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'draft':
        return 'Draft'
      case 'disabled':
        return 'Disabled'
      case 'archived':
        return 'Archived'
      default:
        return status
    }
  }

  const getCategoryColor = (categoryId: string) => {
    return AUTOMATION_CATEGORIES.find(c => c.id === categoryId)?.color || '#6B7280'
  }

  return (
    <div className="space-y-8 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            Automations
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
            Enterprise Automation Engine • {automations.length} automations • {automations.filter(a => a.status === 'active').length} active
          </p>
        </div>
        <div className="flex gap-2">
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
            onClick={handleCreateAutomation}
          >
            <Plus className="w-4 h-4" />
            Create Automation
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search automations..."
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
      </div>

      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:opacity-70"
                >
                  Automation Name
                  {sortColumn === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center gap-1 hover:opacity-70"
                >
                  Category
                  {sortColumn === 'category' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-1 hover:opacity-70"
                >
                  Priority
                  {sortColumn === 'priority' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>Triggers</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>Actions</th>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>Status</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('successRate')}
                  className="flex items-center gap-1 ml-auto hover:opacity-70"
                >
                  Success Rate
                  {sortColumn === 'successRate' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('totalExecutions')}
                  className="flex items-center gap-1 ml-auto hover:opacity-70"
                >
                  Executions
                  {sortColumn === 'totalExecutions' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('tasksCreated')}
                  className="flex items-center gap-1 ml-auto hover:opacity-70"
                >
                  Tasks
                  {sortColumn === 'tasksCreated' && (
                    sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>V</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAutomations.map((automation, index) => (
              <tr
                key={automation.id}
                onClick={() => {
                  setSelectedAutomation(automation.id)
                  router.push(`/assignment-engine/automations/${automation.id}`)
                }}
                style={{
                  backgroundColor: selectedAutomation === automation.id ? '#F0F3F4' : index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                  borderBottom: '1px solid #E2E0DC',
                  cursor: 'pointer',
                }}
              >
                <td className="px-4 py-3" style={{ color: '#0D3133' }}>
                  <div className="font-medium">{automation.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    {automation.description?.substring(0, 40)}...
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${getCategoryColor(automation.category)}20`,
                      color: getCategoryColor(automation.category),
                    }}
                  >
                    {automation.category}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: automation.priority === 1 ? '#FEE2E2' : automation.priority === 2 ? '#FEF3C7' : '#F0FDF4',
                      color: automation.priority === 1 ? '#991B1B' : automation.priority === 2 ? '#92400E' : '#166534',
                    }}
                  >
                    P{automation.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  {automation.triggers.length}
                </td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  {automation.actions.length}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(automation.status)}20`,
                      color: getStatusColor(automation.status),
                    }}
                  >
                    {automation.status === 'active' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {getStatusLabel(automation.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold" style={{ color: automation.successRate >= 95 ? '#10B981' : '#F59E0B' }}>
                    {automation.successRate.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right" style={{ color: '#6B6B6B' }}>
                  {automation.totalExecutions}
                </td>
                <td className="px-4 py-3 text-right" style={{ color: '#6B6B6B' }}>
                  {automation.tasksCreated}
                </td>
                <td className="px-4 py-3 text-center" style={{ color: '#0D3133' }}>
                  {automation.version}
                </td>
                <td className="px-4 py-3 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={e => e.stopPropagation()}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => router.push(`/assignment-engine/automations/${automation.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => router.push(`/assignment-engine/automations/${automation.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Automation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleCloneAutomation(automation, e as any)}
                      >
                        <Copy className="w-4 h-4" />
                        Clone Automation
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleDisableAutomation(automation.id, e as any)}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {automation.status === 'active' ? 'Disable' : 'Enable'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleArchiveAutomation(automation.id, e as any)}
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={(e) => handleDeleteAutomation(automation.id, e as any)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
