'use client'

import { useRouter } from 'next/navigation'
import { WorkspaceConfiguration } from '@/components/workspace-configuration'

const AUTOMATION_CATEGORIES = [
  { id: 'automation-triggers', name: 'Triggers', description: 'Events that trigger automations' },
  { id: 'automation-actions', name: 'Actions', description: 'Actions automations can perform' },
  { id: 'automation-schedules', name: 'Schedules', description: 'Scheduled automation patterns' },
  { id: 'automation-workflows', name: 'Workflows', description: 'Automation workflow types' },
  { id: 'automation-conditions', name: 'Conditions', description: 'Conditions for automation execution' },
  { id: 'automation-results', name: 'Results', description: 'Automation execution results' },
]

export default function AutomationConfigurationPage() {
  const router = useRouter()

  return (
    <WorkspaceConfiguration
      title="Automation Configuration"
      description="Manage automation triggers, actions, schedules, workflows, conditions, and results for intelligent system automation."
      systemCategory="automation"
      categories={AUTOMATION_CATEGORIES}
      onBack={() => router.push('/assignment-engine/configuration')}
    />
  )
}
