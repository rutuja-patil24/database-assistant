import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  Database, Leaf, FolderOpen,
  ArrowRight, Zap, BarChart2,
  MessageSquare, Sparkles, Shield, Link2, Users,
} from 'lucide-react';
import './DashboardPage.css';

const ACTIONS = [
  { label: 'PostgreSQL',   desc: 'Query with natural language',     icon: Database,   color: '#3b82f6', bg: '#eff6ff', to: '/query/postgres' },
  { label: 'MongoDB',      desc: 'Query collections with AI',       icon: Leaf,        color: '#10b981', bg: '#f0fdf4', to: '/query/mongo'    },
  { label: 'MySQL',        desc: 'Natural language to MySQL',        icon: Database,   color: '#f59e0b', bg: '#fffbeb', to: '/mysql'          },
  { label: 'Datasets',     desc: 'Upload CSV and ask questions',     icon: FolderOpen, color: '#8b5cf6', bg: '#f5f3ff', to: '/datasets'       },
  { label: 'Swarm Agents', desc: 'Parallel AI agents',              icon: Zap,         color: '#6366f1', bg: '#eef2ff', to: '/swarm'          },
  { label: 'Benchmark',    desc: 'View accuracy results',            icon: BarChart2,  color: '#10b981', bg: '#f0fdf4', to: '/benchmark'      },
];

const HOW = [
  { n: '01', icon: MessageSquare, title: 'Ask in plain English',     desc: 'Type any question — no SQL knowledge required' },
  { n: '02', icon: Sparkles,      title: 'Gemini reads your schema', desc: 'AI understands tables, columns & relationships' },
  { n: '03', icon: Shield,        title: 'Query is verified',        desc: 'Safety-checked before touching your database' },
  { n: '04', icon: BarChart2,     title: 'Results + insights',       desc: 'Tables, charts, and AI-powered EDA instantly' },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    authAPI.connections().then(r => setConnections(r.data || [])).catch(() => {});
  }, []);

  const pg    = connections.filter(c => c.db_type === 'postgresql');
  const mongo = connections.filter(c => c.db_type === 'mongodb');
  const mysql = connections.filter(c => c.db_type === 'mysql');
  const name  = user?.displayName || user?.full_name || user?.email?.split('@')[0] || 'there';

  const STATS = [
    { label: 'PostgreSQL DBs',    value: pg.length,          color: '#3b82f6', icon: Database },
    { label: 'MongoDB DBs',       value: mongo.length,       color: '#10b981', icon: Leaf     },
    { label: 'MySQL DBs',         value: mysql.length,       color: '#f59e0b', icon: Database },
    { label: 'Total Connections', value: connections.length, color: '#8b5cf6', icon: Link2    },
  ];

  return (
    <div className="dash">

      {/* ── Hero card ── */}
      <div className="dash-hero-card dash-fade-up">
        <div>
          <div className="dash-greeting">{greeting()}</div>
          <h1 className="dash-hero-title">{name} 👋</h1>
          <p className="dash-hero-sub">Here's what's happening with your databases today</p>
        </div>
        <div className="dash-hero-right">
          <div className="dash-hero-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <button className="dash-quick-btn" onClick={() => navigate('/query/postgres')}>
            Quick Query
          </button>
        </div>
      </div>

      {/* ── No connections banner ── */}
      {connections.length === 0 && (
        <div className="dash-banner dash-fade-up" onClick={() => navigate('/connections')}>
          <div className="dash-banner-icon"><Link2 size={18} /></div>
          <div>
            <div className="dash-banner-title">Connect your first database</div>
            <div className="dash-banner-sub">Add a PostgreSQL or MongoDB connection to start querying with AI</div>
          </div>
          <ArrowRight size={18} className="dash-banner-arrow" />
        </div>
      )}

      {/* ── Stats row ── */}
      <div className="dash-stats-row dash-fade-up">
        {STATS.map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="dash-stat-card" style={{ '--stat-color': color }}>
            <div className="dash-stat-icon-box" style={{ background: `${color}18`, color }}>
              <Icon size={18} />
            </div>
            <div className="dash-stat-value" style={{ color }}>{value}</div>
            <div className="dash-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <section className="dash-section dash-fade-up">
        <h2 className="dash-section-title">Quick actions</h2>
        <div className="dash-actions-grid">
          {ACTIONS.map(({ label, desc, icon: Icon, color, bg, to }) => (
            <button
              key={to}
              className="dash-action-card"
              onClick={() => navigate(to)}
            >
              <div className="dash-action-icon-box" style={{ background: bg, color }}>
                <Icon size={20} />
              </div>
              <div className="dash-action-text">
                <div className="dash-action-label">{label}</div>
                <div className="dash-action-desc">{desc}</div>
              </div>
              <ArrowRight size={15} className="dash-action-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="dash-section dash-fade-up">
        <h2 className="dash-section-title">How it works</h2>
        <div className="dash-how-grid">
          {HOW.map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="dash-how-card">
              <div className="dash-how-num">{n}</div>
              <div className="dash-how-icon-box">
                <Icon size={18} />
              </div>
              <div className="dash-how-title">{title}</div>
              <div className="dash-how-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
