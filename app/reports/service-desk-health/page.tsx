'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import ServiceDeskHealthReport from '@/components/service-desk-health-report'

export default function ServiceDeskHealthPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Service Desk Health Report"
      parentRoute="/reports/executive"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Executive Reports', href: '/reports/executive' },
        { label: 'Service Desk Health' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <ServiceDeskHealthReport />
    </ReportWorkspaceLayout>
  )
}
