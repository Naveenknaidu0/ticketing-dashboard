'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuditSummary, getRecentActivity, getMostActiveUsers, searchAuditLogs, AUDIT_LOG_STORE } from '@/lib/audit-log-engine'
import { ChevronRight, Search, Download, Calendar, Activity, Users, TrendingUp } from 'lucide-react'

export default function AuditDashboardPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [selectedAction, setSelectedAction] = useState<string>('all')
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  const getDateFromRange = () => {
    const now = new Date()
    switch (dateRange) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return undefined
    }
  }

  const summary = getAuditSummary(getDateFromRange())
  const recentActivity = getRecentActivity(10)
  const topUsers = getMostActiveUsers(5)

  const searchResults = searchTerm ? searchAuditLogs(searchTerm, 20) : []

  const modules = ['all', 'queues', 'skills', 'rules', 'automations', 'configuration', 'assignments', 'simulations']
  const actions = ['all', 'create', 'update', 'delete', 'publish', 'disable', 'archive', 'restore']

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F5F4F1' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D3133' }}>
            Audit Log Dashboard
          </h1>
          <p style={{ color: '#6B6B6B' }}>Complete governance and compliance tracking for Assignment Engine</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                Total Records
              </span>
              <Activity className="w-4 h-4" style={{ color: '#E69F50' }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
              {summary.totalRecords}
            </div>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Avg {summary.averageRecordsPerDay}/day
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                Unique Users
              </span>
              <Users className="w-4 h-4" style={{ color: '#3B82F6' }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
              {Object.keys(summary.recordsByUser).length}
            </div>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              Active participants
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                Most Updated
              </span>
              <TrendingUp className="w-4 h-4" style={{ color: '#10B981' }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
              {Math.max(...Object.values(summary.recordsByAction), 0)}
            </div>
            <p className="text-xs mt-1" style={{ color: '#999999' }}>
              {Object.entries(summary.recordsByAction).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                Period
              </span>
              <Calendar className="w-4 h-4" style={{ color: '#F59E0B' }} />
            </div>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as any)}
              className="w-full px-2 py-1 border rounded text-sm"
              style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Recent Activity */}
          <div className="lg:col-span-2">
            {/* Search and Filters */}
            <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#999999' }} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search audit logs..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                  />
                </div>
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                  onClick={() => {
                    const csv = AUDIT_LOG_STORE.map(r => `${r.timestamp},${r.action},${r.module},${r.entityName},${r.userName}`).join('\n')
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
                    a.click()
                  }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selectedModule}
                  onChange={e => setSelectedModule(e.target.value)}
                  className="px-3 py-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  {modules.map(m => (
                    <option key={m} value={m}>
                      {m === 'all' ? 'All Modules' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAction}
                  onChange={e => setSelectedAction(e.target.value)}
                  className="px-3 py-2 border rounded text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
                >
                  {actions.map(a => (
                    <option key={a} value={a}>
                      {a === 'all' ? 'All Actions' : a.charAt(0).toUpperCase() + a.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Recent Activity List */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
                Recent Activity {searchTerm && `(${searchResults.length} results)`}
              </h3>

              {(searchTerm ? searchResults : recentActivity).map(record => (
                <div
                  key={record.id}
                  className="p-4 rounded-lg border hover:shadow-sm transition-all cursor-pointer"
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
                  onClick={() => router.push(`/assignment-engine/audit/records/${record.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              record.action === 'create'
                                ? '#D1FAE5'
                                : record.action === 'delete'
                                  ? '#FEE2E2'
                                  : '#FEF3C7',
                            color:
                              record.action === 'create'
                                ? '#059669'
                                : record.action === 'delete'
                                  ? '#DC2626'
                                  : '#92400E',
                          }}
                        >
                          {record.action.toUpperCase()}
                        </span>
                        <span style={{ color: '#6B6B6B' }} className="text-sm">
                          {record.module.toUpperCase()}
                        </span>
                      </div>
                      <p className="font-medium" style={{ color: '#0D3133' }}>
                        {record.entityName}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <span style={{ color: '#999999' }} className="text-xs">
                          By {record.userName}
                        </span>
                        <span style={{ color: '#999999' }} className="text-xs">
                          {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 mt-1" style={{ color: '#E2E0DC' }} />
                  </div>
                </div>
              ))}

              {(searchTerm ? searchResults.length === 0 : recentActivity.length === 0) && (
                <div className="text-center py-8" style={{ color: '#999999' }}>
                  <p>No audit records found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Stats and Top Users */}
          <div className="space-y-6">
            {/* Activity by Module */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
                Activity by Module
              </h3>
              <div className="space-y-3">
                {Object.entries(summary.recordsByModule)
                  .sort(([, a], [, b]) => b - a)
                  .map(([module, count]) => (
                    <div key={module} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: '#6B6B6B' }}>
                        {module.charAt(0).toUpperCase() + module.slice(1)}
                      </span>
                      <span className="font-medium" style={{ color: '#0D3133' }}>
                        {count}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
                Top Contributors
              </h3>
              <div className="space-y-3">
                {topUsers.map(user => (
                  <div key={user.userId} className="flex justify-between items-center">
                    <span className="text-sm" style={{ color: '#6B6B6B' }}>
                      {user.userName}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: '#F0F0F0', color: '#0D3133' }}>
                      {user.recordCount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>
                Info
              </h3>
              <div className="space-y-2 text-sm" style={{ color: '#6B6B6B' }}>
                <p>Complete audit trail of all Assignment Engine changes with comprehensive tracking and analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

