'use client'

import { useState } from 'react'
import { Play, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AutomationComplete } from '@/lib/types'

interface AutomationTestingSystemProps {
  automation: AutomationComplete
  onTestResultsChange: (results: any[]) => void
}

export function AutomationTestingSystem({ automation, onTestResultsChange }: AutomationTestingSystemProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null)

  const handleRunTest = async () => {
    setIsRunning(true)
    // Simulate test run
    setTimeout(() => {
      const results = [
        {
          id: 'test-1',
          name: 'Test Case 1: Normal Execution',
          status: 'passed',
          executionTime: 145,
          triggersMatched: 1,
          conditionsMet: true,
          actionsExecuted: automation.actions.length,
          timestamp: new Date().toISOString(),
        },
        {
          id: 'test-2',
          name: 'Test Case 2: Condition Mismatch',
          status: 'passed',
          executionTime: 89,
          triggersMatched: 1,
          conditionsMet: false,
          actionsExecuted: 0,
          timestamp: new Date().toISOString(),
        },
      ]
      setTestResults(results)
      onTestResultsChange(results)
      setIsRunning(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: '#0D3133' }}>Test Automation</h3>
        <Button
          onClick={handleRunTest}
          disabled={isRunning}
          className="flex items-center gap-2"
          style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Test'}
        </Button>
      </div>

      <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
        <p style={{ color: '#6B6B6B' }} className="mb-4">
          Test this automation against sample data to validate behavior. Review execution flow, trigger matching, condition evaluation, and action outcomes.
        </p>

        {testResults.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map(result => (
              <div
                key={result.id}
                className="p-3 border rounded-lg cursor-pointer transition-colors"
                style={{
                  borderColor: '#E2E0DC',
                  backgroundColor: selectedTestCase === result.id ? '#EBF8FF' : '#FFFFFF',
                }}
                onClick={() => setSelectedTestCase(result.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {result.status === 'passed' ? (
                        <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                      ) : (
                        <AlertCircle className="w-4 h-4" style={{ color: '#F59E0B' }} />
                      )}
                      <p className="font-medium text-sm" style={{ color: '#0D3133' }}>
                        {result.name}
                      </p>
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                      Execution Time: {result.executionTime}ms • Triggers: {result.triggersMatched} • Actions: {result.actionsExecuted}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: result.conditionsMet ? '#D1FAE5' : '#FEE2E2',
                      color: result.conditionsMet ? '#065F46' : '#991B1B',
                    }}
                  >
                    {result.conditionsMet ? 'Conditions Met' : 'Conditions Not Met'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#9CA3AF' }}>No test results yet. Click "Run Test" to execute automation tests.</p>
        )}
      </div>

      {selectedTestCase && (
        <div className="p-4 border rounded-lg" style={{ borderColor: '#E2E0DC' }}>
          <h4 className="font-medium mb-3" style={{ color: '#0D3133' }}>Test Details</h4>
          {testResults.find(r => r.id === selectedTestCase) && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span style={{ color: '#9CA3AF' }}>Status</span>
                <p className="font-medium mt-1" style={{ color: '#0D3133' }}>
                  {testResults.find(r => r.id === selectedTestCase)?.status === 'passed' ? 'Passed' : 'Warning'}
                </p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>Execution Time</span>
                <p className="font-medium mt-1" style={{ color: '#0D3133' }}>
                  {testResults.find(r => r.id === selectedTestCase)?.executionTime}ms
                </p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>Triggers Matched</span>
                <p className="font-medium mt-1" style={{ color: '#0D3133' }}>
                  {testResults.find(r => r.id === selectedTestCase)?.triggersMatched}
                </p>
              </div>
              <div>
                <span style={{ color: '#9CA3AF' }}>Actions Executed</span>
                <p className="font-medium mt-1" style={{ color: '#0D3133' }}>
                  {testResults.find(r => r.id === selectedTestCase)?.actionsExecuted}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
