'use client'

interface SLARiskQueueDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  filterType?: 'at-risk' | 'breached' | 'due-soon' | 'all'
  filters?: {
    group?: string
    priority?: string
  }
}

export function SLARiskQueueDrawer({ isOpen, onClose, title, filterType = 'all', filters }: SLARiskQueueDrawerProps) {
  if (!isOpen) return null

  const slaRiskQueue = [
    { id: 'INC-001245', subject: 'VPN Connection Failed', priority: 'Critical', group: 'Infrastructure', agent: 'John Smith', remaining: '42 mins', risk: 'Critical', status: 'Open' },
    { id: 'INC-001242', subject: 'Email Configuration Issue', priority: 'High', group: 'Application Support', agent: 'Emma Davis', remaining: '2h 15m', risk: 'High', status: 'In Progress' },
    { id: 'INC-001240', subject: 'Network Latency', priority: 'Critical', group: 'Network', agent: 'Mike Chen', remaining: '1h 30m', risk: 'Critical', status: 'Pending User' },
    { id: 'INC-001238', subject: 'Access Request - Database', priority: 'High', group: 'Access Management', agent: 'Sarah Johnson', remaining: '4h 45m', risk: 'High', status: 'Pending Vendor' },
    { id: 'INC-001235', subject: 'System Backup Failed', priority: 'Critical', group: 'Infrastructure', agent: 'James Wilson', remaining: '30 mins', risk: 'Critical', status: 'Open' },
  ]

  // Filter based on filterType and other filters
  const filteredQueue = slaRiskQueue.filter(item => {
    if (filterType === 'at-risk' && item.risk !== 'At Risk') return false
    if (filterType === 'breached' && item.risk !== 'Breached') return false
    if (filters?.group && filters.group !== 'all' && item.group.toLowerCase() !== filters.group) return false
    if (filters?.priority && filters.priority !== 'all' && item.priority.toLowerCase() !== filters.priority) return false
    return true
  })

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-xl z-50 overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E2E0DC' }}>
          <h2 className="text-lg font-semibold" style={{ color: '#1a1a1a' }}>{title}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="p-6">
          {filteredQueue.length === 0 ? (
            <div className="text-center py-12" style={{ color: '#6B6B6B' }}>
              <p className="text-sm">No matching SLA records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQueue.map((item) => (
                <div key={item.id} className="border rounded-lg p-4" style={{ borderColor: '#E2E0DC' }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{item.id}</p>
                      <p className="text-sm" style={{ color: '#6B6B6B' }}>{item.subject}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{
                      backgroundColor: item.risk === 'Critical' ? '#FEE2E2' : '#FEF3C7',
                      color: item.risk === 'Critical' ? '#DC2626' : '#D97706'
                    }}>
                      {item.risk}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: '#6B6B6B' }}>
                    <div>Priority: {item.priority}</div>
                    <div>Group: {item.group}</div>
                    <div>Agent: {item.agent}</div>
                    <div className="font-semibold" style={{ color: '#DC2626' }}>Remaining: {item.remaining}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
