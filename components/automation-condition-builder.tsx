'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConditionGroup } from '@/lib/types'
import { CONDITION_FIELDS } from '@/lib/rule-engine'

interface AutomationConditionBuilderProps {
  conditionGroups: ConditionGroup[]
  onChange: (groups: ConditionGroup[]) => void
}

export function AutomationConditionBuilder({ conditionGroups, onChange }: AutomationConditionBuilderProps) {
  const handleAddGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      logic: 'AND',
      conditions: [
        {
          id: `condition-${Date.now()}`,
          field: CONDITION_FIELDS[0]?.id || 'ticket.priority',
          operator: 'equals',
          value: '',
          customValue: undefined,
        },
      ],
    }
    onChange([...conditionGroups, newGroup])
  }

  const handleRemoveGroup = (groupId: string) => {
    onChange(conditionGroups.filter(g => g.id !== groupId))
  }

  const handleAddCondition = (groupId: string) => {
    onChange(
      conditionGroups.map(g =>
        g.id === groupId
          ? {
              ...g,
              conditions: [
                ...g.conditions,
                {
                  id: `condition-${Date.now()}`,
                  field: CONDITION_FIELDS[0]?.id || 'ticket.priority',
                  operator: 'equals',
                  value: '',
                  customValue: undefined,
                },
              ],
            }
          : g
      )
    )
  }

  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    onChange(
      conditionGroups.map(g =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
          : g
      )
    )
  }

  const handleUpdateCondition = (groupId: string, conditionId: string, updates: any) => {
    onChange(
      conditionGroups.map(g =>
        g.id === groupId
          ? {
              ...g,
              conditions: g.conditions.map(c =>
                c.id === conditionId ? { ...c, ...updates } : c
              ),
            }
          : g
      )
    )
  }

  const handleUpdateLogic = (groupId: string, logic: 'AND' | 'OR') => {
    onChange(conditionGroups.map(g => (g.id === groupId ? { ...g, logic } : g)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: '#0D3133' }}>Automation Conditions</h3>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleAddGroup}
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Add Condition Group
        </Button>
      </div>

      {conditionGroups.length === 0 ? (
        <p style={{ color: '#9CA3AF' }}>No conditions configured. Automation executes when triggers fire.</p>
      ) : (
        <div className="space-y-3">
          {conditionGroups.map((group, groupIdx) => (
            <div
              key={group.id}
              className="border rounded-lg p-4"
              style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: '#0D3133' }}>
                    Group {groupIdx + 1}
                  </span>
                  <select
                    value={group.logic}
                    onChange={e => handleUpdateLogic(group.id, e.target.value as 'AND' | 'OR')}
                    className="px-2 py-1 border rounded text-xs"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  >
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                  </select>
                </div>
                <button
                  onClick={() => handleRemoveGroup(group.id)}
                  className="p-1 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="space-y-2">
                {group.conditions.map((condition, condIdx) => (
                  <div
                    key={condition.id}
                    className="flex items-end gap-2 p-2 bg-white border rounded"
                    style={{ borderColor: '#E2E0DC' }}
                  >
                    <select
                      value={condition.field}
                      onChange={e =>
                        handleUpdateCondition(group.id, condition.id, { field: e.target.value })
                      }
                      className="px-2 py-1 border rounded text-xs flex-1"
                      style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                    >
                      {CONDITION_FIELDS.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>

                    <select
                      value={condition.operator}
                      onChange={e =>
                        handleUpdateCondition(group.id, condition.id, { operator: e.target.value })
                      }
                      className="px-2 py-1 border rounded text-xs"
                      style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                    >
                      {(() => {
                        const field = CONDITION_FIELDS.find(f => f.id === condition.field)
                        return field?.operators?.map(op => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        )) || []
                      })()}
                    </select>

                    <input
                      type="text"
                      value={condition.value}
                      onChange={e =>
                        handleUpdateCondition(group.id, condition.id, { value: e.target.value })
                      }
                      placeholder="Value"
                      className="px-2 py-1 border rounded text-xs flex-1"
                      style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                    />

                    <button
                      onClick={() => handleRemoveCondition(group.id, condition.id)}
                      className="p-1 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full text-xs"
                onClick={() => handleAddCondition(group.id)}
                style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Condition
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
