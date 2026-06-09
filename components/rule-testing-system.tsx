'use client'

import { useState } from 'react'
import { Play, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RuleComplete, RuleTestCase, RuleTestResult } from '@/lib/types'
import { testRule } from '@/lib/rule-engine'

interface RuleTestingSystemProps {
  rule: RuleComplete
  onTestResultsChange: (results: RuleTestResult[]) => void
}

export function RuleTestingSystem({ rule, onTestResultsChange }: RuleTestingSystemProps) {
  const [testCases, setTestCases] = useState<RuleTestCase[]>(rule.testCases || [])
  const [newTestName, setNewTestName] = useState('')
  const [testResults, setTestResults] = useState<RuleTestResult[]>(rule.lastTestResults || [])
  const [showTestForm, setShowTestForm] = useState(false)

  const handleAddTestCase = () => {
    if (!newTestName.trim()) return

    const newTestCase: RuleTestCase = {
      id: `test-${Date.now()}`,
      name: newTestName,
      ticket: {
        priority: 'high',
        type: 'incident',
        customer: 'customer-1',
        description: 'Test ticket',
      },
      expectedActions: [],
    }

    setTestCases([...testCases, newTestCase])
    setNewTestName('')
  }

  const handleRunTests = () => {
    const results: RuleTestResult[] = testCases.map(testCase => 
      testRule(rule, testCase)
    )
    setTestResults(results)
    onTestResultsChange(results)
  }

  const handleDeleteTestCase = (testId: string) => {
    setTestCases(testCases.filter(t => t.id !== testId))
  }

  const passedCount = testResults.filter(r => r.passed).length
  const totalCount = testResults.length

  return (
    <div className="space-y-6">
      {/* Test Coverage */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3F4F3' }}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-sm" style={{ color: '#0D3133' }}>Test Coverage</h4>
            <p className="text-xs mt-1" style={{ color: '#6B6B6B' }}>
              {testCases.length} test cases defined • {totalCount} executed • {passedCount} passed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: '#E69F50' }}>
              {testCases.length === 0 ? 0 : Math.round((passedCount / totalCount) * 100)}%
            </div>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Test Cases */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm" style={{ color: '#0D3133' }}>Test Cases</h4>
          <button
            onClick={() => setShowTestForm(!showTestForm)}
            className="text-sm flex items-center gap-1"
            style={{ color: '#E69F50' }}
          >
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
        </div>

        {showTestForm && (
          <div className="p-4 border rounded-lg mb-4" style={{ borderColor: '#E2E0DC', backgroundColor: '#F9FAFB' }}>
            <input
              type="text"
              value={newTestName}
              onChange={e => setNewTestName(e.target.value)}
              placeholder="e.g., VIP high priority ticket"
              className="w-full px-3 py-2 border rounded-lg mb-2 text-sm"
              style={{ borderColor: '#E2E0DC', color: '#0D3133' }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTestCase}
                className="px-3 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#10B981' }}
              >
                Create
              </button>
              <button
                onClick={() => setShowTestForm(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#E2E0DC', color: '#0D3133' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {testCases.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No test cases. Create test cases to validate rule behavior.</p>
        ) : (
          <div className="space-y-2">
            {testCases.map((testCase, idx) => (
              <div
                key={testCase.id}
                className="p-3 border rounded-lg flex items-center justify-between"
                style={{ borderColor: '#E2E0DC' }}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: '#0D3133' }}>{testCase.name}</div>
                  {testResults.length > 0 && (
                    <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
                      {testResults[idx]?.passed ? (
                        <span style={{ color: '#10B981' }}>✓ Passed</span>
                      ) : (
                        <span style={{ color: '#EF4444' }}>✗ Failed</span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteTestCase(testCase.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Run Tests Button */}
      {testCases.length > 0 && (
        <button
          onClick={handleRunTests}
          className="w-full px-4 py-2 rounded-lg font-medium text-white flex items-center justify-center gap-2"
          style={{ backgroundColor: '#E69F50' }}
        >
          <Play className="w-4 h-4" />
          Run Tests ({testCases.length})
        </button>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-3" style={{ color: '#0D3133' }}>Test Results</h4>
          <div className="space-y-2">
            {testResults.map((result, idx) => (
              <div
                key={result.testId}
                className="p-3 border rounded-lg"
                style={{
                  borderColor: result.passed ? '#D1FAE5' : '#FEE2E2',
                  backgroundColor: result.passed ? '#F0FDF4' : '#FEF2F2',
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                      ) : (
                        <AlertCircle className="w-4 h-4" style={{ color: '#EF4444' }} />
                      )}
                      <span className="font-medium text-sm" style={{ color: '#0D3133' }}>
                        {testCases[idx]?.name}
                      </span>
                    </div>
                    <div className="text-xs mt-2" style={{ color: '#6B6B6B' }}>
                      <p>Conditions Matched: {result.conditionsMatched ? 'Yes' : 'No'}</p>
                      <p>Actions Triggered: {result.triggeredActions.length}</p>
                      <p>Execution Time: {result.executionTime}ms</p>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: result.passed ? '#D1FAE5' : '#FEE2E2',
                      color: result.passed ? '#065F46' : '#991B1B',
                    }}
                  >
                    {result.passed ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
