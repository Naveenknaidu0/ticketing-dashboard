'use client'

import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import Link from 'next/link'
import { BarChart3, TrendingUp, Zap } from 'lucide-react'

const agentReports = [
  { id: 'productivity', name: 'Agent Productivity', path: '/reports/agents/productivity', icon: TrendingUp },
  { id: 'performance', name: 'Agent Performance', path: '/reports/agents/performance', icon: BarChart3 },
  { id: 'workload', name: 'Agent Workload', path: '/reports/agents/workload', icon: Zap },
]

export default function AgentReportsPage() {
  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="border-b p-6" style={{ borderColor: '#E2E0DC' }}>
          <Breadcrumb items={[
            { label: 'Reports', href: '/reports' },
            { label: 'Agent Reports' },
          ]} />
          <h1 className="text-2xl font-bold mt-4" style={{ color: '#1a1a1a' }}>Agent Reports</h1>
          <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>Monitor individual agent productivity and performance metrics</p>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {agentReports.map(report => {
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
