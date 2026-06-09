/**
 * Widget Registry - Complete catalog of all dashboard widgets
 * Maps widget IDs to their configurations, component paths, and metadata
 */

import { logAuditEvent } from './audit-log-engine'

export type WidgetSize = 'small' | 'medium' | 'large' | 'full'
export type DashboardType = 'agent-personal' | 'manager-personal' | 'manager-team'

export interface WidgetDefinition {
  id: string
  name: string
  description: string
  category: string
  component: string // Path to component
  defaultSize: WidgetSize
  supportedSizes: WidgetSize[]
  supportedTabs: string[]
  supportedDashboards: DashboardType[]
  supportsFilters: boolean
  supportsDateRange: boolean
  dataSource: string
  refreshInterval?: number // milliseconds
  createdAt: string
}

// All available widgets in the system
const WIDGET_REGISTRY_DATA: WidgetDefinition[] = [
  // Agent Personal Dashboard - Overview Tab
  {
    id: 'my-open-tickets',
    name: 'My Open Tickets',
    description: 'Tickets assigned to me that are not resolved',
    category: 'tickets',
    component: 'widgets/my-open-tickets',
    defaultSize: 'large',
    supportedSizes: ['large', 'full'],
    supportedTabs: ['Overview', 'Operations'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'tickets',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-performance',
    name: 'My Performance',
    description: 'Personal performance metrics',
    category: 'metrics',
    component: 'widgets/my-performance',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Performance'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: false,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-today',
    name: 'My Today',
    description: "Today's activities and goals",
    category: 'productivity',
    component: 'widgets/my-today',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Overview'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: false,
    supportsDateRange: false,
    dataSource: 'activities',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-sla-status',
    name: 'My SLA Status',
    description: 'SLA performance and status',
    category: 'sla',
    component: 'widgets/my-sla-status',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['SLA & Compliance'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: false,
    supportsDateRange: true,
    dataSource: 'sla',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-queue-status',
    name: 'My Queue Status',
    description: 'Queue assignments and status',
    category: 'operations',
    component: 'widgets/my-queue-status',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Operations'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'queues',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-scheduled-tasks',
    name: 'My Scheduled Tasks',
    description: 'Upcoming scheduled tasks',
    category: 'productivity',
    component: 'widgets/my-scheduled-tasks',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Workload'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'tasks',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-customer-interactions',
    name: 'My Customer Interactions',
    description: 'Recent customer interactions',
    category: 'interactions',
    component: 'widgets/my-customer-interactions',
    defaultSize: 'large',
    supportedSizes: ['large', 'full'],
    supportedTabs: ['Overview'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'interactions',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'my-group-tickets-overview',
    name: 'My Group Tickets Overview',
    description: 'Tickets assigned to agent support groups with quick overview and navigation',
    category: 'tickets',
    component: 'widgets/my-group-tickets-overview',
    defaultSize: 'full',
    supportedSizes: ['full'],
    supportedTabs: ['Overview', 'Workload'],
    supportedDashboards: ['agent-personal'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'tickets',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },

  // Manager Personal Dashboard
  {
    id: 'team-performance',
    name: 'Team Performance',
    description: 'Overall team performance metrics',
    category: 'metrics',
    component: 'widgets/team-performance',
    defaultSize: 'large',
    supportedSizes: ['large', 'full'],
    supportedTabs: ['Overview', 'Performance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-workload',
    name: 'Team Workload',
    description: 'Team member workload distribution',
    category: 'operations',
    component: 'widgets/team-workload',
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
    supportedTabs: ['Workload', 'Operations'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'assignments',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sla-compliance',
    name: 'SLA Compliance',
    description: 'Team SLA compliance overview',
    category: 'sla',
    component: 'widgets/sla-compliance',
    defaultSize: 'large',
    supportedSizes: ['medium', 'large', 'full'],
    supportedTabs: ['SLA & Compliance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'sla',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-capacity',
    name: 'Team Capacity',
    description: 'Team capacity and availability',
    category: 'operations',
    component: 'widgets/team-capacity',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Workload'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: false,
    supportsDateRange: false,
    dataSource: 'resources',
    refreshInterval: 300000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-tickets-by-priority',
    name: 'Tickets by Priority',
    description: 'Team tickets grouped by priority',
    category: 'tickets',
    component: 'widgets/team-tickets-by-priority',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Operations'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'tickets',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-tickets-by-status',
    name: 'Tickets by Status',
    description: 'Team tickets grouped by status',
    category: 'tickets',
    component: 'widgets/team-tickets-by-status',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Operations'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'tickets',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-member-performance',
    name: 'Team Member Performance',
    description: 'Individual team member metrics',
    category: 'metrics',
    component: 'widgets/team-member-performance',
    defaultSize: 'large',
    supportedSizes: ['large', 'full'],
    supportedTabs: ['Performance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-escalations',
    name: 'Escalations',
    description: 'Team escalations and critical issues',
    category: 'alerts',
    component: 'widgets/team-escalations',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Operations'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'escalations',
    refreshInterval: 30000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-queue-overview',
    name: 'Queue Overview',
    description: 'Team queue status and performance',
    category: 'operations',
    component: 'widgets/team-queue-overview',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Operations'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'queues',
    refreshInterval: 60000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-customer-satisfaction',
    name: 'Customer Satisfaction',
    description: 'Team CSAT and NPS scores',
    category: 'metrics',
    component: 'widgets/team-customer-satisfaction',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Performance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-first-response-time',
    name: 'First Response Time',
    description: 'Average first response time',
    category: 'sla',
    component: 'widgets/team-first-response-time',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['SLA & Compliance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-resolution-time',
    name: 'Resolution Time',
    description: 'Average ticket resolution time',
    category: 'sla',
    component: 'widgets/team-resolution-time',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['SLA & Compliance'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: true,
    dataSource: 'analytics',
    refreshInterval: 120000,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-scheduled-activities',
    name: 'Scheduled Activities',
    description: 'Team scheduled activities and events',
    category: 'productivity',
    component: 'widgets/team-scheduled-activities',
    defaultSize: 'medium',
    supportedSizes: ['medium', 'large'],
    supportedTabs: ['Workload'],
    supportedDashboards: ['manager-personal', 'manager-team'],
    supportsFilters: true,
    supportsDateRange: false,
    dataSource: 'tasks',
    createdAt: new Date().toISOString(),
  },
]

/**
 * Get widget definition by ID
 */
export function getWidgetDefinition(widgetId: string): WidgetDefinition | undefined {
  return WIDGET_REGISTRY_DATA.find(w => w.id === widgetId)
}

/**
 * Get widgets for a specific dashboard type
 */
export function getWidgetsForDashboard(dashboardType: DashboardType): WidgetDefinition[] {
  return WIDGET_REGISTRY_DATA.filter(w => w.supportedDashboards.includes(dashboardType))
}

/**
 * Get widgets by category
 */
export function getWidgetsByCategory(category: string): WidgetDefinition[] {
  return WIDGET_REGISTRY_DATA.filter(w => w.category === category)
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const categories = new Set(WIDGET_REGISTRY_DATA.map(w => w.category))
  return Array.from(categories).sort()
}

/**
 * Get all widgets
 */
export function getAllWidgets(): WidgetDefinition[] {
  return WIDGET_REGISTRY_DATA
}

