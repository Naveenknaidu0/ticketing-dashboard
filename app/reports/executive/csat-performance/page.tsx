'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import { CSATPerformanceReport } from '@/components/csat-performance-report'

export default function CSATPerformanceReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="CSAT Performance Report"
      parentRoute="/reports/executive"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Executive Reports', href: '/reports/executive' },
        { label: 'CSAT Performance' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
            Analyze customer satisfaction trends, feedback quality, response rates, agent ratings, and service improvement opportunities.
          </p>
        </div>
        <CSATPerformanceReport />
      </div>
    </ReportWorkspaceLayout>
  )
}
