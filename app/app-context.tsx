'use client'

import React, { createContext, useState, ReactNode } from 'react'

export type UserRole = 'agent' | 'manager' | 'team-lead' | 'executive' | null
export type DashboardView = 'my' | 'team'

export interface TicketFilter {
  status?: string[]
  priority?: string[]
  type?: string[]
  group?: string[]
  assignedTo?: string[]
  slaRisk?: boolean
  dueToday?: boolean
  overdue?: boolean
  waitingCustomer?: boolean
  resolved?: boolean
  resolvedToday?: boolean
}

interface AppContextType {
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  dashboardView: DashboardView
  setDashboardView: (view: DashboardView) => void
  showTooltips: boolean
  setShowTooltips: (show: boolean) => void
  ticketFilters: TicketFilter
  setTicketFilters: (filters: TicketFilter) => void
  clearFilters: () => void
}

export const AppContext = createContext<AppContextType>({
  userRole: null,
  setUserRole: () => {},
  dashboardView: 'my',
  setDashboardView: () => {},
  showTooltips: true,
  setShowTooltips: () => {},
  ticketFilters: {},
  setTicketFilters: () => {},
  clearFilters: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [dashboardView, setDashboardView] = useState<DashboardView>('my')
  const [showTooltips, setShowTooltips] = useState(true)
  const [ticketFilters, setTicketFilters] = useState<TicketFilter>({})

  const clearFilters = () => {
    setTicketFilters({})
  }

  return (
    <AppContext.Provider value={{
      userRole,
      setUserRole,
      dashboardView,
      setDashboardView,
      showTooltips,
      setShowTooltips,
      ticketFilters,
      setTicketFilters,
      clearFilters,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

