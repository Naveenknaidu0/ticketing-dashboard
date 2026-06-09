'use client'

import React from 'react'
import { getStatusBadgeStyle } from '@/lib/widget-styling-utils'
import { ADAMSBRIDGE_TOKENS } from '@/lib/adamsbridge-design-tokens'

interface StandardizedStatusBadgeProps {
  status: 'open' | 'in-progress' | 'resolved' | 'at-risk' | 'breached' | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function StandardizedStatusBadge({
  status,
  size = 'sm',
  className = '',
}: StandardizedStatusBadgeProps) {
  const { backgroundColor, color } = getStatusBadgeStyle(status)

  const sizeMap = {
    sm: {
      padding: `${ADAMSBRIDGE_TOKENS.SPACING.XS} ${ADAMSBRIDGE_TOKENS.SPACING.SM}`,
      fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.XS,
    },
    md: {
      padding: `${ADAMSBRIDGE_TOKENS.SPACING.SM} ${ADAMSBRIDGE_TOKENS.SPACING.MD}`,
      fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.SM,
    },
    lg: {
      padding: `${ADAMSBRIDGE_TOKENS.SPACING.MD} ${ADAMSBRIDGE_TOKENS.SPACING.LG}`,
      fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.BASE,
    },
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-medium ${className}`}
      style={{
        ...sizeMap[size],
        borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.FULL,
        backgroundColor,
        color,
        fontWeight: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
        whiteSpace: 'nowrap',
      }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
    </span>
  )
}
