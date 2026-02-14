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

export function PostgresConnectionForm() {
  const [host, setHost] = useState('localhost')
  const [port, setPort] = useState('5432')
  const [database, setDatabase] = useState('')
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const handleConnect = () => {
    setStatus('Connection not implemented in UI yet. Configure your backend to support this plugin.')
  }

  return (
    <div style={formStyle}>
      <h2 style={titleStyle}>PostgreSQL connection</h2>
      <div>
        <label style={labelStyle}>Host</label>
        <input
          style={inputStyle}
          value={host}
          onChange={(e) => setHost(e.target.value)}
          placeholder="localhost"
        />
      </div>
      <div>
        <label style={labelStyle}>Port</label>
        <input
          style={inputStyle}
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="5432"
        />
      </div>
      <div>
        <label style={labelStyle}>Database</label>
        <input
          style={inputStyle}
          value={database}
          onChange={(e) => setDatabase(e.target.value)}
          placeholder="mydb"
        />
      </div>
      <div>
        <label style={labelStyle}>User</label>
        <input
          style={inputStyle}
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="postgres"
        />
      </div>
      <div>
        <label style={labelStyle}>Password</label>
        <input
          style={inputStyle}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
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
