'use client'

import { useRouter } from 'next/navigation'
import { WorkspaceConfiguration } from '@/components/workspace-configuration'

const RULE_CATEGORIES = [
  { id: 'rule-actions', name: 'Rule Actions', description: 'Available rule actions' },
  { id: 'rule-priorities', name: 'Rule Priorities', description: 'Rule execution priorities' },
  { id: 'rule-conditions', name: 'Conditions', description: 'Rule conditions and operators' },
  { id: 'rule-types', name: 'Rule Types', description: 'Types of rules' },
  { id: 'rule-categories', name: 'Categories', description: 'Rule categorization' },
  { id: 'rule-outcomes', name: 'Outcomes', description: 'Possible rule outcomes' },
]

export default function RuleConfigurationPage() {
  const router = useRouter()

  return (
    <WorkspaceConfiguration
      title="Rule Configuration"
      description="Manage rule actions, priorities, conditions, types, categories, and outcomes for intelligent ticket assignment."
      systemCategory="rule"
      categories={RULE_CATEGORIES}
      onBack={() => router.push('/assignment-engine/configuration')}
    />
  )
}
