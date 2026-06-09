'use client'

import { useApp } from '@/app/app-context'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Home,
  Ticket,
  CheckSquare,
  TrendingUp,
  Zap,
  BookOpen,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  roles: ('agent' | 'manager' | 'team-lead' | 'executive')[]
  tooltip?: string
  group?: string
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <Home className="w-5 h-5" />,
    href: '/dashboard',
    roles: ['agent', 'manager'],
    tooltip: 'Dashboard',
    group: 'WORKSPACE',
  },
  {
    label: 'Ticket List',
    icon: <Ticket className="w-5 h-5" />,
    href: '/tickets',
    roles: ['agent', 'manager'],
    tooltip: 'Tickets',
    group: 'WORKSPACE',
  },
  {
    label: 'To Do',
    icon: <CheckSquare className="w-5 h-5" />,
    href: '/todo',
    roles: ['agent'],
    tooltip: 'To Do',
    group: 'WORKSPACE',
  },
  {
    label: 'Team To-Do',
    icon: <CheckSquare className="w-5 h-5" />,
    href: '/team-todo',
    roles: ['manager'],
    tooltip: 'Team To-Do',
    group: 'OPERATIONS',
  },
  {
    label: 'Reports',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/reports',
    roles: ['manager'],
    tooltip: 'Reports',
    group: 'ANALYTICS',
  },
  {
    label: 'SLA Analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/sla-analytics',
    roles: ['manager'],
    tooltip: 'SLA Analytics',
    group: 'ANALYTICS',
  },
  {
    label: 'Workload',
    icon: <Users className="w-5 h-5" />,
    href: '/workload',
    roles: ['manager'],
    tooltip: 'Workload',
    group: 'OPERATIONS',
  },
  {
    label: 'Assignment Engine',
    icon: <Zap className="w-5 h-5" />,
    href: '/assignment-engine',
    roles: ['manager'],
    tooltip: 'Assignment Engine',
    group: 'OPERATIONS',
  },
  {
    label: 'Leaderboard',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/leaderboard',
    roles: ['agent', 'manager'],
    tooltip: 'Leaderboard',
    group: 'ANALYTICS',
  },
  {
    label: 'Knowledge Base',
    icon: <BookOpen className="w-5 h-5" />,
    href: '/knowledge-base',
    roles: ['agent', 'manager'],
    tooltip: 'Knowledge Base',
    group: 'KNOWLEDGE',
  },
]

interface SidebarProps {
  showTooltips?: boolean
  isCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ showTooltips = true, isCollapsed = false, onCollapsedChange }: SidebarProps) {
  const { userRole } = useApp()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(isCollapsed)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sidebar-collapsed')
    if (stored !== null) {
      const isCollapsed = stored === 'true'
      setCollapsed(isCollapsed)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem('sidebar-collapsed', collapsed.toString())
    onCollapsedChange?.(collapsed)
  }, [collapsed, mounted, onCollapsedChange])

  if (!userRole) {
    return null
  }

  const filteredItems = navItems.filter(item => item.roles.includes(userRole))
  const groupedItems = filteredItems.reduce((acc, item) => {
    const group = item.group || 'OTHER'
    if (!acc[group]) acc[group] = []
    acc[group].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  const sidebarWidth = collapsed ? 72 : 260

  return (
    <aside 
      className="h-[calc(100vh-65px)] overflow-hidden transition-all duration-300 flex flex-col"
      style={{ 
        width: `${sidebarWidth}px`,
        background: 'linear-gradient(180deg, #0D3133 0%, #0A2425 100%)',
      }}
    >
      {/* Brand Area */}
      {!collapsed && (
        <div className="px-4 py-6 border-b" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(230, 159, 80, 0.2)' }}>
              <span className="text-orange-300 font-bold text-sm">AB</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate">AdamsBridge</p>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>PRODUCTION</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <div className="p-2 border-b" style={{ borderBottomColor: 'rgba(255, 255, 255, 0.1)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full p-2 rounded-lg transition-all duration-200"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
          }}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav 
        className="flex-1 p-3 space-y-4 overflow-y-auto relative"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Hidden scrollbar CSS for Chrome/Safari/Edge */}
        <style>{`
          nav::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}</style>

        {/* Top fade indicator */}
        <div 
          className="absolute top-0 left-0 right-0 h-6 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(13, 49, 51, 0.8) 0%, transparent 100%)',
            opacity: 0,
          }}
          ref={(el) => {
            if (el) {
              const nav = el.parentElement
              if (nav) {
                const updateFade = () => {
                  const isScrolled = nav.scrollTop > 10
                  el.style.opacity = isScrolled ? '1' : '0'
                }
                nav.addEventListener('scroll', updateFade)
                return () => nav.removeEventListener('scroll', updateFade)
              }
            }
          }}
        />

        {/* Bottom fade indicator */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-6 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'linear-gradient(0deg, rgba(13, 49, 51, 0.8) 0%, transparent 100%)',
            opacity: 0,
          }}
          ref={(el) => {
            if (el) {
              const nav = el.parentElement
              if (nav) {
                const updateFade = () => {
                  const isNearBottom = nav.scrollHeight - nav.scrollTop - nav.clientHeight < 10
                  el.style.opacity = isNearBottom ? '0' : '1'
                }
                nav.addEventListener('scroll', updateFade)
                updateFade()
                return () => nav.removeEventListener('scroll', updateFade)
              }
            }
          }}
        />
        {Object.entries(groupedItems).map(([group, items]) => (
          <div key={group}>
            {/* Group Header */}
            {!collapsed && (
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                {group}
              </p>
            )}
            
            {/* Group Items */}
            <div className="space-y-1">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                
                return (
                  <div key={item.href} className="relative group">
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer relative"
                      style={isActive ? {
                        backgroundColor: 'rgba(230, 159, 80, 0.25)',
                        color: '#FFFFFF',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        boxShadow: 'inset 3px 0 0 #E69F50',
                      } : {
                        color: 'rgba(255, 255, 255, 0.75)',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.95)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'
                        }
                      }}
                      title={collapsed ? item.label : ''}
                    >
                      {/* Icon */}
                      <span style={{ 
                        color: isActive ? '#E69F50' : 'rgba(255, 255, 255, 0.65)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {item.icon}
                      </span>

                      {/* Label */}
                      {!collapsed && (
                        <span className="truncate" style={{ color: 'inherit' }}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                    
                    {/* Tooltip for collapsed state */}
                    {collapsed && showTooltips && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-lg z-50" style={{ backgroundColor: '#1a1a1a' }}>
                        {item.tooltip}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent" style={{ borderRightColor: '#1a1a1a' }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
