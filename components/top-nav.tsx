'use client'

import { useApp } from '@/app/app-context'
import { useRouter } from 'next/navigation'
import { Bell, Search, Zap, User, LogOut, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TopNavProps {
  showTooltips: boolean
  onTooltipsChange: (show: boolean) => void
}

export function TopNav({ showTooltips, onTooltipsChange }: TopNavProps) {
  const { userRole, setUserRole } = useApp()
  const router = useRouter()

  const handleLogout = () => {
    setUserRole(null)
    router.push('/login')
  }

  return (
    <>
      {/* Top Navigation Bar - Full AdamsBridge Gradient Theme */}
      <div className="sticky top-0 z-40" style={{ 
        background: 'linear-gradient(180deg, #0D3133 0%, #0A2425 100%)',
        height: '62px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="flex items-center justify-between px-8 py-0 gap-6 h-full">
          {/* Left: Page Title & Breadcrumb - White Text */}
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-base font-semibold" style={{ color: '#FFFFFF' }}>Dashboard</h1>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Home</p>
          </div>

          {/* Center: Global Search with Semi-Transparent White Overlay */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
              <Input
                placeholder="Search tickets, users, assets, knowledge articles..."
                className="pl-10 pr-4 rounded-lg h-9 text-sm transition-all duration-200 focus-visible:outline-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  border: '1px solid',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(230, 159, 80, 0.2)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
              {/* Placeholder styling */}
              <style>{`
                input::placeholder {
                  color: rgba(255, 255, 255, 0.5) !important;
                }
              `}</style>
            </div>
          </div>

          {/* Right: Actions with White Icons */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="relative p-2 rounded-lg transition-all duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230, 159, 80, 0.25)'
                    e.currentTarget.style.color = '#E69F50'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E69F50' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-4 py-2 font-semibold text-sm" style={{ color: '#0D3133' }}>Notifications (3)</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-3 py-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#E69F50', marginTop: '2px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>High Priority Ticket</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>5 mins ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-3 py-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#73847B', marginTop: '2px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>SLA Update</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>2 hours ago</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Approvals */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="relative p-2 rounded-lg transition-all duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230, 159, 80, 0.25)'
                    e.currentTarget.style.color = '#E69F50'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  title="Pending Approvals"
                >
                  <FileText className="w-5 h-5" />
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#E69F50', fontSize: '10px' }}>4</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-4 py-2 font-semibold text-sm" style={{ color: '#0D3133' }}>Pending Approvals (4)</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-3 py-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E69F50', marginTop: '8px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Escalation Review</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>John Smith · 30 mins ago</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tasks */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="relative p-2 rounded-lg transition-all duration-200"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230, 159, 80, 0.25)'
                    e.currentTarget.style.color = '#E69F50'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                  title="Due Tasks"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#E69F50', fontSize: '10px' }}>2</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <div className="px-4 py-2 font-semibold text-sm" style={{ color: '#0D3133' }}>Due Tasks (2)</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-3 py-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#E69F50', marginTop: '8px' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>Follow-up on INC-2401</p>
                    <p className="text-xs" style={{ color: '#6B6B6B' }}>Due in 1 hour</p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Menu with AdamsBridge Orange Ring */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className="p-2 rounded-lg transition-all duration-200 flex items-center gap-2"
                  style={{ color: '#FFFFFF' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(230, 159, 80, 0.25)'
                    e.currentTarget.style.color = '#E69F50'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#FFFFFF'
                  }}
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ 
                    backgroundColor: '#0A1E20',
                    border: '2px solid #E69F50',
                    boxShadow: '0 0 8px rgba(230, 159, 80, 0.4)'
                  }}>
                    {userRole === 'manager' ? 'M' : 'A'}
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold" style={{ color: '#0D3133' }}>Support Agent</p>
                  <p className="text-xs capitalize" style={{ color: '#6B6B6B' }}>{userRole} User</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
