'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

const BREADCRUMB_LABELS: Record<string, string> = {
  'assignment-engine': 'Assignment Engine',
  'overview': 'Overview',
  'queues': 'Queues',
  'skills': 'Skills',
  'rules': 'Rules',
  'automations': 'Automations',
  'masters': 'Masters',
  'configuration': 'Configuration',
  'versions': 'Versions',
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Parse pathname to generate breadcrumb items
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === '/') {
      return [{ label: 'Home', href: '/' }]
    }

    const segments = pathname.split('/').filter(Boolean)
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ]

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Skip numeric IDs and parameters
      if (segment.match(/^\[/)) {
        return
      }

      const label = BREADCRUMB_LABELS[segment] || segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      const isLast = index === segments.length - 1
      items.push({
        label,
        href: isLast ? undefined : currentPath,
        isActive: isLast,
      })
    })

    return items
  }

  const items = generateBreadcrumbs()

  return (
    <nav className="flex items-center gap-2 px-8 py-4" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4" style={{ color: '#D1D5DB' }} />
          )}
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="text-sm hover:underline transition-colors"
              style={{ color: '#0D7EC5' }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="text-sm font-medium"
              style={{ color: item.isActive ? '#0D3133' : '#6B6B6B' }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
