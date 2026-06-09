'use client'

import { useApp } from '@/app/app-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const loginOptions = [
  {
    role: 'agent' as const,
    title: 'Agent Login',
    description: 'Access your ticket queue and customer interactions',
    icon: '👤',
  },
  {
    role: 'manager' as const,
    title: 'Manager Login',
    description: 'Monitor team performance and manage tickets',
    icon: '👥',
  },
]

export default function LoginPage() {
  const { setUserRole } = useApp()
  const router = useRouter()

  const handleLogin = (role: 'agent' | 'manager') => {
    setUserRole(role)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#F8F8F7' }}>
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#0D3133' }}>AdamsBridge</h1>
          <p style={{ color: '#6B6B6B' }}>Ticketing Platform</p>
        </div>

        {/* Login Cards */}
        <div className="space-y-4">
          {loginOptions.map((option) => (
            <button
              key={option.role}
              onClick={() => handleLogin(option.role)}
              className="w-full p-6 text-left rounded-lg shadow-sm transition-all hover:shadow-md"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E0DC',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#E69F50';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E0DC';
              }}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{option.icon}</div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a1a' }}>
                    {option.title}
                  </h2>
                  <p className="text-sm" style={{ color: '#6B6B6B' }}>
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm" style={{ color: '#6B6B6B' }}>
          <p>POC - No authentication required</p>
        </div>
      </div>
    </div>
  )
}
