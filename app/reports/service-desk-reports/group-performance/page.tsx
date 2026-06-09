'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'

export default function GroupPerformanceReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Group Performance Report"
      parentRoute="/reports/service-desk"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Service Desk Reports', href: '/reports/service-desk' },
        { label: 'Group Performance' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <div className="space-y-6">
        <div className="p-8 rounded-lg border text-center" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7', color: '#6B6B6B' }}>
          <p className="text-lg font-medium">Group Performance Report</p>
          <p className="text-sm mt-2">Department and group-level operational metrics</p>
        </div>
        <p className="text-sm text-gray-600">Report content and visualizations will be loaded here.</p>
      </div>
    </ReportWorkspaceLayout>
  )
}
