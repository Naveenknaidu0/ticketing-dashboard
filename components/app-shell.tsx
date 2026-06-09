'use client'

import { useApp } from '@/app/app-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TopNav } from '@/components/top-nav'
import { Sidebar } from '@/components/sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { userRole, showTooltips, setShowTooltips } = useApp()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (userRole === null) {
      router.push('/login')
    }
  }, [userRole, router])

  if (userRole === null) {
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-ab-background">
      <TopNav
        showTooltips={showTooltips}
        onTooltipsChange={setShowTooltips}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          showTooltips={showTooltips}
          isCollapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
        
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
