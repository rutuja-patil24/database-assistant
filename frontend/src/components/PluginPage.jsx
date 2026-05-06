import React, { useState, useRef, useEffect } from 'react';
import './PluginPage.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const DEMO_QUESTIONS = [
  'How many employees are in each department?',
  'What is the average salary by department?',
  'Show top 5 orders by revenue',
  'Which department has the highest budget?',
  'Total revenue by product',
  'List all employees in Engineering',
];

const SAMPLE_CONNECTIONS = [
  { label: 'Neon',     value: 'postgresql://user:pass@host.neon.tech/db?sslmode=require' },
  { label: 'Supabase', value: 'postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres' },
  { label: 'Local',    value: 'postgresql://postgres:password@localhost:5432/mydb' },
];

const CLI_STEPS = [
  { n: '1', comment: 'Install Claude Code CLI',    cmd: 'npm install -g @anthropic-ai/claude-code' },
  { n: '2', comment: 'Clone the plugin repo',      cmd: 'git clone https://github.com/rutuja-patil24/database-assistant' },
  { n: '3', comment: 'Start with plugin loaded',   cmd: 'claude --plugin-dir ./database-assistant/db-assistant-plugin' },
];

const CLI_COMMANDS = [
  { cmd: '/db-assistant:query How many employees per department?', desc: 'Query the demo database' },
  { cmd: '/db-assistant:connect postgresql://user:pass@host/db',   desc: 'Connect your own database' },
  { cmd: '/db-assistant:benchmark',                                desc: 'Show accuracy benchmark results' },
];

export default function PluginPage() {
  const [tab, setTab]             = useState('demo');
  const [question, setQuestion]   = useState('');
  const [connStr, setConnStr]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null);
  const [connectResult, setConn]  = useState(null);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState('');
  const inputRef = useRef();

  useEffect(() => { if (tab === 'demo') inputRef.current?.focus(); }, [tab]);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  async function runQuery(q) {
    const question = (q || '').trim();
    if (!question) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const resp = await fetch(`${API}/plugin/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, tables: {} }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(e.message || 'Query failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleChipClick(q) {
    setQuestion(q);
    runQuery(q);
  }

  async function testConnect() {
    if (!connStr.trim()) return;
    setLoading(true); setError(''); setConn(null);
    try {
      const resp = await fetch(`${API}/plugin/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connection_string: connStr, session_id: 'web-' + Date.now() }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) throw new Error(data.detail || data.error || 'Connection failed');
      setConn(data);
    } catch (e) {
      setError(e.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  }

  const cols = result?.preview?.[0] ? Object.keys(result.preview[0]) : [];

  return (
    <div className="pp-page">

      {/* ── Top nav ── */}
      <nav className="pp-nav">
        <div className="pp-nav-inner">
          <div className="pp-nav-brand">
            <div className="pp-nav-logo">DB</div>
            <span className="pp-nav-name">DB Assistant</span>
            <span className="pp-nav-divider">/</span>
            <span className="pp-nav-section">Plugin</span>
          </div>
          <div className="pp-nav-badge">
            <span className="pp-badge-dot" />
            Demo DB Connected
          </div>
        </div>
      </nav>

      <div className="pp-content">

        {/* ── Page header ── */}
        <div className="pp-header">
          <h1 className="pp-title">DB Assistant Plugin</h1>
          <p className="pp-subtitle">
            Query any database using natural language. Powered by Gemini AI — no SQL knowledge required.
          </p>
          <div className="pp-header-meta">
            <span className="pp-tag">4 demo tables</span>
            <span className="pp-tag">PostgreSQL</span>
            <span className="pp-tag pp-tag-green">API live</span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="pp-tabs">
          {[
            { id: 'demo',    label: 'Demo Database',    icon: '⚡' },
            { id: 'connect', label: 'Connect Your DB',  icon: '🔌' },
            { id: 'cli',     label: 'Claude Code CLI',  icon: '💻' },
          ].map(t => (
            <button
              key={t.id}
              className={`pp-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => { setTab(t.id); setError(''); setResult(null); setConn(null); }}
            >
              <span className="pp-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══ DEMO TAB ══ */}
        {tab === 'demo' && (
          <div className="pp-panel fade-in">
            <div className="pp-card">
              <div className="pp-card-label">Sample questions — click to run instantly</div>
              <div className="pp-chips">
                {DEMO_QUESTIONS.map(q => (
                  <button
                    key={q}
                    className="pp-chip"
                    onClick={() => handleChipClick(q)}
                    disabled={loading}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className={`pp-input-wrap ${loading ? 'loading' : ''}`}>
                <div className="pp-input-row">
                  <svg className="pp-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    ref={inputRef}
                    className="pp-input"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && runQuery(question)}
                    placeholder="Ask anything about employees, departments, orders, sales…"
                    disabled={loading}
                  />
                  <button
                    className="pp-run-btn"
                    onClick={() => runQuery(question)}
                    disabled={loading || !question.trim()}
                  >
                    {loading ? (
                      <><span className="pp-spinner" /> Running…</>
                    ) : (
                      <>Run <span className="pp-run-arrow">→</span></>
                    )}
                  </button>
                </div>
                <div className="pp-input-footer">
                  employees · departments · orders · sales_performance
                </div>
              </div>
            </div>

            {error && (
              <div className="pp-error fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {result && !loading && (
              <div className="fade-in">

                {/* Stats */}
                <div className="pp-stats">
                  <div className="pp-stat">
                    <div className="pp-stat-val">{result.row_count}</div>
                    <div className="pp-stat-key">Rows returned</div>
                  </div>
                  <div className="pp-stat-div" />
                  <div className="pp-stat">
                    <div className="pp-stat-val">{cols.length}</div>
                    <div className="pp-stat-key">Columns</div>
                  </div>
                  <div className="pp-stat-div" />
                  <div className="pp-stat">
                    <div className="pp-stat-val pp-stat-success">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Success
                    </div>
                    <div className="pp-stat-key">Status</div>
                  </div>
                </div>

                {/* SQL */}
                {result.sql && (
                  <div className="pp-card pp-sql-card">
                    <div className="pp-sql-header">
                      <div className="pp-card-label" style={{ margin: 0 }}>Generated SQL</div>
                      <button
                        className={`pp-copy-btn ${copied === 'sql' ? 'copied' : ''}`}
                        onClick={() => copy(result.sql, 'sql')}
                      >
                        {copied === 'sql' ? (
                          <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                        ) : (
                          <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                        )}
                      </button>
                    </div>
                    <pre className="pp-sql">{result.sql}</pre>
                  </div>
                )}

                {/* Table */}
                {result.preview?.length > 0 && (
                  <div className="pp-card" style={{ padding: 0 }}>
                    <div className="pp-table-head">
                      <span className="pp-card-label" style={{ margin: 0 }}>
                        Results preview — {result.preview.length} of {result.row_count} rows
                      </span>
                    </div>
                    <div className="pp-table-wrap">
                      <table className="pp-table">
                        <thead>
                          <tr>{cols.map(c => <th key={c}>{c}</th>)}</tr>
                        </thead>
                        <tbody>
                          {result.preview.map((row, i) => (
                            <tr key={i}>
                              {cols.map(c => <td key={c}>{String(row[c] ?? '')}</td>)}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {result.result_url && (
                  <a href={result.result_url} target="_blank" rel="noreferrer" className="pp-cta">
                    <div>
                      <div className="pp-cta-label">View Full Results</div>
                      <div className="pp-cta-url">{result.result_url}</div>
                    </div>
                    <div className="pp-cta-arrow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    </div>
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ CONNECT TAB ══ */}
        {tab === 'connect' && (
          <div className="pp-panel fade-in">
            <div className="pp-card">
              <div className="pp-card-label">Common formats — click to fill</div>
              <div className="pp-examples">
                {SAMPLE_CONNECTIONS.map(s => (
                  <button key={s.label} className="pp-example" onClick={() => setConnStr(s.value)}>
                    <span className="pp-example-label">{s.label}</span>
                    <span className="pp-example-val">{s.value}</span>
                  </button>
                ))}
              </div>

              <div className="pp-field-label">Your connection string</div>
              <textarea
                className="pp-textarea"
                rows={2}
                value={connStr}
                onChange={e => setConnStr(e.target.value)}
                placeholder="postgresql://username:password@host:5432/database"
              />

              <button
                className="pp-connect-btn"
                onClick={testConnect}
                disabled={loading || !connStr.trim()}
              >
                {loading ? (
                  <><span className="pp-spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,.3)' }} /> Testing connection…</>
                ) : (
                  'Test & Connect'
                )}
              </button>
            </div>

            {error && (
              <div className="pp-error fade-in">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {connectResult && (
              <div className="pp-success fade-in">
                <div className="pp-success-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Connected — {connectResult.tables_found?.length} tables found
                </div>
                <div className="pp-table-tags">
                  {connectResult.tables_found?.map(t => (
                    <span key={t} className="pp-table-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ CLI TAB ══ */}
        {tab === 'cli' && (
          <div className="pp-panel fade-in">
            <div className="pp-card">
              <div className="pp-card-label">Setup — 3 steps</div>
              {CLI_STEPS.map((s, i) => (
                <div key={i} className="pp-step">
                  <div className="pp-step-header">
                    <span className="pp-step-num">{s.n}</span>
                    <span className="pp-step-comment">{s.comment}</span>
                  </div>
                  <div className="pp-code-block">
                    <code className="pp-code-text">{s.cmd}</code>
                    <button
                      className={`pp-code-copy ${copied === `step-${i}` ? 'copied' : ''}`}
                      onClick={() => copy(s.cmd, `step-${i}`)}
                    >
                      {copied === `step-${i}` ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pp-card" style={{ padding: 0 }}>
              <div className="pp-card-label" style={{ padding: '16px 20px 0' }}>
                Available slash commands
              </div>
              {CLI_COMMANDS.map((c, i) => (
                <div key={i} className="pp-command">
                  <div className="pp-command-body">
                    <code className="pp-command-code">{c.cmd}</code>
                    <span className="pp-command-desc">{c.desc}</span>
                  </div>
                  <button
                    className={`pp-code-copy ${copied === `cmd-${i}` ? 'copied' : ''}`}
                    onClick={() => copy(c.cmd, `cmd-${i}`)}
                    style={{ flexShrink: 0 }}
                  >
                    {copied === `cmd-${i}` ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pp-card pp-db-info">
              <div className="pp-card-label">Demo database tables</div>
              <div className="pp-demo-tags">
                {['employees — 50 rows', 'departments — 10 rows', 'orders — 200 rows', 'sales_performance — 40 rows'].map(t => (
                  <span key={t} className="pp-demo-tag">{t}</span>
                ))}
              </div>
              <p className="pp-db-note">
                Pre-loaded Neon PostgreSQL — no setup required to start querying.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
