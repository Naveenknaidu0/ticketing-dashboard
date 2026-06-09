'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Edit2, Trash2, Archive, CheckCircle, AlertCircle, Clock, Users, Award, Zap, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SkillComplete } from '@/lib/types'
import { SKILL_CATEGORIES, getCategoryColor, getLevelName } from '@/lib/skill-engine'
import { SkillUsageAnalyticsComponent } from '@/components/skill-usage-analytics'

export default function SkillDetailPage() {
  const router = useRouter()
  const params = useParams()
  const skillId = params?.id as string

  // Sample skill data
  const [skill, setSkill] = useState<SkillComplete>({
    id: 'skill-1',
    code: 'NETWORK_ENG',
    name: 'Network Engineering',
    description: 'Network infrastructure design, deployment and management',
    category: 'cat-network',
    levelModel: [
      { id: 'l1', skillId: 'skill-1', name: 'Beginner', description: 'Entry-level capability', requirements: [], order: 1, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l2', skillId: 'skill-1', name: 'Intermediate', description: 'Intermediate capability', requirements: [], order: 2, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l3', skillId: 'skill-1', name: 'Advanced', description: 'Advanced capability', requirements: [], order: 3, isActive: true, createdAt: '', updatedAt: '' },
      { id: 'l4', skillId: 'skill-1', name: 'Expert', description: 'Expert level', requirements: [], order: 4, isActive: true, createdAt: '', updatedAt: '' },
    ],
    defaultLevelCount: 4,
    certifications: [
      { id: 'cisco-ccna', skillId: 'skill-1', name: 'Cisco CCNA', provider: 'Cisco', issueDate: '', expiryDate: '', isRequired: true, isOptional: false, createdAt: '' },
    ],
    assignedUsers: [
      { id: 'assign-1', userId: 'user-1', userName: 'Sarah Johnson', skillId: 'skill-1', skillName: 'Network Engineering', skillLevel: 4, isPrimary: true, isSecondary: false, yearsExperience: 8, certifications: [], assignedDate: '', assignedBy: 'admin', lastReviewedDate: '', lastReviewedBy: 'admin', status: 'active' },
      { id: 'assign-2', userId: 'user-4', userName: 'James Rodriguez', skillId: 'skill-1', skillName: 'Network Engineering', skillLevel: 3, isPrimary: true, isSecondary: false, yearsExperience: 5, certifications: [], assignedDate: '', assignedBy: 'admin', lastReviewedDate: '', lastReviewedBy: 'admin', status: 'active' },
    ],
    totalAssignedUsers: 12,
    eligibility: {} as any,
    queueMappings: [
      { id: 'qm-1', skillId: 'skill-1', skillName: 'Network Engineering', queueId: 'q-1', queueName: 'Network Support Queue', minimumLevel: 2, priority: 1, createdAt: '' },
      { id: 'qm-2', skillId: 'skill-1', skillName: 'Network Engineering', queueId: 'q-2', queueName: 'Infrastructure Queue', minimumLevel: 3, priority: 1, createdAt: '' },
    ],
    relatedQueues: 3,
    ruleMappings: [
      { id: 'rm-1', skillId: 'skill-1', skillName: 'Network Engineering', ruleId: 'r-1', ruleName: 'Network Routing Rule', minimumLevel: 2, required: true, createdAt: '' },
      { id: 'rm-2', skillId: 'skill-1', skillName: 'Network Engineering', ruleId: 'r-2', ruleName: 'Advanced Network Rule', minimumLevel: 3, required: true, createdAt: '' },
    ],
    relatedRules: 5,
    automationMappings: [],
    relatedAutomations: 2,
    usageAnalytics: {
      skillId: 'skill-1',
      skillName: 'Network Engineering',
      totalAssignedUsers: 12,
      activeUsers: 10,
      inactiveUsers: 2,
      averageProficiency: 3.2,
      queuesUsing: [
        { queueId: 'q-1', queueName: 'Network Support Queue', count: 8 },
        { queueId: 'q-2', queueName: 'Infrastructure Queue', count: 4 },
      ],
      rulesUsing: [
        { ruleId: 'r-1', ruleName: 'Network Routing Rule', count: 45 },
      ],
      automationsUsing: [
        { automationId: 'a-1', automationName: 'Network Auto Assignment', count: 23 },
      ],
      assignmentFrequency: 156,
      lastUsedDate: new Date().toISOString(),
    },
    status: 'active',
    version: 2,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-01',
    updatedBy: 'admin',
    updatedAt: '2024-01-15',
  })

  const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'mappings' | 'analytics' | 'audit'>('overview')

  const categoryColor = getCategoryColor(skill.category)
  const categoryName = SKILL_CATEGORIES.find(c => c.id === skill.category)?.name || skill.category

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: '#6B6B6B' }} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>{skill.name}</h1>
              <span
                className="px-3 py-1 rounded text-sm font-semibold"
                style={{
                  backgroundColor: skill.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                  color: skill.status === 'active' ? '#065F46' : '#991B1B',
                }}
              >
                {skill.status}
              </span>
            </div>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>{skill.description}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            <Edit2 className="w-4 h-4" />
            Edit Skill
          </Button>
          <Button
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>Code</p>
          <p className="font-mono font-semibold" style={{ color: '#0D3133' }}>{skill.code}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>Category</p>
          <span
            className="px-2 py-1 rounded text-xs font-semibold"
            style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
          >
            {categoryName}
          </span>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1" style={{ color: '#6B6B6B' }}>Version</p>
          <p className="font-semibold" style={{ color: '#0D3133' }}>v{skill.version}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: '#6B6B6B' }}>
            <Users className="w-3 h-3" />
            Users
          </p>
          <p className="font-semibold" style={{ color: '#0D3133' }}>{skill.totalAssignedUsers}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: '#6B6B6B' }}>
            <Link2 className="w-3 h-3" />
            Queues
          </p>
          <p className="font-semibold" style={{ color: '#0D3133' }}>{skill.relatedQueues}</p>
        </div>
        <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
          <p className="text-xs font-medium mb-1 flex items-center gap-1" style={{ color: '#6B6B6B' }}>
            <Zap className="w-3 h-3" />
            Rules
          </p>
          <p className="font-semibold" style={{ color: '#0D3133' }}>{skill.relatedRules}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-0 border-b mb-6 flex-wrap" style={{ borderColor: '#E2E0DC' }}>
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'assignments' as const, label: 'User Assignments' },
          { id: 'mappings' as const, label: 'Mappings' },
          { id: 'analytics' as const, label: 'Analytics' },
          { id: 'audit' as const, label: 'Audit Log' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
            style={{
              borderColor: activeTab === tab.id ? '#E69F50' : 'transparent',
              color: activeTab === tab.id ? '#E69F50' : '#6B6B6B',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Proficiency Levels */}
            <div>
              <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Proficiency Levels</h3>
              <div className="grid grid-cols-2 gap-4">
                {skill.levelModel.map((level, idx) => (
                  <div key={level.id} className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E69F50' }}>
                        <span className="text-white text-sm font-bold">{idx + 1}</span>
                      </div>
                      <span className="font-semibold" style={{ color: '#0D3133' }}>{level.name}</span>
                    </div>
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>{level.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {skill.certifications.length > 0 && (
              <div className="border-t pt-6" style={{ borderColor: '#E2E0DC' }}>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#0D3133' }}>
                  <Award className="w-4 h-4" />
                  Required Certifications
                </h3>
                <div className="space-y-2">
                  {skill.certifications.filter(c => c.isRequired).map(cert => (
                    <div key={cert.id} className="flex items-center gap-3 p-3 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{cert.name}</p>
                        <p className="text-xs" style={{ color: '#6B6B6B' }}>{cert.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Assigned Users ({skill.assignedUsers.length})</h3>
            <div className="space-y-2">
              {skill.assignedUsers.map(assignment => (
                <div key={assignment.id} className="p-4 border rounded-lg flex items-center justify-between" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
                  <div>
                    <p className="font-medium" style={{ color: '#0D3133' }}>{assignment.userName}</p>
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>
                      {getLevelName(assignment.skillLevel)} • {assignment.yearsExperience} years experience
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded text-sm font-semibold"
                    style={{
                      backgroundColor: assignment.isPrimary ? '#D1FAE5' : '#FEE2E2',
                      color: assignment.isPrimary ? '#065F46' : '#991B1B',
                    }}
                  >
                    {assignment.isPrimary ? 'Primary' : 'Secondary'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mappings Tab */}
        {activeTab === 'mappings' && (
          <div className="space-y-6">
            {skill.queueMappings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Queue Mappings ({skill.queueMappings.length})</h3>
                <div className="space-y-2">
                  {skill.queueMappings.map(mapping => (
                    <div key={mapping.id} className="p-3 border rounded-lg flex items-center justify-between" style={{ borderColor: '#E2E0DC' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{mapping.queueName}</p>
                        <p className="text-xs" style={{ color: '#6B6B6B' }}>Min Level: {getLevelName(mapping.minimumLevel)}</p>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#E69F50' }}>Priority {mapping.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skill.ruleMappings.length > 0 && (
              <div className="border-t pt-6" style={{ borderColor: '#E2E0DC' }}>
                <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Rule Mappings ({skill.ruleMappings.length})</h3>
                <div className="space-y-2">
                  {skill.ruleMappings.map(mapping => (
                    <div key={mapping.id} className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                      <p className="font-medium text-sm" style={{ color: '#0D3133' }}>{mapping.ruleName}</p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>
                        Min Level: {getLevelName(mapping.minimumLevel)} • {mapping.required ? 'Required' : 'Optional'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <SkillUsageAnalyticsComponent analytics={skill.usageAnalytics} />
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto mb-3" style={{ color: '#9CA3AF' }} />
            <p style={{ color: '#6B6B6B' }}>Audit log entries will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
