import { useState, useCallback, useMemo } from 'react'
import { dashboardLayoutEngine } from '@/lib/dashboard-layout-engine'

export interface DashboardWidgetVisibility {
  [widgetId: string]: boolean
}

/**
 * Hook for managing dashboard widget visibility and auto-layout
 * Integrates with Dashboard Governance for persistence
 */
export function useDashboardWidgetVisibility(
  initialWidgets: Array<{ id: string; defaultVisible?: boolean }>,
  persistenceKey?: string,
) {
  const [visibility, setVisibility] = useState<DashboardWidgetVisibility>(() => {
    // Load from localStorage if persistence key provided
    if (persistenceKey) {
      try {
        const stored = localStorage.getItem(persistenceKey)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {
        console.warn('[v0] Failed to load widget visibility from localStorage', e)
      }
    }

    // Initialize from default values
    const initial: DashboardWidgetVisibility = {}
    initialWidgets.forEach(widget => {
      initial[widget.id] = widget.defaultVisible !== false
    })
    return initial
  })

  // Toggle widget visibility
  const toggleWidget = useCallback(
    (widgetId: string) => {
      setVisibility(prev => {
        const updated = {
          ...prev,
          [widgetId]: !prev[widgetId],
        }

        // Persist if key provided
        if (persistenceKey) {
          try {
            localStorage.setItem(persistenceKey, JSON.stringify(updated))
          } catch (e) {
            console.warn('[v0] Failed to persist widget visibility', e)
          }
        }

        return updated
      })
    },
    [persistenceKey],
  )

  // Show specific widget
  const showWidget = useCallback(
    (widgetId: string) => {
      setVisibility(prev => {
        const updated = {
          ...prev,
          [widgetId]: true,
        }

        if (persistenceKey) {
          try {
            localStorage.setItem(persistenceKey, JSON.stringify(updated))
          } catch (e) {
            console.warn('[v0] Failed to persist widget visibility', e)
          }
        }

        return updated
      })
    },
    [persistenceKey],
  )

  // Hide specific widget
  const hideWidget = useCallback(
    (widgetId: string) => {
      setVisibility(prev => {
        const updated = {
          ...prev,
          [widgetId]: false,
        }

        if (persistenceKey) {
          try {
            localStorage.setItem(persistenceKey, JSON.stringify(updated))
          } catch (e) {
            console.warn('[v0] Failed to persist widget visibility', e)
          }
        }

        return updated
      })
    },
    [persistenceKey],
  )

  // Show all widgets
  const showAllWidgets = useCallback(() => {
    const updated: DashboardWidgetVisibility = {}
    initialWidgets.forEach(widget => {
      updated[widget.id] = true
    })

    setVisibility(updated)

    if (persistenceKey) {
      try {
        localStorage.setItem(persistenceKey, JSON.stringify(updated))
      } catch (e) {
        console.warn('[v0] Failed to persist widget visibility', e)
      }
    }
  }, [initialWidgets, persistenceKey])

  // Hide all widgets
  const hideAllWidgets = useCallback(() => {
    const updated: DashboardWidgetVisibility = {}
    initialWidgets.forEach(widget => {
      updated[widget.id] = false
    })

    setVisibility(updated)

    if (persistenceKey) {
      try {
        localStorage.setItem(persistenceKey, JSON.stringify(updated))
      } catch (e) {
        console.warn('[v0] Failed to persist widget visibility', e)
      }
    }
  }, [initialWidgets, persistenceKey])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const updated: DashboardWidgetVisibility = {}
    initialWidgets.forEach(widget => {
      updated[widget.id] = widget.defaultVisible !== false
    })

    setVisibility(updated)

    if (persistenceKey) {
      try {
        localStorage.setItem(persistenceKey, JSON.stringify(updated))
      } catch (e) {
        console.warn('[v0] Failed to persist widget visibility', e)
      }
    }
  }, [initialWidgets, persistenceKey])

  // Get visible widget count
  const visibleCount = useMemo(() => {
    return Object.values(visibility).filter(Boolean).length
  }, [visibility])

  // Get grid classes for current visible count
  const gridClasses = useMemo(() => {
    return dashboardLayoutEngine.calculateGridClasses(visibleCount)
  }, [visibleCount])

  // Get list of visible widget IDs
  const visibleWidgetIds = useMemo(() => {
    return Object.entries(visibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([widgetId, _]) => widgetId)
  }, [visibility])

  // Check if specific widget is visible
  const isWidgetVisible = useCallback(
    (widgetId: string) => {
      return visibility[widgetId] !== false
    },
    [visibility],
  )

  return {
    visibility,
    toggleWidget,
    showWidget,
    hideWidget,
    showAllWidgets,
    hideAllWidgets,
    resetToDefaults,
    visibleCount,
    visibleWidgetIds,
    gridClasses,
    isWidgetVisible,
  }
}
