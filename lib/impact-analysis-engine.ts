/**
 * Impact Analysis Engine
 * Analyzes and predicts impact of configuration changes
 * Provides severity assessments and recommendations
 */

import { dependencyEngine, ImpactChain } from './dependency-engine'
import { usageEngine, UsageStats } from './usage-engine'

export type ChangeType = 'delete' | 'update' | 'archive' | 'disable' | 'rename' | 'clone'

export interface ImpactAssessment {
  changeType: ChangeType
  configId: string
  configCode: string
  configLabel: string
  canProceeed: boolean
  severity: 'critical' | 'high' | 'medium' | 'low'
  affectedItems: {
    directCount: number
    transitiveCount: number
    byType: {
      rules: number
      automations: number
      dashboards: number
      reports: number
    }
  }
  risks: ImpactRisk[]
  recommendations: string[]
  timeline: {
    estimatedTestingTime: number // minutes
    rollbackComplexity: 'simple' | 'moderate' | 'complex'
  }
}

export interface ImpactRisk {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affected: {
    type: string
    count: number
    examples: string[]
  }
  remediation: string
}

class ImpactAnalysisEngineClass {
  /**
   * Analyze impact of a change before it happens
   */
  analyzeImpact(changeType: ChangeType, configId: string, configCode: string, configLabel: string): ImpactAssessment {
    const impactChain = dependencyEngine.getImpactChain(configId)
    const usageStats = usageEngine.getTotalUsage(configId)
    const canDelete = dependencyEngine.canDelete(configId)

    const risks = this.identifyRisks(changeType, configId, impactChain, usageStats)
    const recommendations = this.generateRecommendations(changeType, configId, impactChain, risks)
    const severity = this.calculateSeverity(risks, impactChain.affected)

    const canProceeed = this.validateChange(changeType, canDelete.canDelete, risks)

    return {
      changeType,
      configId,
      configCode,
      configLabel,
      canProceeed,
      severity,
      affectedItems: {
        directCount: impactChain.direct.length,
        transitiveCount: impactChain.transitive.length,
        byType: impactChain.affected,
      },
      risks,
      recommendations,
      timeline: this.estimateTimeline(changeType, impactChain.affected),
    }
  }

  /**
   * Identify risks associated with a change
   */
  private identifyRisks(changeType: ChangeType, configId: string, impactChain: ImpactChain, usage: number): ImpactRisk[] {
    const risks: ImpactRisk[] = []

    // Risk: Breaking existing items
    if (impactChain.direct.length > 0) {
      risks.push({
        id: 'breaking-change',
        severity: impactChain.direct.length > 10 ? 'critical' : 'high',
        title: 'Breaking Change Risk',
        description: `${impactChain.direct.length} item(s) directly depend on this configuration`,
        affected: {
          type: 'dependent items',
          count: impactChain.direct.length,
          examples: impactChain.direct.slice(0, 3),
        },
        remediation: changeType === 'delete' ? 'Archive instead of deleting' : 'Update dependents first',
      })
    }

    // Risk: High usage
    if (usage > 100) {
      risks.push({
        id: 'high-usage',
        severity: 'critical',
        title: 'High Usage Configuration',
        description: `This configuration is used ${usage} times across the system`,
        affected: {
          type: 'usage instances',
          count: usage,
          examples: [],
        },
        remediation: 'Consider archiving with deprecation period instead of immediate deletion',
      })
    }

    // Risk: Cascading impact
    if (impactChain.transitive.length > impactChain.direct.length * 2) {
      risks.push({
        id: 'cascading-impact',
        severity: 'high',
        title: 'Cascading Impact',
        description: `Change will cascade to ${impactChain.transitive.length} items downstream`,
        affected: {
          type: 'cascading items',
          count: impactChain.transitive.length,
          examples: impactChain.transitive.slice(0, 3),
        },
        remediation: 'Review all transitive dependents before proceeding',
      })
    }

    // Risk: Complex rollback
    if (changeType === 'update' && impactChain.direct.length > 5) {
      risks.push({
        id: 'rollback-complexity',
        severity: 'medium',
        title: 'Complex Rollback Required',
        description: 'Reverting this change would require updates to multiple items',
        affected: {
          type: 'items requiring rollback',
          count: impactChain.direct.length,
          examples: [],
        },
        remediation: 'Create backup before updating and document all changes',
      })
    }

    // Risk: Critical type usage
    if (impactChain.affected.rules > 0) {
      risks.push({
        id: 'used-in-rules',
        severity: impactChain.affected.rules > 5 ? 'high' : 'medium',
        title: 'Used in Business Rules',
        description: `${impactChain.affected.rules} business rule(s) depend on this`,
        affected: {
          type: 'rules',
          count: impactChain.affected.rules,
          examples: [],
        },
        remediation: 'Business rule changes require testing and approval',
      })
    }

    if (impactChain.affected.automations > 0) {
      risks.push({
        id: 'used-in-automations',
        severity: impactChain.affected.automations > 3 ? 'high' : 'medium',
        title: 'Used in Automations',
        description: `${impactChain.affected.automations} automation(s) depend on this`,
        affected: {
          type: 'automations',
          count: impactChain.affected.automations,
          examples: [],
        },
        remediation: 'Automations may fail silently - thorough testing required',
      })
    }

    return risks
  }

  /**
   * Calculate overall severity
   */
  private calculateSeverity(risks: ImpactRisk[], affected: ImpactChain['affected']): 'critical' | 'high' | 'medium' | 'low' {
    const hasCriticalRisk = risks.some(r => r.severity === 'critical')
    if (hasCriticalRisk) return 'critical'

    const hasHighRisk = risks.some(r => r.severity === 'high')
    if (hasHighRisk) return 'high'

    const totalAffected = Object.values(affected).reduce((sum, n) => sum + n, 0)
    if (totalAffected > 20) return 'high'
    if (totalAffected > 5) return 'medium'

    return 'low'
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(changeType: ChangeType, configId: string, impactChain: ImpactChain, risks: ImpactRisk[]): string[] {
    const recommendations: string[] = []

    switch (changeType) {
      case 'delete':
        if (impactChain.direct.length > 0) {
          recommendations.push('❌ Cannot delete: Configuration is in use. Archive instead.')
          recommendations.push(`→ ${impactChain.direct.length} item(s) depend on this.`)
        } else {
          recommendations.push('✓ Safe to delete: No dependencies found')
        }
        break

      case 'archive':
        if (impactChain.direct.length > 0) {
          recommendations.push(`⚠ Archiving will affect ${impactChain.direct.length} dependent item(s)`)
          recommendations.push('→ Consider notifying affected teams before archiving')
        } else {
          recommendations.push('✓ Safe to archive: No active dependencies')
        }
        break

      case 'disable':
        if (impactChain.affected.automations > 0) {
          recommendations.push(`⚠ Disabling will affect ${impactChain.affected.automations} automation(s)`)
          recommendations.push('→ Automations may fail if they rely on this')
        }
        break

      case 'update':
        recommendations.push('→ Test changes in staging environment first')
        if (impactChain.direct.length > 5) {
          recommendations.push(`→ Notify ${impactChain.direct.length} dependent item maintainers`)
        }
        break

      case 'rename':
        recommendations.push('→ Verify no hardcoded references to the old name')
        if (impactChain.direct.length > 0) {
          recommendations.push(`→ Update ${impactChain.direct.length} references to new name`)
        }
        break

      case 'clone':
        recommendations.push('✓ Cloning is safe and non-breaking')
        recommendations.push('→ Review the clone and rename it appropriately')
        break
    }

    // Add risk-based recommendations
    risks.forEach(risk => {
      if (risk.remediation && !recommendations.includes(`→ ${risk.remediation}`)) {
        recommendations.push(`→ ${risk.remediation}`)
      }
    })

    return [...new Set(recommendations)] // Remove duplicates
  }

  /**
   * Validate if change can proceed
   */
  private validateChange(changeType: ChangeType, canDelete: boolean, risks: ImpactRisk[]): boolean {
    if (changeType === 'delete' && !canDelete) {
      return false
    }

    const criticalRisks = risks.filter(r => r.severity === 'critical')
    if (changeType === 'delete' && criticalRisks.length > 0) {
      return false
    }

    return true
  }

  /**
   * Estimate timeline and complexity
   */
  private estimateTimeline(
    changeType: ChangeType,
    affected: ImpactChain['affected'],
  ): {
    estimatedTestingTime: number
    rollbackComplexity: 'simple' | 'moderate' | 'complex'
  } {
    const totalAffected = Object.values(affected).reduce((sum, n) => sum + n, 0)

    let testingTime = 15 // base time
    testingTime += affected.rules * 10
    testingTime += affected.automations * 15
    testingTime += affected.dashboards * 5

    let complexity: 'simple' | 'moderate' | 'complex' = 'simple'
    if (totalAffected > 10) complexity = 'moderate'
    if (totalAffected > 20 || affected.automations > 5) complexity = 'complex'

    return {
      estimatedTestingTime: testingTime,
      rollbackComplexity: complexity,
    }
  }

  /**
   * Generate impact report
   */
  generateImpactReport(assessments: ImpactAssessment[]): string {
    const report = [
      '=== IMPACT ANALYSIS REPORT ===',
      `Generated: ${new Date().toISOString()}`,
      '',
      `Total Changes: ${assessments.length}`,
      `Blockable Changes: ${assessments.filter(a => !a.canProceeed).length}`,
      `High/Critical Severity: ${assessments.filter(a => ['critical', 'high'].includes(a.severity)).length}`,
      '',
    ]

    assessments.forEach(a => {
      report.push(`${a.configLabel} (${a.changeType}): ${a.severity.toUpperCase()}`)
      report.push(`  Affected: ${a.affectedItems.directCount} direct, ${a.affectedItems.transitiveCount} transitive`)
      report.push(`  Blockable: ${!a.canProceeed}`)
    })

    return report.join('\n')
  }
}

// Singleton instance
export const impactAnalysisEngine = new ImpactAnalysisEngineClass()
