import { Link } from 'react-router-dom'
import type { DbPlugin } from '../pages/MultiDatabasePage'

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

const navLinkStyle: React.CSSProperties = {
  padding: '10px 16px',
  margin: '4px 12px',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'block',
}

const pluginsLabelStyle: React.CSSProperties = {
  padding: '16px 16px 8px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const pluginCardStyle: React.CSSProperties = {
  margin: '8px 16px',
  padding: '16px',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--bg-tertiary)',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background 0.2s',
}

interface MultiDbSidebarProps {
  activePlugin: DbPlugin | null
  onSelectPlugin: (plugin: DbPlugin) => void
}

const PLUGINS: { id: DbPlugin; name: string; desc: string }[] = [
  { id: 'postgresql', name: 'PostgreSQL', desc: 'Connect to Postgres databases' },
  { id: 'sql', name: 'SQL Server / MySQL', desc: 'Connect to SQL Server or MySQL' },
  { id: 'mongodb', name: 'MongoDB', desc: 'Connect to MongoDB (NoSQL)' },
]

export function MultiDbSidebar({ activePlugin, onSelectPlugin }: MultiDbSidebarProps) {
  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <div style={logoStyle}>◇</div>
        <span style={titleStyle}>Multi-Database</span>
      </div>

      <Link to="/" style={{ ...navLinkStyle, marginTop: 12 }}>
        ← Data Assistant
      </Link>

      <div style={pluginsLabelStyle}>Database plugins</div>
      {PLUGINS.map((p) => (
        <div
          key={p.id}
          style={{
            ...pluginCardStyle,
            borderColor: activePlugin === p.id ? 'var(--accent)' : undefined,
            background: activePlugin === p.id ? 'var(--accent-muted)' : undefined,
          }}
          onClick={() => onSelectPlugin(p.id)}
        >
          <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {p.name}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {p.desc}
          </div>
        </div>
      ))}
    </aside>
  )
}
