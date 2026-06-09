'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import { PriorityAnalysisReport } from '@/components/priority-analysis-report'

export default function PriorityAnalysisReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Priority Analysis Report"
      parentRoute="/reports/ticket"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Ticket Reports', href: '/reports/ticket' },
        { label: 'Priority Analysis' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <PriorityAnalysisReport />
    </ReportWorkspaceLayout>
  )
}
