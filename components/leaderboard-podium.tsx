'use client'

import { Medal } from 'lucide-react'
import type { LeaderboardAgent } from '@/lib/types'

interface LeaderboardPodiumProps {
  agents: LeaderboardAgent[]
}

export function LeaderboardPodium({ agents }: LeaderboardPodiumProps) {
  const getBadgeColor = (badge: 'gold' | 'silver' | 'bronze' | 'none') => {
    switch (badge) {
      case 'gold':
        return { bg: '#FFF8E7', text: '#D4A574', border: '#E5C4A0' }
      case 'silver':
        return { bg: '#F5F5F5', text: '#9CA3AF', border: '#E5E7EB' }
      case 'bronze':
        return { bg: '#FFF1E6', text: '#D97706', border: '#FED7AA' }
      default:
        return { bg: '#F9F8F6', text: '#6B6B6B', border: '#E2E0DC' }
    }
  }

  const medals = [
    { position: 'second' as const, agent: agents[1], rank: 2 },
    { position: 'first' as const, agent: agents[0], rank: 1 },
    { position: 'third' as const, agent: agents[2], rank: 3 },
  ].filter(m => m.agent)

  if (medals.length === 0) {
    return (
      <div className="text-center py-8" style={{ color: '#6B6B6B' }}>
        No agent data available yet
      </div>
    )
  }

  return (
    <div className="flex items-end justify-center gap-8 mb-8">
      {medals.map(({ position, agent, rank }) => {
        const badgeColor = getBadgeColor(agent.badge)
        const height = position === 'first' ? 'h-64' : position === 'second' ? 'h-56' : 'h-48'

        return (
          <div
            key={agent.id}
            className="flex flex-col items-center"
            style={{
              flex: 1,
              maxWidth: '200px',
            }}
          >
            {/* Medal Badge */}
            <div
              className="rounded-full p-3 mb-4"
              style={{
                backgroundColor: badgeColor.bg,
                border: `2px solid ${badgeColor.border}`,
                width: '60px',
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Medal
                size={32}
                style={{ color: badgeColor.text }}
                fill={badgeColor.text}
              />
            </div>

            {/* Card */}
            <div
              className={`w-full rounded-lg p-4 flex flex-col items-center ${height}`}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E0DC',
              }}
            >
              {/* Photo */}
              <img
                src={agent.photo}
                alt={agent.name}
                className="w-20 h-20 rounded-full mb-3 object-cover"
              />

              {/* Name */}
              <h3 className="font-bold text-center" style={{ color: '#1a1a1a' }}>
                {agent.name}
              </h3>

              {/* Role */}
              <p
                className="text-xs text-center mt-1 mb-4"
                style={{ color: '#6B6B6B' }}
              >
                {agent.role}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 w-full text-center text-xs mt-auto">
                <div>
                  <p className="font-bold" style={{ color: '#1a1a1a' }}>
                    {agent.points}
                  </p>
                  <p style={{ color: '#6B6B6B' }}>Points</p>
                </div>
                <div>
                  <p className="font-bold" style={{ color: '#1a1a1a' }}>
                    {agent.csatScore}%
                  </p>
                  <p style={{ color: '#6B6B6B' }}>CSAT</p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
