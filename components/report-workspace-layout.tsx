'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/breadcrumb'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Download, RotateCcw, Clock, Save, BarChart3, TrendingUp, Table2 } from 'lucide-react'
import React, { useState } from 'react'
import { ReportExportModal } from '@/components/report-export-modal'
import { ReportScheduleModal } from '@/components/report-schedule-modal'
import { ReportSaveViewModal } from '@/components/report-save-view-modal'

interface ReportWorkspaceLayoutProps {
  reportTitle: string
  breadcrumbItems: Array<{ label: string; href?: string }>
  parentRoute?: string
  children: React.ReactNode
  onRefresh?: () => void
  onExport?: () => void
  onSchedule?: () => void
  onSaveView?: () => void
}

export function ReportWorkspaceLayout({
  reportTitle,
  breadcrumbItems,
  parentRoute = '/reports',
  children,
  onRefresh,
  onExport,
  onSchedule,
  onSaveView,
}: ReportWorkspaceLayoutProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'summary' | 'chart' | 'table'>('summary')
  const [showExportModal, setShowExportModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showSaveViewModal, setShowSaveViewModal] = useState(false)

  const handleRefresh = () => {
    console.log('[v0] Refreshing report - preserving filters')
    onRefresh?.()
  }

  const handleExport = () => {
    console.log('[v0] Opening export modal')
    setShowExportModal(true)
  }

  const handleSchedule = () => {
    console.log('[v0] Opening schedule modal')
    setShowScheduleModal(true)
  }

  const handleSaveView = () => {
    console.log('[v0] Opening save view modal')
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
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Title and Actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Link 
                  href={parentRoute}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: '#6B6B6B' }} />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    {reportTitle}
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Refresh report"
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                View:
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('summary')}
                  className="p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'summary' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'summary' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'summary' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Summary view with key metrics and charts"
                >
                  <TrendingUp className="w-4 h-4" />
                  Summary
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className="p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'chart' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'chart' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'chart' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Charts only view"
                >
                  <BarChart3 className="w-4 h-4" />
                  Chart View
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className="p-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  style={{
                    backgroundColor: viewMode === 'table' ? '#0D3133' : '#F8F8F7',
                    color: viewMode === 'table' ? 'white' : '#6B6B6B',
                    border: `1px solid ${viewMode === 'table' ? '#0D3133' : '#E2E0DC'}`,
                  }}
                  title="Detailed data table view"
                >
                  <Table2 className="w-4 h-4" />
                  Table View
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="px-8 py-4 flex gap-4" style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }}>
            <Select defaultValue="7d">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 1 Day</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="network">Network</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Agent" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="sarah">Sarah Wilson</SelectItem>
              <SelectItem value="mike">Mike Johnson</SelectItem>
              <SelectItem value="john">John Davis</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6">
          {children}
        </div>
      </div>
    </div>

    {/* Modals */}
    <ReportExportModal
      isOpen={showExportModal}
      onClose={() => setShowExportModal(false)}
      reportTitle={reportTitle}
    />
    <ReportScheduleModal
      isOpen={showScheduleModal}
      onClose={() => setShowScheduleModal(false)}
      reportTitle={reportTitle}
    />
    <ReportSaveViewModal
      isOpen={showSaveViewModal}
      onClose={() => setShowSaveViewModal(false)}
      reportTitle={reportTitle}
    />
    </>
  )
}
