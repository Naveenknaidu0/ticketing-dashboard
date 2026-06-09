'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Play, X } from 'lucide-react'

/**
 * PHASE 3A.15 - Assignment Simulation UI
 * Manager can test assignment logic without actual assignment
 */

interface SimulationRequest {
  category: string
  priority: string
  group: string
  requiredSkills: string[]
}

interface SimulationResultDisplay {
  queueSelected: string
  skillsMatched: number
  rulesApplied: string[]
  agentSelected: string
  agentScore: number
  reasoning: string[]
  wouldAssign: boolean
}

export function AssignmentSimulationEngine() {
  const [showSimulator, setShowSimulator] = useState(false)
  const [simulationRequest, setSimulationRequest] = useState<SimulationRequest>({
    category: 'Network',
    priority: 'medium',
    group: 'Infrastructure',
    requiredSkills: [],
  })
  const [simulationResult, setSimulationResult] = useState<SimulationResultDisplay | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleRunSimulation = async () => {
    setIsSimulating(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock simulation result
    setSimulationResult({
      queueSelected: 'Infrastructure Queue (INFRA-001)',
      skillsMatched: 3,
      rulesApplied: ['Priority Rule L1', 'Skill Matching', 'Capacity Check'],
      agentSelected: 'Mike Chen',
      agentScore: 87.5,
      reasoning: [
        '✓ Route: Network category → Infrastructure Queue',
        '✓ Skills: Requires Cisco, Firewall, Network - Mike has all at Advanced level',
        '✓ Capacity: Mike at 65% capacity (13/20 tickets)',
        '✓ Availability: Online and active',
        '✓ Performance: 96% SLA compliance, 4.7/5.0 rating',
      ],
      wouldAssign: true,
    })

    setIsSimulating(false)
  }

  if (!showSimulator) {
    return (
      <Button
        onClick={() => setShowSimulator(true)}
        className="flex items-center gap-2"
        variant="outline"
      >
        <Play className="w-4 h-4" />
        Test Assignment
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Assignment Simulation</h2>
          <button
            onClick={() => {
              setShowSimulator(false)
              setSimulationResult(null)
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!simulationResult ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Test how the assignment engine would route a ticket with specific parameters.
              </p>

              {/* Category Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={simulationRequest.category} onValueChange={(val) =>
                  setSimulationRequest(prev => ({ ...prev, category: val }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Application">Application</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <Select value={simulationRequest.priority} onValueChange={(val) =>
                  setSimulationRequest(prev => ({ ...prev, priority: val }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Group Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Support Group</label>
                <Select value={simulationRequest.group} onValueChange={(val) =>
                  setSimulationRequest(prev => ({ ...prev, group: val }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Application">Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Run Button */}
              <Button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full"
              >
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                No actual assignment will be made. Testing only.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Result Header */}
              <div className={`p-4 rounded-lg border flex items-start gap-3 ${
                simulationResult.wouldAssign
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  simulationResult.wouldAssign ? 'text-green-600' : 'text-yellow-600'
                }`} />
                <div>
                  <p className="font-semibold">
                    {simulationResult.wouldAssign
                      ? 'Assignment Would Succeed'
                      : 'Assignment Would Fail'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Assigned to: {simulationResult.agentSelected}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 mb-1">Queue Selected</p>
                  <p className="font-medium">{simulationResult.queueSelected}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-600 mb-1">Agent Score</p>
                  <p className="font-medium">{simulationResult.agentScore.toFixed(1)}/100</p>
                </div>
              </div>

              {/* Rules Applied */}
              <div>
                <p className="text-sm font-semibold mb-2">Rules Applied</p>
                <div className="space-y-1">
                  {simulationResult.rulesApplied.map((rule, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      • {rule}
                    </p>
                  ))}
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <p className="text-sm font-semibold mb-2">Reasoning</p>
                <div className="space-y-1 text-sm">
                  {simulationResult.reasoning.map((reason, i) => (
                    <p key={i} className="text-gray-700">
                      {reason}
                    </p>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setSimulationResult(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Run Another Test
                </Button>
                <Button
                  onClick={() => {
                    setShowSimulator(false)
                    setSimulationResult(null)
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
