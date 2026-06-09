'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function DashboardConfigurationPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" style={{ color: '#6B6B6B' }} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#0D3133' }}>
              Dashboard Governance
            </h1>
            <p style={{ color: '#6B6B6B' }} className="mt-2">
              Dashboard Governance has been moved to a dedicated control center.
            </p>
          </div>
        </div>

        <div
          className="p-8 rounded-lg text-center space-y-4"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E2E0DC', border: '1px solid #E2E0DC' }}
        >
          <p style={{ color: '#6B6B6B', fontSize: '1rem' }}>
            All dashboard governance controls including profiles, widget registry, assignments, layout management, permissions, and audit history are now available in the dedicated Dashboard Governance module.
          </p>
          <button
            onClick={() => router.push('/assignment-engine/dashboard-governance')}
            className="mt-6 px-6 py-2 rounded-lg font-medium"
            style={{ backgroundColor: '#E69F50', color: '#FFFFFF' }}
          >
            Go to Dashboard Governance
          </button>
        </div>
      </div>
    </div>
  )
}

