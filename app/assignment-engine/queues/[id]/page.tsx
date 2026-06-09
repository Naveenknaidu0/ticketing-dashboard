'use client'

import { useState } from 'react'
import { ArrowLeft, Users, Settings, BarChart3, AlertTriangle, Clock, GitBranch, FileText, History, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { assignmentEngine } from '@/lib/assignment-engine'

const TAB_ICONS: Record<string, any> = {
  overview: BarChart3,
  members: Users,
  capacity: Clock,
  skills: Settings,
  routing: GitBranch,
  escalations: AlertTriangle,
  templates: FileText,
  versions: History,
  audit: History,
}

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'members', label: 'Members' },
  { id: 'capacity', label: 'Capacity' },
  { id: 'skills', label: 'Skills' },
  { id: 'routing', label: 'Routing' },
  { id: 'escalations', label: 'Escalations' },
  { id: 'templates', label: 'Templates' },
  { id: 'versions', label: 'Versions' },
  { id: 'audit', label: 'Audit Log' },
]

export default function QueueDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const queue = assignmentEngine.getQueue(params.id)

  if (!queue) {
    return (
      <div className="p-8">
        <Link href="/assignment-engine/queues" className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-4 h-4" />
          Back to Queues
        </Link>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold" style={{ color: '#0D3133' }}>Queue not found</h2>
        </div>
      </div>
    )
  }

  const startEditing = (field: string, value: any) => {
    setEditingField(field)
    setEditValue(String(value))
  }

  const handleSave = () => {
    // In a real app, this would update the queue via assignmentEngine
    setEditingField(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Open Tickets</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#E69F50' }}>{queue.openTickets}</p>
              </div>
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Avg Wait Time</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#0D3133' }}>{queue.avgWaitTime}s</p>
              </div>
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Health Score</p>
                <p className="text-3xl font-bold mt-2" style={{ color: queue.healthScore >= 90 ? '#10B981' : '#EF4444' }}>{queue.healthScore}%</p>
              </div>
              <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>Capacity</p>
                <p className="text-3xl font-bold mt-2" style={{ color: '#0D3133' }}>{queue.capacityUtilization}%</p>
              </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Queue Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Queue Name</span>
                  <span style={{ color: '#0D3133' }}>{queue.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Queue Code</span>
                  <span className="font-mono text-sm" style={{ color: '#0D3133' }}>{queue.queueCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Type</span>
                  <span style={{ color: '#0D3133' }}>{queue.queueType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Department</span>
                  <span style={{ color: '#0D3133' }}>{queue.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Owner</span>
                  <span style={{ color: '#0D3133' }}>{queue.owner}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Status</span>
                  <span
                    className="px-3 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: queue.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                      color: queue.status === 'active' ? '#065F46' : '#991B1B',
                    }}
                  >
                    {queue.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'members':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold" style={{ color: '#0D3133' }}>Team Members ({queue.members.length})</h4>
              <Button
                className="flex items-center gap-2"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {queue.members.map((member) => (
                <div key={member.userId} className="p-4 rounded border flex items-center justify-between" style={{ borderColor: '#E2E0DC' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#0D3133' }}>{member.name}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>Role: {member.role.replace('-', ' ')}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                </div>
              ))}
            </div>
          </div>
        )

      case 'capacity':
        return (
          <div className="space-y-6">
            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Capacity Configuration</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max Open Tickets</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxOpenTickets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max Critical</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxCritical}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max High Priority</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxHigh}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max SLA Risk</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxSlaRisk}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max Daily Assignments</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxDailyAssignments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: '#6B6B6B' }}>Max Concurrent</span>
                  <span className="font-mono" style={{ color: '#0D3133' }}>{queue.capacity.maxConcurrent}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Current Utilization</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span style={{ color: '#6B6B6B' }}>Overall Capacity</span>
                    <span style={{ color: '#0D3133' }}>{queue.capacityUtilization}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${queue.capacityUtilization}%`,
                        height: '100%',
                        backgroundColor: queue.capacityUtilization > 80 ? '#EF4444' : '#10B981',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'skills':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold" style={{ color: '#0D3133' }}>Required Skills ({queue.skills.length})</h4>
              <Button
                className="flex items-center gap-2"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </Button>
            </div>
            <div className="space-y-2">
              {queue.skills.map((skill) => (
                <div key={skill.skillId} className="p-4 rounded border" style={{ borderColor: '#E2E0DC' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#0D3133' }}>{skill.skillName}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>Min Level: {skill.minimumLevel} • {skill.required ? 'Required' : 'Optional'}</p>
                    </div>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'routing':
        return (
          <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Assignment Strategy</h4>
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9FAFB' }}>
              <p className="text-2xl font-bold" style={{ color: '#E69F50' }}>
                {queue.assignmentStrategy.toUpperCase().replace('-', ' ')}
              </p>
              <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
                Tickets are assigned to agents using this strategy.
              </p>
            </div>
          </div>
        )

      case 'escalations':
        return (
          <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
            <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Escalation Rules</h4>
            {queue.escalation.escalationQueue ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: '#6B6B6B' }}>Escalation Queue</span>
                  <span style={{ color: '#0D3133' }}>{queue.escalation.escalationQueue}</span>
                </div>
                {queue.escalation.escalationOwner && (
                  <div className="flex justify-between">
                    <span style={{ color: '#6B6B6B' }}>Escalation Owner</span>
                    <span style={{ color: '#0D3133' }}>{queue.escalation.escalationOwner}</span>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#9CA3AF' }}>No escalation rules configured</p>
            )}
          </div>
        )

      case 'templates':
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold" style={{ color: '#0D3133' }}>Associated Templates</h4>
              <Button
                className="flex items-center gap-2"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Plus className="w-4 h-4" />
                Link Template
              </Button>
            </div>
            {queue.templateIds.length === 0 ? (
              <p style={{ color: '#9CA3AF' }}>No templates associated with this queue</p>
            ) : (
              <div className="space-y-2">
                {queue.templateIds.map((templateId) => (
                  <div key={templateId} className="p-4 rounded border flex items-center justify-between" style={{ borderColor: '#E2E0DC' }}>
                    <span style={{ color: '#0D3133' }}>{templateId}</span>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'versions':
        return (
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Version History (v{queue.version})</h4>
            <div className="space-y-2">
              <div className="p-4 rounded border bg-blue-50" style={{ borderColor: '#E2E0DC' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: '#0D3133' }}>v{queue.version} - Current</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>Published on {new Date(queue.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'audit':
        return (
          <div>
            <h4 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Audit Log</h4>
            <div className="space-y-2">
              <div className="p-4 rounded border" style={{ borderColor: '#E2E0DC' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: '#0D3133' }}>Queue Created</p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>by {queue.createdBy} on {new Date(queue.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <Link href="/assignment-engine/queues" className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700">
        <ArrowLeft className="w-4 h-4" />
        Back to Queues
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>{queue.name}</h1>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>{queue.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
        {TABS.map((tab) => {
          const Icon = TAB_ICONS[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
                color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>{renderTabContent()}</div>
    </div>
  )
}
