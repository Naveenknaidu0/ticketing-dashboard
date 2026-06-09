'use client'

import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface WidgetVisibilityToggleProps {
  widgetId: string
  widgetName: string
  isVisible: boolean
  onToggle: (widgetId: string, newVisibility: boolean) => void
  disabled?: boolean
  className?: string
}

/**
 * Toggle button for widget visibility in Dashboard Governance
 * Triggers auto-layout recalculation when toggled
 */
export function WidgetVisibilityToggle({
  widgetId,
  widgetName,
  isVisible,
  onToggle,
  disabled = false,
  className = '',
}: WidgetVisibilityToggleProps) {
  const handleToggle = () => {
    onToggle(widgetId, !isVisible)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleToggle}
            disabled={disabled}
            className={`p-2 rounded-lg transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'} ${className}`}
            aria-label={isVisible ? `Hide ${widgetName}` : `Show ${widgetName}`}
            style={{
              color: isVisible ? '#0B3D3B' : '#9CA3AF',
            }}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {isVisible ? `Hide ${widgetName}` : `Show ${widgetName}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface WidgetVisibilityListProps {
  widgets: Array<{
    id: string
    name: string
    description?: string
    isVisible: boolean
  }>
  onToggle: (widgetId: string, newVisibility: boolean) => void
  onShowAll?: () => void
  onHideAll?: () => void
  onReset?: () => void
  title?: string
  className?: string
}

/**
 * List of widget visibility toggles for Dashboard Governance panel
 * Allows managers to control widget visibility with auto-layout integration
 */
export function WidgetVisibilityList({
  widgets,
  onToggle,
  onShowAll,
  onHideAll,
  onReset,
  title = 'Widget Visibility',
  className = '',
}: WidgetVisibilityListProps) {
  const visibleCount = widgets.filter(w => w.isVisible).length
  const totalCount = widgets.length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with stats */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid #E2E0DC' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a1a', marginBottom: '2px' }}>
            {title}
          </h3>
          <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
            {visibleCount} of {totalCount} widgets visible
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {onShowAll && (
            <button
              onClick={onShowAll}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #E2E0DC',
                backgroundColor: '#FFFFFF',
                color: '#0B3D3B',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F3F1EE'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'
              }}
            >
              Show All
            </button>
          )}

          {onHideAll && (
            <button
              onClick={onHideAll}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #E2E0DC',
                backgroundColor: '#FFFFFF',
                color: '#0B3D3B',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F3F1EE'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'
              }}
            >
              Hide All
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '6px',
                border: '1px solid #E2E0DC',
                backgroundColor: '#FFFFFF',
                color: '#0B3D3B',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#F3F1EE'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#FFFFFF'
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Widget list */}
      <div className="space-y-2">
        {widgets.map(widget => (
          <div
            key={widget.id}
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: '#FAFAF9', border: '1px solid #E2E0DC' }}
          >
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#1a1a1a', marginBottom: '2px' }}>
                {widget.name}
              </p>
              {widget.description && (
                <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {widget.description}
                </p>
              )}
            </div>

            <WidgetVisibilityToggle
              widgetId={widget.id}
              widgetName={widget.name}
              isVisible={widget.isVisible}
              onToggle={onToggle}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {widgets.length === 0 && (
        <div className="text-center py-8">
          <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
            No widgets available
          </p>
        </div>
      )}
    </div>
  )
}
