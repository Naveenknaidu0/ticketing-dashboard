'use client'

import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import Link from 'next/link'
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

const executiveReports = [
  { id: 'service-desk-health', name: 'Service Desk Health', path: '/reports/executive/service-desk-health', icon: BarChart3 },
  { id: 'ticket-volume', name: 'Ticket Volume', path: '/reports/executive/ticket-volume', icon: TrendingUp },
  { id: 'sla-performance', name: 'SLA Performance', path: '/reports/executive/sla-performance', icon: Clock },
  { id: 'csat-performance', name: 'CSAT Performance', path: '/reports/executive/csat-performance', icon: Users },
]

export default function ExecutiveReportsPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="border-b p-6" style={{ borderColor: '#E2E0DC' }}>
          <Breadcrumb items={[
            { label: 'Reports', href: '/reports' },
            { label: 'Executive Reports' },
          ]} />
          <h1 className="text-2xl font-bold mt-4" style={{ color: '#1a1a1a' }}>Executive Reports</h1>
          <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>High-level service desk health and performance reporting</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {executiveReports.map(report => {
              const Icon = report.icon
              return (
                <Link key={report.id} href={report.path}>
                  <div className="bg-white rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md" style={{ borderColor: '#E2E0DC' }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: '#F8F8F7' }}>
                        <Icon className="w-5 h-5" style={{ color: '#0D3133' }} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{report.name}</h3>
                    <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>View detailed {report.name.toLowerCase()} metrics</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
