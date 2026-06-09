// Hook for real-time configuration registry updates
'use client'

import { useEffect, useState } from 'react'
import { subscribeToRegistryChanges } from '@/lib/configuration-registry'
import { ConfigurationValue } from '@/lib/configuration-registry'

export function useRegistryUpdates(category?: string) {
  const [updates, setUpdates] = useState<{ type: 'create' | 'update' | 'delete'; value: ConfigurationValue }>()

  useEffect(() => {
    const unsubscribe = subscribeToRegistryChanges((type, value) => {
      // If category is specified, only update if the value matches that category
      if (!category || value.category === category) {
        setUpdates({ type, value })
      }
    })

    return () => unsubscribe()
  }, [category])

  return updates
}

// Hook to force re-render when registry changes
export function useRegistryListener(callback: (type: 'create' | 'update' | 'delete', value: ConfigurationValue) => void, deps: any[] = []) {
  useEffect(() => {
    const unsubscribe = subscribeToRegistryChanges((type, value) => {
      callback(type, value)
    })

    return () => unsubscribe()
  }, deps)
}
