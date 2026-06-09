'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Plus, Trash2, X, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RuleComplete, RuleTrigger, ConditionGroup, RuleAction, RuleExecutionConfig } from '@/lib/types'
import {
  DEFAULT_RULE_TRIGGERS,
  CONDITION_FIELDS,
  RULE_ACTION_TYPES,
  RULE_CATEGORIES,
  EXECUTION_STRATEGIES,
  CONDITION_OPERATORS,
} from '@/lib/rule-engine'

interface RuleWizardProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rule: RuleComplete) => void
  existingRule?: RuleComplete
}

export function RuleConfigurationWizard({ isOpen, onClose, onSave, existingRule }: RuleWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: existingRule?.name || '',
    description: existingRule?.description || '',
    category: existingRule?.category || 'routing',
    priority: existingRule?.priority || 1,
  })
  const [triggers, setTriggers] = useState<RuleTrigger[]>(existingRule?.triggers || [])
  const [conditionGroups, setConditionGroups] = useState<ConditionGroup[]>(existingRule?.conditionGroups || [])
  const [actions, setActions] = useState<RuleAction[]>(existingRule?.actions || [])
  const [executionConfig, setExecutionConfig] = useState<RuleExecutionConfig>(
    existingRule?.executionConfig || {
      strategy: 'first-match',
      maxActionsPerRule: 5,
      continueOnError: false,
      parallelExecution: false,
      timeoutSeconds: 5,
      rollbackOnError: true,
    }
  )

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSave = () => {
    const newRule: RuleComplete = {
      id: existingRule?.id || `rule-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: existingRule?.status || 'draft',
      triggers,
      conditionGroups,
      actions,
      executionConfig,
      enabled: existingRule?.enabled || false,
      relatedQueues: existingRule?.relatedQueues || [],
      relatedSkills: existingRule?.relatedSkills || [],
      relatedAutomations: existingRule?.relatedAutomations || [],
      dependentRules: existingRule?.dependentRules || [],
      testCases: existingRule?.testCases || [],
      lastTestResults: existingRule?.lastTestResults || [],
      testCoverage: existingRule?.testCoverage || 0,
      totalExecutions: existingRule?.totalExecutions || 0,
      successfulExecutions: existingRule?.successfulExecutions || 0,
      failedExecutions: existingRule?.failedExecutions || 0,
      successRate: existingRule?.successRate || 100,
      averageExecutionTime: existingRule?.averageExecutionTime || 0,
      version: (existingRule?.version || 0) + 1,
      versionHistory: existingRule?.versionHistory || [],
      auditLog: existingRule?.auditLog || [],
      createdBy: existingRule?.createdBy || 'admin',
      createdAt: existingRule?.createdAt || new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    }
    onSave(newRule)
    onClose()
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Rule Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., High Priority VIP Fast Track"
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this rule does..."
                className="w-full px-3 py-2 border rounded-lg h-24"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  {RULE_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(p => (
                    <option key={p} value={p}>Priority {p}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Rule Triggers</label>
              <div className="space-y-2">
                {DEFAULT_RULE_TRIGGERS.map(trigger => (
                  <label key={trigger.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50" style={{ borderColor: '#E2E0DC' }}>
                    <input
                      type="checkbox"
                      checked={triggers.some(t => t.id === trigger.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setTriggers([...triggers, trigger])
                        } else {
                          setTriggers(triggers.filter(t => t.id !== trigger.id))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-medium text-sm" style={{ color: '#0D3133' }}>{trigger.description}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>{trigger.type}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={{ color: '#0D3133' }}>Conditions (AND Logic)</label>
              <button
                onClick={() => {
                  const newGroup: ConditionGroup = {
                    id: `group-${Date.now()}`,
                    logic: 'AND',
                    conditions: [],
                    nestedGroups: [],
                  }
                  setConditionGroups([...conditionGroups, newGroup])
                }}
                className="text-sm flex items-center gap-1"
                style={{ color: '#E69F50' }}
              >
                <Plus className="w-4 h-4" />
                Add Condition Group
              </button>
            </div>
            
            {conditionGroups.length === 0 ? (
              <p className="text-sm text-gray-500">No conditions. The rule will execute for all tickets.</p>
            ) : (
              <div className="space-y-3">
                {conditionGroups.map((group, idx) => (
                  <div key={group.id} className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                    <div className="flex items-center justify-between mb-2">
                      <select
                        value={group.logic}
                        onChange={e => {
                          const updated = [...conditionGroups]
                          updated[idx].logic = e.target.value as 'AND' | 'OR'
                          setConditionGroups(updated)
                        }}
                        className="px-2 py-1 border rounded text-sm"
                        style={{ borderColor: '#E2E0DC' }}
                      >
                        <option>AND</option>
                        <option>OR</option>
                      </select>
                      <button
                        onClick={() => setConditionGroups(conditionGroups.filter((_, i) => i !== idx))}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Configure individual conditions within this group</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium" style={{ color: '#0D3133' }}>Rule Actions</label>
              <button
                onClick={() => {
                  const newAction: RuleAction = {
                    id: `action-${Date.now()}`,
                    type: 'assign-to-queue',
                    name: 'New Action',
                    parameters: {},
                    executeImmediately: true,
                    stopRuleProcessing: false,
                  }
                  setActions([...actions, newAction])
                }}
                className="text-sm flex items-center gap-1"
                style={{ color: '#E69F50' }}
              >
                <Plus className="w-4 h-4" />
                Add Action
              </button>
            </div>

            {actions.length === 0 ? (
              <p className="text-sm text-gray-500">No actions configured. Add actions to define what happens when the rule matches.</p>
            ) : (
              <div className="space-y-3">
                {actions.map((action, idx) => (
                  <div key={action.id} className="p-3 border rounded-lg flex items-center justify-between" style={{ borderColor: '#E2E0DC' }}>
                    <div>
                      <div className="font-medium text-sm" style={{ color: '#0D3133' }}>{action.name}</div>
                      <div className="text-xs" style={{ color: '#9CA3AF' }}>{action.type}</div>
                    </div>
                    <button
                      onClick={() => setActions(actions.filter((_, i) => i !== idx))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Execution Strategy</label>
              <select
                value={executionConfig.strategy}
                onChange={e => setExecutionConfig({ ...executionConfig, strategy: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg mb-2"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              >
                <option value="first-match">First Match</option>
                <option value="last-match">Last Match</option>
                <option value="execute-all">Execute All</option>
                <option value="stop-after-first-success">Stop After First Success</option>
                <option value="weighted-priority">Weighted Priority</option>
              </select>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                Choose how the system evaluates and executes rules
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Max Actions per Rule</label>
              <input
                type="number"
                value={executionConfig.maxActionsPerRule}
                onChange={e => setExecutionConfig({ ...executionConfig, maxActionsPerRule: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: '#0D3133' }}>
                <input
                  type="checkbox"
                  checked={executionConfig.continueOnError}
                  onChange={e => setExecutionConfig({ ...executionConfig, continueOnError: e.target.checked })}
                  className="w-4 h-4"
                />
                Continue on Error
              </label>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: '#0D3133' }}>
                <input
                  type="checkbox"
                  checked={executionConfig.parallelExecution}
                  onChange={e => setExecutionConfig({ ...executionConfig, parallelExecution: e.target.checked })}
                  className="w-4 h-4"
                />
                Parallel Execution
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0D3133' }}>Timeout (seconds)</label>
              <input
                type="number"
                value={executionConfig.timeoutSeconds}
                onChange={e => setExecutionConfig({ ...executionConfig, timeoutSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: '#0D3133' }}>
                <input
                  type="checkbox"
                  checked={executionConfig.rollbackOnError}
                  onChange={e => setExecutionConfig({ ...executionConfig, rollbackOnError: e.target.checked })}
                  className="w-4 h-4"
                />
                Rollback on Error
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    const titles = [
      'General Information',
      'Rule Triggers',
      'Conditions',
      'Actions',
      'Execution Settings',
    ]
    return titles[currentStep - 1]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" style={{ backgroundColor: '#FFFFFF' }}>
        <DialogHeader>
          <DialogTitle style={{ color: '#0D3133' }}>
            {existingRule ? 'Edit Rule' : 'Create Rule'} - Step {currentStep} of 5
          </DialogTitle>
          <DialogDescription style={{ color: '#6B6B6B' }}>
            {getStepTitle()}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ color: '#E69F50' }}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(step => (
              <div
                key={step}
                className="w-2 h-2 rounded-full transition-colors"
                style={{
                  backgroundColor: step <= currentStep ? '#E69F50' : '#E2E0DC',
                }}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep === 5 && (
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#10B981' }}
              >
                Save Rule
              </button>
            )}
            {currentStep < 5 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#E69F50' }}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
