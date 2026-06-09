'use client'

import { useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface KPICardProps {
  icon: React.ReactNode
  label: string
  value: number
  indicator: string
  tooltip: string
  filterType: 'open' | 'in-progress' | 'due-today' | 'resolved-today'
  isUrgent?: boolean
}

export function KPICard({ icon, label, value, indicator, tooltip, filterType, isUrgent = false }: KPICardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/tickets?filter=${filterType}`)
  }

  const getIndicatorColor = () => {
    if (filterType === 'due-today' && isUrgent) {
      return '#E69F50'
    }
    return '#73847B'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            className="w-full text-left transition-all hover:shadow-md"
            style={{
              height: '115px',
              borderRadius: '12px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E0DC',
              padding: '14px',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="mb-1" style={{ color: '#73847B' }}>
              {icon}
            </div>

            <p className="text-xs mb-1 font-medium" style={{ color: '#6B6B6B', letterSpacing: '0.5px' }}>
              {label}
            </p>

            <p className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
              {value}
            </p>

            <p className="text-xs font-medium" style={{ color: getIndicatorColor() }}>
              {indicator}
            </p>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
