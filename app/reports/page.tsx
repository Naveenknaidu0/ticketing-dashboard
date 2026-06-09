'use client'

import { useApp } from '@/app/app-context'
import { useStore } from '@/app/store-context'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { Search, Download, Plus, Star, Eye, Download as DownloadIcon, Info, BarChart3, Users, Clock, TrendingUp, FileText } from 'lucide-react'
import { useReportNavigation, toggleFavoriteReport, isFavoriteReport } from '@/lib/report-navigation'
import { calculateMetrics } from '@/lib/data-governance'

interface Report {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'executive' | 'ticket' | 'agent' | 'service-desk'
  lastGenerated?: string
  isFavorite?: boolean
}

const reportsByCategory: Record<string, Report[]> = {
  executive: [
    {
      id: 'service-health',
      name: 'Service Desk Health',
      description: 'High-level overview of service desk performance and metrics.',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'executive',
      lastGenerated: '2 hours ago',
      isFavorite: true,
    },
    {
      id: 'ticket-volume',
      name: 'Ticket Volume',
      description: 'Incoming tickets, resolution rates, and trend analysis.',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'executive',
      lastGenerated: '5 hours ago',
    },
    {
      id: 'sla-performance',
      name: 'SLA Performance',
      description: 'SLA compliance, breach rates, and time-to-resolution metrics.',
      icon: <Clock className="w-5 h-5" />,
      category: 'executive',
      lastGenerated: 'Yesterday',
      isFavorite: true,
    },
    {
      id: 'csat-performance',
      name: 'CSAT Performance',
      description: 'Customer satisfaction scores and feedback analysis.',
      icon: <Star className="w-5 h-5" />,
      category: 'executive',
    },
  ],
  ticket: [
    {
      id: 'ticket-status',
      name: 'Ticket Status',
      description: 'Breakdown of tickets by status and processing stages.',
      icon: <FileText className="w-5 h-5" />,
      category: 'ticket',
      lastGenerated: '1 hour ago',
    },
    {
      id: 'priority-analysis',
      name: 'Priority Analysis',
      description: 'Ticket distribution across priority levels with trends.',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'ticket',
    },
    {
      id: 'type-analysis',
      name: 'Ticket Type Analysis',
      description: 'Analysis of tickets by type and classification.',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'ticket',
    },
    {
      id: 'ticket-aging',
      name: 'Ticket Aging',
      description: 'Show ticket age distribution and backlog trends.',
      icon: <Clock className="w-5 h-5" />,
      category: 'ticket',
      lastGenerated: '3 days ago',
      isFavorite: true,
    },
  ],
  agent: [
    {
      id: 'agent-productivity',
      name: 'Agent Productivity',
      description: 'Individual agent performance and workload metrics.',
      icon: <Users className="w-5 h-5" />,
      category: 'agent',
      lastGenerated: '2 hours ago',
      isFavorite: true,
    },
    {
      id: 'agent-performance',
      name: 'Agent Performance',
      description: 'Detailed performance analysis and KPIs by agent.',
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'agent',
    },
    {
      id: 'agent-workload',
      name: 'Agent Workload',
      description: 'Current workload distribution and queue analysis.',
      icon: <BarChart3 className="w-5 h-5" />,
      category: 'agent',
    },
  ],
  'service-desk': [
    {
      id: 'group-performance',
      name: 'Group Performance',
      description: 'Department and group-level operational reporting.',
      icon: <Users className="w-5 h-5" />,
      category: 'service-desk',
    },
  ],
}

const categoryMetadata = {
  executive: {
    title: 'Executive Reports',
    description: 'High-level service desk health and performance reporting.',
    count: 4,
  },
  ticket: {
    title: 'Ticket Reports',
    description: 'Operational ticket analysis and trends.',
    count: 4,
  },
  agent: {
    title: 'Agent Reports',
    description: 'Individual and team performance analysis.',
    count: 3,
  },
  'service-desk': {
    title: 'Service Desk Reports',
    description: 'Department and group-level operational reporting.',
    count: 1,
  },
}

interface ReportCardProps {
  report: Report
  onView: (reportId: string, category: string) => void
  onFavorite: (reportId: string) => void
  onExport: (reportId: string) => void
}

function ReportCard({ report, onView, onFavorite, onExport }: ReportCardProps) {
  return (
    <div
      className="bg-white rounded-lg border p-4 transition-all hover:shadow-md"
      style={{ borderColor: '#E2E0DC' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: '#F8F8F7', color: '#6B6B6B' }}
        >
          {report.icon}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onFavorite(report.id)}
                className="p-1 rounded hover:opacity-70 transition-opacity"
              >
                <Star
                  className="w-4 h-4"
                  style={{
                    color: report.isFavorite ? '#E69F50' : '#D1D5DB',
                    fill: report.isFavorite ? '#E69F50' : 'none',
                  }}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {report.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <h3 className="font-semibold text-sm mb-1" style={{ color: '#1a1a1a' }}>
        {report.name}
      </h3>
      <p className="text-xs mb-3" style={{ color: '#6B6B6B' }}>
        {report.description}
      </p>

      {report.lastGenerated && (
        <p className="text-xs mb-4" style={{ color: '#73847B' }}>
          Last generated: {report.lastGenerated}
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onView(report.id, report.category)}
          className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: '#0D3133',
            color: 'white',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          View Report
        </button>
        <button
          onClick={() => onExport(report.id)}
          className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: '#F8F8F7',
            color: '#6B6B6B',
            border: '1px solid #E2E0DC',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E0DC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F8F7')}
        >
          <DownloadIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const { userRole } = useApp()
  const { state } = useStore()
  const { navigateToReport } = useReportNavigation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDateRange, setSelectedDateRange] = useState('7d')
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(Object.values(reportsByCategory).flatMap(r => r.filter(rep => rep.isFavorite).map(rep => rep.id)))
  )
  const [reportMetrics, setReportMetrics] = useState<Record<string, string>>({})

  // Calculate metrics from store data (CORE-01H: Single source of truth)
  useEffect(() => {
    if (!state?.tickets || !state?.slaRecords) return

    const metrics = calculateMetrics(Array.from(state.tickets.values()), state.slaRecords)

    setReportMetrics({
      ticketVolume: `${metrics.totalTickets} total tickets`,
      openTickets: `${metrics.openTickets} open`,
      resolvedTickets: `${metrics.resolvedTickets} resolved`,
      avgTime: `${metrics.avgResolutionTime}h avg resolution`,
      slaMetrics: `${metrics.slaBreached} breaches`,
    })
  }, [state?.tickets, state?.slaRecords])

  const handleViewReport = (reportId: string, category: string) => {
    navigateToReport(category, reportId)
  }

  const handleFavoriteReport = (reportId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(reportId)) {
      newFavorites.delete(reportId)
    } else {
      newFavorites.add(reportId)
    }
    setFavorites(newFavorites)
  }

  const handleExportReport = (reportId: string) => {
    console.log('[v0] Exporting report:', reportId)
    // Show export modal with options (PDF, Excel, CSV)
  }

  const recentReports = [
    { name: 'Ticket Volume Report', time: '2 hours ago' },
    { name: 'SLA Performance Report', time: 'Yesterday' },
    { name: 'Agent Productivity Report', time: '3 days ago' },
  ]

  const favoriteReports = Array.from(favorites)
    .map((id) => {
      for (const reports of Object.values(reportsByCategory)) {
        const report = reports.find((r) => r.id === id)
        if (report) return report
      }
      return null
    })
    .filter(Boolean) as Report[]

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        {/* Page Header */}
        <div className="bg-white border-b" style={{ borderBottomColor: '#E2E0DC' }}>
          <div className="px-8 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold leading-tight" style={{ color: '#1a1a1a' }}>
                  Reports Center
                </h1>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: '#6B6B6B' }}>
                  Analyze service desk performance, ticket trends, SLA compliance, workload distribution, and team productivity.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: '#E2E0DC',
                    backgroundColor: '#F8F8F7',
                    color: '#1a1a1a',
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: '#E2E0DC',
                    backgroundColor: '#F8F8F7',
                    color: '#1a1a1a',
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Create Custom
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: '#E2E0DC',
                    backgroundColor: '#F8F8F7',
                    color: '#1a1a1a',
                  }}
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: '#E2E0DC',
                    backgroundColor: '#F8F8F7',
                    color: '#1a1a1a',
                  }}
                >
                  <Star className="w-4 h-4" />
                  Saved
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white px-8 py-4 flex items-center gap-3" style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px' }}>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="agent1">Sarah Johnson</SelectItem>
                  <SelectItem value="agent2">Michael Chen</SelectItem>
                  <SelectItem value="agent3">Emma Williams</SelectItem>
                  <SelectItem value="agent4">James Rodriguez</SelectItem>
                  <SelectItem value="agent5">David Kumar</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                  <SelectItem value="task">Task</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="SLA State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="risk">At Risk</SelectItem>
                  <SelectItem value="breached">Breached</SelectItem>
                  <SelectItem value="healthy">Healthy</SelectItem>
                </SelectContent>
              </Select>
            </div>

        {/* Main Content */}
        <div className="overflow-auto" style={{ backgroundColor: '#F8F8F7' }}>
          <div className="pt-4 px-8 pb-8">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#6B6B6B' }} />
                <Input
                  placeholder="Search reports by name, category, or saved reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  style={{ borderColor: '#E2E0DC' }}
                />
              </div>
            </div>

            {/* Report Categories */}
            <div className="space-y-8">
              {(Object.keys(categoryMetadata) as Array<keyof typeof categoryMetadata>).map((categoryKey) => (
                <div key={categoryKey}>
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>
                        {categoryMetadata[categoryKey].title}
                      </h2>
                      <span
                        className="text-sm px-3 py-1 rounded-full"
                        style={{ backgroundColor: '#E2E0DC', color: '#6B6B6B' }}
                      >
                        {reportsByCategory[categoryKey].length} Reports
                      </span>
                    </div>
                    <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                      {categoryMetadata[categoryKey].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportsByCategory[categoryKey].map((report) => (
                      <ReportCard
                        key={report.id}
                        report={{
                          ...report,
                          isFavorite: favorites.has(report.id),
                        }}
                        onView={handleViewReport}
                        onFavorite={handleFavoriteReport}
                        onExport={handleExportReport}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Reports Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#1a1a1a' }}>
                Recent Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentReports.map((report, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border p-4"
                    style={{ borderColor: '#E2E0DC' }}
                  >
                    <h3 className="font-medium text-sm" style={{ color: '#1a1a1a' }}>
                      {report.name}
                    </h3>
                    <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>
                      Generated {report.time}
                    </p>
                    <button
                      className="mt-4 text-xs font-medium px-3 py-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: '#F8F8F7',
                        color: '#0D3133',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#E2E0DC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F8F8F7')}
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Reports Section */}
            {favoriteReports.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4" style={{ color: '#1a1a1a' }}>
                  Favorite Reports
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {favoriteReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-lg border p-4"
                      style={{ borderColor: '#E2E0DC' }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm flex-1" style={{ color: '#1a1a1a' }}>
                          {report.name}
                        </h3>
                        <Star className="w-4 h-4" style={{ color: '#E69F50', fill: '#E69F50' }} />
                      </div>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        {report.description}
                      </p>
                      <button
                        onClick={() => handleViewReport(report.id, report.category)}
                        className="mt-4 text-xs font-medium px-3 py-2 rounded-lg transition-all w-full"
                        style={{
                          backgroundColor: '#0D3133',
                          color: 'white',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                      >
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Report Builder */}
            <div className="mt-8">
              <div
                className="rounded-lg border-2 p-8 text-center"
                style={{ borderColor: '#E2E0DC', borderStyle: 'dashed', backgroundColor: '#F8F8F7' }}
              >
                <Plus className="w-8 h-8 mx-auto mb-4" style={{ color: '#0D3133' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
                  Build Custom Report
                </h3>
                <p className="text-sm mt-2 mb-6" style={{ color: '#6B6B6B' }}>
                  Create personalized reports using filters and metrics.
                </p>
                <Button
                  style={{
                    backgroundColor: '#0D3133',
                    color: 'white',
                  }}
                >
                  Create Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
