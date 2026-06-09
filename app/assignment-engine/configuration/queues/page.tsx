'use client'

import { useRouter } from 'next/navigation'
import { WorkspaceConfiguration } from '@/components/workspace-configuration'

const QUEUE_CATEGORIES = [
  { id: 'queue-types', name: 'Queue Types', description: 'Define types of queues' },
  { id: 'queue-statuses', name: 'Queue Statuses', description: 'Queue operational statuses' },
  { id: 'queue-priorities', name: 'Queue Priorities', description: 'Priority levels for queues' },
  { id: 'queue-categories', name: 'Queue Categories', description: 'Queue categorization' },
  { id: 'queue-tags', name: 'Queue Tags', description: 'Queue tagging system' },
  { id: 'queue-business-hours', name: 'Business Hours', description: 'Operating hours' },
  { id: 'queue-escalation', name: 'Escalation Paths', description: 'Escalation routes' },
]

export default function QueueConfigurationPage() {
  const router = useRouter()

  return (
    <WorkspaceConfiguration
      title="Queue Configuration"
      description="Manage queue types, statuses, priorities, categories, tags, business hours, and escalation paths."
      systemCategory="queue"
      categories={QUEUE_CATEGORIES}
      onBack={() => router.push('/assignment-engine/configuration')}
    />
  )
}
