// Workspace Engine for Configuration Studio
// Provides core workspace functionality, filtering, searching, and bulk operations

import { ConfigurationValue, validateConfigurationValue, cloneConfigurationValue, checkDependencies, canDeleteValue } from './configuration-registry'

export interface WorkspaceConfig {
  id: string
  title: string
  description: string
  systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'dashboard' | 'system'
  categories: WorkspaceCategory[]
}

export interface WorkspaceCategory {
  id: string
  name: string
  description: string
}

export interface FilterCriteria {
  status?: 'active' | 'draft' | 'disabled' | 'archived'
  category?: string
  searchTerm?: string
  createdBy?: string
  minUsageCount?: number
  maxUsageCount?: number
}

export interface SortOptions {
  field: 'name' | 'code' | 'lastModified' | 'usageCount' | 'createdAt'
  direction: 'asc' | 'desc'
}

// Filter configurations by workspace criteria
export function filterConfigurations(
  configs: ConfigurationValue[],
  criteria: FilterCriteria
): ConfigurationValue[] {
  return configs.filter(config => {
    if (criteria.status && config.status !== criteria.status) return false
    if (criteria.category && config.category !== criteria.category) return false
    if (criteria.createdBy && config.metadata?.createdBy !== criteria.createdBy) return false

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase()
      const matchesSearch =
        config.label.toLowerCase().includes(term) ||
        config.code.toLowerCase().includes(term) ||
        config.description?.toLowerCase().includes(term)
      if (!matchesSearch) return false
    }

    if (criteria.minUsageCount !== undefined && (config.dependencies?.usedIn?.length || 0) < criteria.minUsageCount) {
      return false
    }
    if (criteria.maxUsageCount !== undefined && (config.dependencies?.usedIn?.length || 0) > criteria.maxUsageCount) {
      return false
    }

    return true
  })
}

// Sort configurations
export function sortConfigurations(configs: ConfigurationValue[], options: SortOptions): ConfigurationValue[] {
  const sorted = [...configs].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (options.field) {
      case 'name':
        aValue = a.label.toLowerCase()
        bValue = b.label.toLowerCase()
        break
      case 'code':
        aValue = a.code.toLowerCase()
        bValue = b.code.toLowerCase()
        break
      case 'lastModified':
        aValue = new Date(a.metadata?.updatedAt || 0).getTime()
        bValue = new Date(b.metadata?.updatedAt || 0).getTime()
        break
      case 'usageCount':
        aValue = a.dependencies?.usedIn?.length || 0
        bValue = b.dependencies?.usedIn?.length || 0
        break
      case 'createdAt':
        aValue = new Date(a.metadata?.createdAt || 0).getTime()
        bValue = new Date(b.metadata?.createdAt || 0).getTime()
        break
    }

    if (aValue < bValue) return options.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return options.direction === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

// Batch operations
export interface BatchOperationResult {
  successful: number
  failed: number
  errors: string[]
}

export function batchArchiveConfigurations(ids: string[]): BatchOperationResult {
  const result: BatchOperationResult = { successful: 0, failed: 0, errors: [] }

  ids.forEach(id => {
    try {
      // Logic would go here to update status
      result.successful++
    } catch (error) {
      result.failed++
      result.errors.push(`Failed to archive ${id}: ${error}`)
    }
  })

  return result
}

export function batchDeleteConfigurations(ids: string[]): BatchOperationResult {
  const result: BatchOperationResult = { successful: 0, failed: 0, errors: [] }

  ids.forEach(id => {
    const canDelete = canDeleteValue(id)
    if (!canDelete.canDelete) {
      result.failed++
      result.errors.push(`Cannot delete: ${canDelete.reason}`)
    } else {
      try {
        // deleteConfigurationValue(id)
        result.successful++
      } catch (error) {
        result.failed++
        result.errors.push(`Failed to delete ${id}`)
      }
    }
  })

  return result
}

// Export configurations to CSV
export function exportConfigurationsToCSV(configs: ConfigurationValue[], filename: string): void {
  const headers = ['Name', 'Code', 'Status', 'Color', 'Description', 'Last Modified', 'Created By']
  const rows = configs.map(c => [
    c.label,
    c.code,
    c.status,
    c.color || '',
    c.description || '',
    new Date(c.metadata?.updatedAt || '').toLocaleDateString(),
    c.metadata?.createdBy || '',
  ])

  const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Import configurations from CSV
export interface ImportResult {
  successful: number
  failed: number
  errors: string[]
}

export function parseCSVImport(csvContent: string): ConfigurationValue[] {
  const lines = csvContent.trim().split('\n')
  const configs: ConfigurationValue[] = []

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(cell => cell.replace(/^"|"$/g, ''))
    if (cells.length >= 2) {
      const validation = validateConfigurationValue({
        label: cells[0],
        code: cells[1],
        description: cells[4] || undefined,
      })

      if (validation.isValid) {
        configs.push({
          id: `import-${Date.now()}-${i}`,
          label: cells[0],
          code: cells[1],
          description: cells[4] || '',
          status: 'draft',
          category: '',
          systemCategory: 'queue',
          color: cells[3] || '#3B82F6',
          order: i,
          dependencies: { usedIn: [] },
          metadata: {
            createdAt: new Date().toISOString(),
            createdBy: 'import',
            updatedAt: new Date().toISOString(),
            updatedBy: 'import',
            version: 1,
          },
        })
      }
    }
  }

  return configs
}

// Workspace statistics
export interface WorkspaceStats {
  total: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  topUsed: ConfigurationValue[]
  recentlyModified: ConfigurationValue[]
}

export function calculateWorkspaceStats(configs: ConfigurationValue[]): WorkspaceStats {
  const stats: WorkspaceStats = {
    total: configs.length,
    byStatus: {},
    byCategory: {},
    topUsed: [],
    recentlyModified: [],
  }

  // Status breakdown
  configs.forEach(c => {
    stats.byStatus[c.status] = (stats.byStatus[c.status] || 0) + 1
    stats.byCategory[c.category] = (stats.byCategory[c.category] || 0) + 1
  })

  // Top used
  stats.topUsed = [...configs]
    .sort((a, b) => (b.dependencies?.usedIn?.length || 0) - (a.dependencies?.usedIn?.length || 0))
    .slice(0, 5)

  // Recently modified
  stats.recentlyModified = [...configs]
    .sort((a, b) => new Date(b.metadata?.updatedAt || '').getTime() - new Date(a.metadata?.updatedAt || '').getTime())
    .slice(0, 5)

  return stats
}
