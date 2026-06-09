'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useApp } from '@/app/app-context'
import { AppShell } from '@/components/app-shell'
import { Breadcrumb } from '@/components/breadcrumb'
import { KPICard } from '@/components/kpi-card'
import { Search, Plus, Upload, Download, RotateCcw, TrendingUp, Clock, Eye, ThumbsUp, AlertCircle, CheckCircle2 } from 'lucide-react'

// Mock data
const mockKnowledgeData = {
  overview: {
    totalArticles: 248,
    published: 198,
    drafts: 24,
    pendingReview: 12,
    archived: 14,
    mostViewedThisMonth: 'VPN Troubleshooting Guide',
  },
  categories: [
    { name: 'Incident Management', count: 42, lastUpdated: '2 days ago', mostViewed: 'How to Create Incident' },
    { name: 'Service Requests', count: 38, lastUpdated: '1 day ago', mostViewed: 'Service Request Process' },
    { name: 'Access Management', count: 35, lastUpdated: '5 days ago', mostViewed: 'Password Reset Steps' },
    { name: 'Applications', count: 31, lastUpdated: '3 days ago', mostViewed: 'App Installation Guide' },
    { name: 'Infrastructure', count: 28, lastUpdated: '1 week ago', mostViewed: 'Server Maintenance' },
    { name: 'Network', count: 26, lastUpdated: '6 days ago', mostViewed: 'VPN Troubleshooting' },
  ],
  featured: [
    { id: 1, title: 'VPN Troubleshooting Guide', category: 'Network', views: 1254, helpful: 89, updated: '2 hours ago' },
    { id: 2, title: 'Password Reset Procedure', category: 'Access Management', views: 987, helpful: 92, updated: '1 day ago' },
    { id: 3, title: 'Incident Escalation Process', category: 'Incident Management', views: 856, helpful: 85, updated: '3 days ago' },
  ],
  recentlyUpdated: [
    { id: 1, title: 'Email Configuration Steps', category: 'Email & Collaboration', author: 'Sarah Chen', updated: 'Today', version: '2.1' },
    { id: 2, title: 'Software Installation Guide', category: 'Software', author: 'James Rodriguez', updated: 'Yesterday', version: '1.8' },
    { id: 3, title: 'Network Troubleshooting', category: 'Network', author: 'Alex Kim', updated: '2 days ago', version: '3.2' },
  ],
  mostUsed: [
    { rank: 1, title: 'Password Reset Guide', views: 2541, helpful: 94, lastAccessed: '5 mins ago' },
    { rank: 2, title: 'VPN Setup Instructions', views: 2108, helpful: 88, lastAccessed: '12 mins ago' },
    { rank: 3, title: 'Email Setup Guide', views: 1876, helpful: 91, lastAccessed: '23 mins ago' },
    { rank: 4, title: 'Incident Creation Process', views: 1654, helpful: 86, lastAccessed: '1 hour ago' },
    { rank: 5, title: 'Access Request Workflow', views: 1432, helpful: 89, lastAccessed: '2 hours ago' },
  ],
  pendingReview: [
    { id: 1, title: 'New Security Policy Guidelines', author: 'Maria Torres', submitted: '3 hours ago', status: 'Awaiting Review' },
    { id: 2, title: 'Disaster Recovery Procedures', author: 'Chris Anderson', submitted: '1 day ago', status: 'Under Review' },
  ],
  insights: [
    'VPN Troubleshooting is the most viewed article this month with 1,254 views.',
    '15 articles require review from managers.',
    '3 articles have not been updated in 180 days.',
    'Password Reset Guide reduced ticket volume by 22%.',
  ],
}

export default function KnowledgeBasePage() {
  const { userRole } = useApp()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Knowledge Base' },
  ]

  const handleKPIClick = (filter: string) => {
    router.push(`/knowledge-base/articles?filter=${filter}`)
  }

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
    router.push(`/knowledge-base/articles?category=${encodeURIComponent(category)}`)
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="border-b px-8 py-6" style={{ borderColor: '#E2E0DC' }}>
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                Knowledge Base
              </h1>
              <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                Search, discover and manage knowledge articles, solutions, troubleshooting guides and service procedures.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                <Plus className="w-4 h-4" />
                Create
              </button>

              <button
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                <Upload className="w-4 h-4" />
                Import
              </button>

              <button
                className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 border"
                style={{ borderColor: '#E2E0DC', color: '#1a1a1a', backgroundColor: '#F9F9F8' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0ED'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                className="p-2 rounded-lg transition-all"
                style={{ backgroundColor: '#F9F9F8', color: '#6B6B6B' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E2E0DC'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Global Search - Most Important Element */}
          <div className="flex items-center gap-2 p-3 rounded-lg border" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
            <Search className="w-5 h-5" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search articles, keywords, ticket issues, solutions or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#1a1a1a' }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {/* Row 1: Knowledge Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Knowledge Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <button
                onClick={() => handleKPIClick('all')}
                className="text-left transition-all"
              >
                <KPICard
                  label="Total Articles"
                  value={mockKnowledgeData.overview.totalArticles}
                  icon={<AlertCircle className="w-5 h-5" />}
                  indicator="all"
                  tooltip="Total articles in knowledge base"
                  filterType="open"
                />
              </button>
              <button
                onClick={() => handleKPIClick('published')}
                className="text-left transition-all"
              >
                <KPICard
                  label="Published"
                  value={mockKnowledgeData.overview.published}
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  indicator="published"
                  tooltip="Published articles"
                  filterType="open"
                />
              </button>
              <button
                onClick={() => handleKPIClick('drafts')}
                className="text-left transition-all"
              >
                <KPICard
                  label="Drafts"
                  value={mockKnowledgeData.overview.drafts}
                  icon={<Clock className="w-5 h-5" />}
                  indicator="drafts"
                  tooltip="Draft articles"
                  filterType="open"
                />
              </button>
              <button
                onClick={() => handleKPIClick('pending')}
                className="text-left transition-all"
              >
                <KPICard
                  label="Pending Review"
                  value={mockKnowledgeData.overview.pendingReview}
                  icon={<AlertCircle className="w-5 h-5" />}
                  indicator="pending"
                  tooltip="Articles awaiting approval"
                  filterType="due-today"
                  isUrgent={true}
                />
              </button>
              <button
                onClick={() => handleKPIClick('archived')}
                className="text-left transition-all"
              >
                <KPICard
                  label="Archived"
                  value={mockKnowledgeData.overview.archived}
                  icon={<Eye className="w-5 h-5" />}
                  indicator="archived"
                  tooltip="Archived articles"
                  filterType="open"
                />
              </button>
            </div>
          </div>

          {/* Row 2: Knowledge Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Knowledge Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockKnowledgeData.categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="p-4 rounded-lg border text-left transition-all"
                  style={{
                    borderColor: selectedCategory === cat.name ? '#73847B' : '#E2E0DC',
                    backgroundColor: selectedCategory === cat.name ? '#F0F4F2' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCategory === cat.name ? '#F0F4F2' : '#FFFFFF'}
                >
                  <p className="font-bold" style={{ color: '#1a1a1a' }}>{cat.name}</p>
                  <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>{cat.count} articles</p>
                  <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>Updated {cat.lastUpdated}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: '#73847B' }}>Most viewed: {cat.mostViewed}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Featured Knowledge */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Featured Knowledge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockKnowledgeData.featured.map((article) => (
                <Link
                  key={article.id}
                  href={`/knowledge-base/${article.id}`}
                  className="p-4 rounded-lg border text-left transition-all block"
                  style={{ borderColor: '#E2E0DC', backgroundColor: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <p className="font-bold mb-2" style={{ color: '#1a1a1a' }}>{article.title}</p>
                  <p className="text-xs mb-3 px-2 py-1 rounded w-fit" style={{ backgroundColor: '#F0F4F2', color: '#73847B' }}>
                    {article.category}
                  </p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: '#6B6B6B' }}>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {article.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" /> {article.helpful}%
                    </span>
                  </div>
                  <p className="text-xs mt-3" style={{ color: '#9CA3AF' }}>Updated {article.updated}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Row 4: Recently Updated */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Recently Updated
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F9F8', borderColor: '#E2E0DC' }} className="border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Article Title</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Category</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Author</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Updated</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Version</th>
                  </tr>
                </thead>
                <tbody>
                  {mockKnowledgeData.recentlyUpdated.map((article, idx) => (
                    <tr
                      key={idx}
                      className="border-b cursor-pointer transition-all"
                      style={{ borderColor: '#E2E0DC' }}
                      onClick={() => router.push(`/knowledge-base/${article.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{article.title}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.category}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.author}</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.updated}</td>
                      <td className="px-4 py-3" style={{ color: '#73847B', fontWeight: '600' }}>{article.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 5: Most Used Articles */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Most Used Articles (Top 10)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: '#F9F9F8', borderColor: '#E2E0DC' }} className="border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Rank</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Article</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Views</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Helpful %</th>
                    <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Last Accessed</th>
                  </tr>
                </thead>
                <tbody>
                  {mockKnowledgeData.mostUsed.map((article) => (
                    <tr
                      key={article.rank}
                      className="border-b cursor-pointer transition-all"
                      style={{ borderColor: '#E2E0DC' }}
                      onClick={() => router.push(`/knowledge-base/${article.rank}`)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="px-4 py-3 font-bold" style={{ color: '#1a1a1a' }}>#{article.rank}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{article.title}</td>
                      <td className="px-4 py-3 flex items-center gap-2" style={{ color: '#6B6B6B' }}>
                        <TrendingUp className="w-4 h-4" style={{ color: '#73847B' }} />
                        {article.views}
                      </td>
                      <td className="px-4 py-3 font-medium" style={{ color: '#73847B' }}>{article.helpful}%</td>
                      <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.lastAccessed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Row 6: Pending Review (Managers only) */}
          {userRole === 'manager' && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
                Pending Review
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: '#F9F9F8', borderColor: '#E2E0DC' }} className="border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Article</th>
                      <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Author</th>
                      <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Submitted</th>
                      <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Status</th>
                      <th className="px-4 py-3 text-left font-bold" style={{ color: '#1a1a1a' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockKnowledgeData.pendingReview.map((article, idx) => (
                      <tr
                        key={idx}
                        className="border-b cursor-pointer transition-all"
                        style={{ borderColor: '#E2E0DC' }}
                        onClick={() => router.push(`/knowledge-base/${article.id}`)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9F9F8'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="px-4 py-3 font-medium" style={{ color: '#1a1a1a' }}>{article.title}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.author}</td>
                        <td className="px-4 py-3" style={{ color: '#6B6B6B' }}>{article.submitted}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                            {article.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="px-3 py-1 rounded text-xs font-medium transition-all"
                            style={{ backgroundColor: '#F0F4F2', color: '#73847B' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F0EB'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F4F2'}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Row 7: Knowledge Insights */}
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: '#1a1a1a' }}>
              Knowledge Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockKnowledgeData.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#E2E0DC', backgroundColor: '#F9F9F8' }}
                >
                  <p className="text-sm" style={{ color: '#6B6B6B' }}>
                    {insight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
