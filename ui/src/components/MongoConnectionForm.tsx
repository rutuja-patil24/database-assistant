import { useState } from 'react'

const formStyle: React.CSSProperties = {
  maxWidth: 520,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
}

const titleStyle: React.CSSProperties = {
  fontSize: '1.35rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 8,
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'var(--text-secondary)',
  marginBottom: 6,
  display: 'block',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
  boxSizing: 'border-box',
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  resize: 'vertical',
  fontFamily: 'ui-monospace, monospace',
  fontSize: '0.9rem',
}

const buttonStyle: React.CSSProperties = {
  padding: '12px 24px',
  borderRadius: 'var(--radius)',
  border: 'none',
  background: 'var(--accent)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  alignSelf: 'flex-start',
}

export function MongoConnectionForm() {
  const [connectionString, setConnectionString] = useState('mongodb://localhost:27017')
  const [status, setStatus] = useState<string | null>(null)

  const handleConnect = () => {
    setStatus('Connection not implemented in UI yet. Configure your backend to support this plugin.')
  }

  return (
    <div style={formStyle}>
      <h2 style={titleStyle}>MongoDB connection</h2>
      <div>
        <label style={labelStyle}>Connection string</label>
        <textarea
          style={textareaStyle}
          value={connectionString}
          onChange={(e) => setConnectionString(e.target.value)}
          placeholder="mongodb://localhost:27017"
          spellCheck={false}
        />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>
          e.g. mongodb://user:pass@host:27017/dbname or mongodb+srv://...
        </p>
      </div>
      <button style={buttonStyle} onClick={handleConnect}>
        Test connection
      </button>
      {status && (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 8 }}>{status}</p>
      )}
    </div>
  )
}
