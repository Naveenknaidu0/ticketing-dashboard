'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Edit2, Archive, Copy, Trash2, CheckCircle, AlertCircle, Save, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AutomationComplete } from '@/lib/types'
import { DEFAULT_AUTOMATIONS, AUTOMATION_CATEGORIES } from '@/lib/automation-engine'
import { TriggerBuilder } from '@/components/automation-trigger-builder'
import { AutomationConditionBuilder } from '@/components/automation-condition-builder'
import { AutomationActionBuilder } from '@/components/automation-action-builder'
import { AutomationTestingSystem } from '@/components/automation-testing-system'

export default function AutomationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const defaultAutomation = DEFAULT_AUTOMATIONS.find(a => a.id === params.id) || DEFAULT_AUTOMATIONS[0]
  const [automation, setAutomation] = useState<AutomationComplete>(defaultAutomation)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'triggers' | 'conditions' | 'actions' | 'execution' | 'testing' | 'audit'>('general')
  const [editedAutomation, setEditedAutomation] = useState<AutomationComplete>(automation)

  const handleCloneAutomation = () => {
    console.log('[v0] Cloning automation:', automation.id)
  }

  const handleArchive = () => {
    console.log('[v0] Archiving automation:', automation.id)
  }

  const handleDelete = () => {
    console.log('[v0] Deleting automation:', automation.id)
  }

  const handleEditClick = () => {
    setEditedAutomation(automation)
    setIsEditing(true)
  }

  const handleSave = () => {
    setAutomation(editedAutomation)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedAutomation(automation)
    setIsEditing(false)
  }

  const displayAutomation = isEditing ? editedAutomation : automation
  const categoryColor = AUTOMATION_CATEGORIES.find(c => c.id === displayAutomation.category)?.color || '#6B7280'

  return (
    <div className="p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/assignment-engine/automations')}
            className="flex items-center gap-2"
            style={{ color: '#E69F50' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Automations
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedAutomation.name}
                  onChange={e => setEditedAutomation({ ...editedAutomation, name: e.target.value })}
                  className="text-3xl font-bold border rounded px-3 py-2 w-full"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                />
                <textarea
                  value={editedAutomation.description}
                  onChange={e => setEditedAutomation({ ...editedAutomation, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>
                  {automation.name}
                </h1>
                <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
                  {automation.description}
                </p>
              </>
            )}
            
            <div className="flex items-center gap-4 mt-4">
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Category</span>
                {isEditing ? (
                  <select
                    value={editedAutomation.category}
                    onChange={e => setEditedAutomation({ ...editedAutomation, category: e.target.value })}
                    className="mt-1 px-2 py-1 border rounded text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    {AUTOMATION_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                ) : (
                  <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{displayAutomation.category}</p>
                )}
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Priority</span>
                {isEditing ? (
                  <select
                    value={editedAutomation.priority}
                    onChange={e => setEditedAutomation({ ...editedAutomation, priority: parseInt(e.target.value) })}
                    className="mt-1 px-2 py-1 border rounded text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    <option value="1">P1</option>
                    <option value="2">P2</option>
                    <option value="3">P3</option>
                  </select>
                ) : (
                  <p className="font-medium text-sm" style={{ color: '#0D3133' }}>P{displayAutomation.priority}</p>
                )}
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Status</span>
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1"
                  style={{
                    backgroundColor: displayAutomation.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                    color: displayAutomation.status === 'active' ? '#065F46' : '#991B1B',
                  }}
                >
                  {displayAutomation.status === 'active' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {displayAutomation.status}
                </div>
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Version</span>
                <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{displayAutomation.version}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleSave}
                  style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleCancel}
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleCloneAutomation}
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  <Copy className="w-4 h-4" />
                  Clone
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleEditClick}
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={handleArchive}
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-red-600"
                  onClick={handleDelete}
                  style={{ borderColor: '#E2E0DC' }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
        {[
          { id: 'general', label: 'General' },
          { id: 'triggers', label: 'Triggers' },
          { id: 'conditions', label: 'Conditions' },
          { id: 'actions', label: 'Actions' },
          { id: 'execution', label: 'Execution' },
          { id: 'testing', label: 'Testing' },
          { id: 'audit', label: 'Audit Log' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            style={{
              borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
              color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Total Executions</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
                  {displayAutomation.totalExecutions}
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Success Rate</p>
                <p className="text-2xl font-bold mt-1" style={{ color: displayAutomation.successRate >= 95 ? '#10B981' : '#F59E0B' }}>
                  {displayAutomation.successRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Tasks Created</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
                  {displayAutomation.tasksCreated}
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Last Executed</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#0D3133' }}>
                  {displayAutomation.lastExecuted ? new Date(displayAutomation.lastExecuted).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Automation Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Created By</span>
                  <span style={{ color: '#0D3133' }}>{displayAutomation.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Created At</span>
                  <span style={{ color: '#0D3133' }}>{new Date(displayAutomation.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Last Updated By</span>
                  <span style={{ color: '#0D3133' }}>{displayAutomation.updatedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Last Updated</span>
                  <span style={{ color: '#0D3133' }}>{new Date(displayAutomation.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Configuration</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Triggers</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayAutomation.triggers.length}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Conditions</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayAutomation.conditionGroups.length}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Actions</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayAutomation.actions.length}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Enabled</span>
                  <p className="font-medium" style={{ color: displayAutomation.enabled ? '#10B981' : '#F59E0B' }}>
                    {displayAutomation.enabled ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Triggers Tab */}
      {activeTab === 'triggers' && (
        <TriggerBuilder
          triggers={editedAutomation.triggers}
          onChange={triggers => setEditedAutomation({ ...editedAutomation, triggers })}
        />
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <AutomationConditionBuilder
          conditionGroups={editedAutomation.conditionGroups}
          onChange={groups => setEditedAutomation({ ...editedAutomation, conditionGroups: groups })}
        />
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <AutomationActionBuilder
          actions={editedAutomation.actions}
          onChange={newActions => setEditedAutomation({ ...editedAutomation, actions: newActions })}
        />
      )}

      {/* Execution Tab */}
      {activeTab === 'execution' && (
        <div className="space-y-4">
          <h3 className="font-semibold" style={{ color: '#0D3133' }}>Execution Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>Execution Strategy</p>
              <p className="font-medium mt-1" style={{ color: '#0D3133' }}>{displayAutomation.executionConfig.strategy}</p>
            </div>
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>Max Actions</p>
              <p className="font-medium mt-1" style={{ color: '#0D3133' }}>{displayAutomation.executionConfig.maxActionsPerAutomation}</p>
            </div>
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>Timeout</p>
              <p className="font-medium mt-1" style={{ color: '#0D3133' }}>{displayAutomation.executionConfig.timeoutSeconds}s</p>
            </div>
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>Continue on Error</p>
              <p className="font-medium mt-1" style={{ color: displayAutomation.executionConfig.continueOnError ? '#10B981' : '#F59E0B' }}>
                {displayAutomation.executionConfig.continueOnError ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <AutomationTestingSystem automation={displayAutomation} onTestResultsChange={() => {}} />
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: '#0D3133' }}>Audit History</h3>
          {displayAutomation.auditLog.length === 0 ? (
            <p style={{ color: '#9CA3AF' }}>No audit events recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {displayAutomation.auditLog.slice().reverse().map((event) => (
                <div key={event.id} className="p-3 border rounded-lg text-sm" style={{ borderColor: '#E2E0DC' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium" style={{ color: '#0D3133' }}>
                        {event.eventType}: {event.whoName}
                      </p>
                      <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        {new Date(event.when).toLocaleString()}
                      </p>
                      {event.details && (
                        <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>
                          {event.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
