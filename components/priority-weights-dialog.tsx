'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PriorityWeightsDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (model: any) => void
}

export function PriorityWeightsDialog({ isOpen, onClose, onCreate }: PriorityWeightsDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    skillMatch: 40,
    capacity: 30,
    availability: 20,
    queueMembership: 10,
  })

  const handleSubmit = () => {
    onCreate({ id: `model-${Date.now()}`, ...formData, status: 'active' })
    setFormData({ name: '', skillMatch: 40, capacity: 30, availability: 20, queueMembership: 10 })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Weight Model</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Model Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Skill Match: {formData.skillMatch}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.skillMatch}
              onChange={(e) => setFormData({ ...formData, skillMatch: parseInt(e.target.value) })}
              className="w-full"
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
