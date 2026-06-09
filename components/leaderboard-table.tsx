'use client'

import { Medal } from 'lucide-react'
import type { LeaderboardAgent } from '@/lib/types'

interface LeaderboardTableProps {
  agents: LeaderboardAgent[]
  onSelectAgent: (agent: LeaderboardAgent) => void
}

export function LeaderboardTable({ agents, onSelectAgent }: LeaderboardTableProps) {
  const getBadgeIcon = (badge: 'gold' | 'silver' | 'bronze' | 'none') => {
    if (badge === 'none') return null

    const colors = {
      gold: '#D4A574',
      silver: '#9CA3AF',
      bronze: '#D97706',
    }

    return (
      <Medal
        size={16}
        style={{ color: colors[badge] }}
        fill={colors[badge]}
      />
    )
  }

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) {
      return { backgroundColor: '#FFF8E7', color: '#D4A574' }
    } else if (rank === 2) {
      return { backgroundColor: '#F5F5F5', color: '#9CA3AF' }
    } else if (rank === 3) {
      return { backgroundColor: '#FFF1E6', color: '#D97706' }
    }
    return { backgroundColor: '#F9F8F6', color: '#6B6B6B' }
  }

  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: '#E2E0DC' }}
    >
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: '#6B9E8F', color: '#FFFFFF' }}>
            <th className="px-6 py-4 text-left font-semibold" style={{ width: '80px' }}>
              Rank
            </th>
            <th className="px-6 py-4 text-left font-semibold">Agent</th>
            <th className="px-6 py-4 text-left font-semibold">Points</th>
            <th className="px-6 py-4 text-left font-semibold">Tickets Resolved</th>
            <th className="px-6 py-4 text-left font-semibold">Avg Response</th>
            <th className="px-6 py-4 text-left font-semibold">CSAT Score</th>
            <th className="px-6 py-4 text-left font-semibold" style={{ width: '60px' }}>
              SLA
            </th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, idx) => (
            <tr
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
              style={{ borderTopColor: '#E2E0DC' }}
            >
              {/* Rank */}
              <td className="px-6 py-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                  style={getRankBadgeStyle(agent.rank)}
                >
                  {agent.rank}
                </div>
              </td>

              {/* Agent */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={agent.photo}
                    alt={agent.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium" style={{ color: '#1a1a1a' }}>
                      {agent.name}
                    </p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>
                      {agent.role}
                    </p>
                  </div>
                </div>
              </td>

              {/* Points */}
              <td className="px-6 py-4" style={{ color: '#1a1a1a' }}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{agent.points}</span>
                  {agent.badge !== 'none' && getBadgeIcon(agent.badge)}
                </div>
              </td>

              {/* Tickets Resolved */}
              <td className="px-6 py-4" style={{ color: '#1a1a1a' }}>
                {agent.ticketsResolved}
              </td>

              {/* Avg Response */}
              <td className="px-6 py-4 flex items-center gap-2" style={{ color: '#6B6B6B' }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: '#E8F0E8', color: '#6B9E8F' }}
                >
                  ⏱
                </div>
                {agent.avgResponseTime}
              </td>

              {/* CSAT Score */}
              <td className="px-6 py-4" style={{ color: '#1a1a1a' }}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{agent.csatScore}%</span>
                  <span style={{ color: '#F59E0B' }}>⭐</span>
                </div>
              </td>

              {/* SLA */}
              <td className="px-6 py-4">
                <div
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor:
                      agent.slaCompliance >= 95
                        ? '#D1FAE5'
                        : agent.slaCompliance >= 90
                          ? '#FEF3C7'
                          : '#FEE2E2',
                    color:
                      agent.slaCompliance >= 95
                        ? '#059669'
                        : agent.slaCompliance >= 90
                          ? '#D97706'
                          : '#DC2626',
                  }}
                >
                  {agent.slaCompliance}%
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
