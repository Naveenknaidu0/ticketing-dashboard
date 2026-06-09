'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AvailabilityEditDialogProps {
  isOpen: boolean
  status?: any
  onClose: () => void
  onSave: (status: any) => void
}

export function AvailabilityEditDialog({ isOpen, status, onClose, onSave }: AvailabilityEditDialogProps) {
  const [formData, setFormData] = useState(status || { name: '', description: '', autoRevertTime: 60 })

  const handleSubmit = () => {
    onSave({ ...status, ...formData, updatedAt: new Date().toISOString() })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Availability Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: '#E69F50' }}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
