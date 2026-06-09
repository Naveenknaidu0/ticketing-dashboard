'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface EligibilityEditDialogProps {
  isOpen: boolean
  rule?: any
  onClose: () => void
  onSave: (rule: any) => void
}

export function EligibilityEditDialog({ isOpen, rule, onClose, onSave }: EligibilityEditDialogProps) {
  const [formData, setFormData] = useState(rule || { name: '', condition: '' })

  const handleSubmit = () => {
    onSave({ ...rule, ...formData })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Eligibility Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Rule Name</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <Label>Condition</Label>
            <Input value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: '#E69F50' }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
