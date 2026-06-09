/**
 * Dashboard Configuration Registry
 * Stores live configurations for each dashboard
 * Managers modify these configs and they immediately render
 */

import { dashboardAuditEngine } from './dashboard-audit-engine'
import type { DashboardType, WidgetSize } from './widget-registry'

export interface WidgetPlacement {
  widgetId: string
  tab: string
  position: number
  size: WidgetSize
  filters?: Record<string, any>
  dateRange?: {
    startDate?: string
    endDate?: string
    period?: 'today' | 'week' | 'month' | 'quarter' | 'year'
  }
  enabled: boolean
}

export interface DashboardConfig {
  dashboardType: DashboardType
  widgets: WidgetPlacement[]
  tabs: string[]
  settings: {
    autoRefresh: boolean
    refreshInterval: number // milliseconds
    showRefreshButton: boolean
    showExportButton: boolean
  }
  createdAt: string
  updatedAt: string
  updatedBy: string
}

// In-memory storage for dashboard configurations
const DASHBOARD_CONFIGS = new Map<DashboardType, DashboardConfig>()

// Initialize with default configurations
function initializeDefaults() {
  if (DASHBOARD_CONFIGS.size === 0) {
    const now = new Date().toISOString()

    // Agent Personal Dashboard
    DASHBOARD_CONFIGS.set('agent-personal', {
      dashboardType: 'agent-personal',
      widgets: [
        {
          widgetId: 'my-open-tickets',
          tab: 'Overview',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'my-today',
          tab: 'Overview',
          position: 1,
          size: 'medium',
          enabled: true,
        },
        {
          widgetId: 'my-queue-status',
          tab: 'Operations',
          position: 0,
          size: 'medium',
          enabled: true,
        },
        {
          widgetId: 'my-performance',
          tab: 'Performance',
          position: 0,
          size: 'medium',
          enabled: true,
        },
        {
          widgetId: 'my-sla-status',
          tab: 'SLA & Compliance',
          position: 0,
          size: 'medium',
          enabled: true,
        },
      ],
      tabs: ['Overview', 'Operations', 'Performance', 'SLA & Compliance', 'Workload'],
      settings: {
        autoRefresh: true,
        refreshInterval: 60000,
        showRefreshButton: true,
        showExportButton: true,
      },
      createdAt: now,
      updatedAt: now,
      updatedBy: 'system',
    })

    // Manager Personal Dashboard
    DASHBOARD_CONFIGS.set('manager-personal', {
      dashboardType: 'manager-personal',
      widgets: [
        {
          widgetId: 'team-performance',
          tab: 'Overview',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'team-workload',
          tab: 'Workload',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'sla-compliance',
          tab: 'SLA & Compliance',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'team-member-performance',
          tab: 'Performance',
          position: 0,
          size: 'large',
          enabled: true,
        },
      ],
      tabs: ['Overview', 'Operations', 'Performance', 'SLA & Compliance', 'Workload', 'Reports'],
      settings: {
        autoRefresh: true,
        refreshInterval: 120000,
        showRefreshButton: true,
        showExportButton: true,
      },
      createdAt: now,
      updatedAt: now,
      updatedBy: 'system',
    })

    // Manager Team Dashboard
    DASHBOARD_CONFIGS.set('manager-team', {
      dashboardType: 'manager-team',
      widgets: [
        {
          widgetId: 'team-performance',
          tab: 'Overview',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'team-workload',
          tab: 'Operations',
          position: 0,
          size: 'large',
          enabled: true,
        },
        {
          widgetId: 'team-escalations',
          tab: 'Operations',
          position: 1,
          size: 'medium',
          enabled: true,
        },
        {
          widgetId: 'sla-compliance',
          tab: 'SLA & Compliance',
          position: 0,
          size: 'large',
          enabled: true,
        },
      ],
      tabs: ['Overview', 'Operations', 'Performance', 'SLA & Compliance', 'Workload', 'Reports'],
      settings: {
        autoRefresh: true,
        refreshInterval: 120000,
        showRefreshButton: true,
        showExportButton: true,
      },
      createdAt: now,
      updatedAt: now,
      updatedBy: 'system',
    })
  }
}

export const dashboardConfigurationRegistry = {
  /**
   * Get configuration for a dashboard
   */
  getConfig(dashboardType: DashboardType): DashboardConfig | null {
    initializeDefaults()
    return DASHBOARD_CONFIGS.get(dashboardType) || null
  },

  /**
   * Update configuration
   */
  updateConfig(dashboardType: DashboardType, config: Partial<DashboardConfig>, userId: string): DashboardConfig | null {
    initializeDefaults()
    const existing = DASHBOARD_CONFIGS.get(dashboardType)
    if (!existing) return null

    const updated: DashboardConfig = {
      ...existing,
      ...config,
      dashboardType,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    DASHBOARD_CONFIGS.set(dashboardType, updated)

    dashboardAuditEngine.logEvent({
      eventType: 'dashboard_configuration_updated',
      targetType: 'dashboard',
      targetId: dashboardType,
      targetName: dashboardType,
      action: 'update',
      userId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: updated,
    })

    return updated
  },

  /**
   * Add widget to dashboard
   */
  addWidget(dashboardType: DashboardType, widget: WidgetPlacement, userId: string): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    // Check if widget already exists
    if (config.widgets.some(w => w.widgetId === widget.widgetId)) {
      return config
    }

    config.widgets.push(widget)
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    dashboardAuditEngine.logEvent({
      eventType: 'dashboard_widget_added',
      targetType: 'dashboard',
      targetId: dashboardType,
      targetName: `${dashboardType} - ${widget.widgetId}`,
      action: 'update',
      userId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: { widget },
    })

    return config
  },

  /**
   * Remove widget from dashboard
   */
  removeWidget(dashboardType: DashboardType, widgetId: string, userId: string): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    config.widgets = config.widgets.filter(w => w.widgetId !== widgetId)
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    dashboardAuditEngine.logEvent({
      eventType: 'dashboard_widget_removed',
      targetType: 'dashboard',
      targetId: dashboardType,
      targetName: `${dashboardType} - ${widgetId}`,
      action: 'update',
      userId,
      userName: 'Current User',
      userRole: 'manager',
    })

    return config
  },

  /**
   * Update widget placement (position, size, tab)
   */
  updateWidgetPlacement(
    dashboardType: DashboardType,
    widgetId: string,
    placement: Partial<WidgetPlacement>,
    userId: string,
  ): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widget = config.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    Object.assign(widget, placement)
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    return config
  },

  /**
   * Reorder widgets in a tab
   */
  reorderWidgets(
    dashboardType: DashboardType,
    tab: string,
    widgetIds: string[],
    userId: string,
  ): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widgetsInTab = config.widgets.filter(w => w.tab === tab)
    const widgetsOutsideTab = config.widgets.filter(w => w.tab !== tab)

    const reordered = widgetIds
      .map(id => widgetsInTab.find(w => w.widgetId === id))
      .filter((w): w is WidgetPlacement => w !== undefined)
      .map((w, idx) => ({ ...w, position: idx }))

    config.widgets = [...widgetsOutsideTab, ...reordered]
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    return config
  },

  /**
   * Toggle widget enabled/disabled
   */
  toggleWidget(dashboardType: DashboardType, widgetId: string, enabled: boolean, userId: string): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widget = config.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    widget.enabled = enabled
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    return config
  },

  /**
   * Move widget to different tab
   */
  moveWidgetToTab(
    dashboardType: DashboardType,
    widgetId: string,
    newTab: string,
    userId: string,
  ): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widget = config.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    const widgetsInNewTab = config.widgets.filter(w => w.tab === newTab && w.widgetId !== widgetId)
    widget.tab = newTab
    widget.position = widgetsInNewTab.length

    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    return config
  },

  /**
   * Update widget filters
   */
  updateWidgetFilters(
    dashboardType: DashboardType,
    widgetId: string,
    filters: Record<string, any>,
    userId: string,
  ): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widget = config.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    widget.filters = filters
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    dashboardAuditEngine.logEvent({
      eventType: 'dashboard_widget_filters_updated',
      targetType: 'dashboard',
      targetId: dashboardType,
      targetName: `${dashboardType} - ${widgetId}`,
      action: 'update',
      userId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: { filters },
    })

    return config
  },

  /**
   * Update widget date range
   */
  updateWidgetDateRange(
    dashboardType: DashboardType,
    widgetId: string,
    dateRange: WidgetPlacement['dateRange'],
    userId: string,
  ): DashboardConfig | null {
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (!config) return null

    const widget = config.widgets.find(w => w.widgetId === widgetId)
    if (!widget) return null

    widget.dateRange = dateRange
    config.updatedAt = new Date().toISOString()
    config.updatedBy = userId

    return config
  },

  /**
   * Get all configurations
   */
  getAllConfigs(): DashboardConfig[] {
    initializeDefaults()
    return Array.from(DASHBOARD_CONFIGS.values())
  },

  /**
   * Reset to defaults
   */
  resetToDefaults(dashboardType: DashboardType, userId: string): DashboardConfig | null {
    DASHBOARD_CONFIGS.delete(dashboardType)
    initializeDefaults()
    const config = DASHBOARD_CONFIGS.get(dashboardType)
    if (config) {
      config.updatedBy = userId
      config.updatedAt = new Date().toISOString()
    }
    return config
  },
}
