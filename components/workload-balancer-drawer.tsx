'use client'

import { X, AlertCircle, CheckCircle } from 'lucide-react'

interface Ticket {
  id: string
  title: string
  assignee: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending'
  dueDate: string
  slaRisk?: number
}

interface Agent {
  id: string
  name: string
  capacity: number
  capacityUsed: number
  slaRisk: number
  group: string
}

interface WorkloadBalancerDrawerProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onReassign: (agentId: string) => void
}

const agents: Agent[] = [
  { id: '1', name: 'Sarah Johnson', capacity: 35, capacityUsed: 18, slaRisk: 10, group: 'Senior Developer' },
  { id: '2', name: 'Michael Chen', capacity: 38, capacityUsed: 32, slaRisk: 35, group: 'UI/UX Designer' },
  { id: '3', name: 'Emma Williams', capacity: 42, capacityUsed: 28, slaRisk: 15, group: 'Backend Engineer' },
  { id: '4', name: 'James Rodriguez', capacity: 35, capacityUsed: 33, slaRisk: 50, group: 'Product Manager' },
  { id: '5', name: 'Olivia Martinez', capacity: 40, capacityUsed: 38, slaRisk: 70, group: 'QA Engineer' },
]

const getCapacityColor = (capacity: number, used: number): string => {
  const percent = (used / capacity) * 100
  if (percent > 100) return '#DC2626'
  if (percent > 85) return '#F59E0B'
  return '#16A34A'
}

const getPriorityColor = (priority: Ticket['priority']): { bg: string; border: string; text: string } => {
  switch (priority) {
    case 'critical':
      return { bg: '#FEE2E2', border: '#DC2626', text: '#7F1D1D' }
    case 'high':
      return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' }
    case 'medium':
      return { bg: '#DBEAFE', border: '#0EA5E9', text: '#0C4A6E' }
    case 'low':
      return { bg: '#DCFCE7', border: '#16A34A', text: '#166534' }
  }
}

export function WorkloadBalancerDrawer({
  ticket,
  isOpen,
  onClose,
  onReassign,
}: WorkloadBalancerDrawerProps) {
  if (!isOpen || !ticket) return null

  const priorityColor = getPriorityColor(ticket.priority)
  const currentAgent = agents.find(a => a.name === ticket.assignee)

  // Find suggested agents: those with capacity and lower SLA risk
  const suggestedAgents = agents
    .filter(a => a.id !== currentAgent?.id)
    .sort((a, b) => {
      const aCapacity = (a.capacityUsed / a.capacity) * 100
      const bCapacity = (b.capacityUsed / b.capacity) * 100
      return aCapacity - bCapacity
    })
    .slice(0, 3)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg overflow-y-auto z-50 transform transition-transform duration-300"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>
            Workload Balancer
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            title="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Ticket Information */}
          <div>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: '#6B6B6B' }}>
              Ticket Information
            </h3>
            <div
              className="p-4 rounded-lg border"
              style={{
                borderColor: priorityColor.border,
                backgroundColor: priorityColor.bg,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-bold" style={{ color: priorityColor.text }}>
                    {ticket.id}
                  </div>
                  <div className="text-sm mt-2" style={{ color: '#1a1a1a' }}>
                    {ticket.title}
                  </div>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-bold"
                  style={{
                    backgroundColor: priorityColor.border,
                    color: '#FFFFFF',
                  }}
                >
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
              </div>
              <div className="text-xs mt-3 pt-3 border-t" style={{ borderColor: priorityColor.border, color: '#6B6B6B' }}>
                <div>Due: {new Date(ticket.dueDate).toLocaleDateString()}</div>
                <div>Status: {ticket.status}</div>
              </div>
            </div>
          </div>

          {/* Current Assignee */}
          <div>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: '#6B6B6B' }}>
              Current Assignee
            </h3>
            {currentAgent && (
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
                <div className="font-medium" style={{ color: '#1a1a1a' }}>
                  {currentAgent.name}
                </div>
                <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                  {currentAgent.group}
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#6B6B6B' }}>Capacity</span>
                    <span style={{ color: '#1a1a1a' }}>
                      {currentAgent.capacityUsed}/{currentAgent.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(currentAgent.capacityUsed / currentAgent.capacity) * 100}%`,
                        backgroundColor: getCapacityColor(currentAgent.capacity, currentAgent.capacityUsed),
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: '#6B6B6B' }}>SLA Risk</span>
                    <span style={{ color: currentAgent.slaRisk > 50 ? '#DC2626' : '#16A34A' }}>
                      {currentAgent.slaRisk}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Agents */}
          <div>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: '#6B6B6B' }}>
              Suggested Agents
            </h3>
            <div className="space-y-3">
              {suggestedAgents.map(agent => {
                const capacityPercent = (agent.capacityUsed / agent.capacity) * 100
                const capacityColor = getCapacityColor(agent.capacity, agent.capacityUsed)
                const canAccept = agent.capacityUsed < agent.capacity

                return (
                  <div
                    key={agent.id}
                    className="p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                    style={{
                      borderColor: canAccept ? '#E2E0DC' : '#FEE2E2',
                      backgroundColor: canAccept ? '#FFFFFF' : '#FEF2F2',
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium" style={{ color: '#1a1a1a' }}>
                          {agent.name}
                        </div>
                        <div className="text-xs" style={{ color: '#6B6B6B' }}>
                          {agent.group}
                        </div>
                      </div>
                      {canAccept ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#16A34A' }} />
                      ) : (
                        <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#DC2626' }} />
                      )}
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#6B6B6B' }}>Capacity</span>
                        <span style={{ color: '#1a1a1a' }}>
                          {agent.capacityUsed}/{agent.capacity} ({Math.round(capacityPercent)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${capacityPercent}%`,
                            backgroundColor: capacityColor,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span style={{ color: '#6B6B6B' }}>SLA Risk</span>
                        <span style={{ color: agent.slaRisk > 50 ? '#DC2626' : '#16A34A' }}>
                          {agent.slaRisk}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onReassign(agent.id)
                        onClose()
                      }}
                      disabled={!canAccept}
                      className="w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      style={{
                        backgroundColor: canAccept ? '#0C4A6E' : '#E2E0DC',
                        color: canAccept ? '#FFFFFF' : '#6B6B6B',
                      }}
                    >
                      {canAccept ? 'Reassign' : 'Over Capacity'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t" style={{ borderColor: '#E2E0DC' }}>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: '#F8F8F7',
                color: '#6B6B6B',
                border: '1px solid #E2E0DC',
              }}
            >
              Escalate
            </button>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: '#F8F8F7',
                color: '#6B6B6B',
                border: '1px solid #E2E0DC',
              }}
            >
              Watch
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
