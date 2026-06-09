import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1" style={{ fontSize: '14px' }}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#9CA3AF' }} />
          )}
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ color: '#6B6B6B' }}
            >
              {item.label}
            </Link>
          ) : (
            <span className="flex-shrink-0" style={{ color: '#6B6B6B' }}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
