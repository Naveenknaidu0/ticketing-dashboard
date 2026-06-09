import { useEffect, useRef, useCallback } from 'react'

export interface SyncMessage<T> {
  type: 'update' | 'create' | 'delete' | 'sync-request'
  entityType: string
  data?: T
  id?: string
  timestamp: number
}

export interface UseRealtimeSyncOptions<T> {
  channel: string
  onUpdate?: (data: T) => void
  onCreate?: (data: T) => void
  onDelete?: (id: string) => void
  onError?: (error: Error) => void
  enabled?: boolean
}

export function useRealtimeSync<T>({
  channel,
  onUpdate,
  onCreate,
  onDelete,
  onError,
  enabled = true,
}: UseRealtimeSyncOptions<T>) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const baseReconnectDelay = 1000

  const connect = useCallback(() => {
    if (!enabled) return
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/sync/${channel}`
      
      wsRef.current = new WebSocket(wsUrl)

      wsRef.current.onopen = () => {
        console.log(`[v0] WebSocket connected to channel: ${channel}`)
        reconnectAttemptsRef.current = 0
        
        // Send initial sync request
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'sync-request',
            entityType: channel,
            timestamp: Date.now(),
          }))
        }
      }

      wsRef.current.onmessage = (event) => {
        try {
          const message: SyncMessage<T> = JSON.parse(event.data)
          console.log(`[v0] Received sync message:`, message.type)

          switch (message.type) {
            case 'update':
              if (message.data && onUpdate) {
                onUpdate(message.data)
              }
              break
            case 'create':
              if (message.data && onCreate) {
                onCreate(message.data)
              }
              break
            case 'delete':
              if (message.id && onDelete) {
                onDelete(message.id)
              }
              break
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          console.error(`[v0] Failed to parse sync message:`, error)
          onError?.(error)
        }
      }

      wsRef.current.onerror = (event) => {
        const error = new Error(`WebSocket error on channel ${channel}`)
        console.error(`[v0] WebSocket error:`, error)
        onError?.(error)
      }

      wsRef.current.onclose = () => {
        console.log(`[v0] WebSocket disconnected from channel: ${channel}`)
        wsRef.current = null

        if (reconnectAttemptsRef.current < maxReconnectAttempts && enabled) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current)
          console.log(`[v0] Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1})`)
          reconnectAttemptsRef.current += 1
          reconnectTimeoutRef.current = setTimeout(connect, delay)
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error(`[v0] Failed to establish WebSocket connection:`, error)
      onError?.(error)
    }
  }, [channel, enabled, onUpdate, onCreate, onDelete, onError])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }, [])

  const sendMessage = useCallback((message: Partial<SyncMessage<T>>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: Date.now(),
      }))
    } else {
      console.warn(`[v0] WebSocket not connected, cannot send message`)
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      connect()
    }
    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  return {
    sendMessage,
    disconnect,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
  }
}
