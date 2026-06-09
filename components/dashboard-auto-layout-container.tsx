'use client'

import React, { useMemo } from 'react'
import { dashboardLayoutEngine } from '@/lib/dashboard-layout-engine'

interface WidgetDef {
  id: string
  isVisible: boolean
  component: React.ReactNode
  colSpanOverride?: string
}

interface DashboardAutoLayoutContainerProps {
  widgets: WidgetDef[]
  rowId?: string
  className?: string
  gapSize?: 'sm' | 'md' | 'lg'
  containerClassName?: string
}

/**
 * Auto-Layout Container for Dashboard Widgets
 * Automatically recalculates grid when widgets visibility changes
 * No gaps, no empty rows, seamless reflowing
 */
export function DashboardAutoLayoutContainer({
  widgets,
  rowId,
  className = '',
  gapSize = 'md',
  containerClassName = 'flex-1 p-8 overflow-auto',
}: DashboardAutoLayoutContainerProps) {
  const visibleWidgets = useMemo(() => {
    return widgets.filter(w => w.isVisible)
  }, [widgets])

  const visibleCount = visibleWidgets.length

  const gapMap = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  }

  const gridClasses = useMemo(() => {
    return dashboardLayoutEngine.calculateGridClasses(visibleCount)
  }, [visibleCount])

  if (visibleCount === 0) {
    return (
      <div className={containerClassName}>
        <div className="flex items-center justify-center h-64 text-center">
          <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
            No widgets available. Configure widgets in Dashboard Governance.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} mb-6`}>
      <div className={`grid ${gridClasses} ${gapMap[gapSize]} transition-all duration-300`}>
        {visibleWidgets.map((widget, index) => (
          <div
            key={widget.id}
            data-widget-id={widget.id}
            className={`transition-all duration-300 ${widget.colSpanOverride || ''}`}
            style={dashboardLayoutEngine.getWidgetLayoutStyle(widget.id, index, visibleCount)}
          >
            {widget.component}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Smart Row Container - handles visibility-aware layout for dashboard rows
 * Use this to wrap any group of widgets that should reflow together
 */
export function DashboardAutoRow({
  widgets,
  rowClassName = 'mb-6',
  gridClassName = 'gap-4',
}: {
  widgets: WidgetDef[]
  rowClassName?: string
  gridClassName?: string
}) {
  const visibleWidgets = widgets.filter(w => w.isVisible)
  const visibleCount = visibleWidgets.length

  if (visibleCount === 0) {
    return null
  }

  const gridClasses = dashboardLayoutEngine.calculateGridClasses(visibleCount)

  return (
    <div className={rowClassName}>
      <div className={`grid ${gridClasses} ${gridClassName} transition-all duration-300`}>
        {visibleWidgets.map((widget, index) => (
          <div
            key={widget.id}
            data-widget-id={widget.id}
            className="transition-all duration-300"
            style={dashboardLayoutEngine.getWidgetLayoutStyle(widget.id, index, visibleCount)}
          >
            {widget.component}
          </div>
        ))}
      </div>
    </div>
  )
}
