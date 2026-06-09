'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { Info, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { WorkloadPlanner } from './workload-planner'

interface DetailDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function DetailDrawer({ isOpen, onClose, title, children }: DetailDrawerProps) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-lg overflow-auto">
        <div className="p-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>{title}</h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-2xl"
            style={{ color: '#6B6B6B' }}
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function WorkloadAnalyticsCenter() {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)

  // Sample data
  const workloadKPIs = [
    { label: 'Total Assigned Workload', value: '156', trend: 'up 12%', icon: <Users className="w-5 h-5" /> },
    { label: 'Open Tickets', value: '86', trend: 'up 4%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Overloaded Agents', value: '3', trend: 'up 1', icon: <AlertTriangle className="w-5 h-5" /> },
    { label: 'Available Capacity', value: '18%', trend: 'down 5%', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Critical Workload', value: '24', trend: 'up 6', icon: <AlertTriangle className="w-5 h-5" /> },
    { label: 'Team Utilization', value: '82%', trend: 'up 3%', icon: <TrendingUp className="w-5 h-5" /> },
  ]

  const teamCapacity = [
    { group: 'Infrastructure', assigned: 24, open: 18, critical: 4, capacity: 88, status: 'Healthy' },
    { group: 'Application Support', assigned: 22, open: 15, critical: 3, capacity: 82, status: 'Healthy' },
    { group: 'Network', assigned: 28, open: 20, critical: 5, capacity: 112, status: 'Overloaded' },
    { group: 'Access Management', assigned: 18, open: 12, critical: 1, capacity: 68, status: 'Healthy' },
    { group: 'L1 Support', assigned: 20, open: 14, critical: 2, capacity: 75, status: 'Healthy' },
    { group: 'L2 Support', assigned: 26, open: 18, critical: 4, capacity: 98, status: 'Warning' },
    { group: 'L3 Support', assigned: 18, open: 12, critical: 3, capacity: 70, status: 'Healthy' },
  ]

  const agentCapacity = [
    { name: 'Sarah Chen', role: 'L2 Support', assigned: 24, capacity: 78, status: 'Healthy' },
    { name: 'John Smith', role: 'Network', assigned: 34, capacity: 125, status: 'Overloaded' },
    { name: 'Emma Davis', role: 'L1 Support', assigned: 18, capacity: 68, status: 'Healthy' },
    { name: 'Mike Chen', role: 'Infrastructure', assigned: 22, capacity: 82, status: 'Healthy' },
    { name: 'James Wilson', role: 'L3 Support', assigned: 28, capacity: 105, status: 'Warning' },
  ]

  const teamCapacitySummary = {
    total: 156,
    used: 128,
    available: 28,
    overloaded: 3,
    underutilized: 2,
  }

  const queueHealth = [
    { status: 'Open', count: 86, trend: 'up 4%' },
    { status: 'In Progress', count: 64, trend: 'down 2%' },
    { status: 'Pending User', count: 28, trend: 'up 3%' },
    { status: 'Pending Vendor', count: 12, trend: 'down 1%' },
    { status: 'Resolved Today', count: 45, trend: 'up 8%' },
  ]

  const workloadInsights = [
    { text: 'Infrastructure owns 32% of workload', severity: 'info', icon: <TrendingUp className="w-4 h-4" /> },
    { text: 'Network team exceeds capacity by 14%', severity: 'critical', icon: <AlertTriangle className="w-4 h-4" /> },
    { text: 'John Smith owns highest critical workload (5 tickets)', severity: 'high', icon: <AlertTriangle className="w-4 h-4" /> },
    { text: 'L2 queue increased 18% this week', severity: 'high', icon: <TrendingUp className="w-4 h-4" /> },
    { text: '3 agents available for reassignment', severity: 'positive', icon: <Users className="w-4 h-4" /> },
  ]

  return (
    <>
      <div className="space-y-6">
        {/* ROW 1: Workload Command Center */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Workload Command Center
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workloadKPIs.map((kpi, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer"
                style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
                onClick={() => setOpenDrawer(`kpi-${idx}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div style={{ color: '#6B6B6B' }}>{kpi.icon}</div>
                  <Info className="w-4 h-4" style={{ color: '#B0B0B0' }} />
                </div>
                <p className="text-xs font-medium mb-2" style={{ color: '#6B6B6B' }}>
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold mb-2" style={{ color: '#1a1a1a' }}>
                  {kpi.value}
                </p>
                <p className="text-xs font-medium" style={{ color: kpi.trend.includes('down') ? '#16A34A' : '#F59E0B' }}>
                  {kpi.trend}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 2: Team Capacity Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Team Capacity Overview
          </h2>
          <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
            <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <thead style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Group</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Assigned</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Open</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Critical</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Capacity</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {teamCapacity.map((item, idx) => {
                  const capacityColor = item.capacity > 100 ? '#DC2626' : item.capacity > 85 ? '#F59E0B' : '#16A34A'
                  const statusColor = item.status === 'Overloaded' ? '#DC2626' : item.status === 'Warning' ? '#F59E0B' : '#16A34A'
                  const statusBg = item.status === 'Overloaded' ? '#FEE2E2' : item.status === 'Warning' ? '#FEF3C7' : '#D1FAE5'
                  
                  return (
                    <tr
                      key={idx}
                      style={{ borderBottom: '1px solid #E2E0DC', cursor: 'pointer' }}
                      onClick={() => setOpenDrawer(`group-${item.group}`)}
                      className="hover:opacity-75"
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.group}</td>
                      <td className="px-4 py-3 text-center font-medium" style={{ color: '#6B6B6B' }}>{item.assigned}</td>
                      <td className="px-4 py-3 text-center font-medium" style={{ color: '#6B6B6B' }}>{item.open}</td>
                      <td className="px-4 py-3 text-center font-medium" style={{ color: '#DC2626' }}>{item.critical}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${Math.min(item.capacity, 100)}%`,
                                backgroundColor: capacityColor,
                              }}
                            />
                          </div>
                          <span className="text-xs font-semibold" style={{ color: capacityColor, minWidth: '35px' }}>
                            {item.capacity}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: statusBg,
                            color: statusColor,
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 3: Agent Capacity Panel */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Agent Capacity
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Agent List */}
            <div className="lg:col-span-2 border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
              <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
                <thead style={{ backgroundColor: '#F8F8F7', borderBottom: '1px solid #E2E0DC' }}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Agent</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Role</th>
                    <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Assigned</th>
                    <th className="px-4 py-3 text-left font-semibold" style={{ color: '#6B6B6B' }}>Capacity</th>
                    <th className="px-4 py-3 text-center font-semibold" style={{ color: '#6B6B6B' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agentCapacity.map((agent, idx) => {
                    const statusColor = agent.status === 'Overloaded' ? '#DC2626' : agent.status === 'Warning' ? '#F59E0B' : '#16A34A'
                    const statusBg = agent.status === 'Overloaded' ? '#FEE2E2' : agent.status === 'Warning' ? '#FEF3C7' : '#D1FAE5'
                    
                    return (
                      <tr
                        key={idx}
                        style={{ borderBottom: '1px solid #E2E0DC', cursor: 'pointer' }}
                        onClick={() => setOpenDrawer(`agent-${agent.name}`)}
                        className="hover:opacity-75"
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{agent.name}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: '#6B6B6B' }}>{agent.role}</td>
                        <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1a1a1a' }}>{agent.assigned}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5" style={{ backgroundColor: '#E2E0DC' }}>
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(agent.capacity, 100)}%`,
                                  backgroundColor: agent.capacity > 100 ? '#DC2626' : agent.capacity > 85 ? '#F59E0B' : '#16A34A',
                                }}
                              />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#6B6B6B', minWidth: '30px' }}>
                              {agent.capacity}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-semibold"
                            style={{
                              backgroundColor: statusBg,
                              color: statusColor,
                            }}
                          >
                            {agent.status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Right: Team Summary */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F8F6', height: 'fit-content' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1a1a1a' }}>Team Capacity Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B6B6B' }}>Total Capacity</p>
                  <p className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{teamCapacitySummary.total}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B6B6B' }}>Used Capacity</p>
                  <p className="text-lg font-bold" style={{ color: '#F59E0B' }}>{teamCapacitySummary.used}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#6B6B6B' }}>Available Capacity</p>
                  <p className="text-lg font-bold" style={{ color: '#16A34A' }}>{teamCapacitySummary.available}</p>
                </div>
                <div style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px', paddingTop: '12px' }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: '#6B6B6B' }}>Risk Indicators</p>
                  <p className="text-xs mb-1"><span style={{ color: '#DC2626', fontWeight: 'bold' }}>{teamCapacitySummary.overloaded}</span> <span style={{ color: '#6B6B6B' }}>Overloaded</span></p>
                  <p className="text-xs"><span style={{ color: '#16A34A', fontWeight: 'bold' }}>{teamCapacitySummary.underutilized}</span> <span style={{ color: '#6B6B6B' }}>Underutilized</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Workload Planner */}
        <WorkloadPlanner />

        {/* ROW 4: Workload Distribution */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Workload Distribution
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Group Workload */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
              <h3 className="font-semibold mb-3 text-sm" style={{ color: '#1a1a1a' }}>By Group</h3>
              <div className="space-y-3">
                {teamCapacity.slice(0, 4).map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{item.group}</span>
                      <span style={{ color: '#6B6B6B' }}>{item.assigned} assigned</span>
                    </div>
                    <div className="flex gap-1 h-1.5">
                      <div className="flex-1 rounded" style={{ backgroundColor: '#DC2626', opacity: item.critical / item.assigned }}>
                        <div style={{ width: `${(item.critical / item.assigned) * 100}%`, backgroundColor: '#DC2626', height: '100%', borderRadius: '2px' }} />
                      </div>
                      <div className="flex-1 rounded" style={{ backgroundColor: '#F59E0B', opacity: (item.open - item.critical) / item.assigned }}>
                        <div style={{ width: `${((item.open - item.critical) / item.assigned) * 100}%`, backgroundColor: '#F59E0B', height: '100%', borderRadius: '2px' }} />
                      </div>
                      <div className="flex-1 rounded" style={{ backgroundColor: '#BFDBFE' }}>
                        <div style={{ width: `${((item.assigned - item.open) / item.assigned) * 100}%`, backgroundColor: '#BFDBFE', height: '100%', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs mt-1">
                      <span style={{ color: '#6B6B6B' }}><span style={{ color: '#DC2626' }}>●</span> Critical: {item.critical}</span>
                      <span style={{ color: '#6B6B6B' }}><span style={{ color: '#F59E0B' }}>●</span> Open: {item.open}</span>
                      <span style={{ color: '#6B6B6B' }}><span style={{ color: '#BFDBFE' }}>●</span> Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Workload */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
              <h3 className="font-semibold mb-3 text-sm" style={{ color: '#1a1a1a' }}>By Agent (Top 4)</h3>
              <div className="space-y-3">
                {agentCapacity.slice(0, 4).map((agent, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{agent.name}</span>
                      <span style={{ color: agent.capacity > 100 ? '#DC2626' : agent.capacity > 85 ? '#F59E0B' : '#6B6B6B' }}>
                        {agent.capacity}%
                      </span>
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min(agent.capacity, 100)}%`,
                          backgroundColor: agent.capacity > 100 ? '#DC2626' : agent.capacity > 85 ? '#F59E0B' : '#16A34A',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 5: Overloaded Agents */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Overloaded Agents
          </h2>
          <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
            <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <thead style={{ backgroundColor: '#FEE2E2', borderBottom: '1px solid #E2E0DC' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#7F1D1D' }}>Agent</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#7F1D1D' }}>Assigned</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#7F1D1D' }}>Critical</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#7F1D1D' }}>SLA Risk</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#7F1D1D' }}>Capacity %</th>
                </tr>
              </thead>
              <tbody>
                {agentCapacity.filter(a => a.capacity > 100).map((agent, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid #E2E0DC', cursor: 'pointer', backgroundColor: '#FEF2F2' }}
                    onClick={() => setOpenDrawer(`agent-${agent.name}`)}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{agent.name}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1a1a1a' }}>{agent.assigned}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#DC2626' }}>5</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#F59E0B' }}>3</td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {agent.capacity}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 6: Available Capacity */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Available Capacity
          </h2>
          <div className="border rounded-lg overflow-x-auto" style={{ borderColor: '#E2E0DC' }}>
            <table className="w-full text-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <thead style={{ backgroundColor: '#D1FAE5', borderBottom: '1px solid #E2E0DC' }}>
                <tr>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#065F46' }}>Agent</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#065F46' }}>Assigned</th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ color: '#065F46' }}>Available Capacity</th>
                  <th className="px-4 py-3 text-center font-semibold" style={{ color: '#065F46' }}>Capacity %</th>
                </tr>
              </thead>
              <tbody>
                {agentCapacity.filter(a => a.capacity <= 80).map((agent, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: '1px solid #E2E0DC', cursor: 'pointer', backgroundColor: '#F0FDF4' }}
                    onClick={() => setOpenDrawer(`agent-${agent.name}`)}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{agent.name}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#1a1a1a' }}>{agent.assigned}</td>
                    <td className="px-4 py-3" style={{ color: '#16A34A', fontWeight: 'bold' }}>{Math.round(((100 - agent.capacity) / 100) * 30)} tickets</td>
                    <td className="px-4 py-3 text-center">
                      <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {100 - agent.capacity}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROW 7: Queue Health */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Queue Health
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Queue Stats */}
            <div className="space-y-2">
              {queueHealth.map((item, idx) => {
                const isLargest = item.count === Math.max(...queueHealth.map(q => q.count))
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-lg border flex justify-between items-center"
                    style={{
                      borderColor: '#E2E0DC',
                      backgroundColor: isLargest ? '#FEF9E7' : '#FFFFFF'
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{item.status}</p>
                      <p className="text-xs" style={{ color: '#6B6B6B' }}>{item.trend}</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>{item.count}</p>
                  </div>
                )
              })}
            </div>

            {/* Queue Trend Chart */}
            <div className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#1a1a1a' }}>Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={queueHealth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
                  <XAxis dataKey="status" stroke="#6B6B6B" fontSize={11} />
                  <YAxis stroke="#6B6B6B" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }} />
                  <Line type="monotone" dataKey="count" stroke="#0D3133" strokeWidth={2} name="Count" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 8: Workload Insights */}
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>
            Workload Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {workloadInsights.map((insight, idx) => {
              const bgColor = insight.severity === 'critical' ? '#FEE2E2' : insight.severity === 'high' ? '#FEF3C7' : insight.severity === 'positive' ? '#D1FAE5' : '#F3F4F6'
              const textColor = insight.severity === 'critical' ? '#7F1D1D' : insight.severity === 'high' ? '#92400E' : insight.severity === 'positive' ? '#065F46' : '#374151'
              const iconColor = insight.severity === 'critical' ? '#DC2626' : insight.severity === 'high' ? '#F59E0B' : insight.severity === 'positive' ? '#16A34A' : '#6B6B6B'

              return (
                <div
                  key={idx}
                  className="p-3 rounded-lg flex flex-col gap-2"
                  style={{
                    backgroundColor: bgColor,
                    borderLeft: `4px solid ${iconColor}`,
                  }}
                >
                  <div style={{ color: iconColor }}>{insight.icon}</div>
                  <p className="text-xs font-medium leading-snug" style={{ color: textColor }}>
                    {insight.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Drawers for detail views */}
      <DetailDrawer isOpen={openDrawer !== null} onClose={() => setOpenDrawer(null)} title="Detail">
        <p style={{ color: '#6B6B6B' }}>Detail view for {openDrawer}</p>
      </DetailDrawer>
    </>
  )
}
