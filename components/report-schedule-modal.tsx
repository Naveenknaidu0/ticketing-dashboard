'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ReportScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  reportTitle: string
}

export function ReportScheduleModal({ isOpen, onClose, reportTitle }: ReportScheduleModalProps) {
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly')
  const [recipients, setRecipients] = useState('myself')
  const [customEmail, setCustomEmail] = useState('')

  const handleSchedule = () => {
    console.log(`[v0] Scheduling ${reportTitle} - Frequency: ${frequency}, Recipients: ${recipients}`)
    // TODO: Implement actual scheduling functionality
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogDescription>
            Set up automated delivery of {reportTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Frequency Selection */}
          <div>
            <label className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
              Frequency
            </label>
            <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recipients Selection */}
          <div>
            <label className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
              Send To
            </label>
            <Select value={recipients} onValueChange={setRecipients}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="myself">Myself</SelectItem>
                <SelectItem value="manager">My Manager</SelectItem>
                <SelectItem value="team">My Team</SelectItem>
                <SelectItem value="custom">Custom Email</SelectItem>
              </SelectContent>
            </Select>

            {recipients === 'custom' && (
              <Input
                type="email"
                placeholder="Enter email address"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="mt-3"
                style={{ borderColor: '#E2E0DC' }}
              />
            )}
          </div>

          {/* Schedule Summary */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: '#F8F8F7', borderColor: '#E2E0DC' }}>
            <p className="text-xs font-medium" style={{ color: '#6B6B6B' }}>
              Summary
            </p>
            <p className="text-sm mt-2" style={{ color: '#1a1a1a' }}>
              Report will be sent <span className="font-medium">{frequency}</span> to{' '}
              <span className="font-medium">
                {recipients === 'myself'
                  ? 'your email'
                  : recipients === 'manager'
                    ? 'your manager'
                    : recipients === 'team'
                      ? 'your team'
                      : customEmail}
              </span>
            </p>
          </div>

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
              onClick={handleSchedule}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#0D3133',
                color: 'white',
              }}
            >
              <Calendar className="w-4 h-4" />
              Schedule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
