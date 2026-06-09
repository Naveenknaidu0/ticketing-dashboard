'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useStore } from '@/app/store-context'
import { ArrowLeft, Download, RotateCcw, Clock, Save, BarChart3, TrendingUp, Table2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SLAAnalyticsCenter } from '@/components/sla-analytics-center'
import { ReportExportModal } from '@/components/report-export-modal'
import { ReportScheduleModal } from '@/components/report-schedule-modal'
import { ReportSaveViewModal } from '@/components/report-save-view-modal'

export default function SLAAnalyticsPage() {
  const { state } = useStore()
  const [viewMode, setViewMode] = useState<'summary' | 'operational' | 'table'>('summary')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showSaveViewModal, setShowSaveViewModal] = useState(false)
  const [slaMetrics, setSLAMetrics] = useState({
    totalTickets: 0,
    slaBreaches: 0,
    slaAtRisk: 0,
    slaMet: 0,
    complianceRate: 0,
  })
  
  // Filter state
  const [dateRange, setDateRange] = useState('7d')
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSLAState, setSelectedSLAState] = useState('all')

  // Calculate SLA metrics from store
  useEffect(() => {
    if (!state?.tickets || !state?.slaRecords) return

    const tickets = Array.from(state.tickets.values())
    const slaRecords = Array.from(state.slaRecords.values())
    
    // Count SLA statuses
    let breaches = 0
    let atRisk = 0
    let met = 0

    slaRecords.forEach(record => {
      if (record.responseBreached || record.resolutionBreached) {
        breaches++
      } else if (record.complianceScore < 80) {
        atRisk++
      } else {
        met++
      }
    })

    setSLAMetrics({
      totalTickets: tickets.length,
      slaBreaches: breaches,
      slaAtRisk: atRisk,
      slaMet: met,
      complianceRate: slaRecords.length > 0 ? Math.round((met / slaRecords.length) * 100) : 0,
    })
  }, [state?.tickets, state?.slaRecords])

  const handleRefresh = () => {
    console.log('[v0] Refreshing SLA Analytics - preserving filters')
  }

  const handleExport = () => {
    setShowExportModal(true)
  }

  const handleSchedule = () => {
    setShowScheduleModal(true)
  }

  const handleSaveView = () => {
    setShowSaveViewModal(true)
  }

  return (
    <>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b" style={{ borderColor: '#E2E0DC' }}>
          <div className="px-8 py-6">
            {/* Breadcrumb */}
            <div className="mb-4">
              <div className="flex items-center gap-2 text-sm" style={{ color: '#6B6B6B' }}>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <span>/</span>
                <span>SLA Analytics</span>
              </div>
            </div>

            {/* Title and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: '#6B6B6B' }} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    SLA Analytics
                  </h1>
                  <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                    Monitor compliance, identify risks, and prevent SLA breaches before they occur.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Refresh data"
                >
                  <RotateCcw className="w-5 h-5" style={{ color: '#6B6B6B' }} />
                </button>

                <button
                  onClick={handleExport}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: '#F8F8F7',
                    color: '#6B6B6B',
                    border: '1px solid #E2E0DC',
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>

                <button
                  onClick={handleSchedule}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: '#F8F8F7',
                    color: '#6B6B6B',
                    border: '1px solid #E2E0DC',
                  }}
                >
                  <Clock className="w-4 h-4" />
                  Schedule
                </button>

                <button
                  onClick={handleSaveView}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    backgroundColor: '#F8F8F7',
                    color: '#6B6B6B',
                    border: '1px solid #E2E0DC',
                  }}
                >
                  <Save className="w-4 h-4" />
                  Save View
                </button>
              </div>
            </div>

            {/* View Switcher */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                View:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('summary')}
                  className="px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'summary' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'summary' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'summary' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Summary view with key metrics"
                >
                  <TrendingUp className="w-4 h-4" />
                  Summary
                </button>
                <button
                  onClick={() => setViewMode('operational')}
                  className="px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'operational' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'operational' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'operational' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Operational view focused on risk queue"
                >
                  <BarChart3 className="w-4 h-4" />
                  Operational
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'table' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'table' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'table' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Table view with full SLA data"
                >
                  <Table2 className="w-4 h-4" />
                  Table View
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-3 flex-wrap items-center" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px', paddingTop: '16px' }}>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '80px' }}>Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 1 Day</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '50px' }}>Group</label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '50px' }}>Agent</label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Agents</SelectItem>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '65px' }}>Priority</label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '50px' }}>Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '85px' }}>SLA State</label>
                <Select value={selectedSLAState} onValueChange={setSelectedSLAState}>
                  <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All SLA States</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="breached">Breached</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-8 py-6">
            <SLAAnalyticsCenter 
              viewMode={viewMode}
              filters={{
                dateRange,
                group: selectedGroup,
                agent: selectedAgent,
                priority: selectedPriority,
                status: selectedStatus,
                slaState: selectedSLAState
              }}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ReportExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        reportTitle="SLA Analytics"
      />
      <ReportScheduleModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        reportTitle="SLA Analytics"
      />
      <ReportSaveViewModal
        isOpen={showSaveViewModal}
        onClose={() => setShowSaveViewModal(false)}
        reportTitle="SLA Analytics"
      />
    </>
  )
}

