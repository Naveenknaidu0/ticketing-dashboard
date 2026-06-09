'use client'

import { useRouter } from 'next/navigation'
import { WorkspaceConfiguration } from '@/components/workspace-configuration'

const SKILL_CATEGORIES = [
  { id: 'skill-levels', name: 'Skill Levels', description: 'Define proficiency levels' },
  { id: 'skill-categories', name: 'Skill Categories', description: 'Classification of skills' },
  { id: 'skill-certifications', name: 'Certifications', description: 'Required certifications' },
  { id: 'skill-competency', name: 'Competency Levels', description: 'Competency assessment levels' },
  { id: 'skill-languages', name: 'Languages', description: 'Supported languages' },
  { id: 'skill-regions', name: 'Regions', description: 'Geographic regions' },
]

export default function SkillConfigurationPage() {
  const router = useRouter()

  return (
    <WorkspaceConfiguration
      title="Skill Configuration"
      description="Manage skill levels, categories, certifications, competency levels, languages, and regions for skill-based routing."
      systemCategory="skill"
      categories={SKILL_CATEGORIES}
      onBack={() => router.push('/assignment-engine/configuration')}
    />
  )
}
