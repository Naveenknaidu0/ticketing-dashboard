/**
 * System Configuration Engine - Master data management
 * Handles all system-level configuration entities
 */

export type ConfigEntityType =
  | 'department'
  | 'team'
  | 'business-unit'
  | 'location'
  | 'support-group'
  | 'vendor-group'
  | 'customer-segment'
  | 'tag'
  | 'custom-field'

export interface ConfigEntity {
  id: string
  type: ConfigEntityType
  name: string
  description: string
  status: 'active' | 'inactive' | 'archived'
  metadata?: Record<string, any>
  dependencies: string[] // IDs of entities that depend on this
  usageCount: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface Department extends ConfigEntity {
  type: 'department'
  parentDepartmentId?: string
  budget?: number
  headCount?: number
}

export interface Team extends ConfigEntity {
  type: 'team'
  departmentId: string
  teamLead?: string
  capacity?: number
}

export interface BusinessUnit extends ConfigEntity {
  type: 'business-unit'
  businessUnitCode: string
  revenue?: number
}

export interface Location extends ConfigEntity {
  type: 'location'
  address?: string
  city?: string
  state?: string
  country?: string
  timezone?: string
}

export interface SupportGroup extends ConfigEntity {
  type: 'support-group'
  teamIds: string[]
  slaPriority?: 'low' | 'medium' | 'high' | 'critical'
}

export interface VendorGroup extends ConfigEntity {
  type: 'vendor-group'
  vendorType: string
  contactEmail?: string
}

export interface CustomerSegment extends ConfigEntity {
  type: 'customer-segment'
  segmentCode: string
  parentSegmentId?: string
}

export interface Tag extends ConfigEntity {
  type: 'tag'
  color?: string
  category?: string
}

// In-memory storage
const ENTITIES = new Map<string, ConfigEntity>()

// Initialize with defaults
function initializeDefaults() {
  if (ENTITIES.size === 0) {
    const now = new Date().toISOString()
    const defaults: ConfigEntity[] = [
      {
        id: 'dept-eng',
        type: 'department',
        name: 'Engineering',
        description: 'Engineering department',
        status: 'active',
        dependencies: [],
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        id: 'dept-support',
        type: 'department',
        name: 'Support',
        description: 'Customer support department',
        status: 'active',
        dependencies: [],
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        id: 'team-l1',
        type: 'team',
        name: 'L1 Support',
        description: 'Level 1 Support Team',
        status: 'active',
        metadata: { departmentId: 'dept-support' },
        dependencies: [],
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      },
      {
        id: 'bu-cloud',
        type: 'business-unit',
        name: 'Cloud Services',
        description: 'Cloud services business unit',
        status: 'active',
        metadata: { businessUnitCode: 'CLOUD' },
        dependencies: [],
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
      },
    ]
    defaults.forEach(e => ENTITIES.set(e.id, e))
  }
}

export const systemConfigurationEngine = {
  /**
   * Create new configuration entity
   */
  createEntity(data: {
    type: ConfigEntityType
    name: string
    description: string
    metadata?: Record<string, any>
    userId: string
  }): ConfigEntity {
    const now = new Date().toISOString()
    const id = `${data.type}-${Date.now()}`

    const entity: ConfigEntity = {
      id,
      type: data.type,
      name: data.name,
      description: data.description,
      status: 'active',
      metadata: data.metadata,
      dependencies: [],
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: data.userId,
      updatedBy: data.userId,
    }

    ENTITIES.set(id, entity)
    return entity
  },

  /**
   * Get entity by ID
   */
  getEntity(entityId: string): ConfigEntity | null {
    initializeDefaults()
    return ENTITIES.get(entityId) || null
  },

  /**
   * Get all entities of a type
   */
  getEntitiesByType(type: ConfigEntityType): ConfigEntity[] {
    initializeDefaults()
    return Array.from(ENTITIES.values()).filter(e => e.type === type && e.status !== 'archived')
  },

  /**
   * Get all active entities
   */
  getAllEntities(): ConfigEntity[] {
    initializeDefaults()
    return Array.from(ENTITIES.values()).filter(e => e.status !== 'archived')
  },

  /**
   * Get all entities including archived
   */
  getAllEntitiesWithArchived(): ConfigEntity[] {
    initializeDefaults()
    return Array.from(ENTITIES.values())
  },

  /**
   * Update entity
   */
  updateEntity(
    entityId: string,
    updates: Partial<Omit<ConfigEntity, 'id' | 'type' | 'createdAt' | 'createdBy'>>,
    userId: string
  ): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity) return null

    const updated: ConfigEntity = {
      ...entity,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Add dependency
   */
  addDependency(entityId: string, dependentEntityId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity || entity.dependencies.includes(dependentEntityId)) return entity || null

    const updated: ConfigEntity = {
      ...entity,
      dependencies: [...entity.dependencies, dependentEntityId],
      updatedAt: new Date().toISOString(),
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Remove dependency
   */
  removeDependency(entityId: string, dependentEntityId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity) return null

    const updated: ConfigEntity = {
      ...entity,
      dependencies: entity.dependencies.filter(d => d !== dependentEntityId),
      updatedAt: new Date().toISOString(),
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Increment usage count
   */
  incrementUsageCount(entityId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity) return null

    const updated: ConfigEntity = {
      ...entity,
      usageCount: entity.usageCount + 1,
      updatedAt: new Date().toISOString(),
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Decrement usage count
   */
  decrementUsageCount(entityId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity || entity.usageCount === 0) return entity || null

    const updated: ConfigEntity = {
      ...entity,
      usageCount: Math.max(0, entity.usageCount - 1),
      updatedAt: new Date().toISOString(),
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Archive entity
   */
  archiveEntity(entityId: string, userId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity) return null

    const updated: ConfigEntity = {
      ...entity,
      status: 'archived',
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Restore archived entity
   */
  restoreEntity(entityId: string, userId: string): ConfigEntity | null {
    const entity = ENTITIES.get(entityId)
    if (!entity) return null

    const updated: ConfigEntity = {
      ...entity,
      status: 'active',
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    ENTITIES.set(entityId, updated)
    return updated
  },

  /**
   * Delete entity permanently
   */
  deleteEntity(entityId: string): boolean {
    return ENTITIES.delete(entityId)
  },

  /**
   * Clone entity
   */
  cloneEntity(entityId: string, userId: string): ConfigEntity | null {
    const original = ENTITIES.get(entityId)
    if (!original) return null

    const now = new Date().toISOString()
    const newId = `${original.type}-${Date.now()}`

    const cloned: ConfigEntity = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      dependencies: [],
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }

    ENTITIES.set(newId, cloned)
    return cloned
  },

  /**
   * Search entities by name
   */
  searchEntities(query: string, type?: ConfigEntityType): ConfigEntity[] {
    initializeDefaults()
    const lowerQuery = query.toLowerCase()
    return Array.from(ENTITIES.values()).filter(e => {
      const matchesType = !type || e.type === type
      const matchesQuery = e.name.toLowerCase().includes(lowerQuery) || e.description.toLowerCase().includes(lowerQuery)
      return matchesType && matchesQuery && e.status !== 'archived'
    })
  },

  /**
   * Get entity statistics
   */
  getStatistics() {
    initializeDefaults()
    const entities = Array.from(ENTITIES.values())
    const stats: Record<ConfigEntityType, number> = {
      'department': 0,
      'team': 0,
      'business-unit': 0,
      'location': 0,
      'support-group': 0,
      'vendor-group': 0,
      'customer-segment': 0,
      'tag': 0,
      'custom-field': 0,
    }

    entities.forEach(e => {
      if (stats.hasOwnProperty(e.type)) {
        stats[e.type]++
      }
    })

    return {
      total: entities.length,
      active: entities.filter(e => e.status === 'active').length,
      inactive: entities.filter(e => e.status === 'inactive').length,
      archived: entities.filter(e => e.status === 'archived').length,
      byType: stats,
    }
  },

  /**
   * Export entities as JSON
   */
  exportEntities(type?: ConfigEntityType): ConfigEntity[] {
    initializeDefaults()
    const entities = Array.from(ENTITIES.values())
    return type ? entities.filter(e => e.type === type) : entities
  },

  /**
   * Import entities from JSON
   */
  importEntities(entities: ConfigEntity[], userId: string): number {
    let imported = 0
    for (const entity of entities) {
      const newEntity = {
        ...entity,
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      ENTITIES.set(entity.id, newEntity)
      imported++
    }
    return imported
  },
}
