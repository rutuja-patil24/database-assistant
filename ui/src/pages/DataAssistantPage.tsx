import { useState, useCallback, useEffect } from 'react'
import { listDatasets, uploadDataset, runQuery, setUserId, syncUploads, type Dataset } from '../api/client'
import { Sidebar } from '../components/Sidebar'
import { ChatArea } from '../components/ChatArea'
import type { ChatMessage } from '../types'

export default function DataAssistantPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [loadingDatasets, setLoadingDatasets] = useState(true)
  const [userId, setUserIdState] = useState(() => localStorage.getItem('db_assistant_user_id') || 'user1')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([])

  const refreshDatasets = useCallback(async (syncFirst = false) => {
    setLoadingDatasets(true)
    try {
      if (syncFirst) {
        try {
          await syncUploads()
        } catch (e) {
          console.warn('Sync uploads failed (non-fatal):', e)
        }
      }
      const { data } = await listDatasets(true)
      setDatasets(data)
    } catch (e) {
      console.error('Failed to load datasets', e)
    } finally {
      setLoadingDatasets(false)
    }
  }, [])

  useEffect(() => {
    refreshDatasets(true)
  }, [refreshDatasets])

  useEffect(() => {
    setUserId(userId)
  }, [userId])

  const handleUpload = useCallback(async (file: File, name?: string) => {
    await uploadDataset(file, name)
    await refreshDatasets()
  }, [refreshDatasets])

  const handleSendQuestion = useCallback(async (question: string) => {
    if (!question.trim()) return
    if (!selectedDatasetIds.length) {
      alert('Please select at least one dataset from the sidebar.')
      return
    }

    const owner = datasets.find((d) => d.dataset_id === selectedDatasetIds[0])?.user_id ?? userId
    const idsForOwner = selectedDatasetIds.filter(
      (id) => datasets.find((d) => d.dataset_id === id)?.user_id === owner
    )

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question.trim(),
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await runQuery({
        question: question.trim(),
        dataset_ids: idsForOwner.length > 1 ? idsForOwner : undefined,
        dataset_id: idsForOwner.length === 1 ? idsForOwner[0] : undefined,
        limit: 100,
        asUserId: owner,
      })

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: res.execution_error
          ? `Error: ${res.execution_error}`
          : `Returned ${res.count} row(s) in ${res.execution_time_ms ?? 0} ms.`,
        queryResult: res,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e)
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: `Request failed: ${err}`,
        },
      ])
    }
  }, [selectedDatasetIds, datasets, userId])

  return (
    <div className="app-layout" style={layout}>
      <div style={sidebarWrapStyle}>
        <Sidebar
        datasets={datasets}
        loading={loadingDatasets}
        onUpload={handleUpload}
        onRefresh={() => refreshDatasets(true)}
        selectedDatasetIds={selectedDatasetIds}
        onSelectDatasets={setSelectedDatasetIds}
        userId={userId}
        onUserIdChange={setUserIdState}
        />
      </div>
      <div className="app-chat-column" style={chatWrapStyle}>
      <ChatArea
        messages={messages}
        onSend={handleSendQuestion}
        selectedCount={selectedDatasetIds.length}
        placeholder={
          selectedDatasetIds.length
            ? 'Ask a question about your data…'
            : 'Select one or more datasets from the sidebar to start.'
        }
      />
      </div>
    </div>
  )
}

const layout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}

const sidebarWrapStyle: React.CSSProperties = {
  flexShrink: 0,
}

const chatWrapStyle: React.CSSProperties = {
  flex: '1 1 0%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}
