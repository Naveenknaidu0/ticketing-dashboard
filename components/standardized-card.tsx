'use client'

import React from 'react'
import { ADAMSBRIDGE_TOKENS } from '@/lib/adamsbridge-design-tokens'

interface StandardizedCardProps {
  variant?: 'default' | 'subtle' | 'elevated'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
}

export function StandardizedCard({
  variant = 'default',
  children,
  className = '',
  onClick,
  style,
}: StandardizedCardProps) {
  const cardStyle = ADAMSBRIDGE_TOKENS.CARD_STYLES[variant]

  return (
    <div
      className={`transition-all ${onClick ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
      onClick={onClick}
      style={{
        ...cardStyle,
        ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
