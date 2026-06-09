/**
 * Widget Assignment Engine
 * Manages widget visibility and configuration per profile
 * No modifications to widget logic - only visibility control
 */

export interface WidgetVisibility {
  profileId: string
  widgetId: string
  enabled: boolean
  visibleToRoles: string[] // Empty = all roles in profile
  tab: string
  position: number
  size: 'small' | 'medium' | 'large'
}

class WidgetAssignmentEngineClass {
  private widgetVisibility: WidgetVisibility[] = []

  /**
   * Enable widget for profile
   */
  enableWidget(profileId: string, widgetId: string, tab: string, position: number): boolean {
    const existing = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (existing) {
      existing.enabled = true
      return true
    }

    this.widgetVisibility.push({
      profileId,
      widgetId,
      enabled: true,
      visibleToRoles: [],
      tab,
      position,
      size: 'medium',
    })

    return true
  }

  /**
   * Disable widget for profile
   */
  disableWidget(profileId: string, widgetId: string): boolean {
    const visibility = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (visibility) {
      visibility.enabled = false
      return true
    }

    return false
  }

  /**
   * Set widget size
   */
  setWidgetSize(profileId: string, widgetId: string, size: 'small' | 'medium' | 'large'): boolean {
    const visibility = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (!visibility) return false

    visibility.size = size
    return true
  }

  /**
   * Set widget position
   */
  setWidgetPosition(profileId: string, widgetId: string, position: number, tab: string): boolean {
    const visibility = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (!visibility) return false

    visibility.position = position
    visibility.tab = tab
    return true
  }

  /**
   * Restrict widget visibility to specific roles
   */
  restrictWidgetToRoles(profileId: string, widgetId: string, roleIds: string[]): boolean {
    const visibility = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (!visibility) return false

    visibility.visibleToRoles = roleIds
    return true
  }

  /**
   * Make widget visible to all roles in profile
   */
  makeWidgetVisibleToAll(profileId: string, widgetId: string): boolean {
    const visibility = this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId)

    if (!visibility) return false

    visibility.visibleToRoles = []
    return true
  }

  /**
   * Get widget visibility for profile
   */
  getWidgetVisibility(profileId: string, widgetId: string): WidgetVisibility | null {
    return this.widgetVisibility.find(w => w.profileId === profileId && w.widgetId === widgetId) || null
  }

  /**
   * Get all visible widgets for profile
   */
  getVisibleWidgets(profileId: string): WidgetVisibility[] {
    return this.widgetVisibility.filter(w => w.profileId === profileId && w.enabled)
  }

  /**
   * Get all widgets for profile (including disabled)
   */
  getAllWidgetsForProfile(profileId: string): WidgetVisibility[] {
    return this.widgetVisibility.filter(w => w.profileId === profileId)
  }

  /**
   * Check if widget is visible to user with role
   */
  isWidgetVisibleToRole(profileId: string, widgetId: string, userRole: string): boolean {
    const visibility = this.getWidgetVisibility(profileId, widgetId)

    if (!visibility || !visibility.enabled) return false

    // If no role restrictions, visible to all
    if (visibility.visibleToRoles.length === 0) return true

    // Check if user's role is in the allowed list
    return visibility.visibleToRoles.includes(userRole)
  }

  /**
   * Get widgets sorted by position for tab
   */
  getWidgetsForTab(profileId: string, tabName: string): WidgetVisibility[] {
    return this.widgetVisibility
      .filter(w => w.profileId === profileId && w.tab === tabName && w.enabled)
      .sort((a, b) => a.position - b.position)
  }

  /**
   * Reorder widgets when one is disabled (auto-layout)
   */
  autoReorderWidgets(profileId: string, tabName: string): void {
    const widgets = this.widgetVisibility.filter(w => w.profileId === profileId && w.tab === tabName && w.enabled)

    widgets.sort((a, b) => a.position - b.position)

    widgets.forEach((widget, index) => {
      widget.position = index
    })
  }

  /**
   * Move widget to different position and tab
   */
  moveWidget(profileId: string, widgetId: string, newTab: string, newPosition: number): boolean {
    const visibility = this.getWidgetVisibility(profileId, widgetId)

    if (!visibility) return false

    const oldTab = visibility.tab
    visibility.tab = newTab
    visibility.position = newPosition

    // Reorder widgets in both tabs
    this.autoReorderWidgets(profileId, oldTab)
    this.autoReorderWidgets(profileId, newTab)

    return true
  }

  /**
   * Get all widget configurations for profile (for export/serialization)
   */
  exportProfileWidgetConfig(profileId: string): Record<string, WidgetVisibility> {
    const result: Record<string, WidgetVisibility> = {}

    this.widgetVisibility
      .filter(w => w.profileId === profileId)
      .forEach(w => {
        result[w.widgetId] = w
      })

    return result
  }

  /**
   * Import widget configuration for profile
   */
  importProfileWidgetConfig(profileId: string, config: Record<string, WidgetVisibility>): boolean {
    // Clear existing config
    this.widgetVisibility = this.widgetVisibility.filter(w => w.profileId !== profileId)

    // Import new config
    Object.values(config).forEach(visibility => {
      visibility.profileId = profileId
      this.widgetVisibility.push(visibility)
    })

    return true
  }
}

// Singleton instance
export const widgetAssignmentEngine = new WidgetAssignmentEngineClass()
