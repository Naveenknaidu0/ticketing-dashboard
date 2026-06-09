'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ReportExportModalProps {
  isOpen: boolean
  onClose: () => void
  reportTitle: string
}

export function ReportExportModal({ isOpen, onClose, reportTitle }: ReportExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')

  const handleExport = () => {
    console.log(`[v0] Exporting ${reportTitle} as ${selectedFormat.toUpperCase()}`)
    // TODO: Implement actual export functionality
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Report</DialogTitle>
          <DialogDescription>
            Choose a format to export {reportTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Options */}
          <div className="space-y-3">
            {[
              { id: 'pdf', label: 'PDF Document', desc: 'Formatted for printing' },
              { id: 'excel', label: 'Excel Spreadsheet', desc: 'Editable data format' },
              { id: 'csv', label: 'CSV File', desc: 'Raw data export' },
            ].map((format) => (
              <label
                key={format.id}
                className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: selectedFormat === format.id ? '#0D3133' : '#E2E0DC',
                  backgroundColor: selectedFormat === format.id ? '#F0F7F8' : 'white',
                }}
              >
                <input
                  type="radio"
                  name="format"
                  value={format.id}
                  checked={selectedFormat === format.id as any}
                  onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'excel' | 'csv')}
                  className="mr-3"
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                    {format.label}
                  </p>
                  <p className="text-xs" style={{ color: '#6B6B6B' }}>
                    {format.desc}
                  </p>
                </div>
              </label>
            ))}
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
              onClick={handleExport}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#0D3133',
                color: 'white',
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
