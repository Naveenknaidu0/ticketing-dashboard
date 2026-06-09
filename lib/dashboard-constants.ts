/**
 * Dashboard Constants - Real AdamsBridge Dashboards and Widgets
 * Source: AdamsBridge Portal Configuration
 */

export const ADAMBRIDGE_DASHBOARDS = [
  {
    id: 'agent-personal',
    name: 'Agent Personal Dashboard',
    description: 'Personal dashboard for agents to track their tickets and performance',
    type: 'personal',
    role: 'agent',
  },
  {
    id: 'manager-personal',
    name: 'Manager Personal Dashboard',
    description: 'Personal dashboard for managers to monitor their team and KPIs',
    type: 'personal',
    role: 'manager',
  },
  {
    id: 'manager-team',
    name: 'Manager Team Dashboard',
    description: 'Shared team dashboard for managers to manage team performance',
    type: 'team',
    role: 'manager',
  },
] as const

export const ADAMBRIDGE_WIDGETS = [
  // Personal Widgets
  { id: 'my-open-tickets', name: 'My Open Tickets', category: 'Personal', type: 'personal' },
  { id: 'my-performance', name: 'My Performance', category: 'Personal', type: 'personal' },
  { id: 'my-today', name: 'My Today', category: 'Personal', type: 'personal' },

  // Ticket Widgets
  { id: 'all-tickets', name: 'All Tickets', category: 'Tickets', type: 'shared' },
  { id: 'recent-tickets', name: 'Recent Tickets', category: 'Tickets', type: 'shared' },
  { id: 'ticket-queue', name: 'Ticket Queue', category: 'Tickets', type: 'shared' },
  { id: 'ticket-status', name: 'Ticket Status', category: 'Tickets', type: 'shared' },

  // Performance Widgets
  { id: 'csat', name: 'CSAT', category: 'Performance', type: 'shared' },
  { id: 'nps', name: 'NPS', category: 'Performance', type: 'shared' },
  { id: 'resolution-time', name: 'Resolution Time', category: 'Performance', type: 'shared' },
  { id: 'first-contact-resolution', name: 'First Contact Resolution', category: 'Performance', type: 'shared' },

  // SLA Widgets
  { id: 'sla-compliance', name: 'SLA Compliance', category: 'SLA', type: 'shared' },
  { id: 'sla-breaches', name: 'SLA Breaches', category: 'SLA', type: 'shared' },
  { id: 'sla-health', name: 'SLA Health', category: 'SLA', type: 'shared' },

  // Team Widgets
  { id: 'team-performance', name: 'Team Performance', category: 'Team', type: 'shared' },
  { id: 'team-workload', name: 'Team Workload', category: 'Team', type: 'shared' },
  { id: 'team-capacity', name: 'Team Capacity', category: 'Team', type: 'shared' },
  { id: 'team-assignments', name: 'Team Assignments', category: 'Team', type: 'shared' },

  // Productivity Widgets
  { id: 'productivity-index', name: 'Productivity Index', category: 'Productivity', type: 'shared' },
  { id: 'productivity-trend', name: 'Productivity Trend', category: 'Productivity', type: 'shared' },
  { id: 'response-time', name: 'Response Time', category: 'Productivity', type: 'shared' },

  // Workload Widgets
  { id: 'workload-distribution', name: 'Workload Distribution', category: 'Workload', type: 'shared' },
  { id: 'workload-trend', name: 'Workload Trend', category: 'Workload', type: 'shared' },
  { id: 'queue-length', name: 'Queue Length', category: 'Workload', type: 'shared' },

  // Analytics Widgets
  { id: 'analytics-summary', name: 'Analytics Summary', category: 'Analytics', type: 'shared' },
  { id: 'analytics-chart', name: 'Analytics Chart', category: 'Analytics', type: 'shared' },
  { id: 'trending-issues', name: 'Trending Issues', category: 'Analytics', type: 'shared' },
  { id: 'agent-feedback', name: 'Agent Feedback', category: 'Analytics', type: 'shared' },
  { id: 'customer-satisfaction-trend', name: 'Customer Satisfaction Trend', category: 'Analytics', type: 'shared' },
] as const

export const DASHBOARD_TABS = [
  'Overview',
  'Operations',
  'Performance',
  'SLA & Compliance',
  'Workload',
  'Reports',
] as const

export const WIDGET_SIZES = ['small', 'medium', 'large'] as const

export type DashboardId = (typeof ADAMBRIDGE_DASHBOARDS)[number]['id']
export type WidgetId = (typeof ADAMBRIDGE_WIDGETS)[number]['id']
export type DashboardTab = (typeof DASHBOARD_TABS)[number]
export type WidgetSize = (typeof WIDGET_SIZES)[number]
