'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'
import { SLAPerformanceReport } from '@/components/sla-performance-report'

export default function SLAPerformanceReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="SLA Performance Report"
      parentRoute="/reports/executive"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Executive Reports', href: '/reports/executive' },
        { label: 'SLA Performance' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm mb-4" style={{ color: '#6B6B6B' }}>
            Monitor SLA compliance, breach trends, risk exposure, and service performance across teams and ticket priorities.
          </p>
        </div>
        <SLAPerformanceReport />
      </div>
    </ReportWorkspaceLayout>
  )
}
