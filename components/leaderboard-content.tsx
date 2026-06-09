'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/app/store-context'
import { LeaderboardPodium } from './leaderboard-podium'
import { LeaderboardTable } from './leaderboard-table'
import { AgentProfileDrawer } from './agent-profile-drawer'
import { calculateAgentMetrics } from '@/lib/data-governance'
import type { LeaderboardAgent } from '@/lib/types'

// Fallback mock data if store is empty - CORE-01H: Only used when store is unavailable
const mockAgents: LeaderboardAgent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Senior Support Agent',
    photo: 'https://i.pravatar.cc/150?img=1',
    badge: 'gold',
    rank: 1,
    points: 2840,
    ticketsResolved: 156,
    csatScore: 98,
    avgResponseTime: '1.2h',
    slaCompliance: 98,
    responseSLA: 95,
    resolutionSLA: 92,
    knowledgeArticles: 45,
    tasksCompleted: 128,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Support Specialist',
    photo: 'https://i.pravatar.cc/150?img=2',
    badge: 'silver',
    rank: 2,
    points: 2650,
    ticketsResolved: 142,
    csatScore: 96,
    avgResponseTime: '1.5h',
    slaCompliance: 96,
    responseSLA: 93,
    resolutionSLA: 90,
    knowledgeArticles: 38,
    tasksCompleted: 115,
  },
  {
    id: '3',
    name: 'Emma Williams',
    role: 'Support Agent',
    photo: 'https://i.pravatar.cc/150?img=3',
    badge: 'bronze',
    rank: 3,
    points: 2520,
    ticketsResolved: 138,
    csatScore: 95,
    avgResponseTime: '1.8h',
    slaCompliance: 95,
    responseSLA: 91,
    resolutionSLA: 88,
    knowledgeArticles: 35,
    tasksCompleted: 108,
  },
  {
    id: '4',
    name: 'James Rodriguez',
    role: 'Support Agent',
    photo: 'https://i.pravatar.cc/150?img=4',
    badge: 'none',
    rank: 4,
    points: 2280,
    ticketsResolved: 124,
    csatScore: 93,
    avgResponseTime: '2.1h',
    slaCompliance: 93,
    responseSLA: 88,
    resolutionSLA: 85,
    knowledgeArticles: 28,
    tasksCompleted: 92,
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    role: 'Support Agent',
    photo: 'https://i.pravatar.cc/150?img=5',
    badge: 'none',
    rank: 5,
    points: 2140,
    ticketsResolved: 118,
    csatScore: 92,
    avgResponseTime: '2.3h',
    slaCompliance: 92,
    responseSLA: 86,
    resolutionSLA: 83,
    knowledgeArticles: 25,
    tasksCompleted: 85,
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Support Agent',
    photo: 'https://i.pravatar.cc/150?img=6',
    badge: 'none',
    rank: 6,
    points: 2020,
    ticketsResolved: 112,
    csatScore: 91,
    avgResponseTime: '2.5h',
    slaCompliance: 91,
    responseSLA: 84,
    resolutionSLA: 81,
    knowledgeArticles: 22,
    tasksCompleted: 78,
  },
]

interface LeaderboardContentProps {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year'
}

export function LeaderboardContent({ period }: LeaderboardContentProps) {
  const { state } = useStore()
  const [selectedAgent, setSelectedAgent] = useState<LeaderboardAgent | null>(null)
  const [agents, setAgents] = useState<LeaderboardAgent[]>(mockAgents)

  // Calculate leaderboard from store (CORE-01H: Single source of truth)
  useEffect(() => {
    if (!state?.users || !state?.tickets) return

    const agentStats: LeaderboardAgent[] = Array.from(state.users.values())
      .filter(u => u.role === 'agent')
      .map(u => {
        const metrics = calculateAgentMetrics(u.id, u, Array.from(state.tickets.values()))
        
        // Calculate leaderboard points based on resolved tickets, resolution rate, and average time
        const points = Math.round(
          metrics.resolvedTickets * 18 + 
          metrics.resolutionRate * 10 + 
          (100 - Math.min(100, metrics.avgResolutionTime / 10)) * 5
        )
        
        const badge: 'gold' | 'silver' | 'bronze' | 'none' = 
          metrics.resolvedTickets > 15 ? 'gold' : 
          metrics.resolvedTickets > 10 ? 'silver' : 
          metrics.resolvedTickets > 8 ? 'bronze' : 'none'
        
        return {
          id: u.id,
          name: u.name,
          role: u.group || 'Support Agent',
          photo: `https://i.pravatar.cc/150?img=${Math.abs(u.id.charCodeAt(0) % 70)}`,
          badge,
          rank: 0, // Will be set after sorting
          points,
          ticketsResolved: metrics.resolvedTickets,
          csatScore: Math.min(100, 90 + metrics.resolutionRate), // Derived from resolution rate
          avgResponseTime: `${metrics.avgResolutionTime.toFixed(1)}h`,
          slaCompliance: 92, // Will be calculated from SLA records in future
          responseSLA: 90,
          resolutionSLA: 88,
          knowledgeArticles: 0, // From knowledge contribution tracking
          tasksCompleted: metrics.totalAssigned,
        } as LeaderboardAgent
      })
      .sort((a, b) => b.points - a.points)
      .map((agent, idx) => ({ ...agent, rank: idx + 1 }))

    setAgents(agentStats.length > 0 ? agentStats : mockAgents)
  }, [state?.users, state?.tickets])

  const handleSelectAgent = (agent: LeaderboardAgent) => {
    setSelectedAgent(agent)
  }

  return (
    <>
      {/* Podium */}
      <LeaderboardPodium agents={agents.slice(0, 3)} />

      {/* Leaderboard Table */}
      <div className="mt-12">
        <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
          All Rankings
        </h2>
        <LeaderboardTable agents={agents} onSelectAgent={handleSelectAgent} />
      </div>

      {/* Agent Profile Drawer */}
      {selectedAgent && (
        <AgentProfileDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </>
  )
}
