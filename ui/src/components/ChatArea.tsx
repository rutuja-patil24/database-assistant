import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Message } from './Message'
import type { ChatMessage } from '../types'

const chatAreaStyle: React.CSSProperties = {
  position: 'relative',
  flex: '1 1 0%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  background: 'var(--bg-primary)',
}

const messagesStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: 'auto',
  padding: '32px 24px 100px',
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
}

const inputWrapStyle: React.CSSProperties = {
  flexShrink: 0,
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  borderTop: '1px solid var(--border)',
  background: 'var(--bg-primary)',
}

const formStyle: React.CSSProperties = {
  width: '100%',
  minWidth: 0,
  display: 'flex',
  gap: 16,
  alignItems: 'flex-end',
  boxSizing: 'border-box',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  width: '100%',
  padding: '16px 20px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  resize: 'none',
  minHeight: 56,
  maxHeight: 200,
  boxSizing: 'border-box',
}

const buttonStyle: React.CSSProperties = {
  padding: '14px 24px',
  borderRadius: 'var(--radius)',
  border: 'none',
  background: 'var(--accent)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.95rem',
  flexShrink: 0,
}

const emptyStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 16,
  color: 'var(--text-muted)',
  padding: 48,
}

interface ChatAreaProps {
  messages: ChatMessage[]
  onSend: (question: string) => void
  selectedCount: number
  placeholder: string
}

export function ChatArea({ messages, onSend, selectedCount, placeholder }: ChatAreaProps) {
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    onSend(trimmed)
    setInput('')
  }

  const chatBar = (
    <div className="chat-input-bar">
      <form className="chat-input-form" onSubmit={handleSubmit} style={{ margin: 0 }}>
        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
        <button type="submit" className="chat-input-submit" disabled={!input.trim()}>
          Ask
        </button>
      </form>
    </div>
  )

  return (
    <div style={chatAreaStyle}>
      <div style={messagesStyle}>
        {messages.length === 0 ? (
          <div style={emptyStyle}>
            <p style={{ fontSize: '1.25rem' }}>Ask questions in plain English.</p>
            <p style={{ fontSize: '1rem' }}>
              {selectedCount
                ? `${selectedCount} dataset(s) selected. Type your question below.`
                : 'Select one or more datasets from the sidebar to get started.'}
            </p>
          </div>
        ) : (
          messages.map((m) => <Message key={m.id} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
      {typeof document !== 'undefined' && document.body && createPortal(chatBar, document.body)}
    </div>
  )
}

