'use client'

import { useState } from 'react'
import { ChevronLeft, Edit2, Archive, Copy, Trash2, CheckCircle, AlertCircle, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RuleComplete } from '@/lib/types'
import { DEFAULT_RULES } from '@/lib/rule-engine'
import { RuleTestingSystem } from '@/components/rule-testing-system'
import { ConditionBuilder } from '@/components/condition-builder'
import { ActionBuilder } from '@/components/action-builder'

export default function RuleDetailPage({ params }: { params: { id: string } }) {
  const defaultRule = DEFAULT_RULES.find(r => r.id === params.id) || DEFAULT_RULES[0]
  const [rule, setRule] = useState<RuleComplete>(defaultRule)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'conditions' | 'actions' | 'testing' | 'audit'>('general')
  const [editedRule, setEditedRule] = useState<RuleComplete>(rule)

  const handleEditClick = () => {
    setEditedRule(rule)
    setIsEditing(true)
  }

  const handleSave = () => {
    setRule(editedRule)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedRule(rule)
    setIsEditing(false)
  }

  const displayRule = isEditing ? editedRule : rule

  return (
    <div className="p-8" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
            style={{ color: '#E69F50' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Rules
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedRule.name}
                  onChange={e => setEditedRule({ ...editedRule, name: e.target.value })}
                  className="text-3xl font-bold border rounded px-3 py-2 w-full"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                />
                <textarea
                  value={editedRule.description}
                  onChange={e => setEditedRule({ ...editedRule, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
                  rows={2}
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>
                  {rule.name}
                </h1>
                <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>
                  {rule.description}
                </p>
              </>
            )}
            
            <div className="flex items-center gap-4 mt-4">
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Category</span>
                <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{displayRule.category}</p>
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Priority</span>
                {isEditing ? (
                  <select
                    value={editedRule.priority}
                    onChange={e => setEditedRule({ ...editedRule, priority: parseInt(e.target.value) })}
                    className="mt-1 px-2 py-1 border rounded text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    <option value="1">P1</option>
                    <option value="2">P2</option>
                    <option value="3">P3</option>
                  </select>
                ) : (
                  <p className="font-medium text-sm" style={{ color: '#0D3133' }}>P{displayRule.priority}</p>
                )}
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Status</span>
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1"
                  style={{
                    backgroundColor: displayRule.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                    color: displayRule.status === 'active' ? '#065F46' : '#991B1B',
                  }}
                >
                  {displayRule.status === 'active' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {displayRule.status}
                </div>
              </div>
              <div>
                <span className="text-xs" style={{ color: '#9CA3AF' }}>Version</span>
                <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{displayRule.version}</p>
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
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-red-600"
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
      <div className="flex gap-0 mb-6 border-b" style={{ borderColor: '#E2E0DC' }}>
        {[
          { id: 'general', label: 'General' },
          { id: 'conditions', label: 'Conditions & Logic' },
          { id: 'actions', label: 'Actions' },
          { id: 'testing', label: 'Testing' },
          { id: 'audit', label: 'Audit Log' },
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

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Total Executions</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
                  {displayRule.totalExecutions}
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Success Rate</p>
                <p className="text-2xl font-bold mt-1" style={{ color: displayRule.successRate >= 95 ? '#10B981' : '#F59E0B' }}>
                  {displayRule.successRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Avg Execution Time</p>
                <p className="text-2xl font-bold mt-1" style={{ color: '#0D3133' }}>
                  {displayRule.averageExecutionTime}ms
                </p>
              </div>
              <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>Last Executed</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#0D3133' }}>
                  {displayRule.lastExecuted ? new Date(displayRule.lastExecuted).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Rule Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Created By</span>
                  <span style={{ color: '#0D3133' }}>{displayRule.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Created At</span>
                  <span style={{ color: '#0D3133' }}>{new Date(displayRule.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Last Updated By</span>
                  <span style={{ color: '#0D3133' }}>{displayRule.updatedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#9CA3AF' }}>Last Updated</span>
                  <span style={{ color: '#0D3133' }}>{new Date(displayRule.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Related Items</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Queues</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayRule.relatedQueues.length}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Skills</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayRule.relatedSkills.length}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>Automations</span>
                  <p className="font-medium" style={{ color: '#0D3133' }}>{displayRule.relatedAutomations.length}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>Triggers</h3>
              <div className="space-y-2">
                {displayRule.triggers.map(trigger => (
                  <div
                    key={trigger.id}
                    className="px-2 py-1 rounded text-xs bg-blue-100"
                    style={{ color: '#1E40AF' }}
                  >
                    {trigger.type}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <ConditionBuilder
          conditionGroups={editedRule.conditionGroups}
          onChange={groups => setEditedRule({ ...editedRule, conditionGroups: groups })}
        />
      )}

      {/* Actions Tab */}
      {activeTab === 'actions' && (
        <ActionBuilder
          actions={editedRule.actions}
          onChange={newActions => setEditedRule({ ...editedRule, actions: newActions })}
        />
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <RuleTestingSystem rule={displayRule} onTestResultsChange={() => {}} />
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: '#0D3133' }}>Audit History</h3>
          {displayRule.auditLog.length === 0 ? (
            <p style={{ color: '#9CA3AF' }}>No audit events recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {displayRule.auditLog.slice().reverse().map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg text-sm"
                  style={{ borderColor: '#E2E0DC' }}
                >
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
