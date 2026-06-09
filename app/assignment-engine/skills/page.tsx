'use client'

import { useState } from 'react'
import { Plus, Download, Upload, Copy, Edit2, Trash2, Eye, MoreVertical, CheckCircle, AlertCircle, Clock, Zap, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillConfigurationModal } from '@/components/skill-configuration-modal'
import { SkillComplete } from '@/lib/types'
import { skillToListItem, exportSkillsToJSON, importSkillsFromJSON, getCategoryColor, SKILL_CATEGORIES } from '@/lib/skill-engine'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Sample comprehensive skills data
const DEFAULT_SKILLS: SkillComplete[] = [
  {
    id: 'skill-1',
    code: 'NETWORK_ENG',
    name: 'Network Engineering',
    description: 'Network infrastructure design, deployment and management',
    category: 'cat-network',
    levelModel: [
      { id: 'l1', skillId: 'skill-1', name: 'Beginner', description: 'Entry-level', requirements: [], order: 1, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l2', skillId: 'skill-1', name: 'Intermediate', description: 'Intermediate capability', requirements: [], order: 2, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l3', skillId: 'skill-1', name: 'Advanced', description: 'Advanced capability', requirements: [], order: 3, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l4', skillId: 'skill-1', name: 'Expert', description: 'Expert level', requirements: [], order: 4, isActive: true, createdAt: '', updatedAt: '' },
    ],
    defaultLevelCount: 4,
    certifications: [],
    assignedUsers: [],
    totalAssignedUsers: 12,
    eligibility: {} as any,
    queueMappings: [],
    relatedQueues: 3,
    ruleMappings: [],
    relatedRules: 5,
    automationMappings: [],
    relatedAutomations: 2,
    usageAnalytics: {} as any,
    status: 'active',
    version: 1,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-01',
  },
  {
    id: 'skill-2',
    code: 'SECURITY_OPS',
    name: 'Security Operations',
    description: 'Security incident response and threat management',
    category: 'cat-security',
    levelModel: [
      { id: 'l1', skillId: 'skill-2', name: 'L1 Analyst', description: 'Entry level analyst', requirements: [], order: 1, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l2', skillId: 'skill-2', name: 'L2 Analyst', description: 'Intermediate analyst', requirements: [], order: 2, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l3', skillId: 'skill-2', name: 'L3 Specialist', description: 'Senior specialist', requirements: [], order: 3, isActive: true, createdAt: '', updatedAt: '' },
    ],
    defaultLevelCount: 3,
    certifications: [],
    assignedUsers: [],
    totalAssignedUsers: 8,
    eligibility: {} as any,
    queueMappings: [],
    relatedQueues: 2,
    ruleMappings: [],
    relatedRules: 4,
    automationMappings: [],
    relatedAutomations: 1,
    usageAnalytics: {} as any,
    status: 'active',
    version: 2,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-15',
  },
  {
    id: 'skill-3',
    code: 'CLOUD_ARCH',
    name: 'Cloud Architecture',
    description: 'Cloud infrastructure design and optimization',
    category: 'cat-cloud',
    levelModel: [
      { id: 'l1', skillId: 'skill-3', name: 'Beginner', description: 'Entry-level', requirements: [], order: 1, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l2', skillId: 'skill-3', name: 'Intermediate', description: 'Intermediate capability', requirements: [], order: 2, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l3', skillId: 'skill-3', name: 'Advanced', description: 'Advanced capability', requirements: [], order: 3, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l4', skillId: 'skill-3', name: 'Architect', description: 'Architectural level', requirements: [], order: 4, isActive: true, createdAt: '', updatedAt: '' },
    ],
    defaultLevelCount: 4,
    certifications: [],
    assignedUsers: [],
    totalAssignedUsers: 6,
    eligibility: {} as any,
    queueMappings: [],
    relatedQueues: 4,
    ruleMappings: [],
    relatedRules: 3,
    automationMappings: [],
    relatedAutomations: 2,
    usageAnalytics: {} as any,
    status: 'active',
    version: 1,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-05',
    updatedBy: 'admin',
    updatedAt: '2024-01-05',
  },
]

export default function SkillEnginePage() {
  const [skills, setSkills] = useState<SkillComplete[]>(DEFAULT_SKILLS)
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillComplete | undefined>()
  const [sortColumn, setSortColumn] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateSkill = () => {
    setEditingSkill(undefined)
    setIsCreating(true)
    setShowConfigModal(true)
  }

  const handleEditSkill = (skill: SkillComplete) => {
    setEditingSkill(skill)
    setIsCreating(false)
    setShowConfigModal(true)
  }

  const handleSaveSkill = (skill: SkillComplete) => {
    if (isCreating) {
      setSkills([...skills, skill])
    } else {
      setSkills(skills.map(s => s.id === skill.id ? skill : s))
    }
    setShowConfigModal(false)
  }

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter(s => s.id !== skillId))
  }

  const handleCloneSkill = (skill: SkillComplete) => {
    const clonedSkill: SkillComplete = {
      ...skill,
      id: `skill-${Date.now()}`,
      code: `${skill.code}-CLONE`,
      name: `${skill.name} (Clone)`,
      status: 'draft',
      version: 1,
      versionHistory: [],
      auditLog: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSkills([...skills, clonedSkill])
  }

  const handleExportSkills = () => {
    const json = exportSkillsToJSON(skills)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skills-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const sortedSkills = [...skills].sort((a, b) => {
    let aVal: any = a[sortColumn as keyof SkillComplete] || ''
    let bVal: any = b[sortColumn as keyof SkillComplete] || ''
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase()
    if (typeof bVal === 'string') bVal = bVal.toLowerCase()
    
    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  const getCategoryName = (categoryId: string) => {
    return SKILL_CATEGORIES.find(c => c.id === categoryId)?.name || categoryId
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>Skill Engine</h2>
          <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Manage assignment skills, proficiency levels, user competencies and routing eligibility.</p>
        </div>
      </div>

      {/* Top Actions */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          onClick={handleCreateSkill}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Plus className="w-4 h-4" />
          Create Skill
        </Button>
        <Button
          onClick={handleExportSkills}
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
        >
          <Download className="w-4 h-4" />
          Export Skills
        </Button>
        <Button
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
        >
          <Upload className="w-4 h-4" />
          Import Skills
        </Button>
        <Button
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
        >
          <Copy className="w-4 h-4" />
          Create Template
        </Button>
        <Button
          className="flex items-center gap-2 text-sm font-medium"
          style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
        >
          <BarChart3 className="w-4 h-4" />
          Usage Analytics
        </Button>
      </div>

      {/* Skills Table */}
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
        <table className="w-full text-sm">
          <thead style={{ backgroundColor: '#F3F4F3', borderBottom: '1px solid #E2E0DC' }}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>
                <button onClick={() => handleSort('name')} className="hover:text-blue-600">Skill Name {sortColumn === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}</button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Code</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Level Model</th>
              <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#6B6B6B' }}>Users</th>
              <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#6B6B6B' }}>Queues</th>
              <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#6B6B6B' }}>Rules</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold" style={{ color: '#6B6B6B' }}>Ver</th>
              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#6B6B6B' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSkills.map((skill) => {
              const categoryColor = getCategoryColor(skill.category)
              
              return (
                <tr 
                  key={skill.id} 
                  style={{ borderBottom: '1px solid #E2E0DC' }}
                  className={selectedSkill === skill.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
                  onClick={() => setSelectedSkill(skill.id)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium" style={{ color: '#0D3133' }}>{skill.name}</div>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>{skill.description.substring(0, 40)}...</p>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-mono text-xs" style={{ color: '#6B6B6B' }}>{skill.code}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
                    >
                      {getCategoryName(skill.category)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs" style={{ color: '#6B6B6B' }}>
                    {skill.levelModel.length} levels
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                      {skill.totalAssignedUsers}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-semibold" style={{ color: '#0D3133' }}>
                      {skill.relatedQueues}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-semibold" style={{ color: '#0D3133' }}>
                      {skill.relatedRules}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: skill.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: skill.status === 'active' ? '#065F46' : '#991B1B',
                      }}
                    >
                      {skill.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-xs font-mono" style={{ color: '#6B6B6B' }}>
                      v{skill.version}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditSkill(skill)}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-2 rounded hover:bg-gray-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" style={{ color: '#6B6B6B' }} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCloneSkill(skill)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Clone Skill
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Version History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Usage Analysis
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedSkills.length === 0 && (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
          <h3 className="font-semibold mb-2" style={{ color: '#0D3133' }}>No skills created yet</h3>
          <p className="mb-4" style={{ color: '#6B6B6B' }}>Create your first skill to build the competency framework</p>
          <Button
            onClick={handleCreateSkill}
            className="flex items-center gap-2 text-sm font-medium mx-auto"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Plus className="w-4 h-4" />
            Create First Skill
          </Button>
        </div>
      )}

      {/* Skill Configuration Modal */}
      <SkillConfigurationModal
        isOpen={showConfigModal}
        skill={editingSkill}
        onClose={() => setShowConfigModal(false)}
        onSave={handleSaveSkill}
        isNew={isCreating}
      />
    </div>
  )
}
