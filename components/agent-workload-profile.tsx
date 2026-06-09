'use client'

import { X, Download, MoreHorizontal } from 'lucide-react'

interface WorkloadProfileData {
  name: string
  role: string
  group: string
  capacityPercent: number
  capacityStatus: 'Healthy' | 'Warning' | 'Overloaded'
  assignedTickets: number
  openTickets: number
  inProgressTickets: number
  criticalTickets: number
  slaRiskTickets: number
  resolvedThisMonth: number
  workloadBreakdown: {
    open: number
    inProgress: number
    pendingUser: number
    pendingVendor: number
    resolved: number
  }
  ticketTypeBreakdown: {
    incident: number
    serviceRequest: number
    accessRequest: number
    task: number
  }
  priorityBreakdown: {
    critical: number
    high: number
    medium: number
    low: number
  }
  slaPerformance: {
    responseSLA: number
    resolutionSLA: number
    breached: number
    atRisk: number
  }
  currentAssignments: Array<{
    id: string
    subject: string
    priority: 'Critical' | 'High' | 'Medium' | 'Low'
    status: string
    remainingSLA: string
    dueDate: string
  }>
}

interface AgentWorkloadProfileProps {
  isOpen: boolean
  onClose: () => void
  agentData: WorkloadProfileData | null
}

export function AgentWorkloadProfile({ isOpen, onClose, agentData }: AgentWorkloadProfileProps) {
  if (!isOpen || !agentData) return null

  const capacityColor = 
    agentData.capacityStatus === 'Healthy' ? '#16A34A' :
    agentData.capacityStatus === 'Warning' ? '#F59E0B' :
    '#DC2626'

  const totalWorkloadItems = 
    agentData.workloadBreakdown.open +
    agentData.workloadBreakdown.inProgress +
    agentData.workloadBreakdown.pendingUser +
    agentData.workloadBreakdown.pendingVendor +
    agentData.workloadBreakdown.resolved

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-xl z-50 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#E2E0DC' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
            Workload Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Agent Header */}
          <div className="pb-6 border-b" style={{ borderColor: '#E2E0DC' }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                {agentData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                  {agentData.name}
                </h3>
                <p className="text-sm" style={{ color: '#6B6B6B' }}>
                  {agentData.role}
                </p>
                <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                  {agentData.group}
                </p>
              </div>
            </div>

            {/* Capacity Status */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  {agentData.capacityPercent}%
                </div>
                <div className="text-xs" style={{ color: '#6B6B6B' }}>
                  Capacity
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: capacityColor + '20',
                  color: capacityColor,
                }}
              >
                {agentData.capacityStatus}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                Assigned Tickets
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#1a1a1a' }}>
                {agentData.assignedTickets}
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                Open Tickets
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#1a1a1a' }}>
                {agentData.openTickets}
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                In Progress
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#1a1a1a' }}>
                {agentData.inProgressTickets}
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                Critical
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#DC2626' }}>
                {agentData.criticalTickets}
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                SLA Risk
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#F59E0B' }}>
                {agentData.slaRiskTickets}
              </div>
            </div>
            <div className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
              <div className="text-xs" style={{ color: '#6B6B6B' }}>
                Resolved
              </div>
              <div className="text-2xl font-bold mt-1" style={{ color: '#16A34A' }}>
                {agentData.resolvedThisMonth}
              </div>
            </div>
          </div>

          {/* Workload Breakdown */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              Workload Breakdown
            </h4>
            <div className="space-y-2">
              {[
                { label: 'Open', value: agentData.workloadBreakdown.open, color: '#0EA5E9' },
                { label: 'In Progress', value: agentData.workloadBreakdown.inProgress, color: '#F59E0B' },
                { label: 'Pending User', value: agentData.workloadBreakdown.pendingUser, color: '#8B5CF6' },
                { label: 'Pending Vendor', value: agentData.workloadBreakdown.pendingVendor, color: '#EC4899' },
                { label: 'Resolved', value: agentData.workloadBreakdown.resolved, color: '#16A34A' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="text-xs mb-1 flex justify-between">
                      <span style={{ color: '#6B6B6B' }}>{item.label}</span>
                      <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${(item.value / totalWorkloadItems) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Type Breakdown */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              Ticket Type Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Incident', value: agentData.ticketTypeBreakdown.incident },
                { label: 'Service Request', value: agentData.ticketTypeBreakdown.serviceRequest },
                { label: 'Access Request', value: agentData.ticketTypeBreakdown.accessRequest },
                { label: 'Task', value: agentData.ticketTypeBreakdown.task },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg border text-center" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
                  <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    {item.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Breakdown */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              Priority Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Critical', value: agentData.priorityBreakdown.critical, color: '#DC2626' },
                { label: 'High', value: agentData.priorityBreakdown.high, color: '#F59E0B' },
                { label: 'Medium', value: agentData.priorityBreakdown.medium, color: '#0EA5E9' },
                { label: 'Low', value: agentData.priorityBreakdown.low, color: '#16A34A' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg border text-center" style={{ borderColor: item.color + '40', backgroundColor: item.color + '10' }}>
                  <div className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Performance */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              SLA Performance
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Response SLA %', value: agentData.slaPerformance.responseSLA },
                { label: 'Resolution SLA %', value: agentData.slaPerformance.resolutionSLA },
                { label: 'Breached', value: agentData.slaPerformance.breached },
                { label: 'At Risk', value: agentData.slaPerformance.atRisk },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6' }}>
                  <div className="text-xs mb-1" style={{ color: '#6B6B6B' }}>
                    {item.label}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    {item.value}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Assignments Table */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              Current Assignments
            </h4>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-xs">
                <thead style={{ backgroundColor: '#F9F8F6' }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#6B6B6B' }}>ID</th>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#6B6B6B' }}>Priority</th>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#6B6B6B' }}>Status</th>
                    <th className="px-3 py-2 text-left font-semibold" style={{ color: '#6B6B6B' }}>Due</th>
                  </tr>
                </thead>
                <tbody>
                  {agentData.currentAssignments.map((ticket, idx) => (
                    <tr key={idx} style={{ borderTop: '1px solid #E2E0DC' }}>
                      <td className="px-3 py-2">
                        <span style={{ color: '#0EA5E9', fontWeight: '500' }}>
                          {ticket.id}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              ticket.priority === 'Critical' ? '#DC262620' :
                              ticket.priority === 'High' ? '#F59E0B20' :
                              ticket.priority === 'Medium' ? '#0EA5E920' :
                              '#16A34A20',
                            color:
                              ticket.priority === 'Critical' ? '#DC2626' :
                              ticket.priority === 'High' ? '#F59E0B' :
                              ticket.priority === 'Medium' ? '#0EA5E9' :
                              '#16A34A',
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>
                        {ticket.status}
                      </td>
                      <td className="px-3 py-2" style={{ color: '#6B6B6B' }}>
                        {ticket.dueDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manager Actions */}
          <div className="border-t pt-6" style={{ borderColor: '#E2E0DC' }}>
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#1a1a1a' }}>
              Manager Actions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: '#1a1a1a',
                  color: '#FFFFFF',
                }}
              >
                Reassign Work
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: '#F8F8F7',
                  color: '#1a1a1a',
                  border: '1px solid #E2E0DC',
                }}
              >
                Balance Workload
              </button>
            </div>
            <button
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors mt-2 flex items-center justify-center gap-2"
              style={{
                backgroundColor: '#F8F8F7',
                color: '#6B6B6B',
                border: '1px solid #E2E0DC',
              }}
            >
              <Download className="w-4 h-4" />
              Export Profile
            </button>
          </div>

          {/* Insights */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0FDF420', border: '1px solid #22C55E40' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: '#16A34A' }}>
              Insights
            </h4>
            <ul className="text-xs space-y-1" style={{ color: '#6B6B6B' }}>
              <li>• {agentData.name} owns {Math.round((agentData.assignedTickets / 149) * 100)}% of team workload</li>
              <li>• {agentData.resolvedThisMonth} tickets resolved this month</li>
              <li>• {agentData.criticalTickets} critical tickets require immediate attention</li>
              <li>• Capacity status: {agentData.capacityStatus}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
