'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AvailabilityDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (status: any) => void
}

export function AvailabilityDialog({ isOpen, onClose, onCreate }: AvailabilityDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assignmentEligible: true,
    lowPriorityOnly: false,
    autoRevertTime: 60,
  })

  const handleSubmit = () => {
    const newStatus = {
      id: `status-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onCreate(newStatus)
    setFormData({ name: '', description: '', assignmentEligible: true, lowPriorityOnly: false, autoRevertTime: 60 })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Availability Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., On Break"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: '#E69F50' }}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
