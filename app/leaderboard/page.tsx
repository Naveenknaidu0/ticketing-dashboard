'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'
import { LeaderboardContent } from '@/components/leaderboard-content'

type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year'

export default function LeaderboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month')

  return (
    <div className="flex flex-col h-full bg-white">
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Leaderboard' },
        ]}
        title="Leaderboard"
        description="Agent performance ranking and statistics"
        actions={
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              borderColor: '#E2E0DC',
              backgroundColor: '#FFFFFF',
              color: '#1a1a1a',
            }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        }
      />
      
      <div className="flex-1 overflow-auto p-8">
        <LeaderboardContent period={selectedPeriod} />
      </div>
    </div>
  )
}
