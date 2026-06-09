/**
 * Dashboard Permission Engine
 * Manages role-based visibility and access control for dashboards
 * Ensures users only see widgets and tabs appropriate for their role
 */

import type { DashboardRole } from './dashboard-profile-engine'
import { dashboardProfileEngine } from './dashboard-profile-engine'
import { widgetRegistry } from './widget-registry'

export interface DashboardPermission {
  role: DashboardRole
  canViewDashboard: boolean
  canCustomizeDashboard: boolean
  canExport: boolean
  canRefresh: boolean
  allowedWidgets: string[]
  allowedTabs: string[]
}

export interface RolePermissionConfig {
  role: DashboardRole
  permissions: {
    canViewDashboard: boolean
    canCustomizeDashboard: boolean
    canExport: boolean
    canRefresh: boolean
    restrictedWidgets: string[] // explicitly blocked widgets
    restrictedTabs: string[] // explicitly blocked tabs
  }
}

// Default permission matrix for roles
let ROLE_PERMISSIONS: RolePermissionConfig[] = [
  {
    role: 'agent',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: false,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
  {
    role: 'supervisor',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: true,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
  {
    role: 'manager',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: true,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
  {
    role: 'executive',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: false,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
  {
    role: 'admin',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: true,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
  {
    role: 'analyst',
    permissions: {
      canViewDashboard: true,
      canCustomizeDashboard: true,
      canExport: true,
      canRefresh: true,
      restrictedWidgets: [],
      restrictedTabs: [],
    },
  },
]

class DashboardPermissionEngineClass {
  /**
   * Check if user role can view dashboard
   */
  canViewDashboard(role: DashboardRole): boolean {
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    return perm?.permissions.canViewDashboard ?? false
  }

  /**
   * Check if user role can customize dashboard
   */
  canCustomizeDashboard(role: DashboardRole): boolean {
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    return perm?.permissions.canCustomizeDashboard ?? false
  }

  /**
   * Check if user can export dashboard
   */
  canExportDashboard(role: DashboardRole): boolean {
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    return perm?.permissions.canExport ?? false
  }

  /**
   * Check if user can refresh dashboard
   */
  canRefreshDashboard(role: DashboardRole): boolean {
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    return perm?.permissions.canRefresh ?? false
  }

  /**
   * Get all permissions for a role
   */
  getPermissions(role: DashboardRole): DashboardPermission {
    const profile = dashboardProfileEngine.getProfileByRole(role)
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)

    const allWidgets = profile ? profile.layout.tabs.flatMap(t => t.widgets) : []
    const allowedWidgets = allWidgets.filter(
      wId => !perm?.permissions.restrictedWidgets.includes(wId),
    )

    const allTabs = profile?.layout.tabs.map(t => t.id) || []
    const allowedTabs = allTabs.filter(tId => !perm?.permissions.restrictedTabs.includes(tId))

    return {
      role,
      canViewDashboard: perm?.permissions.canViewDashboard ?? false,
      canCustomizeDashboard: perm?.permissions.canCustomizeDashboard ?? false,
      canExport: perm?.permissions.canExport ?? false,
      canRefresh: perm?.permissions.canRefresh ?? false,
      allowedWidgets,
      allowedTabs,
    }
  }

  /**
   * Check if user can view specific widget
   */
  canViewWidget(role: DashboardRole, widgetId: string): boolean {
    const widget = widgetRegistry.getWidget(widgetId)
    if (!widget || !widget.enabled) return false

    // Check if role is supported
    if (!widget.supportedRoles.includes(role)) return false

    // Check if widget is restricted for this role
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    if (perm?.permissions.restrictedWidgets.includes(widgetId)) return false

    // Check permissions
    const userPerms = this.getPermissions(role)
    return userPerms.allowedWidgets.includes(widgetId)
  }

  /**
   * Check if user can view specific tab
   */
  canViewTab(role: DashboardRole, tabId: string): boolean {
    const profile = dashboardProfileEngine.getProfileByRole(role)
    if (!profile) return false

    const tab = profile.layout.tabs.find(t => t.id === tabId)
    if (!tab) return false

    // Check if tab is visible to this role
    if (!tab.visibleTo.includes(role)) return false

    // Check if tab is restricted
    const perm = ROLE_PERMISSIONS.find(p => p.role === role)
    if (perm?.permissions.restrictedTabs.includes(tabId)) return false

    return true
  }

  /**
   * Update role permissions
   */
  updateRolePermissions(
    role: DashboardRole,
    permissions: Partial<RolePermissionConfig['permissions']>,
  ): RolePermissionConfig | null {
    const config = ROLE_PERMISSIONS.find(p => p.role === role)
    if (!config) return null

    Object.assign(config.permissions, permissions)
    return config
  }

  /**
   * Restrict widget for role
   */
  restrictWidgetForRole(role: DashboardRole, widgetId: string): void {
    const config = ROLE_PERMISSIONS.find(p => p.role === role)
    if (config && !config.permissions.restrictedWidgets.includes(widgetId)) {
      config.permissions.restrictedWidgets.push(widgetId)
    }
  }

  /**
   * Allow widget for role
   */
  allowWidgetForRole(role: DashboardRole, widgetId: string): void {
    const config = ROLE_PERMISSIONS.find(p => p.role === role)
    if (config) {
      config.permissions.restrictedWidgets = config.permissions.restrictedWidgets.filter(
        w => w !== widgetId,
      )
    }
  }

  /**
   * Restrict tab for role
   */
  restrictTabForRole(role: DashboardRole, tabId: string): void {
    const config = ROLE_PERMISSIONS.find(p => p.role === role)
    if (config && !config.permissions.restrictedTabs.includes(tabId)) {
      config.permissions.restrictedTabs.push(tabId)
    }
  }

  /**
   * Allow tab for role
   */
  allowTabForRole(role: DashboardRole, tabId: string): void {
    const config = ROLE_PERMISSIONS.find(p => p.role === role)
    if (config) {
      config.permissions.restrictedTabs = config.permissions.restrictedTabs.filter(
        t => t !== tabId,
      )
    }
  }

  /**
   * Get filtered widgets for role
   */
  getVisibleWidgets(role: DashboardRole, widgetIds: string[]): string[] {
    return widgetIds.filter(wId => this.canViewWidget(role, wId))
  }

  /**
   * Get filtered tabs for role
   */
  getVisibleTabs(
    role: DashboardRole,
    tabIds: string[],
  ): string[] {
    return tabIds.filter(tId => this.canViewTab(role, tId))
  }

  /**
   * Check if role has any widgets
   */
  hasAccessToAnyWidget(role: DashboardRole): boolean {
    const profile = dashboardProfileEngine.getProfileByRole(role)
    if (!profile) return false

    const allWidgetIds = profile.layout.tabs.flatMap(t => t.widgets)
    return allWidgetIds.some(wId => this.canViewWidget(role, wId))
  }

  /**
   * Get permission summary for debugging
   */
  getPermissionSummary(role: DashboardRole): Record<string, any> {
    const perms = this.getPermissions(role)
    const profile = dashboardProfileEngine.getProfileByRole(role)

    return {
      role,
      dashboard: {
        canView: perms.canViewDashboard,
        canCustomize: perms.canCustomizeDashboard,
        canExport: perms.canExport,
        canRefresh: perms.canRefresh,
      },
      access: {
        allowedWidgets: perms.allowedWidgets.length,
        allowedTabs: perms.allowedTabs.length,
        totalWidgetsInProfile: profile?.layout.tabs.flatMap(t => t.widgets).length || 0,
        totalTabsInProfile: profile?.layout.tabs.length || 0,
      },
    }
  }
}

export const dashboardPermissionEngine = new DashboardPermissionEngineClass()
