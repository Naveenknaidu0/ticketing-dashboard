'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { dashboardConfigurationRegistry, type DashboardConfig, type WidgetPlacement } from '@/lib/dashboard-configuration-registry'
import { getWidgetDefinition } from '@/lib/widget-registry'
import type { DashboardType } from '@/lib/widget-registry'

interface LiveDashboardRendererProps {
  dashboardType: DashboardType
  isEditMode?: boolean
  onEditWidget?: (widget: WidgetPlacement) => void
}

export function LiveDashboardRenderer({
  dashboardType,
  isEditMode = false,
  onEditWidget,
}: LiveDashboardRendererProps) {
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [activeTab, setActiveTab] = useState<string>('Overview')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const initialConfig = dashboardConfigurationRegistry.getConfig(dashboardType)
    if (initialConfig) {
      setConfig(initialConfig)
      setActiveTab(initialConfig.tabs[0])
    }
  }, [dashboardType])

  if (!config) {
    return (
      <div className="p-8 text-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#9CA3AF' }}>Dashboard configuration not found</p>
      </div>
    )
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsRefreshing(false)
  }

  const handleExport = () => {
    const data = JSON.stringify(config, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-${dashboardType}-${new Date().toISOString()}.json`
    a.click()
  }

  // Get widgets for the active tab
  const tabWidgets = config.widgets.filter(w => w.tab === activeTab && w.enabled)
  const sortedWidgets = [...tabWidgets].sort((a, b) => a.position - b.position)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      {/* Tab Navigation */}
      <div className="sticky top-0 z-30 border-b" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b" style={{ borderColor: '#E2E0DC' }}>
            {config.tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors"
                style={{
                  borderColor: activeTab === tab ? '#E69F50' : 'transparent',
                  color: activeTab === tab ? '#E69F50' : '#6B6B6B',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 ml-4">
            {config.settings.showRefreshButton && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
                title="Refresh dashboard"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            {config.settings.showExportButton && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50"
                style={{ borderColor: '#E2E0DC', color: '#6B6B6B' }}
                title="Export dashboard configuration"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-8">
        {sortedWidgets.length === 0 ? (
          <div className="p-12 text-center rounded-lg border" style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}>
            <p style={{ color: '#9CA3AF' }}>No widgets on this tab</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sortedWidgets.map((widget, idx) => {
              const definition = getWidgetDefinition(widget.widgetId)
              if (!definition) return null

              return (
                <div
                  key={widget.widgetId}
                  onClick={() => isEditMode && onEditWidget?.(widget)}
                  className={`p-6 rounded-lg border transition-all ${
                    isEditMode ? 'cursor-pointer hover:shadow-md hover:border-orange-300' : ''
                  }`}
                  style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold" style={{ color: '#0D3133' }}>
                        {definition.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>
                        {definition.description}
                      </p>
                    </div>
                    <div className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F3F1EE', color: '#6B6B6B' }}>
                      {widget.size}
                    </div>
                  </div>

                  {/* Widget Content Placeholder */}
                  <div
                    className="p-8 rounded border text-center"
                    style={{
                      backgroundColor: '#F9F7F4',
                      borderColor: '#E2E0DC',
                      minHeight: widget.size === 'large' ? '300px' : widget.size === 'medium' ? '200px' : '100px',
                    }}
                  >
                    <p style={{ color: '#9CA3AF' }}>
                      {definition.component}
                    </p>
                    {widget.filters && Object.keys(widget.filters).length > 0 && (
                      <div className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                        Filters: {Object.keys(widget.filters).join(', ')}
                      </div>
                    )}
                    {widget.dateRange && (
                      <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                        Period: {widget.dateRange.period || 'custom'}
                      </div>
                    )}
                  </div>

                  {isEditMode && (
                    <div className="mt-3 text-xs text-center" style={{ color: '#E69F50' }}>
                      Click to edit
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
