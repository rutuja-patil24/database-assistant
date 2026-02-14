import { useState } from 'react'
import { MultiDbSidebar } from '../components/MultiDbSidebar'
import { MultiDbMain } from '../components/MultiDbMain'

export type DbPlugin = 'postgresql' | 'sql' | 'mongodb'

export default function MultiDatabasePage() {
  const [activePlugin, setActivePlugin] = useState<DbPlugin | null>(null)

  return (
    <div style={layout}>
      <MultiDbSidebar activePlugin={activePlugin} onSelectPlugin={setActivePlugin} />
      <MultiDbMain activePlugin={activePlugin} />
    </div>
  )
}

const layout: React.CSSProperties = {
  display: 'flex',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}
