'use client'

import { useState } from 'react'
import { RotateCcw, Eye, Download, Trash2, Clock, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RULE_VERSIONS = [
  {
    version: 5,
    status: 'published',
    createdBy: 'Admin',
    createdAt: '2024-06-03 14:22:00',
    changes: 'Updated condition logic for better accuracy',
    published: true,
    publishedBy: 'Manager Smith',
    publishedAt: '2024-06-03 15:00:00',
    executions: 1523,
    successRate: 94,
  },
  {
    version: 4,
    status: 'archived',
    createdBy: 'Manager Johnson',
    createdAt: '2024-06-02 10:15:00',
    changes: 'Added new trigger for ticket priority changes',
    published: true,
    publishedBy: 'Admin',
    publishedAt: '2024-06-02 11:30:00',
    executions: 892,
    successRate: 91,
  },
  {
    version: 3,
    status: 'archived',
    createdBy: 'Admin',
    createdAt: '2024-06-01 09:45:00',
    changes: 'Initial trigger set configuration',
    published: true,
    publishedBy: 'Manager Smith',
    publishedAt: '2024-06-01 10:00:00',
    executions: 456,
    successRate: 87,
  },
  {
    version: 2,
    status: 'draft',
    createdBy: 'Manager Johnson',
    createdAt: '2024-05-31 16:20:00',
    changes: 'WIP - testing new condition operators',
    published: false,
    executions: 0,
    successRate: 0,
  },
  {
    version: 1,
    status: 'archived',
    createdBy: 'Admin',
    createdAt: '2024-05-30 08:00:00',
    changes: 'Created initial rule',
    published: true,
    publishedBy: 'Admin',
    publishedAt: '2024-05-30 08:15:00',
    executions: 234,
    successRate: 85,
  },
]

export default function VersionsPage() {
  const [selectedVersion, setSelectedVersion] = useState(5)
  const [compareVersion, setCompareVersion] = useState(4)
  const [showComparison, setShowComparison] = useState(false)

  const selected = RULE_VERSIONS.find(v => v.version === selectedVersion)
  const compare = RULE_VERSIONS.find(v => v.version === compareVersion)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#0D3133' }}>Version Control & History</h2>
        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Track all versions and changes with complete audit trail and instant rollback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version List */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
            <div className="p-4 border-b font-semibold" style={{ borderColor: '#E2E0DC', color: '#0D3133' }}>
              Version History
            </div>
            <div className="divide-y" style={{ borderColor: '#E2E0DC' }}>
              {RULE_VERSIONS.map(version => (
                <button
                  key={version.version}
                  onClick={() => setSelectedVersion(version.version)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                  style={{
                    backgroundColor: selectedVersion === version.version ? '#F9F3EC' : 'transparent',
                    borderLeft: selectedVersion === version.version ? '4px solid #E69F50' : '4px solid transparent',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: '#0D3133' }}>v{version.version}</span>
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{
                            backgroundColor:
                              version.status === 'published'
                                ? '#D1FAE5'
                                : version.status === 'draft'
                                  ? '#FEF3C7'
                                  : '#F3F4F3',
                            color:
                              version.status === 'published'
                                ? '#065F46'
                                : version.status === 'draft'
                                  ? '#92400E'
                                  : '#6B6B6B',
                          }}
                        >
                          {version.status}
                        </span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
                        {version.createdAt.split(' ')[0]}
                      </div>
                    </div>
                    {version.published && (
                      <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Version Details */}
        {selected && (
          <div className="lg:col-span-2 space-y-6">
            {/* Info */}
            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#0D3133' }}>Version {selected.version} Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>Status</span>
                  <span
                    className="px-3 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor:
                        selected.status === 'published'
                          ? '#D1FAE5'
                          : selected.status === 'draft'
                            ? '#FEF3C7'
                            : '#F3F4F3',
                      color:
                        selected.status === 'published'
                          ? '#065F46'
                          : selected.status === 'draft'
                            ? '#92400E'
                            : '#6B6B6B',
                    }}
                  >
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>Created By</span>
                  <span style={{ color: '#0D3133' }}>{selected.createdBy}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span style={{ color: '#6B6B6B' }}>Created</span>
                  <span style={{ color: '#0D3133' }}>{selected.createdAt}</span>
                </div>

                {selected.published && (
                  <>
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#E2E0DC' }}>
                      <span style={{ color: '#6B6B6B' }}>Published By</span>
                      <span style={{ color: '#0D3133' }}>{selected.publishedBy}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: '#6B6B6B' }}>Published</span>
                      <span style={{ color: '#0D3133' }}>{selected.publishedAt}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: '#E2E0DC' }}>
                      <span style={{ color: '#6B6B6B' }}>Executions</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">
                        {selected.executions}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span style={{ color: '#6B6B6B' }}>Success Rate</span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: selected.successRate > 90 ? '#D1FAE5' : '#FEF3C7',
                          color: selected.successRate > 90 ? '#065F46' : '#92400E',
                        }}
                      >
                        {selected.successRate}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Changes */}
            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Changes</h3>
              <p className="text-sm" style={{ color: '#6B6B6B' }}>{selected.changes}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                className="flex items-center gap-2 text-sm font-medium flex-1"
                style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
              >
                <Eye className="w-4 h-4" />
                View Full Details
              </Button>
              <Button
                className="flex items-center gap-2 text-sm font-medium flex-1"
                style={{ backgroundColor: '#F3F4F3', color: '#6B6B6B' }}
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              {selected.status !== 'published' && (
                <Button
                  className="flex items-center gap-2 text-sm font-medium flex-1"
                  style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Publish
                </Button>
              )}
              {selected.status === 'archived' && (
                <Button
                  className="flex items-center gap-2 text-sm font-medium flex-1"
                  style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Rollback
                </Button>
              )}
            </div>

            {/* Compare */}
            <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>Compare With Version</h3>
              <div className="flex gap-2">
                <select
                  value={compareVersion}
                  onChange={(e) => setCompareVersion(Number(e.target.value))}
                  className="flex-1 px-3 py-2 rounded border text-sm"
                  style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
                >
                  {RULE_VERSIONS.filter(v => v.version !== selectedVersion).map(v => (
                    <option key={v.version} value={v.version}>
                      v{v.version}
                    </option>
                  ))}
                </select>
                <Button
                  className="text-sm font-medium"
                  style={{ backgroundColor: '#3B82F6', color: '#FFFFFF' }}
                >
                  Compare
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
