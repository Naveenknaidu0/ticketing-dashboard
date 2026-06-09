'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ReportSaveViewModalProps {
  isOpen: boolean
  onClose: () => void
  reportTitle: string
}

export function ReportSaveViewModal({ isOpen, onClose, reportTitle }: ReportSaveViewModalProps) {
  const [viewName, setViewName] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const handleSave = () => {
    if (!viewName.trim()) {
      alert('Please enter a view name')
      return
    }
    console.log(`[v0] Saving view - Name: ${viewName}, Default: ${isDefault}`)
    // TODO: Implement actual save view functionality
    setViewName('')
    setIsDefault(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Current View</DialogTitle>
          <DialogDescription>
            Save this filter combination and preferences for quick access
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* View Name Input */}
          <div>
            <label className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
              View Name
            </label>
            <Input
              placeholder="e.g., This Week's Critical Issues"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              className="mt-2"
              style={{ borderColor: '#E2E0DC' }}
            />
            <p className="text-xs mt-2" style={{ color: '#6B6B6B' }}>
              Give this view a descriptive name to remember it later
            </p>
          </div>

          {/* Saved Elements Summary */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC' }}>
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>
              This view will save:
            </p>
            <ul className="text-xs mt-2 space-y-1" style={{ color: '#6B6B6B' }}>
              <li>• Applied filters (date range, group, agent, priority, status)</li>
              <li>• Chart preferences and view mode</li>
              <li>• Column selections in tables</li>
            </ul>
          </div>

          {/* Set as Default Option */}
          <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: '#E2E0DC' }}>
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="mr-3"
            />
            <div>
              <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                Set as default view
              </p>
              <p className="text-xs" style={{ color: '#6B6B6B' }}>
                Load this view when you access the report
              </p>
            </div>
          </label>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#E2E0DC' }}>
            <Button
              variant="outline"
              onClick={onClose}
              style={{
                borderColor: '#E2E0DC',
                color: '#6B6B6B',
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!viewName.trim()}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#0D3133',
                color: 'white',
                opacity: !viewName.trim() ? 0.5 : 1,
              }}
            >
              <Save className="w-4 h-4" />
              Save View
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
