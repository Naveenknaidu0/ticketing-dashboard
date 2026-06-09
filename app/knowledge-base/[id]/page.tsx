'use client'

import { useState } from 'react'
import { useApp } from '@/app/app-context'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { Edit3, Send, Check, X, Archive, Printer, Download, Share2, Heart, Eye, ThumbsUp, ThumbsDown, MessageSquare, Link as LinkIcon, Clock, User, FileText } from 'lucide-react'

// Mock article data
const mockArticle = {
  id: '1',
  title: 'VPN Troubleshooting Guide',
  category: 'Network',
  type: 'Troubleshooting Guide',
  status: 'Published',
  version: 'v2.4',
  author: 'John Smith',
  createdDate: 'Jan 15, 2024',
  updatedDate: 'Mar 10, 2024',
  views: 1245,
  helpfulVotes: 98,
  linkedTickets: 312,
  isFavorite: false,
  
  sections: {
    overview: {
      purpose: 'This guide helps users troubleshoot common VPN connection issues and restore connectivity.',
      description: 'VPN (Virtual Private Network) issues can prevent employees from accessing corporate resources. This guide provides systematic troubleshooting steps to resolve most common connectivity problems.',
      businessImpact: 'VPN outages impact productivity. Most issues can be resolved within 15 minutes using this guide.',
    },
    problem: {
      description: 'Users cannot connect to the corporate VPN or experience frequent disconnections.',
      symptoms: [
        'Unable to authenticate to VPN service',
        'Connection fails with timeout errors',
        'VPN client crashes on startup',
        'Frequent unexpected disconnections',
      ],
      affectedServices: ['Corporate Network Access', 'Email Service', 'File Server Access', 'Remote Desktop'],
      affectedUsers: 'Remote workers, branch office staff, contractors',
    },
    symptoms: {
      indicators: [
        'Error message: "Authentication Failed"',
        'Error code: ERR_VPN_TIMEOUT',
        'Client freezes during connection',
        'Firewall blocks VPN port',
      ],
      errorMessages: [
        'ERR_CONN_001: Unable to reach VPN gateway',
        'ERR_AUTH_002: Invalid credentials',
        'ERR_TIMEOUT_003: Connection timeout',
      ],
      observedBehavior: 'Connection attempt hangs for 60+ seconds before failing with generic error message.',
    },
    rootCause: {
      knownCauses: [
        'Local firewall blocking VPN traffic',
        'Outdated VPN client',
        'Network connectivity issues',
        'VPN gateway maintenance',
        'MFA token expired',
      ],
      dependencies: 'VPN client v4.2+, .NET Framework 4.6+, TCP/UDP port 443',
      infrastructureImpact: 'VPN gateway load, bandwidth utilization',
    },
    resolution: [
      {
        step: 1,
        action: 'Verify Network Connectivity',
        details: 'Ping 8.8.8.8 to confirm internet connectivity. If ping fails, resolve internet issues first.',
        expected: 'Successfully receive ping responses from internet host',
      },
      {
        step: 2,
        action: 'Restart VPN Client',
        details: 'Close all VPN connections, restart the VPN client application, and attempt connection again.',
        expected: 'VPN client restarts without errors',
      },
      {
        step: 3,
        action: 'Check Firewall Settings',
        details: 'Verify Windows Firewall or third-party firewall allows VPN traffic on ports 443, 1194 (UDP), and 1195 (TCP).',
        expected: 'Firewall rules permit VPN traffic',
      },
      {
        step: 4,
        action: 'Update VPN Client',
        details: 'Download and install latest VPN client from company portal. Current version: 4.5.2.',
        expected: 'Client updates to latest version without errors',
      },
      {
        step: 5,
        action: 'Clear VPN Cache',
        details: 'Navigate to %appdata%/vpn-client/cache and delete contents. Restart VPN client.',
        expected: 'VPN client connects on next attempt',
      },
    ],
    workaround: {
      description: 'If primary VPN connection fails, use the following temporary solutions:',
      steps: [
        'Use mobile hotspot from personal device as temporary connectivity',
        'Access cloud-based services requiring VPN through VPN web portal',
        'Request temporary access bypass for non-VPN remote resources',
      ],
    },
    attachments: [
      { id: 1, name: 'VPN_Setup_Diagram.pdf', type: 'PDF', size: '2.3 MB' },
      { id: 2, name: 'Firewall_Configuration_Guide.docx', type: 'Document', size: '845 KB' },
      { id: 3, name: 'VPN_Client_Installation.mp4', type: 'Video', size: '125 MB' },
    ],
    relatedArticles: [
      { title: 'MFA Authentication Failed', category: 'Access Management', relationship: 'Related' },
      { title: 'Network Troubleshooting Steps', category: 'Network', relationship: 'Related' },
      { title: 'Remote Access Alternatives', category: 'Network', relationship: 'Alternative Solution' },
    ],
    relatedTickets: [
      { id: 'INC-2401', subject: 'VPN Not Connecting', status: 'Resolved', resolution: 'Applied guide step 3' },
      { id: 'INC-2198', subject: 'Frequent VPN Disconnections', status: 'Resolved', resolution: 'Updated VPN client' },
    ],
    versionHistory: [
      { version: 'v2.4', editor: 'John Smith', date: 'Mar 10, 2024', summary: 'Added MFA troubleshooting section' },
      { version: 'v2.3', editor: 'Sarah Chen', date: 'Feb 15, 2024', summary: 'Updated firewall rules for new gateway' },
      { version: 'v2.2', editor: 'John Smith', date: 'Jan 20, 2024', summary: 'Added Windows 11 compatibility notes' },
    ],
    comments: [
      { author: 'Sarah Chen (Manager)', date: 'Mar 9', note: 'Great update. Approved for publishing.' },
      { author: 'Alex Rodriguez (Agent)', date: 'Mar 8', note: 'Suggestion: Add troubleshooting for macOS users' },
    ],
  },
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const { userRole } = useApp()
  const [isFavorite, setIsFavorite] = useState(mockArticle.isFavorite)
  const [helpfulVotes, setHelpfulVotes] = useState(mockArticle.helpfulVotes)
  const [selectedHelpful, setSelectedHelpful] = useState<'helpful' | 'notHelpful' | null>(null)

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Knowledge Base', href: '/knowledge-base' },
    { label: mockArticle.category, href: `/knowledge-base?category=${mockArticle.category}` },
    { label: mockArticle.title },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return { bg: '#F3F4F6', text: '#6B7280' }
      case 'In Review': return { bg: '#FEF3C7', text: '#D97706' }
      case 'Approved': return { bg: '#DBEAFE', text: '#0284C7' }
      case 'Published': return { bg: '#DCFCE7', text: '#16A34A' }
      case 'Archived': return { bg: '#F3F4F6', text: '#6B7280' }
      default: return { bg: '#F9F9F8', text: '#6B6B6B' }
    }
  }

  const statusColor = getStatusColor(mockArticle.status)

  const isManager = userRole === 'manager'
  const isKnowledgeOwner = userRole === 'manager'

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b px-8 py-6" style={{ borderColor: '#E2E0DC' }}>
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Title Section */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>
                  {mockArticle.title}
                </h1>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: '#6B6B6B' }}>
                    {mockArticle.category}
                  </span>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>•</span>
                  <span className="text-sm" style={{ color: '#6B6B6B' }}>
                    {mockArticle.type}
                  </span>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>•</span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                  >
                    {mockArticle.status}
                  </span>
                  <span className="text-sm" style={{ color: '#9CA3AF' }}>•</span>
                  <span className="text-sm font-medium" style={{ color: '#1a1a1a' }}>
                    {mockArticle.version}
                  </span>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isKnowledgeOwner && (
                  <>
                    <button
                      className="p-2 rounded-lg transition-all border"
                      style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                      title="Edit"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    {mockArticle.status === 'Draft' && (
                      <button
                        className="p-2 rounded-lg transition-all border"
                        style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                        title="Submit for Review"
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    )}
                  </>
                )}
                
                {isManager && mockArticle.status === 'In Review' && (
                  <>
                    <button
                      className="p-2 rounded-lg transition-all border"
                      style={{ borderColor: '#E2E0DC', color: '#16A34A', backgroundColor: '#F9F9F8' }}
                      title="Approve"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 rounded-lg transition-all border"
                      style={{ borderColor: '#E2E0DC', color: '#DC2626', backgroundColor: '#F9F9F8' }}
                      title="Reject"
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}

                {isManager && mockArticle.status === 'Approved' && (
                  <button
                    className="px-4 py-2 rounded-lg font-medium transition-all border"
                    style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                    title="Publish"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                  >
                    Publish
                  </button>
                )}

                <button
                  className="p-2 rounded-lg transition-all border"
                  style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                  title="Print"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                >
                  <Printer className="w-5 h-5" />
                </button>

                <button
                  className="p-2 rounded-lg transition-all border"
                  style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                  title="Export PDF"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                >
                  <Download className="w-5 h-5" />
                </button>

                <button
                  className="p-2 rounded-lg transition-all border"
                  style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                  title="Share Link"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-lg transition-all border"
                  style={{
                    borderColor: '#E2E0DC',
                    color: isFavorite ? '#DC2626' : '#1a1a1a',
                    backgroundColor: isFavorite ? '#FEE2E2' : '#F9F9F8'
                  }}
                  title="Favorite"
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isFavorite ? '#FCD5D5' : '#F0F0ED'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isFavorite ? '#FEE2E2' : '#F9F9F8'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Article Metadata */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t" style={{ borderColor: '#E2E0DC' }}>
              <div>
                <p className="text-xs font-bold" style={{ color: '#6B6B6B' }}>AUTHOR</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#1a1a1a' }}>{mockArticle.author}</p>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#6B6B6B' }}>CREATED</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#1a1a1a' }}>{mockArticle.createdDate}</p>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#6B6B6B' }}>UPDATED</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#1a1a1a' }}>{mockArticle.updatedDate}</p>
              </div>
              <div>
                <p className="text-xs font-bold" style={{ color: '#6B6B6B' }}>VIEWS</p>
                <p className="text-sm font-medium mt-1" style={{ color: '#1a1a1a' }}>{mockArticle.views.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Top Information Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 rounded-lg" style={{ backgroundColor: '#F9F9F8' }}>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" style={{ color: '#73847B' }} />
              <div>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Views</p>
                <p className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{mockArticle.views.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-5 h-5" style={{ color: '#73847B' }} />
              <div>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Helpful</p>
                <p className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{helpfulVotes}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" style={{ color: '#73847B' }} />
              <div>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Comments</p>
                <p className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{mockArticle.sections.comments.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" style={{ color: '#73847B' }} />
              <div>
                <p className="text-xs" style={{ color: '#6B6B6B' }}>Linked Tickets</p>
                <p className="text-lg font-bold" style={{ color: '#1a1a1a' }}>{mockArticle.linkedTickets}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            {/* Section 1: Overview */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Overview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Purpose</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.overview.purpose}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Description</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.overview.description}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#F0F4F2', borderLeft: '4px solid #73847B' }}>
                  <h3 className="font-bold mb-1" style={{ color: '#1a1a1a' }}>Business Impact</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.overview.businessImpact}</p>
                </div>
              </div>
            </div>

            {/* Section 2: Problem */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Problem</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Issue</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.problem.description}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Symptoms</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {mockArticle.sections.problem.symptoms.map((symptom, idx) => (
                      <li key={idx} style={{ color: '#6B6B6B' }}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Affected Services</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.problem.affectedServices.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Affected Users</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.problem.affectedUsers}</p>
                </div>
              </div>
            </div>

            {/* Section 3: Root Cause */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Root Cause</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Known Causes</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {mockArticle.sections.rootCause.knownCauses.map((cause, idx) => (
                      <li key={idx} style={{ color: '#6B6B6B' }}>{cause}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>Dependencies</h3>
                  <p style={{ color: '#6B6B6B' }}>{mockArticle.sections.rootCause.dependencies}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Resolution (Step-by-step) */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Resolution Steps</h2>
              <div className="space-y-4">
                {mockArticle.sections.resolution.map((step) => (
                  <div key={step.step} className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
                        style={{ backgroundColor: '#F0F4F2', color: '#73847B' }}
                      >
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: '#1a1a1a' }}>{step.action}</h3>
                        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>{step.details}</p>
                        <p className="text-sm mt-2 p-2 rounded" style={{ backgroundColor: '#F0F4F2', color: '#6B6B6B' }}>
                          <strong>Expected Result:</strong> {step.expected}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 5: Workaround */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Workaround (Temporary)</h2>
              <div className="p-4 rounded-lg border-l-4" style={{ borderColor: '#FCD34D', backgroundColor: '#FFFBEB' }}>
                <p className="mb-3" style={{ color: '#6B6B6B' }}>{mockArticle.sections.workaround.description}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {mockArticle.sections.workaround.steps.map((step, idx) => (
                    <li key={idx} style={{ color: '#6B6B6B' }}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Section 6: Attachments */}
            {mockArticle.sections.attachments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Attachments</h2>
                <div className="space-y-2">
                  {mockArticle.sections.attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      className="w-full p-3 rounded-lg border text-left transition-all"
                      style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F9F8' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5" style={{ color: '#73847B' }} />
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: '#1a1a1a' }}>{attachment.name}</p>
                          <p className="text-xs" style={{ color: '#6B6B6B' }}>{attachment.type} • {attachment.size}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 7: Related Articles */}
            {mockArticle.sections.relatedArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Related Articles</h2>
                <div className="space-y-2">
                  {mockArticle.sections.relatedArticles.map((article, idx) => (
                    <button
                      key={idx}
                      className="w-full p-3 rounded-lg border text-left transition-all"
                      style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F9F8' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium" style={{ color: '#1a1a1a' }}>{article.title}</p>
                          <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>{article.category}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F0F4F2', color: '#73847B' }}>
                          {article.relationship}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Section 8: Related Tickets */}
            {mockArticle.sections.relatedTickets.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Related Tickets</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead style={{ backgroundColor: '#F9F9F8', borderColor: '#E2E0DC' }} className="border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Ticket ID</th>
                        <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Subject</th>
                        <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Status</th>
                        <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Resolution</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockArticle.sections.relatedTickets.map((ticket, idx) => (
                        <tr key={idx} className="border-b" style={{ borderColor: '#E2E0DC' }}>
                          <td className="px-4 py-3 font-medium" style={{ color: '#73847B' }}>{ticket.id}</td>
                          <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{ticket.subject}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#DCFCE7', color: '#16A34A' }}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{ticket.resolution}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 9: Version History */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Version History</h2>
              <div className="space-y-2">
                {mockArticle.sections.versionHistory.map((version, idx) => (
                  <div key={idx} className="p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F9F8' }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold" style={{ color: '#1a1a1a' }}>{version.version}</p>
                        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>{version.summary}</p>
                      </div>
                      <div className="text-right text-xs" style={{ color: '#6B6B6B' }}>
                        <p>{version.editor}</p>
                        <p>{version.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 10: Comments & Review Feedback */}
            {mockArticle.sections.comments.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Comments & Review Feedback</h2>
                <div className="space-y-3">
                  {mockArticle.sections.comments.map((comment, idx) => (
                    <div key={idx} className="p-4 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F9F8' }}>
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-bold" style={{ color: '#1a1a1a' }}>{comment.author}</p>
                        <p className="text-xs" style={{ color: '#6B6B6B' }}>{comment.date}</p>
                      </div>
                      <p style={{ color: '#6B6B6B' }}>{comment.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 11: Helpfulness Feedback */}
            <div className="mb-12 p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F0F4F2' }}>
              <p className="font-bold mb-4" style={{ color: '#1a1a1a' }}>Was this article helpful?</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedHelpful('helpful')}
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: selectedHelpful === 'helpful' ? '#16A34A' : '#FFFFFF',
                    color: selectedHelpful === 'helpful' ? '#FFFFFF' : '#1a1a1a',
                    borderColor: '#E2E0DC',
                    border: '1px solid',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedHelpful !== 'helpful') e.currentTarget.style.backgroundColor = '#F9F9F8'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedHelpful !== 'helpful') e.currentTarget.style.backgroundColor = '#FFFFFF'
                  }}
                >
                  <ThumbsUp className="w-4 h-4 inline mr-2" />
                  Yes
                </button>
                <button
                  onClick={() => setSelectedHelpful('notHelpful')}
                  className="px-4 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: selectedHelpful === 'notHelpful' ? '#DC2626' : '#FFFFFF',
                    color: selectedHelpful === 'notHelpful' ? '#FFFFFF' : '#1a1a1a',
                    borderColor: '#E2E0DC',
                    border: '1px solid',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedHelpful !== 'notHelpful') e.currentTarget.style.backgroundColor = '#F9F9F8'
                  }}
                  onMouseLeave={(e) => {
                    if (selectedHelpful !== 'notHelpful') e.currentTarget.style.backgroundColor = '#FFFFFF'
                  }}
                >
                  <ThumbsDown className="w-4 h-4 inline mr-2" />
                  No
                </button>
              </div>
              {selectedHelpful === 'notHelpful' && (
                <div className="mt-4">
                  <textarea
                    placeholder="Please tell us how we can improve this article..."
                    className="w-full p-3 rounded-lg border outline-none text-sm"
                    style={{ borderColor: '#E2E0DC', color: '#1a1a1a' }}
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Article Navigation */}
            <div className="flex items-center justify-between pt-8 border-t" style={{ borderColor: '#E2E0DC' }}>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-all border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                ← Previous Article
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-all border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                Next Article →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
