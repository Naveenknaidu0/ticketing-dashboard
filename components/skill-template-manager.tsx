'use client'

import { useState } from 'react'
import { Plus, Trash2, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillTemplateComprehensive } from '@/lib/types'

interface SkillTemplateManagerProps {
  templates: SkillTemplateComprehensive[]
  onTemplateCreate: (template: SkillTemplateComprehensive) => void
  onTemplateUse: (templateId: string) => void
}

const SAMPLE_TEMPLATES: SkillTemplateComprehensive[] = [
  {
    id: 'tmpl-l1-desk',
    name: 'L1 Service Desk Agent',
    description: 'Entry-level support agent with basic troubleshooting skills',
    category: 'Service Desk',
    role: 'l1-service-desk',
    skills: [],
    certifications: [],
    eligibility: { queuesEligible: [], rulesEligible: [], automationsEligible: [] },
    queueMapping: [],
    isActive: true,
    usageCount: 24,
    version: 1,
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-01',
  },
  {
    id: 'tmpl-l2-eng',
    name: 'L2 Support Engineer',
    description: 'Intermediate engineer with advanced troubleshooting capabilities',
    category: 'Engineering',
    role: 'l2-support',
    skills: [],
    certifications: [],
    eligibility: { queuesEligible: [], rulesEligible: [], automationsEligible: [] },
    queueMapping: [],
    isActive: true,
    usageCount: 18,
    version: 1,
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-01',
  },
  {
    id: 'tmpl-net-eng',
    name: 'Network Engineer',
    description: 'Specialist focused on network infrastructure and optimization',
    category: 'Infrastructure',
    role: 'network-engineer',
    skills: [],
    certifications: [],
    eligibility: { queuesEligible: [], rulesEligible: [], automationsEligible: [] },
    queueMapping: [],
    isActive: true,
    usageCount: 12,
    version: 1,
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-01',
  },
]

export function SkillTemplateManager({
  templates = SAMPLE_TEMPLATES,
  onTemplateCreate,
  onTemplateUse,
}: SkillTemplateManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    role: 'l1-service-desk' as const,
  })

  const handleCreateTemplate = () => {
    if (!formData.name) return

    const newTemplate: SkillTemplateComprehensive = {
      id: `tmpl-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: 'Custom',
      role: formData.role,
      skills: [],
      certifications: [],
      eligibility: { queuesEligible: [], rulesEligible: [], automationsEligible: [] },
      queueMapping: [],
      isActive: true,
      usageCount: 0,
      version: 1,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    }

    onTemplateCreate(newTemplate)
    setFormData({ name: '', description: '', role: 'l1-service-desk' })
    setShowCreateForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Existing Templates */}
      <div>
        <h3 className="font-semibold mb-4 text-lg" style={{ color: '#0D3133' }}>Skill Templates</h3>
        <div className="grid grid-cols-1 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="flex items-start justify-between p-4 border rounded-lg"
              style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}
            >
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1" style={{ color: '#0D3133' }}>
                  {template.name}
                </h4>
                <p className="text-xs mb-2" style={{ color: '#6B6B6B' }}>
                  {template.description}
                </p>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#9CA3AF' }}>
                  <span>Role: {template.role}</span>
                  <span>Used {template.usageCount} times</span>
                  <span>v{template.version}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={() => onTemplateUse(template.id)}
                  className="flex items-center gap-1 text-xs"
                  style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                >
                  <Copy className="w-3 h-3" />
                  Use
                </Button>
                <Button
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Template Form */}
      {!showCreateForm ? (
        <Button
          onClick={() => setShowCreateForm(true)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      ) : (
        <div className="border-t pt-4" style={{ borderColor: '#E2E0DC' }}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Template Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
                placeholder="e.g., L3 Specialist"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
                rows={2}
                placeholder="Describe this template..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0D3133' }}>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg"
                style={{ borderColor: '#E2E0DC' }}
              >
                <option value="l1-service-desk">L1 Service Desk</option>
                <option value="l2-support">L2 Support Engineer</option>
                <option value="l3-specialist">L3 Specialist</option>
                <option value="network-engineer">Network Engineer</option>
                <option value="security-analyst">Security Analyst</option>
                <option value="cloud-engineer">Cloud Engineer</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateTemplate}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium"
                style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
              >
                <Check className="w-4 h-4" />
                Create
              </Button>
              <Button
                onClick={() => {
                  setShowCreateForm(false)
                  setFormData({ name: '', description: '', role: 'l1-service-desk' })
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
