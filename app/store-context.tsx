'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { applicationStore, type StoreState, type Notification, type LeaderboardEntry } from '@/lib/store'
import BusinessLogicEngine from '@/lib/business-logic-engine'

interface StoreContextType {
  state: StoreState | null
  notifications: Notification[]
  leaderboard: LeaderboardEntry[]
  subscribe: (event: string, handler: (...args: any[]) => void) => void
  unsubscribe: (event: string, handler: (...args: any[]) => void) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export { StoreContext }

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [engine] = useState(() => new BusinessLogicEngine(applicationStore))

  useEffect(() => {
    // Initialize store asynchronously
    const initializeStore = async () => {
      await applicationStore.initializeWithMockData()
      setState(applicationStore.getState())
    }
    
    initializeStore()

    // Listen to store changes
    const handleStateChange = () => {
      setState(applicationStore.getState())
    }

    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
    }

    const handleLeaderboard = (entries: LeaderboardEntry[]) => {
      setLeaderboard(entries)
    }

    // Subscribe to all relevant events
    applicationStore.on('ticket.created', handleStateChange)
    applicationStore.on('ticket.updated', handleStateChange)
    applicationStore.on('ticket.assigned', handleStateChange)
    applicationStore.on('ticket.reassigned', handleStateChange)
    applicationStore.on('ticket.status-changed', handleStateChange)
    applicationStore.on('ticket.priority-changed', handleStateChange)
    applicationStore.on('ticket.resolved', handleStateChange)
    applicationStore.on('ticket.closed', handleStateChange)
    applicationStore.on('ticket.escalated', handleStateChange)
    applicationStore.on('approval.created', handleStateChange)
    applicationStore.on('approval.approved', handleStateChange)
    applicationStore.on('approval.rejected', handleStateChange)
    applicationStore.on('knowledge.created', handleStateChange)
    applicationStore.on('knowledge.published', handleStateChange)
    applicationStore.on('knowledge.reviewed', handleStateChange)
    applicationStore.on('user.available', handleStateChange)
    applicationStore.on('user.busy', handleStateChange)
    applicationStore.on('user.offline', handleStateChange)
    applicationStore.on('user.updated', handleStateChange)
    applicationStore.on('workload.updated', handleStateChange)
    applicationStore.on('notification.created', handleNotification)
    applicationStore.on('leaderboard.updated', handleLeaderboard)
    applicationStore.on('store.initialized', handleStateChange)

    // Listen to business logic engine view updates
    applicationStore.on('view.tickets.updated', handleStateChange)
    applicationStore.on('dashboard.updated', handleStateChange)
    applicationStore.on('agent-dashboard.updated', handleStateChange)
    applicationStore.on('team-dashboard.updated', handleStateChange)
    applicationStore.on('manager-dashboard.updated', handleStateChange)
    applicationStore.on('reports.updated', handleStateChange)
    applicationStore.on('sla.updated', handleStateChange)
    applicationStore.on('workload.recalculated', handleStateChange)
    applicationStore.on('todo.refreshed', handleStateChange)
    applicationStore.on('agent-workload.updated', handleStateChange)
    applicationStore.on('priority-breakdown.updated', handleStateChange)
    applicationStore.on('csat.survey-triggered', () => {
      // Handle CSAT survey trigger
    })
    
    // Listen to queue events
    applicationStore.on('queue.created', handleStateChange)
    applicationStore.on('queue.updated', handleStateChange)
    applicationStore.on('queue.deleted', handleStateChange)

    return () => {
      applicationStore.removeListener('ticket.created', handleStateChange)
      applicationStore.removeListener('ticket.updated', handleStateChange)
      applicationStore.removeListener('ticket.assigned', handleStateChange)
      applicationStore.removeListener('ticket.reassigned', handleStateChange)
      applicationStore.removeListener('ticket.status-changed', handleStateChange)
      applicationStore.removeListener('ticket.priority-changed', handleStateChange)
      applicationStore.removeListener('ticket.resolved', handleStateChange)
      applicationStore.removeListener('ticket.closed', handleStateChange)
      applicationStore.removeListener('ticket.escalated', handleStateChange)
      applicationStore.removeListener('approval.created', handleStateChange)
      applicationStore.removeListener('approval.approved', handleStateChange)
      applicationStore.removeListener('approval.rejected', handleStateChange)
      applicationStore.removeListener('knowledge.created', handleStateChange)
      applicationStore.removeListener('knowledge.published', handleStateChange)
      applicationStore.removeListener('knowledge.reviewed', handleStateChange)
      applicationStore.removeListener('user.available', handleStateChange)
      applicationStore.removeListener('user.busy', handleStateChange)
      applicationStore.removeListener('user.offline', handleStateChange)
      applicationStore.removeListener('user.updated', handleStateChange)
      applicationStore.removeListener('workload.updated', handleStateChange)
      applicationStore.removeListener('notification.created', handleNotification)
      applicationStore.removeListener('leaderboard.updated', handleLeaderboard)
      applicationStore.removeListener('store.initialized', handleStateChange)

      // Remove business logic engine event listeners
      applicationStore.removeListener('view.tickets.updated', handleStateChange)
      applicationStore.removeListener('dashboard.updated', handleStateChange)
      applicationStore.removeListener('agent-dashboard.updated', handleStateChange)
      applicationStore.removeListener('team-dashboard.updated', handleStateChange)
      applicationStore.removeListener('manager-dashboard.updated', handleStateChange)
      applicationStore.removeListener('reports.updated', handleStateChange)
      applicationStore.removeListener('sla.updated', handleStateChange)
      applicationStore.removeListener('workload.recalculated', handleStateChange)
      applicationStore.removeListener('todo.refreshed', handleStateChange)
      applicationStore.removeListener('agent-workload.updated', handleStateChange)
      applicationStore.removeListener('priority-breakdown.updated', handleStateChange)

      // Remove queue event listeners
      applicationStore.removeListener('queue.created', handleStateChange)
      applicationStore.removeListener('queue.updated', handleStateChange)
      applicationStore.removeListener('queue.deleted', handleStateChange)
    }
  }, [])

  const subscribe = useCallback((event: string, handler: (...args: any[]) => void) => {
    applicationStore.on(event, handler)
  }, [])

  const unsubscribe = useCallback((event: string, handler: (...args: any[]) => void) => {
    applicationStore.removeListener(event, handler)
  }, [])

  return (
    <StoreContext.Provider value={{ state, notifications, leaderboard, subscribe, unsubscribe }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }
  return context
}
