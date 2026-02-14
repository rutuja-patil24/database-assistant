import { useRef } from 'react'
import { Link } from 'react-router-dom'
import type { Dataset } from '../api/client'

const sidebarStyle: React.CSSProperties = {
  width: '280px',
  minWidth: '280px',
  background: 'var(--bg-secondary)',
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const headerStyle: React.CSSProperties = {
  padding: '20px 16px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
}

const logoStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: 'var(--radius-sm)',
  background: 'linear-gradient(135deg, var(--accent) 0%, #6366f1 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
}

const titleStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '1.1rem',
  letterSpacing: '-0.02em',
}

const uploadZoneStyle: React.CSSProperties = {
  margin: '16px',
  padding: '16px',
  borderRadius: 'var(--radius)',
  border: '2px dashed var(--border)',
  background: 'var(--bg-tertiary)',
  textAlign: 'center',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  transition: 'border-color 0.2s, background 0.2s',
}

const listStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '8px 0',
}

const datasetItemStyle: React.CSSProperties = {
  padding: '10px 16px',
  margin: '2px 12px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: '0.9rem',
  color: 'var(--text-primary)',
  transition: 'background 0.15s',
}

const footerStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderTop: '1px solid var(--border)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  background: 'var(--bg-tertiary)',
  color: 'var(--text-primary)',
  fontSize: '0.85rem',
}

interface SidebarProps {
  datasets: Dataset[]
  loading: boolean
  onUpload: (file: File, name?: string) => Promise<void>
  onRefresh: () => void
  selectedDatasetIds: string[]
  onSelectDatasets: (ids: string[]) => void
  userId: string
  onUserIdChange: (id: string) => void
}

export function Sidebar({
  datasets,
  loading,
  onUpload,
  onRefresh,
  selectedDatasetIds,
  onSelectDatasets,
  userId,
  onUserIdChange,
}: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await onUpload(file)
    } finally {
      e.target.value = ''
    }
  }

  const toggleDataset = (id: string) => {
    if (selectedDatasetIds.includes(id)) {
      onSelectDatasets(selectedDatasetIds.filter((x) => x !== id))
    } else {
      onSelectDatasets([...selectedDatasetIds, id])
    }
  }

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={logoStyle}>◇</div>
        <span style={titleStyle}>Database Assistant</span>
        <button
          type="button"
          onClick={onRefresh}
          title="Sync with uploads folder and refresh"
          style={{
            marginLeft: 'auto',
            padding: '6px 10px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
          }}
        >
          Sync folder
        </button>
      </div>

      <Link
        to="/databases"
        style={{
          display: 'block',
          padding: '10px 16px',
          margin: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          border: '1px solid var(--border)',
          textAlign: 'center',
        }}
      >
        Multi-Database (PostgreSQL, SQL, MongoDB) →
      </Link>

      <div
        style={uploadZoneStyle}
        onClick={() => fileInputRef.current?.click()}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
          e.currentTarget.style.background = 'var(--accent-muted)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.background = 'var(--bg-tertiary)'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        + Upload CSV or Excel
      </div>

      <div style={{ padding: '0 8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
        Tables (synced with backend/uploads)
      </div>
      <div style={listStyle}>
        {loading ? (
          <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading…</div>
        ) : datasets.length === 0 ? (
          <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No datasets yet. Upload a file above.
          </div>
        ) : (
          datasets.map((d) => (
            <div
              key={d.dataset_id}
              style={{
                ...datasetItemStyle,
                background: selectedDatasetIds.includes(d.dataset_id) ? 'var(--accent-muted)' : undefined,
                borderLeft: selectedDatasetIds.includes(d.dataset_id) ? '3px solid var(--accent)' : undefined,
              }}
              onClick={() => toggleDataset(d.dataset_id)}
            >
              <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                {d.dataset_name}
                {d.user_id && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    ({d.user_id})
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {d.row_count} rows
              </div>
            </div>
          ))
        )}
      </div>

      <div style={footerStyle}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
          User ID (X-User-Id)
        </label>
        <input
          style={inputStyle}
          value={userId}
          onChange={(e) => onUserIdChange(e.target.value)}
          placeholder="user1"
        />
      </div>
    </aside>
  )
}
