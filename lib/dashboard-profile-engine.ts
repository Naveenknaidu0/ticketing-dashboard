/**
 * Dashboard Profile Engine
 * Manages dashboard profiles for different roles/personas
 * Each profile defines which widgets, tabs, and layouts are available
 */

import { logAuditEvent } from './audit-log-engine'

export type DashboardRole = 'agent' | 'supervisor' | 'manager' | 'executive' | 'admin' | 'analyst'

export interface DashboardWidget {
  id: string
  name: string
  component: string
  category: 'metrics' | 'analytics' | 'assignment' | 'performance' | 'sla' | 'custom'
  icon: string
  description: string
  minWidth: number
  maxWidth: number
  defaultWidth: number
  defaultHeight: number
  supportedRoles: DashboardRole[]
  requiresPermissions: string[]
  enabled: boolean
  metadata?: Record<string, any>
}

export interface DashboardTab {
  id: string
  name: string
  description?: string
  widgets: string[] // widget IDs
  order: number
  visibleTo: DashboardRole[]
  default?: boolean
}

export interface DashboardLayout {
  id: string
  roleId: DashboardRole
  tabs: DashboardTab[]
  theme?: {
    primaryColor?: string
    backgroundColor?: string
    cardStyle?: 'minimal' | 'bordered' | 'elevated'
  }
  settings: {
    showRefreshButton: boolean
    autoRefreshInterval?: number
    allowCustomization: boolean
    allowExport: boolean
  }
  updatedAt: string
  updatedBy: string
}

export interface DashboardProfile {
  id: string
  role: DashboardRole
  name: string
  description: string
  layout: DashboardLayout
  defaultTab?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  status: 'active' | 'draft' | 'archived'
}

// In-memory storage for dashboard profiles
let DASHBOARD_PROFILES: DashboardProfile[] = [
  {
    id: 'profile-agent-default',
    role: 'agent',
    name: 'Agent Dashboard',
    description: 'Dashboard for L1 support agents',
    layout: {
      id: 'layout-agent-1',
      roleId: 'agent',
      tabs: [
        {
          id: 'tab-agent-assigned',
          name: 'Assigned Tickets',
          widgets: ['widget-my-tickets', 'widget-sla-status'],
          order: 1,
          visibleTo: ['agent', 'supervisor', 'manager'],
          default: true,
        },
        {
          id: 'tab-agent-queue',
          name: 'Queue Status',
          widgets: ['widget-queue-metrics', 'widget-wait-time'],
          order: 2,
          visibleTo: ['agent', 'supervisor', 'manager'],
        },
      ],
      settings: {
        showRefreshButton: true,
        autoRefreshInterval: 30,
        allowCustomization: false,
        allowExport: true,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    status: 'active',
  },
  {
    id: 'profile-manager-default',
    role: 'manager',
    name: 'Manager Dashboard',
    description: 'Dashboard for managers and supervisors',
    layout: {
      id: 'layout-manager-1',
      roleId: 'manager',
      tabs: [
        {
          id: 'tab-manager-overview',
          name: 'Team Overview',
          widgets: [
            'widget-team-metrics',
            'widget-sla-compliance',
            'widget-agent-performance',
            'widget-queue-health',
          ],
          order: 1,
          visibleTo: ['manager', 'supervisor', 'executive'],
          default: true,
        },
        {
          id: 'tab-manager-assignments',
          name: 'Assignments',
          widgets: ['widget-assignment-rules', 'widget-skill-distribution'],
          order: 2,
          visibleTo: ['manager', 'supervisor'],
        },
        {
          id: 'tab-manager-analytics',
          name: 'Analytics',
          widgets: ['widget-trends', 'widget-performance-chart'],
          order: 3,
          visibleTo: ['manager', 'executive', 'analyst'],
        },
      ],
      settings: {
        showRefreshButton: true,
        autoRefreshInterval: 60,
        allowCustomization: true,
        allowExport: true,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    status: 'active',
  },
  {
    id: 'profile-executive-default',
    role: 'executive',
    name: 'Executive Dashboard',
    description: 'High-level metrics for executives',
    layout: {
      id: 'layout-executive-1',
      roleId: 'executive',
      tabs: [
        {
          id: 'tab-executive-kpi',
          name: 'KPIs',
          widgets: ['widget-kpi-summary', 'widget-revenue-impact', 'widget-customer-satisfaction'],
          order: 1,
          visibleTo: ['executive', 'manager'],
          default: true,
        },
      ],
      settings: {
        showRefreshButton: true,
        autoRefreshInterval: 300,
        allowCustomization: false,
        allowExport: true,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'system',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
    updatedBy: 'system',
    status: 'active',
  },
]

class DashboardProfileEngineClass {
  /**
   * Get profile for a specific role
   */
  getProfileByRole(role: DashboardRole): DashboardProfile | null {
    return DASHBOARD_PROFILES.find(p => p.role === role && p.status === 'active') || null
  }

  /**
   * Get all profiles
   */
  getAllProfiles(): DashboardProfile[] {
    return DASHBOARD_PROFILES.filter(p => p.status !== 'archived')
  }

  /**
   * Get profile by ID
   */
  getProfileById(id: string): DashboardProfile | null {
    return DASHBOARD_PROFILES.find(p => p.id === id) || null
  }

  /**
   * Create new dashboard profile
   */
  createProfile(data: Omit<DashboardProfile, 'id' | 'createdAt' | 'updatedAt'>): DashboardProfile {
    const profile: DashboardProfile = {
      ...data,
      id: `profile-${data.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
    }

    DASHBOARD_PROFILES.push(profile)

    logAuditEvent({
      eventType: 'dashboard_profile_created',
      module: 'dashboard',
      action: 'create',
      entityId: profile.id,
      entityType: 'DashboardProfile',
      entityName: profile.name,
      userId: data.createdBy,
      userName: data.createdBy,
      userRole: 'manager',
      afterState: profile,
      source: 'ui',
    })

    return profile
  }

  /**
   * Update dashboard profile
   */
  updateProfile(id: string, updates: Partial<DashboardProfile>): DashboardProfile | null {
    const profile = this.getProfileById(id)
    if (!profile) return null

    const beforeState = JSON.parse(JSON.stringify(profile))

    Object.assign(profile, updates, {
      updatedAt: new Date().toISOString(),
    })

    logAuditEvent({
      eventType: 'dashboard_profile_updated',
      module: 'dashboard',
      action: 'update',
      entityId: profile.id,
      entityType: 'DashboardProfile',
      entityName: profile.name,
      userId: updates.updatedBy || 'system',
      userName: updates.updatedBy || 'system',
      userRole: 'manager',
      beforeState,
      afterState: profile,
      source: 'ui',
    })

    return profile
  }

  /**
   * Publish draft profile to active
   */
  publishProfile(id: string, publishedBy: string): DashboardProfile | null {
    const profile = this.getProfileById(id)
    if (!profile || profile.status !== 'draft') return null

    return this.updateProfile(id, {
      status: 'active',
      updatedBy: publishedBy,
    })
  }

  /**
   * Archive profile
   */
  archiveProfile(id: string, archivedBy: string): boolean {
    const profile = this.getProfileById(id)
    if (!profile) return false

    this.updateProfile(id, {
      status: 'archived',
      updatedBy: archivedBy,
    })
    return true
  }

  /**
   * Clone profile for another role
   */
  cloneProfile(sourceId: string, targetRole: DashboardRole, clonedBy: string): DashboardProfile | null {
    const source = this.getProfileById(sourceId)
    if (!source) return null

    const clone: DashboardProfile = {
      ...JSON.parse(JSON.stringify(source)),
      id: `profile-${targetRole}-${Date.now()}`,
      role: targetRole,
      name: `${source.name} (${targetRole})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: clonedBy,
      updatedBy: clonedBy,
      status: 'draft',
    }

    clone.layout.roleId = targetRole

    DASHBOARD_PROFILES.push(clone)

    logAuditEvent({
      eventType: 'dashboard_profile_cloned',
      module: 'dashboard',
      action: 'create',
      entityId: clone.id,
      entityType: 'DashboardProfile',
      entityName: clone.name,
      userId: clonedBy,
      userName: clonedBy,
      userRole: 'manager',
      metadata: { sourceProfileId: sourceId },
      afterState: clone,
      source: 'ui',
    })

    return clone
  }

  /**
   * Add tab to profile
   */
  addTab(profileId: string, tab: DashboardTab): DashboardProfile | null {
    const profile = this.getProfileById(profileId)
    if (!profile) return null

    profile.layout.tabs.push({
      ...tab,
      order: (profile.layout.tabs.length || 0) + 1,
    })

    return this.updateProfile(profileId, {
      layout: profile.layout,
    })
  }

  /**
   * Remove tab from profile
   */
  removeTab(profileId: string, tabId: string): DashboardProfile | null {
    const profile = this.getProfileById(profileId)
    if (!profile) return null

    profile.layout.tabs = profile.layout.tabs.filter(t => t.id !== tabId)

    return this.updateProfile(profileId, {
      layout: profile.layout,
    })
  }

  /**
   * Reorder tabs
   */
  reorderTabs(profileId: string, tabIds: string[]): DashboardProfile | null {
    const profile = this.getProfileById(profileId)
    if (!profile) return null

    const tabMap = new Map(profile.layout.tabs.map((t, i) => [t.id, i]))
    profile.layout.tabs.sort((a, b) => {
      const indexA = tabIds.indexOf(a.id)
      const indexB = tabIds.indexOf(b.id)
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
    })

    profile.layout.tabs.forEach((tab, idx) => {
      tab.order = idx + 1
    })

    return this.updateProfile(profileId, {
      layout: profile.layout,
    })
  }

  /**
   * Get visible tabs for a role
   */
  getVisibleTabs(profileId: string, forRole: DashboardRole): DashboardTab[] {
    const profile = this.getProfileById(profileId)
    if (!profile) return []

    return profile.layout.tabs.filter(tab => tab.visibleTo.includes(forRole))
  }

  /**
   * Get default tab for profile
   */
  getDefaultTab(profileId: string): DashboardTab | null {
    const profile = this.getProfileById(profileId)
    if (!profile) return null

    const defaultTab = profile.layout.tabs.find(t => t.default === true)
    return defaultTab || profile.layout.tabs[0] || null
  }
}

export const dashboardProfileEngine = new DashboardProfileEngineClass()
