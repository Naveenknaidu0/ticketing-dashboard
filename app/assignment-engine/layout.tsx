'use client'

import { useApp } from '@/app/app-context'
import { AssignmentEngineNav } from '@/components/assignment-engine-nav'
import { AssignmentEngineBreadcrumb } from '@/components/assignment-engine-breadcrumb'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ReactNode } from 'react'

export default function AssignmentEngineLayout({ children }: { children: ReactNode }) {
  const { userRole } = useApp()

  // Role-based access control
  if (!userRole || !['manager', 'admin', 'super-admin'].includes(userRole)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0D3133' }}>Access Denied</h1>
          <p style={{ color: '#6B6B6B' }}>You don&apos;t have permission to access the Assignment Engine.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b" style={{ borderColor: '#E2E0DC' }}>
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#0D3133' }}>Assignment Engine</h1>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>Manage routing, automation, queues, skills, capacity, and assignment policies.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="flex items-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Create Rule
              </Button>
              <Button
                className="flex items-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Create Queue
              </Button>
              <Button
                className="flex items-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Create Automation
              </Button>
              <Button
                className="flex items-center gap-2 text-sm font-medium border"
                style={{ borderColor: '#E69F50', color: '#E69F50', backgroundColor: 'transparent' }}
              >
                <Plus className="w-4 h-4" />
                Run Simulation
              </Button>
            </div>
          </div>

          {/* Breadcrumbs */}
          <AssignmentEngineBreadcrumb />
        </div>
      </div>

      {/* Content with Left Navigation */}
      <div className="flex flex-1 overflow-hidden">
        <AssignmentEngineNav />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAFAF9' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
