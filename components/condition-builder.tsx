'use client'

import { Plus, Trash2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConditionGroup, RuleCondition } from '@/lib/types'
import { CONDITION_FIELDS } from '@/lib/rule-engine'

interface ConditionBuilderProps {
  conditionGroups: ConditionGroup[]
  onChange: (groups: ConditionGroup[]) => void
}

export function ConditionBuilder({ conditionGroups, onChange }: ConditionBuilderProps) {
  const handleAddGroup = () => {
    const newGroup: ConditionGroup = {
      id: `group-${Date.now()}`,
      logic: 'AND',
      conditions: [],
      nestedGroups: [],
    }
    onChange([...conditionGroups, newGroup])
  }

  const handleRemoveGroup = (groupId: string) => {
    onChange(conditionGroups.filter(g => g.id !== groupId))
  }

  const handleToggleLogic = (groupId: string) => {
    onChange(
      conditionGroups.map(g =>
        g.id === groupId ? { ...g, logic: g.logic === 'AND' ? 'OR' : 'AND' } : g
      )
    )
  }

  const handleAddCondition = (groupId: string) => {
    const newCondition: RuleCondition = {
      id: `cond-${Date.now()}`,
      field: 'ticket.priority',
      operator: 'equals',
      value: '',
      dataType: 'string',
    }
    onChange(
      conditionGroups.map(g =>
        g.id === groupId ? { ...g, conditions: [...g.conditions, newCondition] } : g
      )
    )
  }

  const handleUpdateCondition = (groupId: string, conditionId: string, updates: Partial<RuleCondition>) => {
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

  const handleRemoveCondition = (groupId: string, conditionId: string) => {
    onChange(
      conditionGroups.map(g =>
        g.id === groupId
          ? { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
          : g
      )
    )
  }

  return (
    <div className="space-y-4">
      {conditionGroups.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <p style={{ color: '#9CA3AF' }}>No condition groups. Rule will execute for all tickets.</p>
          <Button
            onClick={handleAddGroup}
            className="mt-4 flex items-center gap-2 mx-auto text-sm"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add Condition Group
          </Button>
        </div>
      ) : (
        <>
          {conditionGroups.map((group, groupIdx) => (
            <div key={group.id} className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: '#0D3133' }}>
                    Group {groupIdx + 1}
                  </span>
                  <button
                    onClick={() => handleToggleLogic(group.id)}
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: '#E69F50',
                      color: '#FFFFFF',
                    }}
                  >
                    {group.logic}
                  </button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveGroup(group.id)}
                  className="text-red-600 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {group.conditions.map((condition, condIdx) => (
                  <div key={condition.id} className="p-3 bg-white rounded border" style={{ borderColor: '#E2E0DC' }}>
                    <div className="grid grid-cols-5 gap-3 items-end">
                      <select
                        value={condition.field}
                        onChange={e => handleUpdateCondition(group.id, condition.id, { field: e.target.value })}
                        className="px-2 py-1 border rounded text-sm"
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
                        onChange={e => handleUpdateCondition(group.id, condition.id, { operator: e.target.value })}
                        className="px-2 py-1 border rounded text-sm"
                        style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                      >
                        {(() => {
                          const selectedField = CONDITION_FIELDS.find(f => f.id === condition.field)
                          return selectedField?.operators.map(op => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          )) || []
                        })()}
                      </select>

                      <input
                        type="text"
                        value={condition.value}
                        onChange={e => handleUpdateCondition(group.id, condition.id, { value: e.target.value })}
                        placeholder="Value"
                        className="px-2 py-1 border rounded text-sm col-span-2"
                        style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                      />

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveCondition(group.id, condition.id)}
                        className="text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleAddCondition(group.id)}
                variant="outline"
                className="mt-3 w-full text-sm"
                style={{ borderColor: '#E2E0DC', color: '#E69F50' }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Condition
              </Button>
            </div>
          ))}

          <Button
            onClick={handleAddGroup}
            className="w-full flex items-center gap-2 text-sm"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Add Condition Group
          </Button>
        </>
      )}
    </div>
  )
}
