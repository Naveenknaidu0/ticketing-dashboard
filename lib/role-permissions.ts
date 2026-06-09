import { Ticket } from '@/lib/store'

export type UserRole = 'agent' | 'manager' | 'team-lead' | 'executive' | null

export type Permission = 'view_all_tickets' | 'view_team_tickets' | 'view_personal_tickets' | 'view_all_reports' | 'view_team_reports' | 'manage_approvals' | 'manage_knowledge' | 'manage_assignments' | 'view_executive_dashboard'

export const ROLE_PERMISSIONS: Record<Exclude<UserRole, null>, Permission[]> = {
  agent: [
    'view_personal_tickets',
  ],
  'team-lead': [
    'view_team_tickets',
    'view_team_reports',
  ],
  manager: [
    'view_all_tickets',
    'view_all_reports',
    'manage_approvals',
    'manage_knowledge',
    'manage_assignments',
  ],
  executive: [
    'view_executive_dashboard',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role as Exclude<UserRole, null>]?.includes(permission) ?? false
}

export function canViewTicket(role: UserRole, ticketAssignedTo: string | undefined, currentUserId: string): boolean {
  if (!role) return false

  if (role === 'agent') {
    // Agents can only see their own assigned tickets
    return ticketAssignedTo === currentUserId
  }

  if (role === 'team-lead') {
    // Team leads can see their team's tickets
    return true // Assuming all tickets are considered "team" tickets
  }

  if (role === 'manager') {
    // Managers can see all tickets
    return true
  }

  if (role === 'executive') {
    // Executives can see all tickets (read-only)
    return true
  }

  return false
}

export function filterTicketsByRole(
  tickets: Ticket[],
  role: UserRole,
  currentUserId: string
): Ticket[] {
  if (!role) return []

  if (role === 'agent') {
    // Agents see only their assigned tickets
    return tickets.filter(t => t.assignedTo === currentUserId)
  }

  if (role === 'team-lead') {
    // Team leads see team tickets
    return tickets
  }

  if (role === 'manager' || role === 'executive') {
    // Managers and executives see all tickets
    return tickets
  }

  return []
}

export function getVisibleModules(role: UserRole): string[] {
  if (!role) return []

  const baseModules = ['dashboard', 'tickets', 'workload', 'leaderboard', 'knowledge-base']

  if (role === 'agent') {
    return ['dashboard', 'tickets', 'workload', 'leaderboard']
  }

  if (role === 'team-lead') {
    return ['dashboard', 'tickets', 'sla', 'workload', 'leaderboard', 'knowledge-base']
  }

  if (role === 'manager') {
    return ['dashboard', 'tickets', 'sla', 'workload', 'leaderboard', 'knowledge-base', 'approvals', 'reports']
  }

  if (role === 'executive') {
    return ['dashboard', 'reports']
  }

  return []
}
