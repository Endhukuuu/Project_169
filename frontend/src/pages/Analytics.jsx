import { useState, useEffect } from 'react';
import { getAnalytics } from '../services/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Analytics() {
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

  if (loading) return <div className="animate-pulse">Loading analytics...</div>;
  if (!data) return <div>Failed to load data.</div>;

  // Monochrome colors for charts
  const COLORS = ['#111827', '#4b5563', '#9ca3af', '#d1d5db', '#f3f4f6'];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Enterprise Data Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Severity Distribution */}
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Issue Severity Distribution</h2>
          <div style={{ height: '300px' }}>
            {data.severities?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.severities}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {data.severities.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>No issues found</div>
            )}
          </div>
        </div>

        {/* Activity Over Time */}
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Analysis Volume (Last 30 Days)</h2>
          <div style={{ height: '300px' }}>
             {data.activity?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis dataKey="date" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)' }} />
                  <Bar dataKey="analyses" fill="var(--text-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>No activity found</div>
            )}
          </div>
        </div>

      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Key Metrics Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Code Analyses</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.analyses_count}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Bugs Detected</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.issues_count}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Reviews</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.reviews_count}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Avg Code Quality Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.avg_quality_score}/100</div>
          </div>
        </div>
        
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', gap: '32px' }}>
           <div>
             <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Full Projects Analyzed</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{data.pi_projects || 0}</div>
           </div>
           <div>
             <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Total Project Files Scanned</div>
             <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{data.pi_files || 0}</div>
           </div>
        </div>
      </div>
    </div>
  );
}
