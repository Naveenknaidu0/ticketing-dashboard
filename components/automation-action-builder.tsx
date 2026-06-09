'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AutomationAction } from '@/lib/types'
import { AUTOMATION_ACTION_TYPES } from '@/lib/automation-engine'

interface AutomationActionBuilderProps {
  actions: AutomationAction[]
  onChange: (actions: AutomationAction[]) => void
}

export function AutomationActionBuilder({ actions, onChange }: AutomationActionBuilderProps) {
  const handleAddAction = () => {
    const newAction: AutomationAction = {
      id: `action-${Date.now()}`,
      name: AUTOMATION_ACTION_TYPES[0]?.name || 'New Action',
      type: AUTOMATION_ACTION_TYPES[0]?.id || 'assign-to-queue',
      category: AUTOMATION_ACTION_TYPES[0]?.category || 'ticket',
      parameters: {},
      stopAutomationProcessing: false,
      timeout: 30,
      retryOnFailure: false,
      maxRetries: 3,
    }
    onChange([...actions, newAction])
  }

  const handleRemoveAction = (actionId: string) => {
    onChange(actions.filter(a => a.id !== actionId))
  }

  const handleUpdateAction = (actionId: string, updates: Partial<AutomationAction>) => {
    onChange(actions.map(a => (a.id === actionId ? { ...a, ...updates } : a)))
  }

  const handleReorderActions = (fromIndex: number, toIndex: number) => {
    const newActions = [...actions]
    const [action] = newActions.splice(fromIndex, 1)
    newActions.splice(toIndex, 0, action)
    onChange(newActions)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: '#0D3133' }}>Automation Actions</h3>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleAddAction}
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Add Action
        </Button>
      </div>

      {actions.length === 0 ? (
        <p style={{ color: '#9CA3AF' }}>No actions configured. Add actions to execute when automation triggers.</p>
      ) : (
        <div className="space-y-2">
          {actions.map((action, idx) => (
            <div
              key={action.id}
              className="p-3 border rounded-lg"
              style={{ borderColor: '#E2E0DC' }}
            >
              <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 mt-1" style={{ color: '#9CA3AF' }} />
                <div className="flex-1 space-y-2">
                  <select
                    value={action.type}
                    onChange={e => {
                      const selectedAction = AUTOMATION_ACTION_TYPES.find(a => a.id === e.target.value)
                      handleUpdateAction(action.id, {
                        type: e.target.value,
                        name: selectedAction?.name || 'Action',
                        category: selectedAction?.category || action.category,
                      })
                    }}
                    className="w-full px-2 py-1 border rounded text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    {AUTOMATION_ACTION_TYPES.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 text-xs">
                    <span style={{ backgroundColor: '#F0FDF4', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                      {action.category}
                    </span>
                    <label style={{ color: '#9CA3AF' }}>
                      <input
                        type="checkbox"
                        checked={action.stopAutomationProcessing}
                        onChange={e => handleUpdateAction(action.id, { stopAutomationProcessing: e.target.checked })}
                        className="mr-1"
                      />
                      Stop Processing
                    </label>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveAction(action.id)}
                  className="p-1 hover:bg-red-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
