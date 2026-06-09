'use client'

import React from 'react'
import { getProgressBarColor } from '@/lib/widget-styling-utils'
import { ADAMSBRIDGE_TOKENS } from '@/lib/adamsbridge-design-tokens'

interface StandardizedProgressBarProps {
  percentage: number
  showLabel?: boolean
  height?: 'sm' | 'md' | 'lg'
  animated?: boolean
  className?: string
}

export function StandardizedProgressBar({
  percentage,
  showLabel = true,
  height = 'md',
  animated = false,
  className = '',
}: StandardizedProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  const barColor = getProgressBarColor(clampedPercentage)

  const heightMap = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  }

  return (
    <div className={className}>
      <div
        style={{
          width: '100%',
          height: heightMap[height],
          backgroundColor: ADAMSBRIDGE_TOKENS.COLORS.NEUTRAL_200,
          borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.FULL,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: barColor,
            borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.FULL,
            transition: animated ? 'width 0.5s ease' : 'none',
          }}
        />
      </div>
      {showLabel && (
        <div
          style={{
            marginTop: ADAMSBRIDGE_TOKENS.SPACING.XS,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.XS,
              color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY,
            }}
          >
            {clampedPercentage < 80 ? 'Critical' : clampedPercentage < 90 ? 'Warning' : 'Healthy'}
          </span>
          <span
            style={{
              fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.XS,
              fontWeight: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
              color: barColor,
            }}
          >
            {clampedPercentage}%
          </span>
        </div>
      )}
    </div>
  )
}
