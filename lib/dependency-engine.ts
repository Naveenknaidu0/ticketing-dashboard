/**
 * Dependency Engine
 * Builds and maintains dependency graphs for all configurations
 * Tracks cross-references between configurations across all modules
 */

import { ConfigurationValue } from './configuration-registry'

export interface DependencyNode {
  id: string
  code: string
  label: string
  category: string
  type: 'configuration' | 'rule' | 'automation' | 'dashboard' | 'report'
  dependencies: string[] // IDs this config depends on
  dependents: string[] // IDs that depend on this config
  metadata?: {
    createdAt: string
    updatedAt: string
    version: number
  }
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>
  edges: Set<string> // "from->to" edge identifiers
  cycleDetected: boolean
  cycles: string[][]
}

export interface ImpactChain {
  direct: string[] // Immediate dependents
  transitive: string[] // All downstream dependents
  affected: {
    rules: number
    automations: number
    dashboards: number
    reports: number
  }
}

export interface DependencyMetrics {
  totalNodes: number
  totalEdges: number
  averageDependencies: number
  orphanedConfigs: string[]
  criticalNodes: string[] // Nodes with many dependents
  cyclicNodes: string[]
}

class DependencyEngineClass {
  private graph: DependencyGraph = {
    nodes: new Map(),
    edges: new Set(),
    cycleDetected: false,
    cycles: [],
  }

  private scanCache: Map<string, DependencyNode[]> = new Map()

  /**
   * Register a configuration in the dependency graph
   */
  registerNode(config: ConfigurationValue, type: DependencyNode['type'] = 'configuration'): void {
    const node: DependencyNode = {
      id: config.id,
      code: config.code,
      label: config.label,
      category: config.category,
      type,
      dependencies: [],
      dependents: [],
      metadata: config.metadata,
    }

    this.graph.nodes.set(config.id, node)
  }

  /**
   * Add a dependency: fromId depends on toId
   */
  addDependency(fromId: string, toId: string): boolean {
    const fromNode = this.graph.nodes.get(fromId)
    const toNode = this.graph.nodes.get(toId)

    if (!fromNode || !toNode) return false

    // Prevent duplicate edges
    const edgeId = `${fromId}->${toId}`
    if (this.graph.edges.has(edgeId)) return false

    fromNode.dependencies.push(toId)
    toNode.dependents.push(fromId)
    this.graph.edges.add(edgeId)

    // Detect cycles after adding new edge
    this.detectCycles()
    this.clearCache()

    return true
  }

  /**
   * Remove a dependency
   */
  removeDependency(fromId: string, toId: string): boolean {
    const fromNode = this.graph.nodes.get(fromId)
    const toNode = this.graph.nodes.get(toId)

    if (!fromNode || !toNode) return false

    fromNode.dependencies = fromNode.dependencies.filter(id => id !== toId)
    toNode.dependents = toNode.dependents.filter(id => id !== fromId)

    const edgeId = `${fromId}->${toId}`
    this.graph.edges.delete(edgeId)

    this.detectCycles()
    this.clearCache()

    return true
  }

  /**
   * Get direct and transitive impact of deleting/updating a configuration
   */
  getImpactChain(configId: string): ImpactChain {
    const direct = this.getDirectDependents(configId)
    const transitive = this.getTransitiveDependents(configId)

    const affected = {
      rules: 0,
      automations: 0,
      dashboards: 0,
      reports: 0,
    }

    transitive.forEach(id => {
      const node = this.graph.nodes.get(id)
      if (node) {
        switch (node.type) {
          case 'rule':
            affected.rules++
            break
          case 'automation':
            affected.automations++
            break
          case 'dashboard':
            affected.dashboards++
            break
          case 'report':
            affected.reports++
            break
        }
      }
    })

    return { direct, transitive, affected }
  }

  /**
   * Get direct dependents (immediate downstream)
   */
  private getDirectDependents(configId: string): string[] {
    const node = this.graph.nodes.get(configId)
    return node?.dependents || []
  }

  /**
   * Get all transitive dependents using BFS
   */
  private getTransitiveDependents(configId: string): string[] {
    const visited = new Set<string>()
    const queue = [configId]

    while (queue.length > 0) {
      const current = queue.shift()!
      if (visited.has(current)) continue

      visited.add(current)
      const node = this.graph.nodes.get(current)
      if (node) {
        node.dependents.forEach(depId => {
          if (!visited.has(depId)) {
            queue.push(depId)
          }
        })
      }
    }

    visited.delete(configId)
    return Array.from(visited)
  }

  /**
   * Detect cycles in dependency graph
   */
  private detectCycles(): void {
    this.graph.cycleDetected = false
    this.graph.cycles = []

    const visited = new Set<string>()
    const recursionStack = new Set<string>()

    const visit = (nodeId: string, path: string[]): void => {
      visited.add(nodeId)
      recursionStack.add(nodeId)

      const node = this.graph.nodes.get(nodeId)
      if (node) {
        node.dependencies.forEach(depId => {
          if (!visited.has(depId)) {
            visit(depId, [...path, depId])
          } else if (recursionStack.has(depId)) {
            // Found cycle
            this.graph.cycleDetected = true
            const cycleStart = path.indexOf(depId)
            this.graph.cycles.push(path.slice(cycleStart).concat([depId]))
          }
        })
      }

      recursionStack.delete(nodeId)
    }

    this.graph.nodes.forEach((node, nodeId) => {
      if (!visited.has(nodeId)) {
        visit(nodeId, [nodeId])
      }
    })
  }

  /**
   * Calculate dependency metrics
   */
  getMetrics(): DependencyMetrics {
    const orphaned: string[] = []
    const critical: string[] = []
    const cyclic: string[] = []

    this.graph.nodes.forEach((node, nodeId) => {
      // Orphaned: no dependencies or dependents
      if (node.dependencies.length === 0 && node.dependents.length === 0) {
        orphaned.push(nodeId)
      }

      // Critical: many dependents
      if (node.dependents.length > 5) {
        critical.push(nodeId)
      }
    })

    // Extract cyclic nodes
    this.graph.cycles.forEach(cycle => {
      cyclic.push(...cycle)
    })

    return {
      totalNodes: this.graph.nodes.size,
      totalEdges: this.graph.edges.size,
      averageDependencies:
        this.graph.nodes.size > 0
          ? Array.from(this.graph.nodes.values()).reduce((sum, n) => sum + n.dependencies.length, 0) /
            this.graph.nodes.size
          : 0,
      orphanedConfigs: [...new Set(orphaned)],
      criticalNodes: [...new Set(critical)],
      cyclicNodes: [...new Set(cyclic)],
    }
  }

  /**
   * Get all dependencies of a configuration
   */
  getDependencies(configId: string): DependencyNode[] {
    const node = this.graph.nodes.get(configId)
    if (!node) return []

    return node.dependencies.map(depId => this.graph.nodes.get(depId)).filter(n => n) as DependencyNode[]
  }

  /**
   * Get all dependents of a configuration
   */
  getDependents(configId: string): DependencyNode[] {
    const node = this.graph.nodes.get(configId)
    if (!node) return []

    return node.dependents.map(depId => this.graph.nodes.get(depId)).filter(n => n) as DependencyNode[]
  }

  /**
   * Check if a configuration can be safely deleted
   */
  canDelete(configId: string): { canDelete: boolean; reason?: string; affectedCount?: number } {
    const node = this.graph.nodes.get(configId)
    if (!node) return { canDelete: true }

    if (node.dependents.length > 0) {
      return {
        canDelete: false,
        reason: `This configuration is used by ${node.dependents.length} other item(s). Archive instead of deleting.`,
        affectedCount: node.dependents.length,
      }
    }

    return { canDelete: true }
  }

  /**
   * Clear the scan cache
   */
  private clearCache(): void {
    this.scanCache.clear()
  }

  /**
   * Export graph as JSON
   */
  exportGraph() {
    return {
      nodes: Array.from(this.graph.nodes.values()),
      edges: Array.from(this.graph.edges),
      cycleDetected: this.graph.cycleDetected,
      cycles: this.graph.cycles,
    }
  }

  /**
   * Reset the entire graph
   */
  reset(): void {
    this.graph.nodes.clear()
    this.graph.edges.clear()
    this.graph.cycleDetected = false
    this.graph.cycles = []
    this.clearCache()
  }
}

// Singleton instance
export const dependencyEngine = new DependencyEngineClass()
