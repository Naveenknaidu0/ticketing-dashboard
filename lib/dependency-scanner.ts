/**
 * Dependency Scanner
 * Scans all rules, automations, dashboards, and reports for configuration references
 * Builds the actual dependency graph based on what's actually using what
 */

import { dependencyEngine } from './dependency-engine'

export interface ScanResult {
  totalItemsScanned: number
  dependenciesFound: number
  configsReferenced: string[]
  cyclesDetected: number
  scanDuration: number // milliseconds
  timestamp: string
}

export interface ScanTarget {
  id: string
  type: 'rule' | 'automation' | 'dashboard' | 'report'
  name: string
  content: any
}

class DependencyScannerClass {
  /**
   * Scan all targets for configuration references
   */
  async scanAll(targets: ScanTarget[]): Promise<ScanResult> {
    const startTime = Date.now()
    const configsReferenced = new Set<string>()
    let dependenciesFound = 0

    for (const target of targets) {
      const configIds = await this.scanTarget(target)
      configIds.forEach(id => {
        configsReferenced.add(id)
        dependenciesFound++
      })
    }

    const scanDuration = Date.now() - startTime

    // Build graph from results
    this.buildDependencyGraph(targets)

    const metrics = dependencyEngine.getMetrics()

    return {
      totalItemsScanned: targets.length,
      dependenciesFound,
      configsReferenced: Array.from(configsReferenced),
      cyclesDetected: metrics.cyclicNodes.length,
      scanDuration,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Scan a single target for configuration references
   */
  private async scanTarget(target: ScanTarget): Promise<string[]> {
    const configIds = new Set<string>()

    const patterns = this.generateSearchPatterns()

    // Convert target content to string for searching
    const targetString = JSON.stringify(target.content).toLowerCase()

    patterns.forEach(pattern => {
      const regex = new RegExp(pattern, 'gi')
      const matches = targetString.match(regex)
      if (matches) {
        matches.forEach(match => {
          // Extract config ID/code from match
          const configId = this.extractConfigId(match, target.type)
          if (configId) {
            configIds.add(configId)
          }
        })
      }
    })

    // Add found dependencies to dependency engine
    configIds.forEach(configId => {
      dependencyEngine.addDependency(target.id, configId)
    })

    return Array.from(configIds)
  }

  /**
   * Generate search patterns for different target types
   */
  private generateSearchPatterns(): string[] {
    return [
      // Configuration codes (e.g., "queue-high", "skill-javascript")
      /[a-z][a-z0-9-]*-[a-z0-9-]+/gi.source,

      // Configuration IDs (e.g., "config-1234567890")
      /config-\d+/gi.source,

      // References in field names or values
      /configId["']?:\s*["']([a-z0-9-]+)["']/gi.source,
      /configCode["']?:\s*["']([a-z0-9-]+)["']/gi.source,

      // References in conditions
      /\(config[Id|Code]*\s*=(?!=)\s*["']([a-z0-9-]+)["']/gi.source,

      // References in assignments
      /queueId|skillId|priorityId|statusId|typeId/gi.source,
    ]
  }

  /**
   * Extract configuration ID from match
   */
  private extractConfigId(match: string, targetType: string): string | null {
    // Normalize the match
    const normalized = match.toLowerCase().trim()

    // Try to extract from pattern
    const configPattern = /config-\d+|[a-z][a-z0-9-]*-[a-z0-9-]+/
    const extracted = normalized.match(configPattern)

    return extracted ? extracted[0] : null
  }

  /**
   * Build dependency graph from scan results
   */
  private buildDependencyGraph(targets: ScanTarget[]): void {
    // Register all targets as nodes
    targets.forEach(target => {
      dependencyEngine['registerNode']?.({ id: target.id, code: target.name.toLowerCase(), label: target.name } as any, target.type)
    })
  }

  /**
   * Scan for unused configurations
   */
  async findUnusedConfigurations(allConfigs: string[], scannedItems: ScanTarget[]): Promise<string[]> {
    const scan = await this.scanAll(scannedItems)
    return allConfigs.filter(configId => !scan.configsReferenced.includes(configId))
  }

  /**
   * Find cycles in dependencies
   */
  getCycles(): string[][] {
    const metrics = dependencyEngine.getMetrics()
    return metrics.cyclicNodes.map(nodeId => [nodeId])
  }

  /**
   * Generate scan report
   */
  generateScanReport(result: ScanResult): string {
    const report = [
      '=== DEPENDENCY SCAN REPORT ===',
      `Scan Time: ${result.timestamp}`,
      `Duration: ${result.scanDuration}ms`,
      '',
      `Items Scanned: ${result.totalItemsScanned}`,
      `Dependencies Found: ${result.dependenciesFound}`,
      `Unique Configurations Referenced: ${result.configsReferenced.length}`,
      `Circular Dependencies: ${result.cyclesDetected}`,
      '',
    ]

    if (result.cyclesDetected > 0) {
      report.push('⚠ WARNING: Circular dependencies detected')
      report.push('This may cause infinite loops or unexpected behavior')
    }

    return report.join('\n')
  }

  /**
   * Reset scanner state
   */
  reset(): void {
    dependencyEngine.reset()
  }
}

// Singleton instance
export const dependencyScanner = new DependencyScannerClass()
