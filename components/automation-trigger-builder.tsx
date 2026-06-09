'use client'

import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AutomationTrigger } from '@/lib/types'
import { AUTOMATION_TRIGGERS } from '@/lib/automation-engine'

interface TriggerBuilderProps {
  triggers: AutomationTrigger[]
  onChange: (triggers: AutomationTrigger[]) => void
}

export function TriggerBuilder({ triggers, onChange }: TriggerBuilderProps) {
  const handleAddTrigger = () => {
    const newTrigger: AutomationTrigger = {
      id: `trigger-${Date.now()}`,
      type: AUTOMATION_TRIGGERS[0]?.id || 'ticket-created',
      conditions: {},
    }
    onChange([...triggers, newTrigger])
  }

  const handleRemoveTrigger = (triggerId: string) => {
    onChange(triggers.filter(t => t.id !== triggerId))
  }

  const handleUpdateTrigger = (triggerId: string, type: string) => {
    onChange(triggers.map(t => (t.id === triggerId ? { ...t, type } : t)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: '#0D3133' }}>Automation Triggers</h3>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleAddTrigger}
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Add Trigger
        </Button>
      </div>

      {triggers.length === 0 ? (
        <p style={{ color: '#9CA3AF' }}>No triggers configured. Automation will not execute.</p>
      ) : (
        <div className="space-y-2">
          {triggers.map((trigger, idx) => (
            <div
              key={trigger.id}
              className="p-3 border rounded-lg flex items-center gap-3"
              style={{ borderColor: '#E2E0DC' }}
            >
              <GripVertical className="w-4 h-4" style={{ color: '#9CA3AF' }} />
              <div className="flex-1">
                <select
                  value={trigger.type}
                  onChange={e => handleUpdateTrigger(trigger.id, e.target.value)}
                  className="w-full px-2 py-1 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  {AUTOMATION_TRIGGERS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                  {AUTOMATION_TRIGGERS.find(t => t.id === trigger.type)?.description}
                </p>
              </div>
              <button
                onClick={() => handleRemoveTrigger(trigger.id)}
                className="p-1 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
