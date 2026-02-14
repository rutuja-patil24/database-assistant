import type { DbPlugin } from '../pages/MultiDatabasePage'
import { PostgresConnectionForm } from './PostgresConnectionForm'
import { SqlConnectionForm } from './SqlConnectionForm'
import { MongoConnectionForm } from './MongoConnectionForm'

const mainStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  background: 'var(--bg-primary)',
  overflow: 'hidden',
}

const contentStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'auto',
  padding: '32px 48px',
}

const emptyStyle: React.CSSProperties = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  gap: 12,
  color: 'var(--text-muted)',
  fontSize: '1.1rem',
}

interface MultiDbMainProps {
  activePlugin: DbPlugin | null
}

export function MultiDbMain({ activePlugin }: MultiDbMainProps) {
  return (
    <main style={mainStyle}>
      <div style={contentStyle}>
        {!activePlugin && (
          <div style={emptyStyle}>
            <p>Select a database plugin from the sidebar</p>
            <p style={{ fontSize: '0.95rem' }}>
              PostgreSQL, SQL Server/MySQL, or MongoDB
            </p>
          </div>
        )}
        {activePlugin === 'postgresql' && <PostgresConnectionForm />}
        {activePlugin === 'sql' && <SqlConnectionForm />}
        {activePlugin === 'mongodb' && <MongoConnectionForm />}
      </div>
    </main>
  )
}
