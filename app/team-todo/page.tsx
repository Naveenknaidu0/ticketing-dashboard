'use client'

import { useState } from 'react'
import { Download, RotateCcw, Eye, AlertCircle, Clock, CheckCircle2, Zap, AlertTriangle, Users, FileText, TrendingUp } from 'lucide-react'
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

export default function TeamTodoPage() {
  const [viewCompleted, setViewCompleted] = useState(false)
  const [timeFilter, setTimeFilter] = useState('today')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Team To-Do' },
  ]

  const mockSummary = {
    pendingApprovals: 12,
    slaRisks: 18,
    escalations: 6,
    unassignedTickets: 4,
    completedActionsToday: 22,
    criticalTeamActions: 3,
  }

  const mockTeamAttentionRequired = [
    { priority: 'critical', id: 'INC-2401', subject: 'Production Database Cluster Failure', action: 'Immediate Incident Response', owner: 'John Smith', timeRemaining: '5 mins' },
    { priority: 'critical', id: 'INC-2398', subject: 'VIP Client Service Degradation', action: 'Escalation Review', owner: 'Sarah Johnson', timeRemaining: '12 mins' },
    { priority: 'high', id: 'INC-2395', subject: 'Major System Performance Issues', action: 'Team Coordination', owner: 'Michael Chen', timeRemaining: '28 mins' },
    { priority: 'high', id: 'CHG-1205', subject: 'Emergency Security Patch Deployment', action: 'Change Approval', owner: 'Emma Davis', timeRemaining: '45 mins' },
  ]

  const mockPendingApprovals = [
    { id: 'AR-5401', type: 'Access Request', requestedBy: 'Sarah Johnson', pendingSince: '3 hours', approvalRequired: 'VP Engineering' },
    { id: 'CHG-1203', type: 'Change Request', requestedBy: 'Michael Chen', pendingSince: '2 hours', approvalRequired: 'Change Advisory' },
    { id: 'KB-2145', type: 'Knowledge Article', requestedBy: 'Emma Davis', pendingSince: '1.5 hours', approvalRequired: 'Content Lead' },
    { id: 'MIC-0842', type: 'Major Incident Closure', requestedBy: 'John Smith', pendingSince: '45 mins', approvalRequired: 'Director' },
  ]

  const mockSLARiskWatchlist = [
    { id: 'INC-2402', priority: 'critical', group: 'L1 Support', agent: 'Alex Torres', slaRemaining: '18 mins', riskLevel: 'critical' },
    { id: 'INC-2399', priority: 'high', group: 'L2 Network', agent: 'Lisa Chen', slaRemaining: '1.2 hours', riskLevel: 'high' },
    { id: 'SR-1589', priority: 'high', group: 'Hardware', agent: 'David Lee', slaRemaining: '2.5 hours', riskLevel: 'high' },
    { id: 'INC-2396', priority: 'medium', group: 'Database', agent: 'Maria Garcia', slaRemaining: '4 hours', riskLevel: 'medium' },
  ]

  const mockTeamFollowUps = [
    { category: 'Agent Workload Imbalance', item: 'L1 Support: 2 agents with 40+ tickets', age: '2 hours', action: 'Rebalance queue' },
    { category: 'Old Tickets', item: '3 tickets over 30 days in backlog', age: '1 day', action: 'Review and close' },
    { category: 'Backlog Growth', item: 'Unassigned queue grew 15%', age: '3 hours', action: 'Immediate assignment' },
    { category: 'Pending Customer Responses', item: '8 tickets awaiting customer input', age: 'varies', action: 'Follow-up sent' },
  ]

  const mockEscalations = [
    { id: 'INC-2400', type: 'Customer Escalation', owner: 'Sarah Johnson', age: '2 hours', status: 'In Progress' },
    { id: 'INC-2393', type: 'VIP Escalation', owner: 'Michael Chen', age: '4 hours', status: 'Resolved' },
    { id: 'INC-2388', type: 'Management Escalation', owner: 'John Smith', age: '1 day', status: 'In Progress' },
    { id: 'INC-2379', type: 'Repeated Escalation', owner: 'Emma Davis', age: '3 days', status: 'Pending Review' },
  ]

  const mockUnassignedWork = [
    { id: 'INC-2403', priority: 'critical', group: 'L1 Support', created: '2:15 PM', age: '45 mins' },
    { id: 'SR-1592', priority: 'high', group: 'Hardware', created: '1:30 PM', age: '2 hours' },
    { id: 'INC-2397', priority: 'medium', group: 'Database', created: '12:45 PM', age: '3.5 hours' },
    { id: 'CHG-1206', priority: 'high', group: 'Network', created: '10:00 AM', age: '6 hours' },
  ]

  const mockCompletedActionsToday = [
    { time: '3:45 PM', action: 'Approval Completed', performedBy: 'Director', reference: 'MIC-0835' },
    { time: '3:20 PM', action: 'Ticket Reassigned', performedBy: 'Team Lead', reference: 'INC-2391' },
    { time: '3:00 PM', action: 'Escalation Closed', performedBy: 'Manager', reference: 'INC-2375' },
    { time: '2:30 PM', action: 'Major Incident Reviewed', performedBy: 'Director', reference: 'MIC-0828' },
    { time: '2:15 PM', action: 'Knowledge Article Approved', performedBy: 'Content Lead', reference: 'KB-2140' },
  ]

  const mockRecommendations = [
    '3 Critical tickets require immediate assignment - recommend escalating to Senior Engineers',
    'Network team exceeded SLA risk threshold - 45% of tickets at risk of breach',
    '2 change approvals pending for more than 24 hours - expedited review recommended',
    'L2 backlog increased by 15% - consider load balancing or hiring surge',
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
        return '#10B981'
      default:
        return '#6B7280'
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return '#DC2626'
      case 'high':
        return '#EA580C'
      case 'medium':
        return '#F59E0B'
      default:
        return '#10B981'
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b p-4 px-6" style={{ borderColor: '#E2E0DC' }}>
          <div className="mb-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                Team To-Do
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                Review approvals, escalations, SLA risks, and team actions requiring attention.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Refresh">
                <RotateCcw className="w-4 h-4" style={{ color: '#1a1a1a' }} />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100" title="Export">
                <Download className="w-4 h-4" style={{ color: '#1a1a1a' }} />
              </button>
              <button
                onClick={() => setViewCompleted(!viewCompleted)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
              >
                <Eye className="w-4 h-4" />
                {viewCompleted ? 'Hide Completed' : 'View Completed'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b p-4 px-6 flex items-center gap-3" style={{ borderColor: '#E2E0DC' }}>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>

          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="l1">L1 Support</SelectItem>
              <SelectItem value="l2">L2 Network</SelectItem>
              <SelectItem value="database">Database</SelectItem>
            </SelectContent>
          </Select>

          <Select value={agentFilter} onValueChange={setAgentFilter}>
            <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="unassigned">Unassigned Only</SelectItem>
              <SelectItem value="overloaded">Overloaded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40" style={{ borderColor: '#E2E0DC' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Team Action Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Team Action Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <KPICard
                label="Pending Approvals"
                value={mockSummary.pendingApprovals}
                icon={<FileText className="w-5 h-5" />}
                indicator="pending"
                tooltip="Actions waiting for your approval"
                filterType="open"
              />
              <KPICard
                label="SLA Risks"
                value={mockSummary.slaRisks}
                icon={<AlertCircle className="w-5 h-5" />}
                indicator="atrisk"
                tooltip="Tickets at risk of missing SLA"
                filterType="due-today"
                isUrgent={true}
              />
              <KPICard
                label="Escalations"
                value={mockSummary.escalations}
                icon={<Zap className="w-5 h-5" />}
                indicator="escalations"
                tooltip="Team member escalations requiring attention"
                filterType="due-today"
              />
              <KPICard
                label="Unassigned Tickets"
                value={mockSummary.unassignedTickets}
                icon={<Users className="w-5 h-5" />}
                indicator="unassigned"
                tooltip="Tickets awaiting team assignment"
                filterType="open"
              />
              <KPICard
                label="Completed Actions Today"
                value={mockSummary.completedActionsToday}
                icon={<CheckCircle2 className="w-5 h-5" />}
                indicator="completed"
                tooltip="Actions completed by your team today"
                filterType="resolved-today"
              />
              <KPICard
                label="Critical Team Actions"
                value={mockSummary.criticalTeamActions}
                icon={<AlertTriangle className="w-5 h-5" />}
                indicator="critical"
                tooltip="Critical actions requiring immediate attention"
                filterType="due-today"
                isUrgent={true}
              />
            </div>
          </div>

          {/* Team Attention Required */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Team Attention Required
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Subject</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Action Required</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Owner</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Remaining Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeamAttentionRequired.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(item.priority) }}
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.subject}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.action}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.owner}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: getPriorityColor(item.priority) }}>{item.timeRemaining}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Pending Approvals
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Request ID</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Type</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Requested By</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Pending Since</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Approval Required</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPendingApprovals.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.type}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.requestedBy}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.pendingSince}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.approvalRequired}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <button className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200">Approve</button>
                        <button className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SLA Risk Watchlist */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              SLA Risk Watchlist
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Group</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Assigned Agent</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Remaining SLA</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {mockSLARiskWatchlist.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(item.priority) }}
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.group}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.agent}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: getRiskLevelColor(item.riskLevel) }}>{item.slaRemaining}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getRiskLevelColor(item.riskLevel) }}
                        >
                          {item.riskLevel.charAt(0).toUpperCase() + item.riskLevel.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Follow-Ups */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Team Follow-Ups
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Category</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Item</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Age</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Recommended Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTeamFollowUps.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.category}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.item}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.age}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#0284C7' }}>{item.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Escalations */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Escalations
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Escalation Type</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Owner</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Age</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEscalations.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.type}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.owner}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.age}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: item.status === 'Resolved' ? '#DBEAFE' : '#FEF3C7',
                            color: item.status === 'Resolved' ? '#0284C7' : '#D97706',
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unassigned Work */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Unassigned Work
            </h2>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Priority</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Group</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Created</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Age</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockUnassignedWork.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50" style={{ borderColor: '#E2E0DC' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.id}</td>
                      <td className="px-4 py-3">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: getPriorityColor(item.priority) }}
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.group}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.created}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.age}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <button className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">Assign</button>
                        <button className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200">Escalate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Completed Actions Today - Conditional */}
          {viewCompleted && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Completed Actions Today
              </h2>
              <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F8F6' }}>
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Time</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Action</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Performed By</th>
                      <th className="px-4 py-3 text-left font-semibold" style={{ color: '#1a1a1a' }}>Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCompletedActionsToday.map((item, idx) => (
                      <tr key={idx} className="border-t" style={{ borderColor: '#E2E0DC' }}>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.time}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.action}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{item.performedBy}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Manager Recommendations */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Manager Recommendations
            </h2>
            <div className="space-y-3">
              {mockRecommendations.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFBEB' }}>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#D97706' }} />
                    <p style={{ color: '#6B6B6B' }}>{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
