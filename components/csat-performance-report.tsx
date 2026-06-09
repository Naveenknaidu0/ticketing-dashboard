'use client'

import { useState } from 'react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, Area, AreaChart 
} from 'recharts'
import { Info, TrendingUp, TrendingDown, AlertCircle, Star } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ReportKPICardProps {
  label: string
  value: string
  trend: string
  comparison: string
  icon: React.ReactNode
  warningIndicator?: boolean
}

function ReportKPICard({ label, value, trend, comparison, icon, warningIndicator }: ReportKPICardProps) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{ borderColor: '#E2E0DC', backgroundColor: warningIndicator ? '#FEF3E2' : '#FFFFFF' }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium" style={{ color: '#73847B' }}>{label}</span>
        <div style={{ color: '#6B6B6B' }}>{icon}</div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>
        {value}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium" style={{ color: warningIndicator ? '#E69F50' : '#10B981' }}>
          {trend}
        </span>
        <span className="text-xs" style={{ color: '#6B6B6B' }}>
          {comparison}
        </span>
      </div>
    </div>
  )
}

// Sample data
const csatTrendData = [
  { period: 'Mon', avgRating: 4.5, responseRate: 72, positive: 85, negative: 8 },
  { period: 'Tue', avgRating: 4.3, responseRate: 68, positive: 80, negative: 12 },
  { period: 'Wed', avgRating: 4.6, responseRate: 75, positive: 88, negative: 7 },
  { period: 'Thu', avgRating: 4.2, responseRate: 65, positive: 78, negative: 15 },
  { period: 'Fri', avgRating: 4.4, responseRate: 70, positive: 83, negative: 10 },
  { period: 'Sat', avgRating: 4.7, responseRate: 78, positive: 90, negative: 5 },
  { period: 'Sun', avgRating: 4.8, responseRate: 82, positive: 92, negative: 3 },
]

const ratingDistributionData = [
  { name: '5 Star', value: 485, percentage: 42 },
  { name: '4 Star', value: 320, percentage: 28 },
  { name: '3 Star', value: 180, percentage: 16 },
  { name: '2 Star', value: 75, percentage: 7 },
  { name: '1 Star', value: 50, percentage: 4 },
]

const sentimentData = [
  { category: 'Positive', count: 805, percentage: 70 },
  { category: 'Neutral', count: 210, percentage: 18 },
  { category: 'Negative', count: 115, percentage: 10 },
]

const groupPerformanceData = [
  { group: 'Infrastructure', avgCSAT: 4.4, surveys: 285, positive: 88, negative: 8 },
  { group: 'Application Support', avgCSAT: 4.6, surveys: 312, positive: 91, negative: 5 },
  { group: 'Network', avgCSAT: 4.1, surveys: 198, positive: 78, negative: 18 },
  { group: 'Access Management', avgCSAT: 4.7, surveys: 165, positive: 94, negative: 3 },
  { group: 'L1', avgCSAT: 4.5, surveys: 245, positive: 89, negative: 7 },
  { group: 'L2', avgCSAT: 4.3, surveys: 220, positive: 85, negative: 10 },
  { group: 'L3', avgCSAT: 3.9, surveys: 140, positive: 72, negative: 22 },
]

const agentPerformanceData = [
  { rank: 1, agent: 'Sarah Johnson', csat: 4.8, surveys: 185, positive: 95, negative: 2, tickets: 245 },
  { rank: 2, agent: 'John Smith', csat: 4.7, surveys: 192, positive: 94, negative: 3, tickets: 265 },
  { rank: 3, agent: 'Emma Davis', csat: 4.6, surveys: 178, positive: 92, negative: 4, tickets: 232 },
  { rank: 4, agent: 'Mike Chen', csat: 4.5, surveys: 165, positive: 89, negative: 6, tickets: 218 },
  { rank: 5, agent: 'James Wilson', csat: 4.4, surveys: 158, positive: 87, negative: 8, tickets: 195 },
  { rank: 6, agent: 'Lisa Anderson', csat: 4.2, surveys: 142, positive: 82, negative: 12, tickets: 188 },
  { rank: 7, agent: 'Robert Miller', csat: 4.1, surveys: 135, positive: 80, negative: 14, tickets: 175 },
  { rank: 8, agent: 'Jennifer Lee', csat: 4.0, surveys: 128, positive: 78, negative: 16, tickets: 162 },
  { rank: 9, agent: 'David Brown', csat: 3.9, surveys: 118, positive: 75, negative: 18, tickets: 148 },
  { rank: 10, agent: 'Maria Garcia', csat: 3.8, surveys: 112, positive: 72, negative: 20, tickets: 135 },
]

const ticketTypeSatisfactionData = [
  { type: 'Incident', avgCSAT: 4.3, surveys: 485, positive: 82, negative: 12 },
  { type: 'Service Request', avgCSAT: 4.6, surveys: 380, positive: 90, negative: 5 },
  { type: 'Access Request', avgCSAT: 4.7, surveys: 245, positive: 93, negative: 3 },
  { type: 'Task', avgCSAT: 4.2, surveys: 145, positive: 78, negative: 15 },
]

const negativeReasonData = [
  { reason: 'Slow Resolution', count: 42, percentage: 36 },
  { reason: 'Poor Communication', count: 28, percentage: 24 },
  { reason: 'Long Wait Time', count: 22, percentage: 19 },
  { reason: 'Incorrect Resolution', count: 15, percentage: 13 },
  { reason: 'Repeated Follow-up', count: 8, percentage: 7 },
]

const positiveReasonData = [
  { reason: 'Fast Resolution', count: 285, percentage: 35 },
  { reason: 'Helpful Agent', count: 240, percentage: 30 },
  { reason: 'Clear Communication', count: 165, percentage: 20 },
  { reason: 'Knowledgeable Support', count: 85, percentage: 11 },
  { reason: 'First Contact Resolution', count: 30, percentage: 4 },
]

const commentsData = [
  { rating: 5, comment: 'Excellent support! Issue resolved quickly and professionally.', ticketId: 'INC-001245', group: 'Infrastructure', date: '2024-01-15' },
  { rating: 5, comment: 'Great communication throughout the process. Very satisfied!', ticketId: 'INC-001242', group: 'Application', date: '2024-01-15' },
  { rating: 1, comment: 'Waited 3 hours for response. Very disappointed.', ticketId: 'INC-001240', group: 'Network', date: '2024-01-14' },
  { rating: 4, comment: 'Good support but resolution took longer than expected.', ticketId: 'INC-001238', group: 'L1', date: '2024-01-14' },
  { rating: 2, comment: 'Had to follow up multiple times. Support quality needs improvement.', ticketId: 'INC-001235', group: 'L2', date: '2024-01-13' },
]

const drilldownData = [
  { ticketId: 'INC-001245', agent: 'Sarah Johnson', group: 'Infrastructure', rating: 5, sentDate: '2024-01-10', responseDate: '2024-01-15', sentiment: 'Positive' },
  { ticketId: 'INC-001242', agent: 'John Smith', group: 'Application', rating: 5, sentDate: '2024-01-10', responseDate: '2024-01-15', sentiment: 'Positive' },
  { ticketId: 'INC-001240', agent: 'Mike Chen', group: 'Network', rating: 1, sentDate: '2024-01-09', responseDate: '2024-01-14', sentiment: 'Negative' },
  { ticketId: 'INC-001238', agent: 'Emma Davis', group: 'L1', rating: 4, sentDate: '2024-01-09', responseDate: '2024-01-14', sentiment: 'Positive' },
  { ticketId: 'INC-001235', agent: 'James Wilson', group: 'L2', rating: 2, sentDate: '2024-01-08', responseDate: '2024-01-13', sentiment: 'Negative' },
  { ticketId: 'INC-001230', agent: 'Lisa Anderson', group: 'Infrastructure', rating: 5, sentDate: '2024-01-08', responseDate: '2024-01-13', sentiment: 'Positive' },
  { ticketId: 'INC-001228', agent: 'Robert Miller', group: 'Network', rating: 3, sentDate: '2024-01-07', responseDate: '2024-01-12', sentiment: 'Neutral' },
  { ticketId: 'INC-001225', agent: 'Jennifer Lee', group: 'Application', rating: 4, sentDate: '2024-01-07', responseDate: '2024-01-12', sentiment: 'Positive' },
]

const COLORS = ['#10B981', '#F59E0B', '#EF4444']

export function CSATPerformanceReport() {
  const [trendPeriod, setTrendPeriod] = useState('weekly')
  const [commentTab, setCommentTab] = useState('all')

  const filteredComments = commentTab === 'all' 
    ? commentsData 
    : commentTab === 'positive' 
    ? commentsData.filter(c => c.rating >= 4)
    : commentsData.filter(c => c.rating <= 2)

  return (
    <div className="space-y-6">
      {/* Row 1: CSAT KPI Cards */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>CSAT Performance Metrics</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
              </TooltipTrigger>
              <TooltipContent>Key performance indicators for customer satisfaction</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <ReportKPICard label="Avg CSAT Score" value="4.6/5" trend="↑ 8%" comparison="vs last week" icon={<Star className="w-5 h-5" />} />
          <ReportKPICard label="Response Rate" value="73.4%" trend="↑ 5%" comparison="vs last week" icon={<TrendingUp className="w-5 h-5" />} />
          <ReportKPICard label="Positive Feedback" value="86%" trend="↑ 3%" comparison="vs last week" icon={<TrendingUp className="w-5 h-5" />} />
          <ReportKPICard label="Negative Feedback" value="9%" trend="↓ 2%" comparison="vs last week" icon={<TrendingDown className="w-5 h-5" />} />
          <ReportKPICard label="Total Surveys Sent" value="1,255" trend="↑ 12%" comparison="vs last week" icon={<TrendingUp className="w-5 h-5" />} />
          <ReportKPICard label="Responses Received" value="920" trend="↑ 6%" comparison="vs last week" icon={<TrendingUp className="w-5 h-5" />} />
        </div>
      </div>

      {/* Row 2: Overall Satisfaction Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Overall Customer Satisfaction</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Average satisfaction across all survey responses</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="text-6xl font-bold mb-2" style={{ color: '#0D3133' }}>4.6</div>
            <div style={{ color: '#6B6B6B' }}>out of 5.0</div>
          </div>
          <div style={{ borderTopColor: '#E2E0DC', borderTopWidth: '1px' }} className="pt-6 mt-6">
            <p className="text-xs font-semibold mb-4" style={{ color: '#73847B' }}>RATING DISTRIBUTION</p>
            <div className="space-y-2">
              {ratingDistributionData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="text-sm font-medium" style={{ color: '#1a1a1a', minWidth: '60px' }}>{item.name}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2" style={{ backgroundColor: '#E2E0DC' }}>
                    <div className="h-2 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: '#10B981' }} />
                  </div>
                  <div className="text-sm font-medium" style={{ color: '#6B6B6B', minWidth: '50px' }}>{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Feedback Sentiment Overview</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Distribution of positive, neutral, and negative feedback</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" dataKey="value">
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value) => `${value} responses`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex gap-6 mt-4">
            {sentimentData.map((item, idx) => (
              <div key={item.category} className="flex-1 text-center">
                <div className="text-2xl font-bold" style={{ color: COLORS[idx] }}>{item.percentage}%</div>
                <div className="text-xs" style={{ color: '#6B6B6B' }}>{item.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: CSAT Trend Analysis */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>CSAT Trend Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Average rating and response rate trends over time</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(period => (
              <button key={period} onClick={() => setTrendPeriod(period.toLowerCase())} className="px-3 py-1 rounded text-sm font-medium transition-all" style={{ backgroundColor: trendPeriod === period.toLowerCase() ? '#E69F50' : '#F8F8F7', color: trendPeriod === period.toLowerCase() ? 'white' : '#1a1a1a', border: `1px solid ${trendPeriod === period.toLowerCase() ? '#E69F50' : '#E2E0DC'}` }}>
                {period}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={csatTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="period" stroke="#6B6B6B" />
            <YAxis yAxisId="left" stroke="#6B6B6B" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B6B6B" />
            <RechartsTooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgRating" stroke="#0D3133" strokeWidth={2} dot={{ fill: '#0D3133' }} name="Avg Rating" />
            <Bar yAxisId="right" dataKey="responseRate" fill="#E69F50" name="Response Rate %" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Row 4: Group-wise CSAT Performance */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>CSAT Performance by Group</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
              </TooltipTrigger>
              <TooltipContent>Customer satisfaction metrics by support group</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: '#F8F8F7' }}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>Group</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Avg CSAT</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Surveys</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Positive %</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Negative %</th>
              </tr>
            </thead>
            <tbody>
              {groupPerformanceData.map((item, idx) => (
                <tr key={item.group} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8F8F7' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.group}</td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: item.avgCSAT >= 4.5 ? '#10B981' : item.avgCSAT >= 4.0 ? '#F59E0B' : '#EF4444' }}>{item.avgCSAT.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{item.surveys}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#10B981' }}>{item.positive}%</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#EF4444' }}>{item.negative}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Agent-wise CSAT Performance */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Top 10 Agent Performance</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
              </TooltipTrigger>
              <TooltipContent>Ranking of agents by customer satisfaction scores</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: '#F8F8F7' }}>
              <tr>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Rank</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>Agent Name</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>CSAT Score</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Surveys</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Positive %</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Negative %</th>
              </tr>
            </thead>
            <tbody>
              {agentPerformanceData.map((item, idx) => (
                <tr key={item.agent} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8F8F7' }}>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: '#E69F50' }}>#{item.rank}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{item.agent}</td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: item.csat >= 4.6 ? '#10B981' : item.csat >= 4.0 ? '#F59E0B' : '#EF4444' }}>{item.csat.toFixed(1)}</td>
                  <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{item.surveys}</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#10B981' }}>{item.positive}%</td>
                  <td className="px-4 py-3 text-center font-semibold" style={{ color: '#EF4444' }}>{item.negative}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 6: Ticket Type Satisfaction */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>CSAT by Ticket Type</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
              </TooltipTrigger>
              <TooltipContent>Satisfaction levels across different ticket types</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ticketTypeSatisfactionData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
            <XAxis dataKey="type" stroke="#6B6B6B" />
            <YAxis stroke="#6B6B6B" />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="avgCSAT" fill="#0D3133" name="Avg CSAT" />
            <Bar dataKey="positive" fill="#10B981" name="Positive %" />
            <Bar dataKey="negative" fill="#EF4444" name="Negative %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Row 7 & 8: Feedback Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Negative Feedback Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Common reasons for negative customer feedback</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={negativeReasonData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis type="number" stroke="#6B6B6B" />
              <YAxis dataKey="reason" type="category" stroke="#6B6B6B" width={140} />
              <RechartsTooltip />
              <Bar dataKey="count" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center gap-2 mb-6">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Positive Feedback Analysis</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Most appreciated aspects of support service</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={positiveReasonData} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E0DC" />
              <XAxis type="number" stroke="#6B6B6B" />
              <YAxis dataKey="reason" type="category" stroke="#6B6B6B" width={140} />
              <RechartsTooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 9: Customer Comments */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Customer Comments</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
                </TooltipTrigger>
                <TooltipContent>Latest survey comments from customers</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {['All', 'Positive', 'Negative'].map(tab => (
              <button key={tab} onClick={() => setCommentTab(tab.toLowerCase())} className="px-3 py-1 rounded text-sm font-medium transition-all" style={{ backgroundColor: commentTab === tab.toLowerCase() ? '#E69F50' : '#F8F8F7', color: commentTab === tab.toLowerCase() ? 'white' : '#1a1a1a', border: `1px solid ${commentTab === tab.toLowerCase() ? '#E69F50' : '#E2E0DC'}` }}>
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {filteredComments.map((item, idx) => (
            <div key={idx} className="p-3 rounded border" style={{ borderColor: '#E2E0DC', backgroundColor: '#F8F8F7' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-bold" style={{ color: item.rating >= 4 ? '#10B981' : item.rating === 3 ? '#F59E0B' : '#EF4444' }}>
                    {Array(item.rating).fill('★').join('')}
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#73847B' }}>{item.ticketId}</span>
                  <span className="text-xs" style={{ color: '#A0A0A0' }}>·</span>
                  <span className="text-xs" style={{ color: '#73847B' }}>{item.group}</span>
                </div>
                <span className="text-xs" style={{ color: '#A0A0A0' }}>{item.date}</span>
              </div>
              <p className="text-sm" style={{ color: '#1a1a1a' }}>{item.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Row 10: Insights */}
      <div>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>CSAT Improvement Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border flex items-start gap-3" style={{ borderColor: '#E2E0DC', backgroundColor: '#F0FDF4' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
            <div>
              <p className="font-medium" style={{ color: '#1a1a1a' }}>Application Support improved CSAT by 9%</p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>Positive trend from process improvements</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border flex items-start gap-3" style={{ borderColor: '#E2E0DC', backgroundColor: '#F0FDF4' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#10B981' }} />
            <div>
              <p className="font-medium" style={{ color: '#1a1a1a' }}>Network Team received highest positive feedback</p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>Maintain momentum with current practices</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border flex items-start gap-3" style={{ borderColor: '#E2E0DC', backgroundColor: '#FEF3E2' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <div>
              <p className="font-medium" style={{ color: '#1a1a1a' }}>Response time reduction improved ratings by 12%</p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>Continue optimization efforts</p>
            </div>
          </div>
          <div className="p-4 rounded-lg border flex items-start gap-3" style={{ borderColor: '#E2E0DC', backgroundColor: '#FEF3E2' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
            <div>
              <p className="font-medium" style={{ color: '#1a1a1a' }}>L3 team shows lower satisfaction scores</p>
              <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>May indicate escalation fatigue - review resolution approach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 11: Drilldown Table */}
      <div className="p-6 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#1a1a1a' }}>Detailed CSAT Data</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button><Info className="w-4 h-4" style={{ color: '#6B6B6B' }} /></button>
              </TooltipTrigger>
              <TooltipContent>Ticket-by-ticket satisfaction data with all metrics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: '#F8F8F7' }}>
              <tr>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>Ticket ID</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>Agent</th>
                <th className="px-4 py-3 text-left font-semibold" style={{ color: '#73847B' }}>Group</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Rating</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Sent Date</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Response Date</th>
                <th className="px-4 py-3 text-center font-semibold" style={{ color: '#73847B' }}>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {drilldownData.map((item, idx) => (
                <tr key={item.ticketId} style={{ borderBottomColor: '#E2E0DC', borderBottomWidth: '1px', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8F8F7' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#0D3133' }}>{item.ticketId}</td>
                  <td className="px-4 py-3" style={{ color: '#1a1a1a' }}>{item.agent}</td>
                  <td className="px-4 py-3" style={{ color: '#1a1a1a' }}>{item.group}</td>
                  <td className="px-4 py-3 text-center font-bold" style={{ color: item.rating >= 4 ? '#10B981' : item.rating === 3 ? '#F59E0B' : '#EF4444' }}>
                    {item.rating} {'★'.repeat(item.rating)}
                  </td>
                  <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{item.sentDate}</td>
                  <td className="px-4 py-3 text-center" style={{ color: '#6B6B6B' }}>{item.responseDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: item.sentiment === 'Positive' ? '#D1FAE5' : item.sentiment === 'Negative' ? '#FEE2E2' : '#F3F4F6', color: item.sentiment === 'Positive' ? '#065F46' : item.sentiment === 'Negative' ? '#7F1D1D' : '#374151' }}>
                      {item.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
