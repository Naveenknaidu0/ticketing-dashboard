'use client'

import React from 'react'
import { Breadcrumb } from '@/components/breadcrumb'

interface PageHeaderProps {
  breadcrumbs?: Array<{ label: string; href?: string }>
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function PageHeader({
  breadcrumbs = [],
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b" style={{ borderBottomColor: '#E2E0DC' }}>
      <div className="px-8 py-4">
        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <div className="mb-3">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}

        {/* Title and Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h1 
                className="text-xl font-bold leading-tight" 
                style={{ color: '#1a1a1a' }}
              >
                {title}
              </h1>
            )}
            {description && (
              <p 
                className="text-sm mt-1 line-clamp-1" 
                style={{ color: '#6B6B6B' }}
              >
                {description}
              </p>
            )}
          </div>
          
          {/* Actions - Right aligned */}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
