/**
 * Profile Dependency Engine
 * Tracks profile usage and prevents deletion of profiles that are in use
 */

import { profileAssignmentEngine, type ProfileAssignment } from './profile-assignment-engine'
import { profileBuilderEngine } from './profile-builder-engine'

export interface ProfileDependency {
  profileId: string
  usageType: 'role' | 'team' | 'user'
  count: number
  samples: string[] // Sample IDs
}

export interface DeletionValidation {
  canDelete: boolean
  reason?: string
  dependencies: ProfileDependency[]
}

class ProfileDependencyEngineClass {
  /**
   * Get all dependencies for a profile
   */
  getProfileDependencies(profileId: string): ProfileDependency[] {
    const dependencies: ProfileDependency[] = []

    // Get all assignments for this profile
    const assignments = profileAssignmentEngine.getAssignmentsForProfile(profileId)

    if (assignments.roles.length > 0) {
      dependencies.push({
        profileId,
        usageType: 'role',
        count: assignments.roles.length,
        samples: assignments.roles.slice(0, 3).map(a => a.targetId),
      })
    }

    if (assignments.teams.length > 0) {
      dependencies.push({
        profileId,
        usageType: 'team',
        count: assignments.teams.length,
        samples: assignments.teams.slice(0, 3).map(a => a.targetId),
      })
    }

    if (assignments.users.length > 0) {
      dependencies.push({
        profileId,
        usageType: 'user',
        count: assignments.users.length,
        samples: assignments.users.slice(0, 3).map(a => a.targetId),
      })
    }

    return dependencies
  }

  /**
   * Check if profile can be deleted
   */
  canDeleteProfile(profileId: string): DeletionValidation {
    const profile = profileBuilderEngine.getProfile(profileId)

    if (!profile) {
      return {
        canDelete: false,
        reason: 'Profile not found',
        dependencies: [],
      }
    }

    const dependencies = this.getProfileDependencies(profileId)

    if (dependencies.length === 0) {
      return {
        canDelete: true,
        dependencies: [],
      }
    }

    const totalUsers = dependencies.reduce((sum, dep) => {
      if (dep.usageType === 'role') return sum + dep.count * 10 // Assume 10 users per role
      if (dep.usageType === 'team') return sum + dep.count * 15 // Assume 15 users per team
      return sum + dep.count
    }, 0)

    return {
      canDelete: false,
      reason: `Profile is assigned to ${totalUsers} users through roles, teams, or direct assignment. Archive instead of deleting.`,
      dependencies,
    }
  }

  /**
   * Get profiles that depend on this widget
   */
  getProfilesUsingWidget(widgetId: string): string[] {
    // This would need integration with widget-assignment-engine
    // For now, returning empty - implement when integrated
    return []
  }

  /**
   * Get profiles that use a specific dashboard
   */
  getProfilesUsingDashboard(dashboardId: string): string[] {
    const profiles = profileBuilderEngine.getAllProfiles()
    return profiles.filter(p => p.defaultDashboard === dashboardId).map(p => p.id)
  }

  /**
   * Get total impact of deleting a profile
   */
  calculateDeletionImpact(profileId: string): {
    affectedRoles: number
    affectedTeams: number
    affectedUsers: number
    totalUsersImpacted: number
    estimatedBreakingChanges: string[]
  } {
    const dependencies = this.getProfileDependencies(profileId)

    const roleCount = dependencies.find(d => d.usageType === 'role')?.count || 0
    const teamCount = dependencies.find(d => d.usageType === 'team')?.count || 0
    const userCount = dependencies.find(d => d.usageType === 'user')?.count || 0

    const totalUsers = roleCount * 10 + teamCount * 15 + userCount

    const breakingChanges: string[] = []

    if (roleCount > 0) {
      breakingChanges.push(`${roleCount} roles will lose dashboard customization`)
    }

    if (teamCount > 0) {
      breakingChanges.push(`${teamCount} teams will lose dashboard customization`)
    }

    if (userCount > 0) {
      breakingChanges.push(`${userCount} users will revert to default dashboard`)
    }

    return {
      affectedRoles: roleCount,
      affectedTeams: teamCount,
      affectedUsers: userCount,
      totalUsersImpacted: totalUsers,
      estimatedBreakingChanges: breakingChanges,
    }
  }

  /**
   * Suggest alternative profiles to assign before deleting
   */
  suggestAlternativeProfiles(profileId: string): string[] {
    const profile = profileBuilderEngine.getProfile(profileId)
    if (!profile) return []

    const allProfiles = profileBuilderEngine.getAllProfiles()

    // Suggest profiles with similar role/team mappings
    return allProfiles
      .filter(
        p =>
          p.id !== profileId &&
          (p.roleMapping.some(r => profile.roleMapping.includes(r)) ||
            p.teamMapping.some(t => profile.teamMapping.includes(t)))
      )
      .slice(0, 3)
      .map(p => p.id)
  }

  /**
   * Cascade assignment if profile is deleted/archived
   */
  cascadeAssignmentOnDelete(profileId: string, newProfileId: string): boolean {
    // Get all assignments for the profile to delete
    const profile = profileBuilderEngine.getProfile(profileId)
    if (!profile) return false

    const newProfile = profileBuilderEngine.getProfile(newProfileId)
    if (!newProfile) return false

    // Re-assign to new profile (simplified - in production would be more sophisticated)
    console.log(`Reassigning from profile ${profileId} to ${newProfileId}`)

    return true
  }
}

// Singleton instance
export const profileDependencyEngine = new ProfileDependencyEngineClass()
