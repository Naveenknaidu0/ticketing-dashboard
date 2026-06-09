'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard,
  List,
  Briefcase,
  FileText,
  Zap,
  Grid3x3,
  History,
} from 'lucide-react'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  count?: number
}

const navItems: NavItem[] = [
  {
    label: 'Overview',
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: '/assignment-engine/overview',
  },
  {
    label: 'Queues',
    icon: <List className="w-4 h-4" />,
    href: '/assignment-engine/queues',
    count: 2,
  },
  {
    label: 'Skills',
    icon: <Briefcase className="w-4 h-4" />,
    href: '/assignment-engine/skills',
    count: 19,
  },
  {
    label: 'Rules',
    icon: <FileText className="w-4 h-4" />,
    href: '/assignment-engine/rules',
    count: 8,
  },
  {
    label: 'Automations',
    icon: <Zap className="w-4 h-4" />,
    href: '/assignment-engine/automations',
    count: 5,
  },
  {
    label: 'Configuration',
    icon: <Grid3x3 className="w-4 h-4" />,
    href: '/assignment-engine/configuration',
  },
  {
    label: 'Audit Logs',
    icon: <History className="w-4 h-4" />,
    href: '/assignment-engine/audit',
  },
]

export function AssignmentEngineNav() {
  const pathname = usePathname()

  return (
    <aside className="w-56 border-r" style={{ borderColor: '#E2E0DC' }}>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm"
              style={{
                backgroundColor: isActive ? 'rgba(230, 159, 80, 0.1)' : 'transparent',
                color: isActive ? '#E69F50' : '#6B6B6B',
              }}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className="px-2 py-1 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: isActive ? '#E69F50' : '#F3F4F3',
                    color: isActive ? '#FFFFFF' : '#6B6B6B',
                  }}
                >
                  {item.count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
