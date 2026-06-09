'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useStore } from '@/app/store-context'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MoreVertical,
  Plus,
  ChevronDown,
  Info,
  Send,
  Paperclip,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Link as LinkIcon,
  MessageSquare,
  Zap,
} from 'lucide-react'

// Mock history
const mockHistory = [
  { id: 1, user: 'John Smith', date: '12 Jun 2026', time: '10:30', action: 'Ticket Created', detail: 'Ticket created' },
  { id: 2, user: 'Sarah Chen', date: '12 Jun 2026', time: '11:15', action: 'Status Changed', detail: 'Open → In Progress' },
  { id: 3, user: 'Sarah Chen', date: '13 Jun 2026', time: '14:20', action: 'Assignment Changed', detail: 'Assigned to Sarah Chen' },
  { id: 4, user: 'Mike Johnson', date: '14 Jun 2026', time: '09:00', action: 'Priority Changed', detail: 'Medium → High' },
]

// Mock comments
const mockComments = [
  { id: 1, author: 'John Smith', role: 'Requester', timestamp: '12 Jun 2026 10:30', message: 'I need VPN access urgently for a project starting this week.' },
  { id: 2, author: 'Sarah Chen', role: 'Agent', timestamp: '12 Jun 2026 11:15', message: 'Hi John, I\'ve received your request. I\'m verifying your access level with the infrastructure team.' },
  { id: 3, author: 'John Smith', role: 'Requester', timestamp: '12 Jun 2026 14:00', message: 'Thanks for the quick response. Please let me know if you need any additional information.' },
]

// Mock internal notes
const mockInternalNotes = [
  { id: 1, author: 'Sarah Chen', timestamp: '12 Jun 2026 11:30', note: 'Verified user department and role in system. Request appears legitimate.' },
  { id: 2, author: 'Mike Johnson', timestamp: '13 Jun 2026 16:45', note: 'Escalated priority due to project deadline. Coordinating with network team.' },
]

// Mock associated tickets
const mockAssociatedTickets = {
  parent: [
    { id: 'INC-000580', subject: 'New Onboarding - John Smith', status: 'In Progress', priority: 'High' },
  ],
  child: [
    { id: 'INC-000594', subject: 'Configure VPN Gateway', status: 'Open', priority: 'High' },
  ],
  linked: [
    { id: 'INC-000562', subject: 'Similar VPN Access Issue', status: 'Resolved', priority: 'Medium' },
  ],
}

// Mock tasks
const mockTasks = [
  { id: 1, name: 'Verify user credentials', assignedTo: 'Sarah Chen', status: 'Completed', dueDate: '13 Jun 2026' },
  { id: 2, name: 'Configure VPN permissions', assignedTo: 'Mike Johnson', status: 'In Progress', dueDate: '15 Jun 2026' },
  { id: 3, name: 'Send credentials to user', assignedTo: 'Sarah Chen', status: 'Open', dueDate: '16 Jun 2026' },
]

// Mock documents
const mockDocuments = [
  { id: 1, name: 'vpn_setup_guide.pdf', uploadedBy: 'Sarah Chen', uploadDate: '12 Jun 2026', size: '2.4 MB' },
  { id: 2, name: 'user_access_form.xlsx', uploadedBy: 'John Smith', uploadDate: '12 Jun 2026', size: '156 KB' },
]

// Mock work logs
const mockWorkLogs = [
  { id: 1, date: '12 Jun 2026', agent: 'Sarah Chen', timeSpent: '45 Minutes', description: 'Reviewed VPN request and verified user credentials' },
  { id: 2, date: '13 Jun 2026', agent: 'Mike Johnson', timeSpent: '60 Minutes', description: 'Configured VPN access and permissions in the system' },
]

function getStatusColor(status: string) {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-800'
    case 'In Progress':
      return 'bg-blue-100 text-blue-800'
    case 'Open':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High':
      return '#E76F51'
    case 'Medium':
      return '#E9C46A'
    case 'Low':
      return '#2A9D8F'
    default:
      return '#E2E8F0'
  }
}

export default function TicketWorkspacePage() {
  const params = useParams()
  const ticketId = params?.id as string
  const { state } = useStore()
  
  const [activeTab, setActiveTab] = useState('history')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    timeTracker: true,
    slaStatus: true,
    ticketDetails: true,
    additionalFields: true,
  })

  // Load ticket from store
  const storeTicket = state?.tickets.get(ticketId)
  const requester = storeTicket ? state?.users.get(storeTicket.createdBy) : null
  const assignedUser = storeTicket && storeTicket.assignedTo ? state?.users.get(storeTicket.assignedTo) : null

  // Fallback mock ticket if not in store
  const mockTicket = {
    id: 'INC-000593',
    subject: 'VPN Access Request',
    status: 'In Progress',
    priority: 'High',
    requester: { name: 'John Smith', email: 'john@company.com' },
    group: 'Infrastructure',
    assignedTo: 'Sarah Chen',
    createdDate: '12 Jun 2026',
    channel: 'Email',
    description: 'User needs VPN access to connect to the corporate network from home office.',
    detailedDescription: 'John Smith requires VPN access to connect remotely to the corporate network.',
    supportLevel: 'Standard',
    slaStatus: 'At Risk',
    category: 'Access Control',
    subcategory: 'VPN Access',
    department: 'Sales',
    tags: ['urgent', 'vpn', 'access'],
    updatedDate: '14 Jun 2026',
  }

  // Use store ticket if available, otherwise use mock
  const displayTicket = storeTicket ? {
    id: storeTicket.id,
    subject: storeTicket.title,
    status: storeTicket.status.charAt(0).toUpperCase() + storeTicket.status.slice(1).replace('-', ' '),
    priority: storeTicket.priority.charAt(0).toUpperCase() + storeTicket.priority.slice(1),
    requester: {
      name: requester?.name || 'Unknown',
      email: requester?.email || '',
    },
    group: storeTicket.category || 'General',
    assignedTo: assignedUser?.name || 'Unassigned',
    createdDate: new Date(storeTicket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    channel: 'System',
    description: storeTicket.description || '',
    detailedDescription: storeTicket.description || '',
    supportLevel: 'Standard',
    slaStatus: 'At Risk',
    category: storeTicket.category || 'General',
    subcategory: 'General',
    department: 'General',
    tags: storeTicket.tags || [],
    updatedDate: new Date(storeTicket.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  } : mockTicket

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <AppShell>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-4">
          <Breadcrumb items={[
            { label: 'Tickets', href: '/tickets' },
            { label: displayTicket.id }
          ]} />
          <div className="mt-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>
                  #{displayTicket.id}
                </h1>
                <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: getStatusColor(displayTicket.status).split(' ')[0], color: getStatusColor(displayTicket.status).split(' ')[1] }}>
                  {displayTicket.status}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-gray-800">{displayTicket.subject}</h2>
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Requester:</span> {displayTicket.requester.name}
                  <br />
                  <a href={`mailto:${displayTicket.requester.email}`} className="text-blue-600 hover:underline">
                    {displayTicket.requester.email}
                  </a>
                </div>
                <div>
                  <span className="font-medium">Created:</span> {displayTicket.createdDate}
                  <br />
                  <span className="font-medium">Channel:</span> {displayTicket.channel}
                </div>
                <div>
                  <span className="font-medium">Group:</span> {displayTicket.group}
                </div>
                <div>
                  <span className="font-medium">Priority:</span>
                  <span className="ml-2 inline-block w-3 h-3 rounded-full" style={{ backgroundColor: getPriorityColor(displayTicket.priority) }}></span>
                  {displayTicket.priority}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Assign
              </Button>
              <Button size="sm" variant="outline">
                Change Status
              </Button>
              <Button size="sm" variant="outline">
                Add Internal Note
              </Button>
              <Button size="sm" variant="outline">
                Add Work Log
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                Resolve
              </Button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden bg-gray-50">
          {/* Left Side - 75% */}
          <div className="flex-1 overflow-auto border-r border-gray-200">
            {/* Description Section */}
            <div className="bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold" style={{ color: '#0D3133' }}>
                    Description
                  </h3>
                  <span className="text-gray-400 cursor-help" title="Issue details and request information">
                    <Info className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Issue Summary</h4>
                  <p className="text-gray-700">{displayTicket.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Detailed Description</h4>
                  <p className="text-gray-700">{displayTicket.detailedDescription}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white">
              <div className="border-b border-gray-200 px-6">
                <div className="flex gap-8 overflow-x-auto">
                  {['history', 'comments', 'internal-notes', 'associated-tickets', 'tasks', 'documents', 'work-logs'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab
                          ? 'border-orange-500 text-orange-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                      style={activeTab === tab ? { borderBottomColor: '#E69F50', color: '#E69F50' } : {}}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className="space-y-4">
                    {mockHistory.map((item, index) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-white">
                            {item.user.charAt(0)}
                          </div>
                          {index !== mockHistory.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{item.user} {item.action}</p>
                              <p className="text-sm text-gray-600">{item.detail}</p>
                            </div>
                            <span className="text-xs text-gray-500">{item.date} {item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    {mockComments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-xs font-semibold text-white">
                            {comment.author.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{comment.author}</p>
                            <p className="text-xs text-gray-500">{comment.timestamp}</p>
                          </div>
                          <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ backgroundColor: comment.role === 'Agent' ? '#E8F5E9' : '#FFF3E0' }}>
                            {comment.role}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    ))}
                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                      <textarea
                        placeholder="Write your reply here..."
                        className="w-full border-none outline-none resize-none mb-3"
                        rows={3}
                      />
                      <div className="flex justify-between items-center">
                        <button className="p-2 hover:bg-gray-100 rounded">
                          <Paperclip className="w-5 h-5 text-gray-600" />
                        </button>
                        <Button size="sm" style={{ backgroundColor: '#E69F50' }} className="text-white">
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Internal Notes Tab */}
                {activeTab === 'internal-notes' && (
                  <div className="space-y-4">
                    {mockInternalNotes.map(note => (
                      <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{note.author}</p>
                            <p className="text-xs text-gray-500">{note.timestamp}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">Private Note</span>
                        </div>
                        <p className="text-gray-700">{note.note}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Internal Note
                    </Button>
                  </div>
                )}

                {/* Associated Tickets Tab */}
                {activeTab === 'associated-tickets' && (
                  <div className="space-y-6">
                    {mockAssociatedTickets.parent.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Parent Ticket</h4>
                        {mockAssociatedTickets.parent.map(ticket => (
                          <div key={ticket.id} className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{ticket.id}</p>
                              <p className="text-sm text-gray-600">{ticket.subject}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                              {ticket.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {mockAssociatedTickets.child.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Child Tickets</h4>
                        {mockAssociatedTickets.child.map(ticket => (
                          <div key={ticket.id} className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{ticket.id}</p>
                              <p className="text-sm text-gray-600">{ticket.subject}</p>
                            </div>
                            <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#FFF3E0', color: '#F57F17' }}>
                              {ticket.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Task Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Assigned To</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockTasks.map(task => (
                            <tr key={task.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4">{task.name}</td>
                              <td className="py-3 px-4">{task.assignedTo}</td>
                              <td className="py-3 px-4">
                                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: task.status === 'Completed' ? '#E8F5E9' : task.status === 'In Progress' ? '#E3F2FD' : '#FFF3E0' }}>
                                  {task.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{task.dueDate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    {mockDocuments.map(doc => (
                      <div key={doc.id} className="bg-gray-50 p-4 rounded border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.uploadedBy} • {doc.uploadDate} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost">
                          Download
                        </Button>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                )}

                {/* Work Logs Tab */}
                {activeTab === 'work-logs' && (
                  <div className="space-y-4">
                    {mockWorkLogs.map(log => (
                      <div key={log.id} className="bg-gray-50 p-4 rounded border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{log.date}</p>
                            <p className="text-sm text-gray-600">{log.agent}</p>
                          </div>
                          <span className="text-sm font-semibold" style={{ color: '#E69F50' }}>
                            {log.timeSpent}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{log.description}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Work Log
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - 25% */}
          <div className="w-96 overflow-auto bg-white border-l border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4" style={{ color: '#0D3133' }}>
              Ticket Properties
            </h3>

            {/* Time Tracker */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('timeTracker')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#E69F50' }} />
                  <span className="font-medium text-gray-900">Time Tracker</span>
                </div>
                {expandedSections.timeTracker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.timeTracker && (
                <div className="p-4 space-y-3">
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Time Logged</p>
                    <p className="font-semibold text-lg text-gray-900">1h 45m</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">First Response Time</p>
                    <p className="font-semibold text-gray-900">45 minutes</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Last Activity</p>
                    <p className="font-semibold text-gray-900">2 hours ago</p>
                  </div>
                </div>
              )}
            </div>

            {/* SLA Status */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('slaStatus')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" style={{ color: '#E9C46A' }} />
                  <span className="font-medium text-gray-900">SLA Status</span>
                </div>
                {expandedSections.slaStatus ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.slaStatus && (
                <div className="p-4 space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Response SLA</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Resolution SLA</span>
                      <span className="font-semibold">84%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ticket Details */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('ticketDetails')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: '#0D3133' }} />
                  <span className="font-medium text-gray-900">Ticket Details</span>
                </div>
                {expandedSections.ticketDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.ticketDetails && (
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900">{displayTicket.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Group</p>
                    <p className="font-medium text-gray-900">{displayTicket.group}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Priority</p>
                    <p className="font-medium text-gray-900">{displayTicket.priority}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Status</p>
                    <p className="font-medium text-gray-900">{displayTicket.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Support Level</p>
                    <p className="font-medium text-gray-900">{displayTicket.supportLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Category</p>
                    <p className="font-medium text-gray-900">{displayTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Subcategory</p>
                    <p className="font-medium text-gray-900">{displayTicket.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Due Date</p>
                    <p className="font-medium text-gray-900">15 Jun 2026</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Fields */}
            <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('additionalFields')}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: '#2A9D8F' }} />
                  <span className="font-medium text-gray-900">Additional Fields</span>
                </div>
                {expandedSections.additionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedSections.additionalFields && (
                <div className="p-4 space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Source</p>
                    <p className="font-medium text-gray-900">Email</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Created Date</p>
                    <p className="font-medium text-gray-900">{displayTicket.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Updated Date</p>
                    <p className="font-medium text-gray-900">{displayTicket.updatedDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Department</p>
                    <p className="font-medium text-gray-900">{displayTicket.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {displayTicket.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="border-t border-gray-200 bg-white px-8 py-3 flex items-center justify-between shadow-lg">
          <p className="text-sm text-gray-600">Ticket #INC-000593 • Last updated 2 hours ago</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Save
            </Button>
            <Button size="sm" variant="outline">
              Assign
            </Button>
            <Button size="sm" variant="outline">
              Change Status
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
              Resolve
            </Button>
            <Button size="sm" variant="outline">
              Close Ticket
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
