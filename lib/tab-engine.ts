// Tab/Section Engine - Manage page layouts, tabs, sections, and panels
// Allows managers to control UI structure without coding

import { logAuditEvent } from './audit-log-engine'
import type { VisibilityRule } from './form-engine'

export interface Panel {
  id: string
  name: string
  label: string
  type: 'widget' | 'metric' | 'list' | 'chart' | 'form' | 'custom'
  content?: string
  visibility: VisibilityRule
  order: number
  width: 'full' | 'half' | 'third'
}

export interface TabSection {
  id: string
  name: string
  label: string
  icon?: string
  description?: string
  panels: Panel[]
  visibility: VisibilityRule
  order: number
}

export interface TabLayout {
  id: string
  name: string
  label: string
  type: 'queue' | 'skill' | 'rule' | 'automation'
  tabs: TabSection[]
  defaultTab?: string
  version: number
  status: 'draft' | 'active' | 'archived'
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let TAB_LAYOUTS: TabLayout[] = [
  {
    id: 'layout-queue-detail',
    name: 'queue-detail-page',
    label: 'Queue Detail Page',
    type: 'queue',
    tabs: [
      {
        id: 'tab-overview',
        name: 'overview',
        label: 'Overview',
        icon: 'LayoutGrid',
        panels: [
          { id: 'panel-stats', name: 'queue-stats', label: 'Queue Statistics', type: 'metric', visibility: { type: 'always' }, order: 1, width: 'full' },
          { id: 'panel-recent', name: 'recent-items', label: 'Recent Items', type: 'list', visibility: { type: 'always' }, order: 2, width: 'full' },
        ],
        visibility: { type: 'always' },
        order: 1,
      },
      {
        id: 'tab-settings',
        name: 'settings',
        label: 'Settings',
        icon: 'Settings',
        panels: [
          { id: 'panel-config', name: 'queue-config', label: 'Configuration', type: 'form', visibility: { type: 'always' }, order: 1, width: 'full' },
        ],
        visibility: { type: 'role-based', roles: ['admin', 'manager'] },
        order: 2,
      },
    ],
    defaultTab: 'tab-overview',
    version: 1,
    status: 'active',
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

// Get layout by ID
export function getTabLayout(id: string): TabLayout | undefined {
  return TAB_LAYOUTS.find(l => l.id === id)
}

// Get layout by type
export function getLayoutByType(type: TabLayout['type']): TabLayout | undefined {
  return TAB_LAYOUTS.find(l => l.type === type && l.status === 'active')
}

// Get all active layouts
export function getAllActiveLayouts(): TabLayout[] {
  return TAB_LAYOUTS.filter(l => l.status === 'active')
}

// Create new layout
export function createTabLayout(data: Omit<TabLayout, 'id' | 'version' | 'metadata' | 'status'>): TabLayout {
  const layout: TabLayout = {
    ...data,
    id: `layout-${Date.now()}`,
    version: 1,
    status: 'draft',
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    },
  }

  TAB_LAYOUTS.push(layout)

  logAuditEvent({
    eventType: 'layout_created',
    module: 'configuration',
    action: 'create',
    entityId: layout.id,
    entityType: 'TabLayout',
    entityName: layout.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: layout,
    source: 'ui',
  })

  return layout
}

// Update layout
export function updateTabLayout(id: string, updates: Partial<Omit<TabLayout, 'id' | 'metadata'>>): TabLayout | null {
  const layout = getTabLayout(id)
  if (!layout) return null

  const beforeState = JSON.parse(JSON.stringify(layout))
  Object.assign(layout, updates)
  layout.version += 1
  layout.metadata.updatedAt = new Date().toISOString()
  layout.metadata.updatedBy = 'current-user'

  logAuditEvent({
    eventType: 'layout_updated',
    module: 'configuration',
    action: 'update',
    entityId: layout.id,
    entityType: 'TabLayout',
    entityName: layout.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: layout,
    source: 'ui',
  })

  return layout
}

// Delete layout
export function deleteTabLayout(id: string): boolean {
  const index = TAB_LAYOUTS.findIndex(l => l.id === id)
  if (index > -1) {
    const layout = TAB_LAYOUTS[index]
    TAB_LAYOUTS.splice(index, 1)

    logAuditEvent({
      eventType: 'layout_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: layout.id,
      entityType: 'TabLayout',
      entityName: layout.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: layout,
      source: 'ui',
    })

    return true
  }
  return false
}

// Add tab to layout
export function addTabToLayout(layoutId: string, tab: TabSection): TabLayout | null {
  const layout = getTabLayout(layoutId)
  if (!layout) return null

  tab.order = (layout.tabs.length || 0) + 1
  layout.tabs.push(tab)
  return updateTabLayout(layoutId, { tabs: layout.tabs })
}

// Remove tab from layout
export function removeTabFromLayout(layoutId: string, tabId: string): TabLayout | null {
  const layout = getTabLayout(layoutId)
  if (!layout) return null

  layout.tabs = layout.tabs.filter(t => t.id !== tabId)
  return updateTabLayout(layoutId, { tabs: layout.tabs })
}

// Add panel to tab
export function addPanelToTab(layoutId: string, tabId: string, panel: Panel): TabLayout | null {
  const layout = getTabLayout(layoutId)
  if (!layout) return null

  const tab = layout.tabs.find(t => t.id === tabId)
  if (!tab) return null

  panel.order = (tab.panels.length || 0) + 1
  tab.panels.push(panel)
  return updateTabLayout(layoutId, { tabs: layout.tabs })
}

// Remove panel from tab
export function removePanelFromTab(layoutId: string, tabId: string, panelId: string): TabLayout | null {
  const layout = getTabLayout(layoutId)
  if (!layout) return null

  const tab = layout.tabs.find(t => t.id === tabId)
  if (!tab) return null

  tab.panels = tab.panels.filter(p => p.id !== panelId)
  return updateTabLayout(layoutId, { tabs: layout.tabs })
}

// Publish layout
export function publishTabLayout(id: string): TabLayout | null {
  return updateTabLayout(id, { status: 'active' })
}

// Archive layout
export function archiveTabLayout(id: string): TabLayout | null {
  return updateTabLayout(id, { status: 'archived' })
}

// Clone layout
export function cloneTabLayout(id: string, newName?: string): TabLayout | null {
  const source = getTabLayout(id)
  if (!source) return null

  const cloned = createTabLayout({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    type: source.type,
    tabs: JSON.parse(JSON.stringify(source.tabs)),
    defaultTab: source.defaultTab,
  })

  return cloned
}

// Get layout statistics
export interface LayoutStatistics {
  totalLayouts: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  totalTabs: number
  totalPanels: number
}

export function getLayoutStatistics(): LayoutStatistics {
  const stats: LayoutStatistics = {
    totalLayouts: TAB_LAYOUTS.length,
    byType: {},
    byStatus: {},
    totalTabs: 0,
    totalPanels: 0,
  }

  TAB_LAYOUTS.forEach(layout => {
    stats.byType[layout.type] = (stats.byType[layout.type] || 0) + 1
    stats.byStatus[layout.status] = (stats.byStatus[layout.status] || 0) + 1
    stats.totalTabs += layout.tabs.length
    stats.totalPanels += layout.tabs.reduce((sum, t) => sum + t.panels.length, 0)
  })

  return stats
}
