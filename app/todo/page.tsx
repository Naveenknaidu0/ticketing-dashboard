'use client'

import { useState } from 'react'
import { Download, RotateCcw, Eye, AlertCircle, Clock, CheckCircle2, Zap } from 'lucide-react'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { KPICard } from '@/components/kpi-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function TodoPage() {
  const [viewCompleted, setViewCompleted] = useState(false)
  const [timeFilter, setTimeFilter] = useState('today')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'To Do' },
  ]

  const mockSummary = {
    dueToday: 8,
    slaRisk: 3,
    waitingOnMe: 6,
    completedToday: 14,
    criticalActions: 2,
  }

  const mockPriorityQueue = [
    { id: 'INC-1042', subject: 'Critical server outage affecting production', action: 'First Response Required', timeRemaining: '22 Minutes', priority: 'critical' },
    { id: 'INC-1088', subject: 'Database backup failed - urgent investigation', action: 'Resolution Due', timeRemaining: '1 Hour', priority: 'high' },
    { id: 'INC-1095', subject: 'VIP customer access issue', action: 'Response Required', timeRemaining: '35 Minutes', priority: 'critical' },
  ]

  const mockDueToday = [
    { id: 'TSK-2341', subject: 'Follow-up with customer on implementation status', dueTime: '5:00 PM', actionType: 'Follow-up Required' },
    { id: 'TSK-2355', subject: 'Customer callback for feedback collection', dueTime: '4:30 PM', actionType: 'Customer Callback' },
    { id: 'TSK-2368', subject: 'Pending update on ticket resolution', dueTime: '6:00 PM', actionType: 'Pending Update' },
  ]

  const mockWaitingOnMe = [
    { id: 'INC-1075', subject: 'Waiting for work log entry completion', action: 'Pending Work Log', age: '2 days' },
    { id: 'INC-1082', subject: 'Investigation status needs documentation', action: 'Pending Investigation', age: '1 day' },
    { id: 'INC-1091', subject: 'Customer update pending from agent', action: 'Pending Customer Update', age: '3 hours' },
  ]

  const mockSLARisk = [
    { id: 'INC-1080', priority: 'critical', responseRemaining: '15 mins', resolutionRemaining: '45 mins', riskLevel: 'critical' },
    { id: 'INC-1087', priority: 'high', responseRemaining: '1 hour', resolutionRemaining: '2 hours', riskLevel: 'high' },
  ]

  const mockCompletedToday = [
    { time: '2:45 PM', action: 'Ticket Resolved', ticket: 'INC-1070' },
    { time: '2:30 PM', action: 'Customer Updated', ticket: 'TSK-2340' },
    { time: '2:15 PM', action: 'Work Log Added', ticket: 'INC-1068' },
    { time: '1:50 PM', action: 'Follow-up Completed', ticket: 'TSK-2335' },
  ]

  const mockFocusItems = [
    '2 Critical tickets require response within 30 minutes.',
    '3 tickets need customer follow-up today.',
    '1 VIP ticket approaching SLA breach.',
    'Complete pending work logs before end of shift.',
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#DC2626'
      case 'high':
        return '#EA580C'
      case 'medium':
        return '#F59E0B'
      case 'low':
        return '#6B7280'
      default:
        return '#6B7280'
    }
  }

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#FEE2E2'
      case 'high':
        return '#FED7AA'
      case 'medium':
        return '#FEF3C7'
      case 'low':
        return '#F3F4F6'
      default:
        return '#F3F4F6'
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-white">
        {/* Page Header */}
        <div className="border-b px-8 py-4" style={{ borderColor: '#E2E0DC' }}>
          <div className="mb-3 overflow-x-auto">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                To Do
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                Your tasks and reminders requiring attention today.
              </p>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button
                variant={viewCompleted ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={() => setViewCompleted(!viewCompleted)}
              >
                <Eye className="w-4 h-4" />
                {viewCompleted ? 'Hide' : 'View'} Completed
              </Button>
            </div>
          </div>
        </div>

        {/* Global Filters */}
        <div className="border-b px-8 py-3 flex gap-4" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="all">All Open Actions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32" style={{ borderColor: '#E2E0DC' }}>
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

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue placeholder="Ticket Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="incident">Incident</SelectItem>
              <SelectItem value="request">Service Request</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="change">Change</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* ROW 1: ACTION SUMMARY */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                My Action Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <KPICard
                  icon={<Clock className="w-5 h-5" />}
                  label="Due Today"
                  value={mockSummary.dueToday}
                  indicator="Actions pending"
                  tooltip="Actions and follow-ups due today"
                  filterType="due-today"
                />
                <KPICard
                  icon={<AlertCircle className="w-5 h-5" />}
                  label="SLA Risk"
                  value={mockSummary.slaRisk}
                  indicator="At risk"
                  tooltip="Tickets at SLA risk"
                  filterType="due-today"
                  isUrgent={true}
                />
                <KPICard
                  icon={<Zap className="w-5 h-5" />}
                  label="Waiting On Me"
                  value={mockSummary.waitingOnMe}
                  indicator="Blocked items"
                  tooltip="Work blocked by pending actions"
                  filterType="due-today"
                />
                <KPICard
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  label="Completed Today"
                  value={mockSummary.completedToday}
                  indicator="Actions done"
                  tooltip="Completed actions today"
                  filterType="due-today"
                />
                <KPICard
                  icon={<AlertCircle className="w-5 h-5" />}
                  label="Critical Actions"
                  value={mockSummary.criticalActions}
                  indicator="Urgent"
                  tooltip="Critical actions requiring immediate attention"
                  filterType="due-today"
                  isUrgent={true}
                />
              </div>
            </div>

            {/* ROW 2: PRIORITY QUEUE */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                My Priority Queue
              </h2>
              <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F8F6', borderBottom: '1px solid #E2E0DC' }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Subject</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Action Required</th>
                      <th className="px-4 py-3 text-right font-semibold" style={{ color: '#1a1a1a' }}>Remaining Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPriorityQueue.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ borderColor: '#E2E0DC' }}
                      >
                        <td className="px-4 py-3">
                          <div
                            className="inline-block px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: getPriorityBg(item.priority), color: getPriorityColor(item.priority) }}
                          >
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.subject}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.action}</td>
                        <td className="px-4 py-3 text-right font-semibold" style={{ color: getPriorityColor(item.priority) }}>
                          {item.timeRemaining}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 3: DUE TODAY */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Due Today
              </h2>
              <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F8F6', borderBottom: '1px solid #E2E0DC' }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Subject</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Due Time</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Action Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDueToday.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ borderColor: '#E2E0DC' }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.subject}</td>
                        <td className="px-4 py-3 font-semibold" style={{ color: '#E69F50' }}>{item.dueTime}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.actionType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 4: WAITING ON ME */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Waiting On Me
              </h2>
              <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F8F6', borderBottom: '1px solid #E2E0DC' }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Subject</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Missing Action</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockWaitingOnMe.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ borderColor: '#E2E0DC' }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.subject}</td>
                        <td className="px-4 py-3" style={{ color: '#EA580C' }}>{item.action}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 5: SLA RISK QUEUE */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                SLA Risk Queue
              </h2>
              <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F8F6', borderBottom: '1px solid #E2E0DC' }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Response Remaining</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Resolution Remaining</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockSLARisk.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ borderColor: '#E2E0DC' }}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                        <td className="px-4 py-3">
                          <div
                            className="inline-block px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: getPriorityBg(item.priority), color: getPriorityColor(item.priority) }}
                          >
                            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                          </div>
                        </td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.responseRemaining}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.resolutionRemaining}</td>
                        <td className="px-4 py-3">
                          <div
                            className="inline-block px-2 py-1 rounded text-xs font-semibold"
                            style={{ backgroundColor: item.riskLevel === 'critical' ? '#FEE2E2' : '#FED7AA', color: item.riskLevel === 'critical' ? '#DC2626' : '#EA580C' }}
                          >
                            {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)} Risk
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ROW 6: COMPLETED TODAY */}
            {viewCompleted && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                  Completed Today
                </h2>
                <div className="overflow-x-auto border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: '#F9F8F6', borderBottom: '1px solid #E2E0DC' }}>
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Time</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Action</th>
                        <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockCompletedToday.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-t"
                          style={{ borderColor: '#E2E0DC' }}
                        >
                          <td className="px-4 py-3 font-medium" style={{ color: '#6B6B6B' }}>{item.time}</td>
                          <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.action}</td>
                          <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.ticket}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ROW 7: TODAY'S FOCUS */}
            <div>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Today's Focus
              </h2>
              <div className="space-y-2">
                {mockFocusItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border flex gap-3"
                    style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#73847B' }} />
                    </div>
                    <p style={{ color: '#6B6B6B' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
