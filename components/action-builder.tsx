'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RuleAction } from '@/lib/types'
import { RULE_ACTION_TYPES } from '@/lib/rule-engine'

interface ActionBuilderProps {
  actions: RuleAction[]
  onChange: (actions: RuleAction[]) => void
}

export function ActionBuilder({ actions, onChange }: ActionBuilderProps) {
  const handleAddAction = () => {
    const newAction: RuleAction = {
      id: `action-${Date.now()}`,
      type: 'assign-to-agent',
      name: 'Assign to Agent',
      order: actions.length + 1,
      parameters: {},
      executeImmediately: true,
      stopRuleProcessing: false,
    }
    onChange([...actions, newAction])
  }

  const handleRemoveAction = (actionId: string) => {
    onChange(actions.filter(a => a.id !== actionId))
  }

  const handleUpdateAction = (actionId: string, updates: Partial<RuleAction>) => {
    onChange(
      actions.map(a => (a.id === actionId ? { ...a, ...updates } : a))
    )
  }

  const handleReorderActions = (fromIdx: number, toIdx: number) => {
    const newActions = [...actions]
    const [moved] = newActions.splice(fromIdx, 1)
    newActions.splice(toIdx, 0, moved)
    onChange(newActions.map((a, idx) => ({ ...a, order: idx + 1 })))
  }

  return (
    <div className="space-y-4">
      {actions.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <p style={{ color: '#9CA3AF' }}>No actions configured. No operations will be performed.</p>
          <Button
            onClick={handleAddAction}
            className="mt-4 flex items-center gap-2 mx-auto text-sm"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add Action
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {actions.map((action, idx) => (
              <div
                key={action.id}
                className="p-4 border rounded-lg flex items-center gap-3"
                style={{ borderColor: '#E2E0DC' }}
              >
                <div className="flex gap-2">
                  {idx > 0 && (
                    <button
                      onClick={() => handleReorderActions(idx, idx - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      ↑
                    </button>
                  )}
                  {idx < actions.length - 1 && (
                    <button
                      onClick={() => handleReorderActions(idx, idx + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      ↓
                    </button>
                  )}
                </div>

                <div className="flex-1">
                  <div className="grid grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="text-xs" style={{ color: '#9CA3AF' }}>
                        Action Type
                      </label>
                      <select
                        value={action.type}
                        onChange={e =>
                          handleUpdateAction(action.id, { type: e.target.value as any })
                        }
                        className="w-full px-2 py-1 border rounded text-sm mt-1"
                        style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                      >
                        {RULE_ACTION_TYPES.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs" style={{ color: '#9CA3AF' }}>
                        Name
                      </label>
                      <input
                        type="text"
                        value={action.name}
                        onChange={e => handleUpdateAction(action.id, { name: e.target.value })}
                        className="w-full px-2 py-1 border rounded text-sm mt-1"
                        style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-xs" style={{ color: '#9CA3AF' }}>
                        <input
                          type="checkbox"
                          checked={action.stopRuleProcessing}
                          onChange={e =>
                            handleUpdateAction(action.id, { stopRuleProcessing: e.target.checked })
                          }
                          className="mr-1"
                        />
                        Stop Processing
                      </label>
                    </div>

                    <div className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveAction(action.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddAction}
            className="w-full flex items-center gap-2 text-sm"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add Action
          </Button>
        </>
      )}
    </div>
  )
}
