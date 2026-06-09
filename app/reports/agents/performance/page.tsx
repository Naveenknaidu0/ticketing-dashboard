'use client'

import { ReportWorkspaceLayout } from '@/components/report-workspace-layout'

export default function AgentPerformanceReportPage() {
  return (
    <ReportWorkspaceLayout
      reportTitle="Agent Performance Report"
      parentRoute="/reports/agents"
      breadcrumbItems={[
        { label: 'Reports', href: '/reports' },
        { label: 'Agent Reports', href: '/reports/agents' },
        { label: 'Agent Performance' },
      ]}
      onRefresh={() => console.log('[v0] Refreshing report')}
      onExport={() => console.log('[v0] Exporting report')}
      onSchedule={() => console.log('[v0] Scheduling report')}
      onSaveView={() => console.log('[v0] Saving view')}
    >
      <div className="space-y-6">
        <div className="p-8 rounded-lg border text-center" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7', color: '#6B6B6B' }}>
          <p className="text-lg font-medium">Agent Performance Report</p>
          <p className="text-sm mt-2">Individual agent performance metrics and comparisons</p>
        </div>
        <p className="text-sm text-gray-600">Report content and visualizations will be loaded here.</p>
      </div>
    </ReportWorkspaceLayout>
  )
}
