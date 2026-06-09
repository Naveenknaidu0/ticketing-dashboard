'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, Copy, MoreVertical, AlertCircle, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QueueDialog } from '@/components/queue-dialog'
import { QueueEditDialog } from '@/components/queue-edit-dialog'
import { assignmentEngine } from '@/lib/assignment-engine'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function QueuesPage() {
  const [queues, setQueues] = useState(assignmentEngine.getAllQueues())
  const [selectedQueue, setSelectedQueue] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingQueueId, setEditingQueueId] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [activeTab, setActiveTab] = useState<'general' | 'capacity' | 'escalation'>('general')

  const getQueueTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      'support': { bg: '#DBEAFE', text: '#1E40AF' },
      'assignment': { bg: '#FEE2E2', text: '#991B1B' },
      'escalation': { bg: '#D1FAE5', text: '#065F46' },
      'vip': { bg: '#FEF3C7', text: '#92400E' },
      'overflow': { bg: '#F3E8FF', text: '#581C87' },
      'approval': { bg: '#DCFCE7', text: '#166534' },
      'custom': { bg: '#F3F4F3', text: '#6B6B6B' },
    }
    return colors[type] || { bg: '#F3F4F3', text: '#6B6B6B' }
  }

  const getHealthColor = (score: number) => {
    if (score >= 90) return { color: '#10B981', label: 'Excellent' }
    if (score >= 70) return { color: '#F59E0B', label: 'Good' }
    if (score >= 50) return { color: '#EF4444', label: 'Fair' }
    return { color: '#DC2626', label: 'Poor' }
  }

  const getCapacityColor = (utilization: number) => {
    if (utilization <= 50) return '#10B981'
    if (utilization <= 75) return '#F59E0B'
    if (utilization <= 90) return '#EF4444'
    return '#DC2626'
  }

  const handleDelete = (queueId: string) => {
    setQueues(queues.filter(q => q.id !== queueId))
  }

  const handleEdit = (queueId: string) => {
    setEditingQueueId(queueId)
  }

  const handleSaveEdit = (updatedQueue: any, isDraft: boolean) => {
    const updatedQueues = queues.map(q => q.id === updatedQueue.id ? updatedQueue : q)
    setQueues(updatedQueues)
    setEditingQueueId(null)
    assignmentEngine.updateQueue(updatedQueue.id, updatedQueue)
  }

  const handleDuplicate = (queue: any) => {
    const newQueue = {
      ...queue,
      id: `queue-${Date.now()}`,
      queueCode: `${queue.queueCode}-COPY`,
      name: `${queue.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setQueues([...queues, newQueue])
  }

  const handleCreateQueue = (newQueue: any) => {
    setQueues([...queues, newQueue])
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedQueues = [...queues].sort((a: any, b: any) => {
    let aVal = a[sortColumn as keyof typeof a] || ''
    let bVal = b[sortColumn as keyof typeof b] || ''
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  return (
    <div className="p-8">
      <QueueDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreate={handleCreateQueue}
      />
      
      {editingQueueId && (
        <QueueEditDialog
          isOpen={!!editingQueueId}
          queue={queues.find(q => q.id === editingQueueId)}
          onClose={() => setEditingQueueId(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>Assignment Queues</h2>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Enterprise Queue Management • {queues.length} queues • {queues.reduce((sum, q) => sum + q.openTickets, 0)} open tickets</p>
        </div>
        <Button
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-4 h-4" />
          Create Queue
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b" style={{ borderColor: '#E2E0DC' }}>
        {[
          { id: 'general', label: 'Queues' },
          { id: 'capacity', label: 'Capacity' },
          { id: 'escalation', label: 'Escalation' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
              color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab: Queues Table */}
      {activeTab === 'general' && (
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>
                <button onClick={() => handleSort('name')} className="hover:text-blue-600">Queue Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Department</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Owner</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Members</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Open</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Capacity</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>SLA Risk</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Ver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Health</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedQueues.map((queue: any) => {
              const typeColor = getQueueTypeColor(queue.queueType)
              const healthColor = getHealthColor(queue.healthScore)
              const capacityColor = getCapacityColor(queue.capacityUtilization)
              
              return (
                <tr 
                  key={queue.id} 
                  style={{ borderBottom: '1px solid #E2E0DC' }}
                  className={selectedQueue === queue.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  onClick={() => setSelectedQueue(queue.id)}
                >
                  {/* Queue Name */}
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: '#0D3133' }}>{queue.name}</div>
                    <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{queue.description}</div>
                  </td>

                  {/* Queue Code */}
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs" style={{ color: '#6B6B6B' }}>{queue.queueCode}</span>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                    >
                      {queue.queueType}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                    {queue.department}
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>
                    {queue.owner}
                  </td>

                  {/* Members */}
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {queue.members.length}
                    </span>
                  </td>

                  {/* Open Tickets */}
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold" style={{ color: '#0D3133' }}>
                      {queue.openTickets}
                    </span>
                  </td>

                  {/* Capacity */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div style={{ width: '60px', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px' }}>
                        <div
                          style={{
                            width: `${queue.capacityUtilization}%`,
                            height: '100%',
                            backgroundColor: capacityColor,
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: '#6B6B6B' }}>
                        {queue.capacityUtilization}%
                      </span>
                    </div>
                  </td>

                  {/* SLA Risk */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-semibold" style={{ color: queue.slaRiskCount > 0 ? '#DC2626' : '#10B981' }}>
                      {queue.slaRiskCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: queue.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: queue.status === 'active' ? '#065F46' : '#991B1B',
                      }}
                    >
                      {queue.status}
                    </span>
                  </td>

                  {/* Version */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-mono" style={{ color: '#6B6B6B' }}>
                      v{queue.version}
                    </span>
                  </td>

                  {/* Health */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" style={{ color: healthColor.color }} />
                      <span className="text-xs font-semibold" style={{ color: healthColor.color }}>
                        {queue.healthScore}%
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                      <button
                        onClick={() => handleEdit(queue.id)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        title="Edit Queue"
                      >
                        <Edit2 className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDuplicate(queue)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(queue.id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Capacity Tab */}
      {activeTab === 'capacity' && (
        <div className="p-8 text-center" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.5rem' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>Queue Capacity Management</h3>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>Configure agent capacity, workload distribution, and capacity profiles for each queue. This functionality is available through individual queue settings.</p>
        </div>
      )}

      {/* Escalation Tab */}
      {activeTab === 'escalation' && (
        <div className="p-8 text-center" style={{ backgroundColor: '#F3F4F3', borderRadius: '0.5rem' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>Queue Escalation Rules</h3>
          <p className="text-sm" style={{ color: '#6B6B6B' }}>Define escalation policies, SLA thresholds, and escalation actions for each queue. Configure escalation paths and notifications in queue settings.</p>
        </div>
      )}

      {/* Empty State */}
      {queues.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>No queues created yet</h3>
          <p className="mb-4" style={{ color: '#6B6B6B' }}>Create your first queue to start managing ticket routing</p>
          <Button
            className="flex items-center gap-2 text-sm font-medium mx-auto"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="w-4 h-4" />
            Create First Queue
          </Button>
        </div>
      )}
    </div>
  )
}
