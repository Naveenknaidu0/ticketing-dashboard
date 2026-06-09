/**
 * Usage Engine
 * Tracks actual usage of configurations across all systems
 * Counts usage frequency, identifies trends, detects unused items
 */

export interface UsageRecord {
  configId: string
  type: 'rule' | 'automation' | 'dashboard' | 'report' | 'template'
  entityId: string
  entityName: string
  usageCount: number
  lastUsedAt: string
  context: string // Where/how it's used
  severity: 'critical' | 'high' | 'medium' | 'low'
}

export interface UsageStats {
  totalUsage: number
  byType: Record<string, number>
  byFrequency: {
    veryHigh: string[] // >100 uses
    high: string[] // 50-100 uses
    medium: string[] // 10-50 uses
    low: string[] // 1-10 uses
    unused: string[] // 0 uses
  }
  mostUsed: UsageRecord[]
  leastUsed: UsageRecord[]
  unused: string[]
  trends: {
    increased: string[] // Usage increased
    decreased: string[] // Usage decreased
    stable: string[] // Stable usage
  }
}

class UsageEngineClass {
  private usageRecords: Map<string, UsageRecord[]> = new Map()
  private usageHistory: Map<string, { timestamp: string; count: number }[]> = new Map()

  /**
   * Record usage of a configuration
   */
  recordUsage(configId: string, record: Omit<UsageRecord, 'usageCount' | 'lastUsedAt'>): void {
    if (!this.usageRecords.has(configId)) {
      this.usageRecords.set(configId, [])
    }

    const existing = this.usageRecords.get(configId)!.find(r => r.entityId === record.entityId && r.type === record.type)

    if (existing) {
      existing.usageCount++
      existing.lastUsedAt = new Date().toISOString()
    } else {
      this.usageRecords.get(configId)!.push({
        ...record,
        usageCount: 1,
        lastUsedAt: new Date().toISOString(),
      })
    }

    // Track history
    const history = this.usageHistory.get(configId) || []
    history.push({
      timestamp: new Date().toISOString(),
      count: this.getTotalUsage(configId),
    })
    this.usageHistory.set(configId, history.slice(-365)) // Keep last 365 days
  }

  /**
   * Get total usage count for a configuration
   */
  getTotalUsage(configId: string): number {
    const records = this.usageRecords.get(configId) || []
    return records.reduce((sum, r) => sum + r.usageCount, 0)
  }

  /**
   * Get usage records for a configuration
   */
  getUsageRecords(configId: string): UsageRecord[] {
    return this.usageRecords.get(configId) || []
  }

  /**
   * Get usage statistics
   */
  getUsageStats(configIds: string[]): UsageStats {
    const byType: Record<string, number> = {
      rule: 0,
      automation: 0,
      dashboard: 0,
      report: 0,
      template: 0,
    }

    const byFrequency = {
      veryHigh: [] as string[],
      high: [] as string[],
      medium: [] as string[],
      low: [] as string[],
      unused: [] as string[],
    }

    const allRecords: UsageRecord[] = []
    let totalUsage = 0

    configIds.forEach(configId => {
      const records = this.usageRecords.get(configId) || []
      const count = records.reduce((sum, r) => sum + r.usageCount, 0)

      if (count === 0) {
        byFrequency.unused.push(configId)
      } else if (count > 100) {
        byFrequency.veryHigh.push(configId)
      } else if (count >= 50) {
        byFrequency.high.push(configId)
      } else if (count >= 10) {
        byFrequency.medium.push(configId)
      } else {
        byFrequency.low.push(configId)
      }

      records.forEach(r => {
        byType[r.type]++
        totalUsage += r.usageCount
        allRecords.push(r)
      })
    })

    const mostUsed = [...allRecords].sort((a, b) => b.usageCount - a.usageCount).slice(0, 10)
    const leastUsed = [...allRecords].sort((a, b) => a.usageCount - b.usageCount).slice(0, 10)

    return {
      totalUsage,
      byType,
      byFrequency,
      mostUsed,
      leastUsed,
      unused: byFrequency.unused,
      trends: {
        increased: [],
        decreased: [],
        stable: [],
      },
    }
  }

  /**
   * Identify configurations that haven't been used recently
   */
  getInactiveConfigs(configIds: string[], daysSinceUsed: number = 30): string[] {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceUsed)

    return configIds.filter(configId => {
      const records = this.usageRecords.get(configId) || []
      if (records.length === 0) return true

      const mostRecent = records.reduce((latest, r) => {
        return new Date(r.lastUsedAt) > new Date(latest.lastUsedAt) ? r : latest
      })

      return new Date(mostRecent.lastUsedAt) < cutoffDate
    })
  }

  /**
   * Calculate usage trend for a configuration
   */
  getUsageTrend(configId: string): 'increasing' | 'decreasing' | 'stable' {
    const history = this.usageHistory.get(configId) || []
    if (history.length < 2) return 'stable'

    const recent = history.slice(-7) // Last 7 records
    const older = history.slice(-14, -7)

    if (recent.length === 0 || older.length === 0) return 'stable'

    const recentAvg = recent.reduce((sum, h) => sum + h.count, 0) / recent.length
    const olderAvg = older.reduce((sum, h) => sum + h.count, 0) / older.length

    const change = (recentAvg - olderAvg) / (olderAvg || 1)

    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }

  /**
   * Get usage severity (how critical a configuration is)
   */
  calculateSeverity(configId: string): 'critical' | 'high' | 'medium' | 'low' {
    const usage = this.getTotalUsage(configId)
    const records = this.usageRecords.get(configId) || []
    const criticality = records.filter(r => r.severity === 'critical').length

    if (criticality > 0 || usage > 100) return 'critical'
    if (usage > 50 || records.some(r => r.severity === 'high')) return 'high'
    if (usage > 10) return 'medium'
    return 'low'
  }

  /**
   * Get recommendations for unused configurations
   */
  getRecommendations(configIds: string[]): string[] {
    const recommendations: string[] = []
    const inactive = this.getInactiveConfigs(configIds, 90)

    if (inactive.length > 0) {
      recommendations.push(`${inactive.length} configurations haven't been used in 90 days - consider archiving them`)
    }

    const unused = configIds.filter(id => this.getTotalUsage(id) === 0)
    if (unused.length > 0) {
      recommendations.push(`${unused.length} configurations are completely unused - safe to delete or archive`)
    }

    return recommendations
  }

  /**
   * Export usage data
   */
  exportUsageData() {
    return {
      records: Array.from(this.usageRecords.entries()),
      history: Array.from(this.usageHistory.entries()),
    }
  }

  /**
   * Clear usage data for a configuration
   */
  clearUsage(configId: string): void {
    this.usageRecords.delete(configId)
    this.usageHistory.delete(configId)
  }

  /**
   * Reset all usage data
   */
  reset(): void {
    this.usageRecords.clear()
    this.usageHistory.clear()
  }
}

// Singleton instance
export const usageEngine = new UsageEngineClass()
