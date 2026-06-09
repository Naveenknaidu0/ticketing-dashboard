'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import { TicketVolumeReport } from '@/components/ticket-volume-report'

export default function TicketVolumeReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Ticket Volume Report"
      parentRoute="/reports/executive"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Executive Reports', href: '/reports/executive' },
        { label: 'Ticket Volume' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
            Analyze ticket creation, resolution trends, backlog growth, and workload inflow across the service desk.
          </p>
        </div>
        <TicketVolumeReport />
      </div>
    </ReportWorkspaceLayout>
  )
}
