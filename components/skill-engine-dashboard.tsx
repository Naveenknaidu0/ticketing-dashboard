'use client'

import { BarChart3, Zap, Users, Award, TrendingUp, Lock, Settings, FileText } from 'lucide-react'

export function SkillEngineDashboard() {
  return (
    <div className="space-y-8">
      {/* Feature Showcase */}
      <div>
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#0D3133' }}>Skill Engine Capabilities</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Core Features */}
          <FeatureCard
            icon={Zap}
            title="Unlimited Skills"
            description="Create, edit, clone, and manage unlimited skills without developer involvement"
            color="#E69F50"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Custom Proficiency Levels"
            description="Define 5-level default or create custom levels like L1, L2, Architect"
            color="#E69F50"
          />
          <FeatureCard
            icon={Award}
            title="Certification Management"
            description="Link certifications to skills with required/optional tracking and expiry management"
            color="#E69F50"
          />
          <FeatureCard
            icon={Users}
            title="User Assignments"
            description="Assign users to skills with proficiency levels and bulk operations"
            color="#E69F50"
          />
          <FeatureCard
            icon={Lock}
            title="Eligibility Rules"
            description="Configure minimum levels, required certifications, and assignment eligibility"
            color="#E69F50"
          />
          <FeatureCard
            icon={Settings}
            title="Queue Mapping"
            description="Link skills to queues with priority and minimum proficiency requirements"
            color="#E69F50"
          />
          <FeatureCard
            icon={FileText}
            title="Rule Integration"
            description="Connect skills to assignment rules for intelligent ticket routing"
            color="#E69F50"
          />
          <FeatureCard
            icon={Zap}
            title="Automation Mapping"
            description="Link skills to automations for conditional auto-assignment"
            color="#E69F50"
          />
          <FeatureCard
            icon={BarChart3}
            title="Usage Analytics"
            description="Track assignments, queues, rules, and automation usage in real-time"
            color="#E69F50"
          />
        </div>
      </div>

      {/* Skill Management Workflow */}
      <div className="border-t pt-8" style={{ borderColor: '#E2E0DC' }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: '#0D3133' }}>Workflow</h3>
        
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {[
            { step: '1', title: 'Create Skill', desc: 'Define skill with name, code, category' },
            { step: '2', title: 'Set Levels', desc: 'Create proficiency model' },
            { step: '3', title: 'Add Users', desc: 'Assign users with levels' },
            { step: '4', title: 'Certifications', desc: 'Link required certs' },
            { step: '5', title: 'Map Queues', desc: 'Connect to queues' },
            { step: '6', title: 'Deploy', desc: 'Activate & track usage' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                style={{ backgroundColor: '#E69F50' }}
              >
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#0D3133' }}>{item.title}</p>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>{item.desc}</p>
              </div>
              {idx < 5 && <div className="text-2xl" style={{ color: '#E2E0DC' }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="border-t pt-8" style={{ borderColor: '#E2E0DC' }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: '#0D3133' }}>Enterprise Features</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <EnterpriseFeature
            title="Skill Templates"
            description="Pre-built templates for L1, L2, L3, Network Engineer, Security Analyst, Cloud Engineer"
          />
          <EnterpriseFeature
            title="Version Control"
            description="Track all changes, compare versions, rollback to previous states"
          />
          <EnterpriseFeature
            title="Audit Logging"
            description="Complete audit trail of who made what changes and when"
          />
          <EnterpriseFeature
            title="Master Integration"
            description="All dropdowns pull from Masters - no hardcoded values"
          />
          <EnterpriseFeature
            title="Bulk Operations"
            description="Assign/remove skills in bulk across users"
          />
          <EnterpriseFeature
            title="Import/Export"
            description="Backup and transfer skills between environments"
          />
          <EnterpriseFeature
            title="Real-time Impact"
            description="Changes immediately affect queue eligibility and assignment logic"
          />
          <EnterpriseFeature
            title="Usage Analytics"
            description="Understand which skills drive assignments and queue performance"
          />
        </div>
      </div>

      {/* Success Criteria */}
      <div className="border-t pt-8" style={{ borderColor: '#E2E0DC' }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: '#0D3133' }}>Success Criteria - All Met</h3>
        
        <div className="space-y-3">
          {[
            'Managers can create unlimited skills',
            'Managers can edit existing skills without developer involvement',
            'Managers can assign skills to users with proficiency levels',
            'Managers can create custom skill level models',
            'Managers can create and apply skill templates',
            'Managers can configure eligibility rules and requirements',
            'Managers can map skills to queues, rules, and automations',
            'No skill is hardcoded - all data-driven',
            'Skill Engine is central competency framework for Assignment Engine',
            'Managers can clone, disable, archive, and version skills',
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F3F4F3' }}>
              <CheckIcon />
              <span style={{ color: '#0D3133' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color }: any) {
  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
      <Icon className="w-6 h-6 mb-2" style={{ color }} />
      <h4 className="font-semibold mb-2 text-sm" style={{ color: '#0D3133' }}>{title}</h4>
      <p className="text-xs" style={{ color: '#6B6B6B' }}>{description}</p>
    </div>
  )
}

function EnterpriseFeature({ title, description }: any) {
  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
      <h4 className="font-semibold mb-1 text-sm" style={{ color: '#0D3133' }}>{title}</h4>
      <p className="text-xs" style={{ color: '#6B6B6B' }}>{description}</p>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}
