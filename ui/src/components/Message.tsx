import type { ChatMessage } from '../types'

const userBubbleStyle: React.CSSProperties = {
  alignSelf: 'flex-end',
  maxWidth: 'min(85%, 900px)',
  padding: '14px 20px',
  borderRadius: 'var(--radius)',
  background: 'var(--accent-muted)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  fontSize: '1rem',
}

const assistantBubbleStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  maxWidth: '100%',
  width: '100%',
}

const assistantTextStyle: React.CSSProperties = {
  padding: '12px 0',
  fontSize: '0.95rem',
  color: 'var(--text-secondary)',
}

const tableWrapStyle: React.CSSProperties = {
  marginTop: 12,
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  overflow: 'hidden',
  background: 'var(--bg-secondary)',
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.85rem',
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  background: 'var(--bg-tertiary)',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  borderBottom: '1px solid var(--border)',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderBottom: '1px solid var(--border)',
}

const sqlBlockStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 'var(--radius-sm)',
  background: 'var(--bg-tertiary)',
  border: '1px solid var(--border)',
  fontSize: '0.8rem',
  fontFamily: 'ui-monospace, monospace',
  color: 'var(--text-secondary)',
  overflow: 'auto',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
}

const metaStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  marginTop: 8,
}

export function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      {isUser ? (
        <div style={userBubbleStyle}>{message.content}</div>
      ) : (
        <div style={assistantBubbleStyle}>
          <div style={assistantTextStyle}>{message.content}</div>
          {message.queryResult?.sql && (
            <div style={sqlBlockStyle}>{message.queryResult.sql}</div>
          )}
          {message.queryResult?.data && message.queryResult.data.length > 0 && (
            <div style={tableWrapStyle}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    {Object.keys(message.queryResult.data[0]).map((k) => (
                      <th key={k} style={thStyle}>
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.queryResult.data.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((v, j) => (
                        <td key={j} style={tdStyle}>
                          {v == null ? '—' : String(v)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {message.queryResult?.execution_time_ms != null && (
            <div style={metaStyle}>
              {message.queryResult.count} row(s) · {message.queryResult.execution_time_ms} ms
            </div>
          )}
        </div>
      )}
    </div>
  )
}
