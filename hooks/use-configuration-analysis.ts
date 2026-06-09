/**
 * useConfigurationAnalysis Hook
 * Provides dependency and impact analysis data for configuration UI components
 */

'use client'

import { useEffect, useState } from 'react'
import { dependencyEngine, DependencyNode } from '@/lib/dependency-engine'
import { usageEngine, UsageRecord } from '@/lib/usage-engine'
import { impactAnalysisEngine, ImpactAssessment } from '@/lib/impact-analysis-engine'
import { subscribeToRegistryChanges } from '@/lib/configuration-registry'

export interface ConfigurationAnalysis {
  loading: boolean
  dependencies: {
    dependencies: DependencyNode[]
    dependents: DependencyNode[]
    impactChain: {
      direct: number
      transitive: number
    }
  }
  usage: {
    totalUsage: number
    byType: Record<string, number>
    records: UsageRecord[]
    trend: 'increasing' | 'decreasing' | 'stable'
    lastUsedAt?: string
    inactiveFor?: number
  }
  impact: ImpactAssessment
  error?: string
}

export function useConfigurationAnalysis(configId: string, changeType: 'delete' | 'update' | 'archive' | 'disable' = 'delete') {
  const [analysis, setAnalysis] = useState<ConfigurationAnalysis>({
    loading: true,
    dependencies: {
      dependencies: [],
      dependents: [],
      impactChain: { direct: 0, transitive: 0 },
    },
    usage: {
      totalUsage: 0,
      byType: {},
      records: [],
      trend: 'stable',
    },
    impact: {
      changeType,
      configId,
      configCode: '',
      configLabel: '',
      canProceeed: true,
      severity: 'low',
      affectedItems: {
        directCount: 0,
        transitiveCount: 0,
        byType: { rules: 0, automations: 0, dashboards: 0, reports: 0 },
      },
      risks: [],
      recommendations: [],
      timeline: {
        estimatedTestingTime: 15,
        rollbackComplexity: 'simple',
      },
    },
  })

  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setAnalysis(prev => ({ ...prev, loading: true }))

        // Get dependencies
        const deps = dependencyEngine.getDependencies(configId)
        const dependents = dependencyEngine.getDependents(configId)
        const impactChain = dependencyEngine.getImpactChain(configId)

        // Get usage
        const totalUsage = usageEngine.getTotalUsage(configId)
        const records = usageEngine.getUsageRecords(configId)
        const trend = usageEngine.getUsageTrend(configId)

        // Build usage by type
        const byType: Record<string, number> = {}
        records.forEach(r => {
          byType[r.type] = (byType[r.type] || 0) + r.usageCount
        })

        // Get impact analysis - we need config details from context
        // For now, we'll create a basic assessment
        const impact = impactAnalysisEngine.analyzeImpact(changeType, configId, 'config-code', 'Configuration')

        setAnalysis({
          loading: false,
          dependencies: {
            dependencies: deps,
            dependents,
            impactChain: {
              direct: impactChain.direct.length,
              transitive: impactChain.transitive.length,
            },
          },
          usage: {
            totalUsage,
            byType,
            records,
            trend,
            lastUsedAt: records.length > 0 ? records[0].lastUsedAt : undefined,
          },
          impact,
        })
      } catch (error) {
        setAnalysis(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load analysis',
        }))
      }
    }

    loadAnalysis()

    // Subscribe to registry changes
    const unsubscribe = subscribeToRegistryChanges(() => {
      loadAnalysis()
    })

    return unsubscribe
  }, [configId, changeType])

  return analysis
}

/**
 * useImpactAssessment Hook
 * Provides impact assessment for configuration changes
 */
export function useImpactAssessment(configId: string, configCode: string, configLabel: string, changeType: 'delete' | 'update' | 'archive' | 'disable' = 'delete') {
  const [assessment, setAssessment] = useState<ImpactAssessment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const impact = impactAnalysisEngine.analyzeImpact(changeType, configId, configCode, configLabel)
      setAssessment(impact)
      setLoading(false)
    } catch (error) {
      console.error('Failed to assess impact:', error)
      setLoading(false)
    }
  }, [configId, configCode, configLabel, changeType])

  return { assessment, loading }
}
