'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AssignmentEnginePage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/assignment-engine/overview')
  }, [router])
  
  return null
}
