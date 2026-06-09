'use client'

import { useState } from 'react'
import { Plus, Trash2, Check, X, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillCertification } from '@/lib/types'

interface CertificationManagerProps {
  certifications: SkillCertification[]
  onCertificationChange: (certs: SkillCertification[]) => void
}

const SAMPLE_CERTIFICATION_PROVIDERS = [
  { id: 'cert-microsoft', name: 'Microsoft' },
  { id: 'cert-cisco', name: 'Cisco' },
  { id: 'cert-aws', name: 'Amazon Web Services' },
  { id: 'cert-google', name: 'Google Cloud' },
  { id: 'cert-isc2', name: 'ISC(2)' },
  { id: 'cert-comptia', name: 'CompTIA' },
]

const SAMPLE_CERTIFICATIONS = [
  { id: 'azure-admin', name: 'Azure Administrator', provider: 'Microsoft' },
  { id: 'cisco-ccna', name: 'Cisco CCNA', provider: 'Cisco' },
  { id: 'aws-sol-arch', name: 'AWS Solutions Architect', provider: 'Amazon Web Services' },
  { id: 'aws-security', name: 'AWS Security Specialty', provider: 'Amazon Web Services' },
  { id: 'google-cloud-pro', name: 'Google Cloud Professional', provider: 'Google Cloud' },
  { id: 'cissp', name: 'CISSP', provider: 'ISC(2)' },
  { id: 'cism', name: 'CISM', provider: 'ISACA' },
]

export function CertificationManager({
  certifications = [],
  onCertificationChange,
}: CertificationManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    issueDate: '',
    expiryDate: '',
    isRequired: false,
  })

  const handleAddCertification = () => {
    if (!formData.name || !formData.provider) return

    const newCert: SkillCertification = {
      id: `cert-${Date.now()}`,
      skillId: '',
      name: formData.name,
      provider: formData.provider,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      isRequired: formData.isRequired,
      isOptional: !formData.isRequired,
      createdAt: new Date().toISOString(),
    }

    onCertificationChange([...certifications, newCert])
    setFormData({ name: '', provider: '', issueDate: '', expiryDate: '', isRequired: false })
    setShowAddForm(false)
  }

  const handleRemoveCertification = (certId: string) => {
    onCertificationChange(certifications.filter(c => c.id !== certId))
  }

  const handleToggleRequired = (certId: string) => {
    onCertificationChange(
      certifications.map(c =>
        c.id === certId ? { ...c, isRequired: !c.isRequired, isOptional: c.isRequired } : c
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Certifications List */}
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2" style={{ color: '#0D3133' }}>
          <Award className="w-4 h-4" />
          Certifications ({certifications.length})
        </h4>

        {certifications.length === 0 ? (
          <p className="text-sm" style={{ color: '#9CA3AF' }}>No certifications defined yet</p>
        ) : (
          <div className="space-y-2">
            {certifications.map(cert => (
              <div
                key={cert.id}
                className="flex items-center justify-between p-3 border rounded-lg"
                style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: '#0D3133' }}>
                    {cert.name}
                  </p>
                  <p className="text-xs" style={{ color: '#6B6B6B' }}>
                    {cert.provider}
                    {cert.isRequired && (
                      <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">Required</span>
                    )}
                    {cert.expiryDate && (
                      <span className="ml-2">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveCertification(cert.id)}
                  className="p-2 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Certification Form */}
      {!showAddForm ? (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </Button>
      ) : (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Certification *</label>
              <select
                value={formData.name}
                onChange={(e) => {
                  const cert = SAMPLE_CERTIFICATIONS.find(c => c.id === e.target.value)
                  if (cert) {
                    setFormData({ ...formData, name: cert.name, provider: cert.provider })
                  }
                }}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="">Select certification...</option>
                {SAMPLE_CERTIFICATIONS.map(cert => (
                  <option key={cert.id} value={cert.id}>
                    {cert.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Provider</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
                placeholder="e.g., Microsoft"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Issue Date</label>
                <input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  style={{ borderColor: '#E2E0DC' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRequired"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isRequired" className="text-sm" style={{ color: '#0D3133' }}>
                This certification is required
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddCertification}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Check className="w-4 h-4" />
                Add
              </Button>
              <Button
                onClick={() => {
                  setShowAddForm(false)
                  setFormData({ name: '', provider: '', issueDate: '', expiryDate: '', isRequired: false })
                }}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
