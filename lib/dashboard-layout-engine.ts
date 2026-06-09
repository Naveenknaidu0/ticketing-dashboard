/**
 * Dashboard Layout Engine
 * Manages widget layout, positioning, sizing on dashboards
 * Handles automatic reflow when widgets are hidden/removed
 */

import { logAuditEvent } from './audit-log-engine'
import { widgetRegistry } from './widget-registry'

export interface WidgetPosition {
  widgetId: string
  x: number // column 0-3 for 4-column layout
  y: number // row position
  width: number // 1-4 columns
  height: number // number of rows
  order: number
}

export interface DashboardLayoutConfig {
  id: string
  profileId: string
  tabId: string
  positions: WidgetPosition[]
  gridCols: number // number of columns in grid
  gap: number // gap between widgets in px
  updatedAt: string
  updatedBy: string
}

let LAYOUT_CONFIGS: DashboardLayoutConfig[] = []

class DashboardLayoutEngineClass {
  /**
   * Get layout for a profile tab
   */
  getLayout(profileId: string, tabId: string): DashboardLayoutConfig | null {
    return LAYOUT_CONFIGS.find(l => l.profileId === profileId && l.tabId === tabId) || null
  }

  /**
   * Create or update layout for a profile tab
   */
  setLayout(
    profileId: string,
    tabId: string,
    positions: WidgetPosition[],
    updatedBy: string,
  ): DashboardLayoutConfig {
    const existing = LAYOUT_CONFIGS.find(l => l.profileId === profileId && l.tabId === tabId)

    if (existing) {
      const before = JSON.parse(JSON.stringify(existing))

      existing.positions = positions
      existing.updatedAt = new Date().toISOString()
      existing.updatedBy = updatedBy

      logAuditEvent({
        eventType: 'dashboard_layout_updated',
        module: 'dashboard',
        action: 'update',
        entityId: existing.id,
        entityType: 'DashboardLayout',
        entityName: `${profileId}/${tabId}`,
        userId: updatedBy,
        userName: updatedBy,
        userRole: 'manager',
        beforeState: before,
        afterState: existing,
        source: 'ui',
      })

      return existing
    }

    const layout: DashboardLayoutConfig = {
      id: `layout-${profileId}-${tabId}`,
      profileId,
      tabId,
      positions,
      gridCols: 4,
      gap: 16,
      updatedAt: new Date().toISOString(),
      updatedBy,
    }

    LAYOUT_CONFIGS.push(layout)

    logAuditEvent({
      eventType: 'dashboard_layout_created',
      module: 'dashboard',
      action: 'create',
      entityId: layout.id,
      entityType: 'DashboardLayout',
      entityName: `${profileId}/${tabId}`,
      userId: updatedBy,
      userName: updatedBy,
      userRole: 'manager',
      afterState: layout,
      source: 'ui',
    })

    return layout
  }

  /**
   * Update single widget position
   */
  updateWidgetPosition(
    profileId: string,
    tabId: string,
    widgetId: string,
    position: Partial<WidgetPosition>,
    updatedBy: string,
  ): DashboardLayoutConfig | null {
    const layout = this.getLayout(profileId, tabId)
    if (!layout) return null

    const existing = layout.positions.find(p => p.widgetId === widgetId)
    if (existing) {
      Object.assign(existing, position)
    } else {
      layout.positions.push({
        widgetId,
        x: position.x || 0,
        y: position.y || 0,
        width: position.width || 2,
        height: position.height || 3,
        order: (layout.positions.length || 0) + 1,
      })
    }

    layout.updatedAt = new Date().toISOString()
    layout.updatedBy = updatedBy

    return layout
  }

  /**
   * Auto-layout widgets when one is hidden/removed
   * Reflows remaining widgets to fill empty space
   */
  autoLayout(
    profileId: string,
    tabId: string,
    visibleWidgetIds: string[],
    updatedBy: string,
  ): DashboardLayoutConfig | null {
    const layout = this.getLayout(profileId, tabId)
    if (!layout) return null

    // Filter to only visible widgets
    const newPositions: WidgetPosition[] = []
    let currentRow = 0
    let currentCol = 0
    const colsPerRow = layout.gridCols

    visibleWidgetIds.forEach((widgetId, idx) => {
      const widget = widgetRegistry.getWidget(widgetId)
      if (!widget) return

      // Calculate position based on default width
      const width = Math.min(widget.defaultWidth, colsPerRow)
      const height = widget.defaultHeight

      // Wrap to next row if needed
      if (currentCol + width > colsPerRow) {
        currentCol = 0
        currentRow++
      }

      newPositions.push({
        widgetId,
        x: currentCol,
        y: currentRow,
        width,
        height,
        order: idx + 1,
      })

      currentCol += width
    })

    layout.positions = newPositions
    layout.updatedAt = new Date().toISOString()
    layout.updatedBy = updatedBy

    logAuditEvent({
      eventType: 'dashboard_layout_autolayout',
      module: 'dashboard',
      action: 'update',
      entityId: layout.id,
      entityType: 'DashboardLayout',
      entityName: `${profileId}/${tabId}`,
      userId: updatedBy,
      userName: updatedBy,
      userRole: 'manager',
      metadata: { visibleWidgetCount: visibleWidgetIds.length },
      afterState: layout,
      source: 'system',
    })

    return layout
  }

  /**
   * Validate layout doesn't have overlaps
   */
  validateLayout(layout: DashboardLayoutConfig): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    const grid: Set<string> = new Set()

    layout.positions.forEach(pos => {
      for (let row = pos.y; row < pos.y + pos.height; row++) {
        for (let col = pos.x; col < pos.x + pos.width; col++) {
          const key = `${col},${row}`
          if (grid.has(key)) {
            errors.push(`Widget ${pos.widgetId} overlaps at position (${col}, ${row})`)
          }
          grid.add(key)
        }
      }

      // Check bounds
      if (pos.x + pos.width > layout.gridCols) {
        errors.push(`Widget ${pos.widgetId} extends beyond grid width`)
      }
      if (pos.y < 0 || pos.x < 0) {
        errors.push(`Widget ${pos.widgetId} has negative position`)
      }
    })

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Get grid view - 2D array of widget IDs for rendering
   */
  getGridView(layout: DashboardLayoutConfig): (string | null)[][] {
    // Find max dimensions
    let maxRow = 0
    let maxCol = 0

    layout.positions.forEach(pos => {
      maxRow = Math.max(maxRow, pos.y + pos.height)
      maxCol = Math.max(maxCol, pos.x + pos.width)
    })

    // Create grid
    const grid: (string | null)[][] = Array(maxRow)
      .fill(null)
      .map(() => Array(maxCol).fill(null))

    // Fill grid
    layout.positions.forEach(pos => {
      for (let row = pos.y; row < pos.y + pos.height; row++) {
        for (let col = pos.x; col < pos.x + pos.width; col++) {
          grid[row][col] = pos.widgetId
        }
      }
    })

    return grid
  }

  /**
   * Get widget positions for CSS Grid
   */
  getWidgetGridPositions(
    layout: DashboardLayoutConfig,
  ): Array<{
    widgetId: string
    gridColumn: string
    gridRow: string
  }> {
    return layout.positions.map(pos => ({
      widgetId: pos.widgetId,
      gridColumn: `${pos.x + 1} / span ${pos.width}`,
      gridRow: `${pos.y + 1} / span ${pos.height}`,
    }))
  }

  /**
   * Reset layout to defaults
   */
  resetToDefaults(profileId: string, tabId: string, updatedBy: string): DashboardLayoutConfig | null {
    const layout = this.getLayout(profileId, tabId)
    if (!layout) return null

    // Get all widgets for this tab from profile
    // This would need profile context - for now just clear
    layout.positions = []
    layout.updatedAt = new Date().toISOString()
    layout.updatedBy = updatedBy

    logAuditEvent({
      eventType: 'dashboard_layout_reset',
      module: 'dashboard',
      action: 'update',
      entityId: layout.id,
      entityType: 'DashboardLayout',
      entityName: `${profileId}/${tabId}`,
      userId: updatedBy,
      userName: updatedBy,
      userRole: 'manager',
      source: 'ui',
    })

    return layout
  }

  /**
   * Get all layouts for a profile
   */
  getProfileLayouts(profileId: string): DashboardLayoutConfig[] {
    return LAYOUT_CONFIGS.filter(l => l.profileId === profileId)
  }

  /**
   * Get responsive breakpoints
   */
  getResponsiveBreakpoints(): {
    mobile: number
    tablet: number
    desktop: number
    colsPerBreakpoint: Record<string, number>
  } {
    return {
      mobile: 640,
      tablet: 1024,
      desktop: 1280,
      colsPerBreakpoint: {
        mobile: 1,
        tablet: 2,
        desktop: 4,
      },
    }
  }

  /**
   * Calculate auto-layout grid classes based on visible widget count
   * Returns Tailwind classes for responsive grid
   */
  calculateGridClasses(visibleWidgetCount: number): string {
    switch (visibleWidgetCount) {
      case 0:
        return 'grid-cols-1'
      case 1:
        return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1'
      case 2:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
      case 3:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        // 5+ widgets - auto grid that wraps
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  /**
   * Calculate column span for a widget based on total visible count
   * Ensures widgets don't leave empty space
   */
  calculateWidgetColSpan(widgetIndex: number, totalVisibleWidgets: number): string {
    if (totalVisibleWidgets === 0) return 'col-span-1'
    if (totalVisibleWidgets === 1) return 'col-span-1'
    if (totalVisibleWidgets === 2) return 'col-span-1'
    if (totalVisibleWidgets === 3) return 'col-span-1'
    if (totalVisibleWidgets === 4) return 'col-span-1'

    // For 5+ widgets, calculate smart wrapping
    const remainingWidgets = totalVisibleWidgets - widgetIndex
    if (remainingWidgets === 1) {
      // Last widget alone - stretch to fill
      return 'md:col-span-2 lg:col-span-3'
    }
    if (remainingWidgets === 2) {
      // Two widgets left - split evenly
      return 'md:col-span-1 lg:col-span-1'
    }
    return 'col-span-1'
  }

  /**
   * Auto-reflow widgets when visibility changes - fills gaps seamlessly
   * Returns filtered and repositioned widget list
   */
  autoReflowVisibleWidgets(
    allWidgets: Array<{ id: string; isVisible: boolean }>,
  ): Array<{ id: string; index: number }> {
    const visibleWidgets = allWidgets.filter(w => w.isVisible)

    return visibleWidgets.map((widget, index) => ({
      id: widget.id,
      index,
    }))
  }

  /**
   * Calculate CSS Grid template for automatic layout
   * Removes empty rows/cols when widgets are hidden
   */
  calculateAutoGridTemplate(visibleWidgetIds: string[]): {
    gridTemplateColumns: string
    gridAutoFlow: string
    gridGap: string
  } {
    const count = visibleWidgetIds.length

    if (count === 0) {
      return {
        gridTemplateColumns: '1fr',
        gridAutoFlow: 'row',
        gridGap: '16px',
      }
    }

    if (count === 1) {
      return {
        gridTemplateColumns: '1fr',
        gridAutoFlow: 'row',
        gridGap: '16px',
      }
    }

    if (count === 2) {
      return {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoFlow: 'row',
        gridGap: '16px',
      }
    }

    if (count === 3) {
      return {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridAutoFlow: 'row',
        gridGap: '16px',
      }
    }

    if (count === 4) {
      return {
        gridTemplateColumns: 'repeat(2, 1fr)',
        gridAutoFlow: 'row',
        gridGap: '16px',
      }
    }

    // 5+ widgets - balanced grid
    return {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gridAutoFlow: 'dense',
      gridGap: '16px',
    }
  }

  /**
   * Get layout-specific CSS for a widget based on position in visible set
   * Prevents gaps and ensures smooth reflowing
   */
  getWidgetLayoutStyle(
    widgetId: string,
    indexInVisibleSet: number,
    totalVisibleWidgets: number,
  ): React.CSSProperties {
    const baseStyle: React.CSSProperties = {
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    }

    // Handle special cases where widgets should stretch to fill rows
    if (totalVisibleWidgets === 4 && (indexInVisibleSet === 2 || indexInVisibleSet === 3)) {
      // Last two widgets in 4-widget layout (2x2 grid)
      return baseStyle
    }

    if (totalVisibleWidgets === 5) {
      if (indexInVisibleSet === 4) {
        // Last widget of 5 - can be wider on larger screens
        return {
          ...baseStyle,
          gridColumn: 'span 1',
        }
      }
    }

    return baseStyle
  }
}

export const dashboardLayoutEngine = new DashboardLayoutEngineClass()
