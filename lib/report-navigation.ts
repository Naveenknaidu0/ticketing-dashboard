'use client'

import { useRouter } from 'next/navigation'

export interface ReportRoute {
  category: string
  reportId: string
  path: string
}

const REPORT_ROUTES: Record<string, string> = {
  // Executive Reports
  'executive-service-health': '/reports/service-desk-health',
  'executive-ticket-volume': '/reports/executive/ticket-volume',
  'executive-sla-performance': '/reports/executive/sla-performance',
  'executive-csat-performance': '/reports/executive/csat-performance',
  
  // Ticket Reports
  'ticket-ticket-status': '/reports/ticket-reports/ticket-status',
  'ticket-priority-analysis': '/reports/ticket-reports/priority-analysis',
  'ticket-type-analysis': '/reports/ticket-reports/ticket-type-analysis',
  'ticket-ticket-aging': '/reports/ticket-reports/ticket-aging',
  
  // Agent Reports
  'agent-agent-productivity': '/reports/agent-reports/agent-productivity',
  'agent-agent-performance': '/reports/agent-reports/agent-performance',
  'agent-agent-workload': '/reports/agent-reports/agent-workload',
  
  // Service Desk Reports
  'service-desk-group-performance': '/reports/service-desk-reports/group-performance',
}

export function useReportNavigation() {
  const router = useRouter()
  
  const navigateToReport = (category: string, reportId: string) => {
    const key = `${category}-${reportId}`
    const path = REPORT_ROUTES[key]
    
    if (path) {
      // Add to recent reports (localStorage for POC)
      addToRecentReports({ category, reportId, path })
      router.push(path)
    } else {
      console.error('[v0] No route found for report:', key)
    }
  }
  
  return { navigateToReport }
}

export function addToRecentReports(report: ReportRoute) {
  if (typeof window === 'undefined') return
  
  try {
    const recentReports = JSON.parse(localStorage.getItem('recentReports') || '[]')
    const filtered = recentReports.filter(
      (r: ReportRoute) => !(r.category === report.category && r.reportId === report.reportId)
    )
    const updated = [{ ...report, timestamp: new Date().toISOString() }, ...filtered].slice(0, 10)
    localStorage.setItem('recentReports', JSON.stringify(updated))
  } catch (e) {
    console.error('[v0] Error saving to recent reports:', e)
  }
}

export function toggleFavoriteReport(category: string, reportId: string) {
  if (typeof window === 'undefined') return
  
  try {
    const favorites = JSON.parse(localStorage.getItem('favoriteReports') || '[]')
    const key = `${category}-${reportId}`
    const index = favorites.indexOf(key)
    
    if (index > -1) {
      favorites.splice(index, 1)
    } else {
      favorites.push(key)
    }
    
    localStorage.setItem('favoriteReports', JSON.stringify(favorites))
    return index === -1 // Return true if now favorited
  } catch (e) {
    console.error('[v0] Error toggling favorite:', e)
    return false
  }
}

export function isFavoriteReport(category: string, reportId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const favorites = JSON.parse(localStorage.getItem('favoriteReports') || '[]')
    const key = `${category}-${reportId}`
    return favorites.includes(key)
  } catch (e) {
    return false
  }
}
