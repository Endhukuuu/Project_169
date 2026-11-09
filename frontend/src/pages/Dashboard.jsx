import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics, getUserActivity } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  AlertTriangle, 
  FileCode, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  BrainCircuit, 
  FolderGit2, 
  Code2,
  Clock,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAnalytics().catch(() => null),
      getUserActivity().catch(() => [])
    ]).then(([analyticsRes, activityRes]) => {
      setData(analyticsRes || {
        analyses_count: 0,
        reviews_count: 0,
        issues_count: 0,
        avg_quality_score: 0,
        activity: []
      });
      setActivities(Array.isArray(activityRes) ? activityRes : []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#6b7280' }}>
        Loading dashboard intelligence...
      </div>
    );
  }

  const statCards = [
    { label: 'Analyses Run', value: data?.analyses_count ?? 0, icon: FileCode },
    { label: 'Code Reviews', value: data?.reviews_count ?? 0, icon: Layers },
    { label: 'Issues Identified', value: data?.issues_count ?? 0, icon: AlertTriangle },
    { label: 'Avg Quality Score', value: data?.analyses_count > 0 && data?.avg_quality_score > 0 ? `${data.avg_quality_score}/100` : 'N/A', icon: Activity },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
              Welcome back, {user?.name || 'Developer'}
            </h1>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '3px 8px',
              borderRadius: '9999px',
              backgroundColor: user?.role === 'admin' ? '#000' : '#e5e7eb',
              color: user?.role === 'admin' ? '#fff' : '#111827',
              letterSpacing: '0.04em'
            }}>
              {user?.role?.toUpperCase() || 'DEVELOPER'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '6px 0 0 0' }}>
            {user?.role === 'admin' 
              ? 'Multi-user system monitor active. Overseeing all project intelligence pipelines and developer workflows.' 
              : 'Continuous developer intelligence and code quality hub.'}
          </p>
        </div>

        {user?.role === 'admin' ? (
          <Link
            to="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            <ShieldCheck size={18} />
            <span>Open Admin Portal</span>
            <ArrowRight size={16} />
          </Link>
        ) : (
          <Link
            to="/project-intelligence"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
            <BrainCircuit size={18} />
            <span>Analyze New ZIP</span>
            <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Admin Quick Overview Alert */}
      {user?.role === 'admin' && (
        <div style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#111827',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827' }}>
                System Administrator Privileges Active
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Full cross-user visibility enabled. You can audit all users, switch user accounts, and examine platform metrics.
              </div>
            </div>
          </div>
          <Link
            to="/admin"
            style={{
              fontSize: '0.82rem',
              fontWeight: '600',
              color: '#000',
              textDecoration: 'underline'
            }}
          >
            View All Users & Activity →
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '28px' 
      }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: '#ffffff',
            padding: '20px 24px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '500', marginBottom: '6px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#111827' }}>
                {stat.value}
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <stat.icon size={22} color="#111827" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Quick Launch */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Activity Chart */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', margin: 0 }}>Analysis Activity Trend</h2>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Historical volume across recent days
              </div>
            </div>
          </div>
          <div style={{ height: '260px' }}>
            {data?.activity && data.activity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderColor: '#111827', borderRadius: '6px', color: '#fff', fontSize: '0.8rem' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="analyses" stroke="#111827" strokeWidth={2.5} dot={{ fill: '#111827', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                No activity trend recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch & Shortcuts */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px' }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                to="/project-intelligence"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  backgroundColor: '#fafafa'
                }}
              >
                <BrainCircuit size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Project Intelligence</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Upload ZIP repository</div>
                </div>
                <ArrowRight size={14} color="#6b7280" />
              </Link>

              <Link
                to="/projects"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  backgroundColor: '#fafafa'
                }}
              >
                <FolderGit2 size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Projects Workspace</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>Manage code repositories</div>
                </div>
                <ArrowRight size={14} color="#6b7280" />
              </Link>

              <Link
                to="/review"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: 'var(--text-primary)',
                  backgroundColor: '#fafafa'
                }}
              >
                <Code2 size={18} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Code Review</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>AI code review & feedback</div>
                </div>
                <ArrowRight size={14} color="#6b7280" />
              </Link>
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            All intelligence pipelines run securely using Google Gemini API with isolated context boundaries.
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>Recent Activity</h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Audit log of recent system events</div>
          </div>
          <Clock size={16} color="#6b7280" />
        </div>

        <div>
          {activities.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
              No recent activity recorded.
            </div>
          ) : (
            activities.slice(0, 6).map((act, i) => (
              <div
                key={act._id || i}
                style={{
                  padding: '12px 24px',
                  borderBottom: i < activities.slice(0, 6).length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#111827' }}>
                    {act.action}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {act.details?.projectName ? `Project: ${act.details.projectName}` : act.details?.message || 'Standard platform action'}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {new Date(act.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
