'use client'

import React from 'react'
import { RotateCcw, Download, Maximize2, Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ADAMSBRIDGE_TOKENS } from '@/lib/adamsbridge-design-tokens'

interface StandardizedWidgetHeaderProps {
  title: string
  subtitle?: string
  onRefresh?: () => void
  onExport?: () => void
  onExpand?: () => void
  tooltip?: string
  actionButtons?: React.ReactNode
  className?: string
}

export function StandardizedWidgetHeader({
  title,
  subtitle,
  onRefresh,
  onExport,
  onExpand,
  tooltip,
  actionButtons,
  className = '',
}: StandardizedWidgetHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div>
        <div className="flex items-center gap-2">
          <h3
            style={{
              fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.BASE,
              fontWeight: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
              color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_PRIMARY,
            }}
          >
            {title}
          </h3>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-0.5 rounded hover:opacity-70 transition-opacity">
                    <Info
                      className="w-4 h-4"
                      style={{ color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY }}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {subtitle && (
          <p
            style={{
              fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.XS,
              color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_TERTIARY,
              marginTop: '4px',
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actionButtons}

        {onRefresh && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onRefresh}
                  style={{
                    padding: ADAMSBRIDGE_TOKENS.SPACING.SM,
                    borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.MD,
                    color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Refresh data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onExport && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onExport}
                  style={{
                    padding: ADAMSBRIDGE_TOKENS.SPACING.SM,
                    borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.MD,
                    color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                  }}
                >
                  <Download className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Export data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onExpand && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onExpand}
                  style={{
                    padding: ADAMSBRIDGE_TOKENS.SPACING.SM,
                    borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.MD,
                    color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY,
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.7'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1'
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Expand widget</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
