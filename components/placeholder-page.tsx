'use client'

import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  description: string
  breadcrumbs: Array<{ label: string; href?: string }>
  showActionButton?: boolean
  actionLabel?: string
}

export function PlaceholderPageContent({
  title,
  description,
  breadcrumbs,
  showActionButton = false,
  actionLabel = 'New Item',
}: PlaceholderPageProps) {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="bg-white sticky top-0 z-20" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
          <div className="px-8 py-6">
            <Breadcrumb items={breadcrumbs} />
            
            <div className="flex items-center justify-between mt-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>{title}</h1>
                <p className="mt-2" style={{ color: '#6B6B6B' }}>{description}</p>
              </div>
              {showActionButton && (
                <button className="px-4 py-2 text-white rounded-lg font-medium transition-all flex items-center gap-2" style={{ backgroundColor: '#0D3133' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
                  <Plus className="w-4 h-4" />
                  {actionLabel}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="bg-white p-12 text-center rounded-lg shadow-sm" style={{ borderColor: '#E2E0DC', borderWidth: '1px' }}>
            <p className="text-lg" style={{ color: '#6B6B6B' }}>
              Page content for {title} will be built here
            </p>
            <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
              This is a placeholder showing the page structure and routing
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
