import type { QueryResponse } from './api/client'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  queryResult?: QueryResponse
}
