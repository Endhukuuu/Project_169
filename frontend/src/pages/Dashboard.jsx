import { useEffect, useState } from 'react';
import { getAnalytics } from '../services/api';
import { Activity, AlertTriangle, CheckCircle, FileCode, Layers } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="animate-pulse">Loading dashboard...</div>;
  if (!data) return <div>Failed to load data.</div>;

  const statCards = [
    { label: 'Total Analyses', value: data.analyses_count, icon: FileCode },
    { label: 'Total Reviews', value: data.reviews_count, icon: Layers },
    { label: 'Issues Detected', value: data.issues_count, icon: AlertTriangle },
    { label: 'Avg Quality Score', value: data.avg_quality_score, icon: Activity },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stat.value}</div>
            </div>
            <stat.icon size={40} color="var(--border-dark)" />
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Analysis Activity Trend</h2>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="date" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="analyses" stroke="var(--text-primary)" strokeWidth={2} dot={{ fill: 'var(--text-primary)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
