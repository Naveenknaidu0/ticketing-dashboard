'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Plus,
  Download,
  Upload,
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
import { RuleComplete } from '@/lib/types'
import { DEFAULT_RULES, exportRules } from '@/lib/rule-engine'

export default function RulesPage() {
  const router = useRouter()
  const [rules, setRules] = useState<RuleComplete[]>(DEFAULT_RULES)
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('priority')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'disabled' | 'archived'>('all')

  // Filter and sort rules
  const filteredRules = rules
    .filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || rule.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortColumn as keyof RuleComplete]
      let bValue: any = b[sortColumn as keyof RuleComplete]

      if (sortColumn === 'successRate') {
        aValue = a.successRate || 0
        bValue = b.successRate || 0
      } else if (sortColumn === 'totalExecutions') {
        aValue = a.totalExecutions || 0
        bValue = b.totalExecutions || 0
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

  const handleCreateRule = () => {
    const newRule: RuleComplete = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      description: '',
      category: 'routing',
      priority: 1,
      status: 'draft',
      triggers: [],
      conditionGroups: [],
      actions: [],
      executionConfig: {
        strategy: 'first-match',
        maxActionsPerRule: 5,
        continueOnError: false,
        parallelExecution: false,
        timeoutSeconds: 30,
        rollbackOnError: false,
      },
      enabled: false,
      relatedQueues: [],
      relatedSkills: [],
      relatedAutomations: [],
      dependentRules: [],
      testCases: [],
      lastTestResults: [],
      testCoverage: 0,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      successRate: 100,
      averageExecutionTime: 0,
      version: 1,
      versionHistory: [],
      auditLog: [],
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    }
    setRules([...rules, newRule])
    router.push(`/assignment-engine/rules/${newRule.id}`)
  }

  const handleCloneRule = (rule: RuleComplete, e: React.MouseEvent) => {
    e.stopPropagation()
    const clonedRule: RuleComplete = {
      ...rule,
      id: `rule-${Date.now()}`,
      name: `${rule.name} (Copy)`,
      version: 1,
      versionHistory: [],
      auditLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      enabled: false,
    }
    setRules([...rules, clonedRule])
  }

  const handleDisableRule = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRules(rules.map(r => 
      r.id === ruleId 
        ? { ...r, status: r.status === 'active' ? 'disabled' : 'active', enabled: !r.enabled }
        : r
    ))
  }

  const handleArchiveRule = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRules(rules.map(r =>
      r.id === ruleId ? { ...r, status: 'archived' } : r
    ))
  }

  const handleDeleteRule = (ruleId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setRules(rules.filter(r => r.id !== ruleId))
  }

  const handleExport = () => {
    const dataStr = exportRules(filteredRules)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `rules-${Date.now()}.json`
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

  return (
    <div className="space-y-8 p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            Assignment Rules
          </h2>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
            No-Code Rule Engine • {rules.length} rules • {rules.filter(r => r.status === 'active').length} active
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
            onClick={handleCreateRule}
          >
            <Plus className="w-4 h-4" />
            Create Rule
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search rules..."
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

      {/* Rules Table */}
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:opacity-70"
                >
                  Rule Name
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
              <th className="px-4 py-3 text-left font-semibold" style={{ color: '#0D3133' }}>Triggers</th>
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
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>V</th>
              <th className="px-4 py-3 text-right font-semibold" style={{ color: '#0D3133' }}>Last Updated</th>
              <th className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRules.map((rule, index) => (
              <tr
                key={rule.id}
                onClick={() => {
                  setSelectedRule(rule.id)
                  router.push(`/assignment-engine/rules/${rule.id}`)
                }}
                style={{
                  backgroundColor: selectedRule === rule.id ? '#F0F3F4' : index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                  borderBottom: '1px solid #E2E0DC',
                  cursor: 'pointer',
                }}
              >
                <td className="px-4 py-3" style={{ color: '#0D3133' }}>
                  <div className="font-medium">{rule.name}</div>
                  <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                    {rule.description?.substring(0, 40)}...
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                  {rule.category}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: rule.priority === 1 ? '#FEE2E2' : rule.priority === 2 ? '#FEF3C7' : '#F0FDF4',
                      color: rule.priority === 1 ? '#991B1B' : rule.priority === 2 ? '#92400E' : '#166534',
                    }}
                  >
                    P{rule.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {rule.triggers.slice(0, 2).map(trigger => (
                      <span
                        key={trigger.id}
                        className="px-2 py-1 rounded text-xs bg-blue-100"
                        style={{ color: '#1E40AF' }}
                      >
                        {trigger.type}
                      </span>
                    ))}
                    {rule.triggers.length > 2 && (
                      <span className="px-2 py-1 text-xs" style={{ color: '#9CA3AF' }}>
                        +{rule.triggers.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-semibold" style={{ color: '#0D3133' }}>
                  {rule.actions.length}
                </td>
                <td className="px-4 py-3">
                  <div
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(rule.status)}20`,
                      color: getStatusColor(rule.status),
                    }}
                  >
                    {rule.status === 'active' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    {getStatusLabel(rule.status)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="font-semibold" style={{ color: rule.successRate >= 95 ? '#10B981' : '#F59E0B' }}>
                    {rule.successRate.toFixed(1)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right" style={{ color: '#6B6B6B' }}>
                  {rule.totalExecutions}
                </td>
                <td className="px-4 py-3 text-center" style={{ color: '#0D3133' }}>
                  {rule.version}
                </td>
                <td className="px-4 py-3 text-right text-xs" style={{ color: '#9CA3AF' }}>
                  {new Date(rule.updatedAt).toLocaleDateString()}
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
                        onClick={() => router.push(`/assignment-engine/rules/${rule.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center gap-2"
                        onClick={() => router.push(`/assignment-engine/rules/${rule.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Rule
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleCloneRule(rule, e as any)}
                      >
                        <Copy className="w-4 h-4" />
                        Clone Rule
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleDisableRule(rule.id, e as any)}
                      >
                        <AlertCircle className="w-4 h-4" />
                        {rule.status === 'active' ? 'Disable' : 'Enable'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2"
                        onClick={(e) => handleArchiveRule(rule.id, e as any)}
                      >
                        <Archive className="w-4 h-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-red-600"
                        onClick={(e) => handleDeleteRule(rule.id, e as any)}
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
