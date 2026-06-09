import { useEffect, useRef, useCallback } from 'react'

export interface AuditEntry {
  id: string
  timestamp: number
  action: string
  entityType: string
  entityId: string
  userId?: string
  changes?: {
    field: string
    before: any
    after: any
  }[]
  metadata?: Record<string, any>
}

const AUDIT_STORAGE_KEY = 'audit_trail'
const MAX_ENTRIES = 1000

export function useAuditTrail() {
  const auditRef = useRef<AuditEntry[]>([])

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY)
      if (stored) {
        auditRef.current = JSON.parse(stored)
      }
    } catch (err) {
      console.warn('[v0] Failed to load audit trail from storage:', err)
    }
  }, [])

  const addEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    auditRef.current.unshift(newEntry)

    // Keep only the most recent entries
    if (auditRef.current.length > MAX_ENTRIES) {
      auditRef.current = auditRef.current.slice(0, MAX_ENTRIES)
    }

    // Persist to localStorage
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditRef.current))
    } catch (err) {
      console.warn('[v0] Failed to save audit trail to storage:', err)
    }

    console.log(`[v0] Audit entry recorded:`, newEntry.action, newEntry.entityType)
  }, [])

  const getEntries = useCallback((
    filters?: {
      entityType?: string
      entityId?: string
      action?: string
      since?: number
    }
  ): AuditEntry[] => {
    let entries = [...auditRef.current]

    if (filters?.entityType) {
      entries = entries.filter(e => e.entityType === filters.entityType)
    }
    if (filters?.entityId) {
      entries = entries.filter(e => e.entityId === filters.entityId)
    }
    if (filters?.action) {
      entries = entries.filter(e => e.action === filters.action)
    }
    if (filters?.since) {
      entries = entries.filter(e => e.timestamp >= filters.since)
    }

    return entries
  }, [])

  const clearOldEntries = useCallback((beforeTimestamp: number) => {
    auditRef.current = auditRef.current.filter(e => e.timestamp >= beforeTimestamp)
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(auditRef.current))
    } catch (err) {
      console.warn('[v0] Failed to save audit trail after clearing:', err)
    }
  }, [])

  return {
    addEntry,
    getEntries,
    clearOldEntries,
    entries: auditRef.current,
  }
}
