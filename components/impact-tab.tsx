/**
 * Configuration Impact Analysis Tab Component
 * Displays impact assessment before delete/update/archive operations
 */

'use client'

import { useState } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react'

export type ChangeType = 'delete' | 'update' | 'archive' | 'disable'

interface ImpactRisk {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  affected: {
    type: string
    count: number
    examples: string[]
  }
  remediation: string
}

interface ImpactTabProps {
  configId: string
  configLabel: string
  canDelete: boolean
  affectedItems: {
    directCount: number
    transitiveCount: number
    byType: {
      rules: number
      automations: number
      dashboards: number
      reports: number
    }
  }
  risks: ImpactRisk[]
  recommendations: string[]
  severity: 'critical' | 'high' | 'medium' | 'low'
  estimatedTestingTime: number
  rollbackComplexity: 'simple' | 'moderate' | 'complex'
  changeType?: ChangeType
}

export function ImpactTab({
  configId,
  configLabel,
  canDelete,
  affectedItems,
  risks,
  recommendations,
  severity,
  estimatedTestingTime,
  rollbackComplexity,
  changeType = 'delete',
}: ImpactTabProps) {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical':
        return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' }
      case 'high':
        return { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' }
      case 'medium':
        return { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' }
      default:
        return { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' }
    }
  }

  const severityColor = getSeverityColor(severity)

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="p-4 rounded-lg border" style={{ backgroundColor: severityColor.bg, borderColor: severityColor.border }}>
        <div className="flex items-start gap-3">
          {severity === 'critical' && <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: severityColor.text }} />}
          {severity === 'high' && <AlertTriangle className="w-6 h-6 flex-shrink-0" style={{ color: severityColor.text }} />}
          {severity === 'medium' && <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: severityColor.text }} />}
          {severity === 'low' && <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: severityColor.text }} />}

          <div>
            <div className="font-semibold" style={{ color: severityColor.text }}>
              {severity === 'critical' && '🚨 CRITICAL IMPACT - High Risk Change'}
              {severity === 'high' && '⚠️ HIGH IMPACT - Review Before Proceeding'}
              {severity === 'medium' && 'ℹ️ MEDIUM IMPACT - Requires Testing'}
              {severity === 'low' && '✓ LOW IMPACT - Safe to Proceed'}
            </div>
            <div className="text-sm mt-1" style={{ color: severityColor.text }}>
              {changeType === 'delete' && !canDelete && 'Cannot delete: This configuration is in use'}
              {changeType === 'delete' && canDelete && 'Safe to delete: No active dependencies'}
              {changeType === 'archive' && 'Archiving will hide this configuration but preserve history'}
              {changeType === 'update' && 'Changes will cascade to dependent items'}
              {changeType === 'disable' && 'Disabling may cause dependent automations to fail'}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="text-xs text-gray-600" style={{ color: '#9CA3AF' }}>Direct Impact</div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {affectedItems.directCount}
          </div>
        </div>

        <div className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="text-xs text-gray-600" style={{ color: '#9CA3AF' }}>Transitive Impact</div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {affectedItems.transitiveCount}
          </div>
        </div>

        <div className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="text-xs text-gray-600" style={{ color: '#9CA3AF' }}>Testing Time</div>
          <div className="text-2xl font-bold" style={{ color: '#0D3133' }}>
            {estimatedTestingTime}m
          </div>
        </div>

        <div className="p-3 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <div className="text-xs text-gray-600" style={{ color: '#9CA3AF' }}>Rollback</div>
          <div className="text-lg font-bold capitalize" style={{ color: '#0D3133' }}>
            {rollbackComplexity}
          </div>
        </div>
      </div>

      {/* Affected By Type */}
      {(affectedItems.byType.rules > 0 ||
        affectedItems.byType.automations > 0 ||
        affectedItems.byType.dashboards > 0 ||
        affectedItems.byType.reports > 0) && (
        <div className="border rounded-lg p-4" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
          <h3 className="font-semibold mb-3" style={{ color: '#0D3133' }}>
            Affected Items by Type
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {affectedItems.byType.rules > 0 && (
              <div className="p-2 rounded border" style={{ borderColor: '#FCD34D' }}>
                <div className="text-xs" style={{ color: '#92400E' }}>Rules</div>
                <div className="text-xl font-bold" style={{ color: '#92400E' }}>
                  {affectedItems.byType.rules}
                </div>
              </div>
            )}
            {affectedItems.byType.automations > 0 && (
              <div className="p-2 rounded border" style={{ borderColor: '#FECACA' }}>
                <div className="text-xs" style={{ color: '#991B1B' }}>Automations</div>
                <div className="text-xl font-bold" style={{ color: '#991B1B' }}>
                  {affectedItems.byType.automations}
                </div>
              </div>
            )}
            {affectedItems.byType.dashboards > 0 && (
              <div className="p-2 rounded border" style={{ borderColor: '#93C5FD' }}>
                <div className="text-xs" style={{ color: '#1E40AF' }}>Dashboards</div>
                <div className="text-xl font-bold" style={{ color: '#1E40AF' }}>
                  {affectedItems.byType.dashboards}
                </div>
              </div>
            )}
            {affectedItems.byType.reports > 0 && (
              <div className="p-2 rounded border" style={{ borderColor: '#C6F6D5' }}>
                <div className="text-xs" style={{ color: '#22543D' }}>Reports</div>
                <div className="text-xl font-bold" style={{ color: '#22543D' }}>
                  {affectedItems.byType.reports}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Risks */}
      {risks.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ color: '#0D3133' }}>
            Identified Risks ({risks.length})
          </h3>
          {risks.map(risk => (
            <div
              key={risk.id}
              className="border rounded-lg overflow-hidden"
              style={{ borderColor: getSeverityColor(risk.severity).border }}
            >
              <button
                onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
                className="w-full px-4 py-3 flex items-start justify-between"
                style={{ backgroundColor: getSeverityColor(risk.severity).bg }}
              >
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm" style={{ color: getSeverityColor(risk.severity).text }}>
                    {risk.title}
                  </div>
                  <div className="text-xs mt-1" style={{ color: getSeverityColor(risk.severity).text }}>
                    Affects {risk.affected.count} {risk.affected.type}
                  </div>
                </div>
                <div
                  className="text-xs px-2 py-1 rounded capitalize"
                  style={{
                    backgroundColor: getSeverityColor(risk.severity).border,
                    color: getSeverityColor(risk.severity).text,
                  }}
                >
                  {risk.severity}
                </div>
              </button>

              {selectedRisk === risk.id && (
                <div className="px-4 py-3 border-t" style={{ borderColor: getSeverityColor(risk.severity).border }}>
                  <div className="mb-3">
                    <div className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>
                      Description:
                    </div>
                    <div className="text-sm" style={{ color: '#0D3133' }}>
                      {risk.description}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: '#6B6B6B' }}>
                      Remediation:
                    </div>
                    <div className="text-sm" style={{ color: '#0D3133' }}>
                      {risk.remediation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <div className="px-4 py-3" style={{ backgroundColor: '#FAFAF9' }}>
            <h3 className="font-semibold flex items-center gap-2" style={{ color: '#0D3133' }}>
              <Zap className="w-4 h-4" style={{ color: '#E69F50' }} />
              Recommendations
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#E2E0DC' }}>
            {recommendations.map((rec, idx) => (
              <div key={idx} className="px-4 py-3 text-sm" style={{ color: '#0D3133' }}>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proceed Button Status */}
      <div className="sticky bottom-0 pt-4 border-t" style={{ borderColor: '#E2E0DC', backgroundColor: '#FAFAF9' }}>
        {changeType === 'delete' && !canDelete && (
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: '#FECACA', backgroundColor: '#FEE2E2' }}>
            <div className="font-semibold text-sm" style={{ color: '#991B1B' }}>
              ❌ Cannot Proceed with Deletion
            </div>
            <div className="text-xs mt-1" style={{ color: '#991B1B' }}>
              This configuration is in use. Archive it instead.
            </div>
          </div>
        )}
        {changeType === 'delete' && canDelete && (
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: '#C6F6D5', backgroundColor: '#ECFDF5' }}>
            <div className="font-semibold text-sm" style={{ color: '#22543D' }}>
              ✓ Safe to Delete
            </div>
            <div className="text-xs mt-1" style={{ color: '#22543D' }}>
              No active dependencies detected. Proceed with caution.
            </div>
          </div>
        )}
        {severity === 'critical' && changeType !== 'delete' && (
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: '#FECACA', backgroundColor: '#FEE2E2' }}>
            <div className="font-semibold text-sm" style={{ color: '#991B1B' }}>
              ⚠️ Requires Approval
            </div>
            <div className="text-xs mt-1" style={{ color: '#991B1B' }}>
              Critical impact changes require manager approval and testing
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
