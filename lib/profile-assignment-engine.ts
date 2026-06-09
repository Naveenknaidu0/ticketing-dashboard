/**
 * Profile Assignment Engine
 * Manages profile assignments to roles, teams, and users with cascading priority
 * Priority order: User (0) > Team (1) > Role (2) > Default (3)
 */

import { logAuditEvent } from './audit-log-engine'

export interface ProfileAssignment {
  id: string
  profileId: string
  assignmentType: 'role' | 'team' | 'user'
  targetId: string // roleId | teamId | userId
  priority: 0 | 1 | 2 // 0=User, 1=Team, 2=Role
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  status: 'active' | 'archived'
  notes?: string
}

export interface UserProfileResolution {
  userId: string
  resolvedProfileId: string | null
  resolutionSource: 'user' | 'team' | 'role' | 'default'
  appliedRules: string[]
}

class ProfileAssignmentEngineClass {
  private assignments: ProfileAssignment[] = []

  /**
   * Assign profile to role (lowest priority)
   */
  assignToRole(profileId: string, roleId: string, userId: string): ProfileAssignment {
    const assignment: ProfileAssignment = {
      id: `assign-${Date.now()}-${Math.random()}`,
      profileId,
      assignmentType: 'role',
      targetId: roleId,
      priority: 2,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      status: 'active',
    }

    this.assignments.push(assignment)

    logAuditEvent({
      eventType: 'profile_assigned_to_role',
      module: 'dashboard-governance',
      action: 'create',
      entityId: assignment.id,
      entityType: 'ProfileAssignment',
      entityName: `Profile ${profileId} → Role ${roleId}`,
      userId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: assignment,
      source: 'ui',
    })

    return assignment
  }

  /**
   * Assign profile to team (medium priority)
   */
  assignToTeam(profileId: string, teamId: string, userId: string): ProfileAssignment {
    const assignment: ProfileAssignment = {
      id: `assign-${Date.now()}-${Math.random()}`,
      profileId,
      assignmentType: 'team',
      targetId: teamId,
      priority: 1,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      status: 'active',
    }

    this.assignments.push(assignment)

    logAuditEvent({
      eventType: 'profile_assigned_to_team',
      module: 'dashboard-governance',
      action: 'create',
      entityId: assignment.id,
      entityType: 'ProfileAssignment',
      entityName: `Profile ${profileId} → Team ${teamId}`,
      userId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: assignment,
      source: 'ui',
    })

    return assignment
  }

  /**
   * Assign profile to user (highest priority - overrides everything)
   */
  assignToUser(profileId: string, userId: string, managerId: string): ProfileAssignment {
    // Remove any existing user assignment for this user
    const existingIdx = this.assignments.findIndex(
      a => a.assignmentType === 'user' && a.targetId === userId && a.status === 'active'
    )
    if (existingIdx > -1) {
      this.assignments[existingIdx].status = 'archived'
    }

    const assignment: ProfileAssignment = {
      id: `assign-${Date.now()}-${Math.random()}`,
      profileId,
      assignmentType: 'user',
      targetId: userId,
      priority: 0,
      createdBy: managerId,
      createdAt: new Date().toISOString(),
      updatedBy: managerId,
      updatedAt: new Date().toISOString(),
      status: 'active',
    }

    this.assignments.push(assignment)

    logAuditEvent({
      eventType: 'profile_assigned_to_user',
      module: 'dashboard-governance',
      action: 'create',
      entityId: assignment.id,
      entityType: 'ProfileAssignment',
      entityName: `Profile ${profileId} → User ${userId}`,
      userId: managerId,
      userName: 'Current User',
      userRole: 'manager',
      afterState: assignment,
      source: 'ui',
    })

    return assignment
  }

  /**
   * Resolve profile for user with priority cascading
   * Priority: User (0) > Team (1) > Role (2) > Default (3)
   */
  resolveProfileForUser(userId: string, userTeamId: string, userRoleId: string, defaultProfileId?: string): UserProfileResolution {
    const appliedRules: string[] = []

    // Check User assignment (highest priority)
    const userAssignment = this.assignments.find(
      a => a.assignmentType === 'user' && a.targetId === userId && a.status === 'active'
    )
    if (userAssignment) {
      appliedRules.push(`User override: ${userAssignment.profileId}`)
      return {
        userId,
        resolvedProfileId: userAssignment.profileId,
        resolutionSource: 'user',
        appliedRules,
      }
    }

    // Check Team assignment (medium priority)
    const teamAssignment = this.assignments.find(
      a => a.assignmentType === 'team' && a.targetId === userTeamId && a.status === 'active'
    )
    if (teamAssignment) {
      appliedRules.push(`Team assignment: ${teamAssignment.profileId}`)
      return {
        userId,
        resolvedProfileId: teamAssignment.profileId,
        resolutionSource: 'team',
        appliedRules,
      }
    }

    // Check Role assignment (lowest priority)
    const roleAssignment = this.assignments.find(
      a => a.assignmentType === 'role' && a.targetId === userRoleId && a.status === 'active'
    )
    if (roleAssignment) {
      appliedRules.push(`Role assignment: ${roleAssignment.profileId}`)
      return {
        userId,
        resolvedProfileId: roleAssignment.profileId,
        resolutionSource: 'role',
        appliedRules,
      }
    }

    // Fallback to default profile
    appliedRules.push(`Default profile: ${defaultProfileId || 'none'}`)
    return {
      userId,
      resolvedProfileId: defaultProfileId || null,
      resolutionSource: 'default',
      appliedRules,
    }
  }

  /**
   * Get all assignments for a profile
   */
  getAssignmentsForProfile(profileId: string): {
    roles: ProfileAssignment[]
    teams: ProfileAssignment[]
    users: ProfileAssignment[]
  } {
    const active = this.assignments.filter(a => a.status === 'active' && a.profileId === profileId)

    return {
      roles: active.filter(a => a.assignmentType === 'role'),
      teams: active.filter(a => a.assignmentType === 'team'),
      users: active.filter(a => a.assignmentType === 'user'),
    }
  }

  /**
   * Get count of users affected by each assignment type
   */
  getAssignmentStats(profileId: string): {
    byRoles: number
    byTeams: number
    byUsers: number
    total: number
  } {
    const assignments = this.getAssignmentsForProfile(profileId)

    // This is a simplified calculation - in production you'd query user counts
    return {
      byRoles: assignments.roles.length * 10, // Assume 10 users per role on average
      byTeams: assignments.teams.length * 15, // Assume 15 users per team on average
      byUsers: assignments.users.length,
      total: assignments.roles.length * 10 + assignments.teams.length * 15 + assignments.users.length,
    }
  }

  /**
   * Remove assignment
   */
  removeAssignment(assignmentId: string, userId: string): boolean {
    const assignment = this.assignments.find(a => a.id === assignmentId)
    if (!assignment) return false

    assignment.status = 'archived'
    assignment.updatedBy = userId
    assignment.updatedAt = new Date().toISOString()

    logAuditEvent({
      eventType: 'profile_assignment_removed',
      module: 'dashboard-governance',
      action: 'delete',
      entityId: assignmentId,
      entityType: 'ProfileAssignment',
      entityName: `Assignment removed`,
      userId,
      userName: 'Current User',
      userRole: 'manager',
      beforeState: assignment,
      source: 'ui',
    })

    return true
  }

  /**
   * Bulk assign profile to multiple roles
   */
  bulkAssignToRoles(profileId: string, roleIds: string[], userId: string): ProfileAssignment[] {
    return roleIds.map(roleId => this.assignToRole(profileId, roleId, userId))
  }

  /**
   * Bulk assign profile to multiple teams
   */
  bulkAssignToTeams(profileId: string, teamIds: string[], userId: string): ProfileAssignment[] {
    return teamIds.map(teamId => this.assignToTeam(profileId, teamId, userId))
  }

  /**
   * Bulk assign profile to multiple users
   */
  bulkAssignToUsers(profileId: string, userIds: string[], managerId: string): ProfileAssignment[] {
    return userIds.map(userId => this.assignToUser(profileId, userId, managerId))
  }

  /**
   * Get all active assignments
   */
  getAllAssignments(): ProfileAssignment[] {
    return this.assignments.filter(a => a.status === 'active')
  }

  /**
   * Get assignment history (including archived)
   */
  getAssignmentHistory(profileId?: string): ProfileAssignment[] {
    if (profileId) {
      return this.assignments.filter(a => a.profileId === profileId)
    }
    return this.assignments
  }
}

// Singleton instance
export const profileAssignmentEngine = new ProfileAssignmentEngineClass()
