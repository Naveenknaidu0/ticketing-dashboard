'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href: string
}

export function AssignmentEngineBreadcrumb() {
  const pathname = usePathname()

  // Map paths to breadcrumb labels
  const pathMap: Record<string, string> = {
    '/assignment-engine/overview': 'Overview',
    '/assignment-engine/queues': 'Queues',
    '/assignment-engine/skills': 'Skills',
    '/assignment-engine/skills/users': 'User Skills',
    '/assignment-engine/eligibility': 'Eligibility Rules',
    '/assignment-engine/capacity': 'Capacity',
    '/assignment-engine/capacity/templates': 'Capacity Templates',
    '/assignment-engine/availability': 'Availability',
    '/assignment-engine/matrix': 'Eligibility Matrix',
    '/assignment-engine/priority': 'Priority Weights',
    '/assignment-engine/rules': 'Rules',
    '/assignment-engine/automations': 'Automations',
    '/assignment-engine/strategies': 'Strategies',
    '/assignment-engine/escalations': 'Escalations',
    '/assignment-engine/simulation': 'Simulation',
    '/assignment-engine/audit': 'Audit Trail',
  }

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Assignment Engine', href: '/assignment-engine/overview' },
    ]

    // Check if this is a detail page (e.g., /assignment-engine/queues/queue-1)
    let currentPath = ''
    for (let i = 0; i < segments.length; i++) {
      currentPath += '/' + segments[i]
      
      // Skip if this is 'assignment-engine' (root)
      if (segments[i] === 'assignment-engine') continue

      // Check if we have a mapping for this path
      const mappedLabel = pathMap[currentPath]
      if (mappedLabel && i < segments.length - 1) {
        breadcrumbs.push({ label: mappedLabel, href: currentPath })
      } else if (mappedLabel && i === segments.length - 1) {
        // Last segment - current page (not clickable)
        breadcrumbs.push({ label: mappedLabel, href: '' })
      } else if (!mappedLabel && i === segments.length - 1) {
        // For detail pages like queue-1, use the queue name or ID
        const label = segments[i].replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
        breadcrumbs.push({ label, href: '' })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <nav className="flex items-center gap-2 text-sm" style={{ color: '#6B6B6B' }}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        const isClickable = item.href !== ''

        return (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight className="w-4 h-4" style={{ color: '#D1D5DB' }} />
            )}
            {isClickable ? (
              <Link
                href={item.href}
                className="hover:underline"
                style={{ color: '#3B82F6' }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="truncate max-w-xs"
                title={item.label}
                style={{ color: '#6B6B6B', fontWeight: isLast ? '500' : 'normal' }}
              >
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
