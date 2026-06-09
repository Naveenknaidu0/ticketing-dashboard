'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import { TicketStatusReport } from '@/components/ticket-status-report'

export default function TicketStatusReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Ticket Status Report"
      parentRoute="/reports/ticket"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Ticket Reports', href: '/reports/ticket' },
        { label: 'Ticket Status' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <TicketStatusReport />
    </ReportWorkspaceLayout>
  )
}
