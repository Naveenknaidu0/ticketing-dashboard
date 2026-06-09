/**
 * Profile Builder Engine - Unified profile management for AdamsBridge dashboards
 * Handles creation, editing, and deletion of dashboard profiles
 */

import { ADAMBRIDGE_DASHBOARDS, ADAMBRIDGE_WIDGETS, DASHBOARD_TABS, type DashboardId, type WidgetId, type DashboardTab, type WidgetSize } from './dashboard-constants'

export interface WidgetConfig {
  widgetId: WidgetId
  tab: DashboardTab
  position: number
  size: WidgetSize
  enabled: boolean
}

export interface DashboardProfile {
  id: string
  name: string
  description: string
  dashboardId: DashboardId
  baselineWidgets: WidgetId[]
  widgets: WidgetConfig[]
  status: 'draft' | 'active' | 'archived'
  createdAt: string
  updatedAt: string
  createdBy: string
}

// In-memory storage for profiles
const PROFILES_STORAGE = new Map<string, DashboardProfile>()

// Initialize with default profiles if empty
function initializeDefaults() {
  if (PROFILES_STORAGE.size === 0) {
    const now = new Date().toISOString()
    const defaults: DashboardProfile[] = [
      {
        id: 'profile-agent-default',
        name: 'Agent Default Profile',
        description: 'Default profile for agents',
        dashboardId: 'agent-personal',
        baselineWidgets: ['my-open-tickets', 'my-performance', 'my-today'],
        widgets: [
          { widgetId: 'my-open-tickets', tab: 'Overview', position: 0, size: 'large', enabled: true },
          { widgetId: 'my-performance', tab: 'Performance', position: 0, size: 'medium', enabled: true },
          { widgetId: 'my-today', tab: 'Overview', position: 1, size: 'medium', enabled: true },
        ],
        status: 'active',
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
      },
      {
        id: 'profile-manager-default',
        name: 'Manager Default Profile',
        description: 'Default profile for managers',
        dashboardId: 'manager-personal',
        baselineWidgets: ['team-performance', 'team-workload', 'sla-compliance', 'team-capacity'],
        widgets: [
          { widgetId: 'team-performance', tab: 'Overview', position: 0, size: 'large', enabled: true },
          { widgetId: 'team-workload', tab: 'Operations', position: 0, size: 'medium', enabled: true },
          { widgetId: 'sla-compliance', tab: 'SLA & Compliance', position: 0, size: 'large', enabled: true },
          { widgetId: 'team-capacity', tab: 'Workload', position: 0, size: 'medium', enabled: true },
        ],
        status: 'active',
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
      },
    ]
    defaults.forEach(p => PROFILES_STORAGE.set(p.id, p))
  }
}

export const profileBuilderEngine = {
  /**
   * Get all profiles
   */
  getAllProfiles(): DashboardProfile[] {
    initializeDefaults()
    return Array.from(PROFILES_STORAGE.values())
  },

  /**
   * Get single profile by ID
   */
  getProfile(profileId: string): DashboardProfile | null {
    initializeDefaults()
    return PROFILES_STORAGE.get(profileId) || null
  },

  /**
   * Create new profile
   */
  createProfile(data: {
    name: string
    description: string
    dashboardId: DashboardId
    userId: string
  }): DashboardProfile {
    const now = new Date().toISOString()
    const id = `profile-${Date.now()}`

    const profile: DashboardProfile = {
      id,
      name: data.name,
      description: data.description,
      dashboardId: data.dashboardId,
      baselineWidgets: [],
      widgets: [],
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: data.userId,
    }

    PROFILES_STORAGE.set(id, profile)
    return profile
  },

  /**
   * Update profile details
   */
  updateProfile(profileId: string, data: Partial<DashboardProfile>, userId: string): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    const updated: DashboardProfile = {
      ...profile,
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.dashboardId && { dashboardId: data.dashboardId }),
      ...(data.status && { status: data.status }),
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Add widget to profile
   */
  addWidget(profileId: string, widgetId: WidgetId, tab: DashboardTab): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    // Check if widget already exists
    if (profile.widgets.some(w => w.widgetId === widgetId)) {
      return profile
    }

    const newPosition = profile.widgets.filter(w => w.tab === tab).length

    const updated: DashboardProfile = {
      ...profile,
      widgets: [
        ...profile.widgets,
        {
          widgetId,
          tab,
          position: newPosition,
          size: 'medium',
          enabled: true,
        },
      ],
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Remove widget from profile
   */
  removeWidget(profileId: string, widgetId: WidgetId): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    const removed = profile.widgets.filter(w => w.widgetId !== widgetId)

    // Re-position remaining widgets in each tab
    const reordered: WidgetConfig[] = []
    const positionsByTab = new Map<DashboardTab, number>()

    for (const widget of removed) {
      const currentPos = positionsByTab.get(widget.tab) || 0
      reordered.push({ ...widget, position: currentPos })
      positionsByTab.set(widget.tab, currentPos + 1)
    }

    const updated: DashboardProfile = {
      ...profile,
      widgets: reordered,
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Update widget configuration
   */
  updateWidgetConfig(
    profileId: string,
    widgetId: WidgetId,
    config: Partial<WidgetConfig>
  ): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    const updated: DashboardProfile = {
      ...profile,
      widgets: profile.widgets.map(w =>
        w.widgetId === widgetId ? { ...w, ...config } : w
      ),
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Move widget to different tab
   */
  moveWidgetToTab(profileId: string, widgetId: WidgetId, newTab: DashboardTab): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    const widget = profile.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    // Calculate new position in target tab
    const widgetsInNewTab = profile.widgets.filter(w => w.tab === newTab && w.widgetId !== widgetId)
    const newPosition = widgetsInNewTab.length

    const updated: DashboardProfile = {
      ...profile,
      widgets: profile.widgets.map(w =>
        w.widgetId === widgetId ? { ...w, tab: newTab, position: newPosition } : w
      ),
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Reorder widgets within a tab
   */
  reorderWidgetsInTab(profileId: string, tab: DashboardTab, widgetIds: WidgetId[]): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    // Separate widgets in target tab and other tabs
    const widgetsInTab = profile.widgets.filter(w => w.tab === tab)
    const widgetsOutsideTab = profile.widgets.filter(w => w.tab !== tab)

    // Reorder widgets in tab based on provided order
    const reorderedInTab = widgetIds
      .map(id => widgetsInTab.find(w => w.widgetId === id))
      .filter((w): w is WidgetConfig => w !== undefined)
      .map((w, idx) => ({ ...w, position: idx }))

    const updated: DashboardProfile = {
      ...profile,
      widgets: [...widgetsOutsideTab, ...reorderedInTab],
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Clone profile
   */
  cloneProfile(profileId: string, userId: string): DashboardProfile | null {
    const original = PROFILES_STORAGE.get(profileId)
    if (!original) return null

    const now = new Date().toISOString()
    const newId = `profile-${Date.now()}`

    const cloned: DashboardProfile = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    }

    PROFILES_STORAGE.set(newId, cloned)
    return cloned
  },

  /**
   * Archive profile (soft delete)
   */
  archiveProfile(profileId: string): DashboardProfile | null {
    const profile = PROFILES_STORAGE.get(profileId)
    if (!profile) return null

    const updated: DashboardProfile = {
      ...profile,
      status: 'archived',
      updatedAt: new Date().toISOString(),
    }

    PROFILES_STORAGE.set(profileId, updated)
    return updated
  },

  /**
   * Delete profile permanently
   */
  deleteProfile(profileId: string): boolean {
    return PROFILES_STORAGE.delete(profileId)
  },

  /**
   * Get available dashboards
   */
  getAvailableDashboards() {
    return ADAMBRIDGE_DASHBOARDS
  },

  /**
   * Get available widgets
   */
  getAvailableWidgets() {
    return ADAMBRIDGE_WIDGETS
  },

  /**
   * Get available tabs
   */
  getAvailableTabs() {
    return DASHBOARD_TABS
  },

  /**
   * Get widget info
   */
  getWidgetInfo(widgetId: WidgetId) {
    return ADAMBRIDGE_WIDGETS.find(w => w.id === widgetId)
  },

  /**
   * Get dashboard info
   */
  getDashboardInfo(dashboardId: DashboardId) {
    return ADAMBRIDGE_DASHBOARDS.find(d => d.id === dashboardId)
  },
}
