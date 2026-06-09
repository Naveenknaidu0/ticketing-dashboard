// Comprehensive Skill Engine Utilities

import { SkillComplete, SkillListItem, UserSkillAssignment, SkillLevelModel, SkillAuditEvent } from './types'

// Initialize default skill levels
export const DEFAULT_SKILL_LEVELS: SkillLevelModel[] = [
  { id: 'level-1', skillId: '', name: 'Beginner', description: 'Entry-level capability', requirements: [], order: 1, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'level-2', skillId: '', name: 'Intermediate', description: 'Intermediate capability with some independence', requirements: [], order: 2, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'level-3', skillId: '', name: 'Advanced', description: 'Advanced capability and knowledge', requirements: [], order: 3, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'level-4', skillId: '', name: 'Expert', description: 'Expert-level capability and leadership', requirements: [], order: 4, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'level-5', skillId: '', name: 'Architect', description: 'Architectural and strategic level', requirements: [], order: 5, isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

// Initialize default skill categories from Masters
export const SKILL_CATEGORIES = [
  { id: 'cat-network', code: 'NETWORK', name: 'Network', description: 'Network infrastructure and management', color: '#3B82F6', isActive: true },
  { id: 'cat-infra', code: 'INFRASTRUCTURE', name: 'Infrastructure', description: 'Infrastructure design and deployment', color: '#8B5CF6', isActive: true },
  { id: 'cat-security', code: 'SECURITY', name: 'Security', description: 'Security and compliance', color: '#DC2626', isActive: true },
  { id: 'cat-cloud', code: 'CLOUD', name: 'Cloud', description: 'Cloud platforms and services', color: '#06B6D4', isActive: true },
  { id: 'cat-database', code: 'DATABASE', name: 'Database', description: 'Database administration and design', color: '#F59E0B', isActive: true },
  { id: 'cat-application', code: 'APPLICATION', name: 'Application', description: 'Application development and support', color: '#10B981', isActive: true },
  { id: 'cat-identity', code: 'IDENTITY', name: 'Identity', description: 'Identity and access management', color: '#EC4899', isActive: true },
  { id: 'cat-hardware', code: 'HARDWARE', name: 'Hardware', description: 'Hardware and devices', color: '#6B7280', isActive: true },
]

// Convert full skill to list item for table display
export function skillToListItem(skill: SkillComplete): SkillListItem {
  return {
    id: skill.id,
    name: skill.name,
    code: skill.code,
    category: skill.category,
    levelModel: skill.levelModel.length > 0 ? skill.levelModel[0].name : 'Default',
    assignedUsers: skill.totalAssignedUsers,
    relatedQueues: skill.relatedQueues,
    relatedRules: skill.relatedRules,
    status: skill.status,
    version: skill.version,
    lastUpdated: skill.updatedAt,
  }
}

// Check if user can be assigned to skill
export function canAssignSkill(user: any, skill: SkillComplete): { canAssign: boolean; reason?: string } {
  if (skill.status === 'disabled' || skill.status === 'archived') {
    return { canAssign: false, reason: 'Skill is not available' }
  }
  
  if (!user || !user.id) {
    return { canAssign: false, reason: 'Invalid user' }
  }
  
  return { canAssign: true }
}

// Calculate skill usage impact
export function getSkillUsageImpact(skill: SkillComplete): {
  affectedUsers: number
  affectedQueues: number
  affectedRules: number
  affectedAutomations: number
  totalImpact: number
} {
  return {
    affectedUsers: skill.totalAssignedUsers,
    affectedQueues: skill.relatedQueues,
    affectedRules: skill.relatedRules,
    affectedAutomations: skill.relatedAutomations,
    totalImpact: skill.totalAssignedUsers + skill.relatedQueues + skill.relatedRules + skill.relatedAutomations,
  }
}

// Format skill proficiency level name
export function getLevelName(level: number, customLevels?: SkillLevelModel[]): string {
  if (customLevels && customLevels.length >= level) {
    return customLevels[level - 1]?.name || `Level ${level}`
  }
  
  const defaultNames = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Architect']
  return defaultNames[level] || `Level ${level}`
}

// Get color for skill category
export function getCategoryColor(categoryId: string): { bg: string; text: string } {
  const category = SKILL_CATEGORIES.find(c => c.id === categoryId)
  if (!category) return { bg: '#F3F4F3', text: '#6B6B6B' }
  
  return { bg: category.color + '20', text: category.color }
}

// Track skill audit event
export function createAuditEvent(
  skillId: string,
  skillName: string,
  eventType: string,
  who: string,
  whoName: string,
  oldValue?: any,
  newValue?: any
): SkillAuditEvent {
  return {
    id: `audit-${Date.now()}`,
    skillId,
    skillName,
    eventType: eventType as any,
    who,
    whoName,
    when: new Date().toISOString(),
    oldValue,
    newValue,
  }
}

// Build skill export data
export function exportSkillsToJSON(skills: SkillComplete[]): string {
  return JSON.stringify(skills, null, 2)
}

// Parse imported skills
export function importSkillsFromJSON(jsonData: string): SkillComplete[] {
  try {
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('[v0] Error parsing skills JSON:', error)
    return []
  }
}

// Validate skill configuration
export function validateSkillConfiguration(skill: Partial<SkillComplete>): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!skill.name || skill.name.trim() === '') {
    errors.push('Skill name is required')
  }
  
  if (!skill.code || skill.code.trim() === '') {
    errors.push('Skill code is required')
  }
  
  if (!skill.category) {
    errors.push('Skill category is required')
  }
  
  if (!skill.levelModel || skill.levelModel.length === 0) {
    errors.push('At least one proficiency level is required')
  }
  
  return { valid: errors.length === 0, errors }
}
