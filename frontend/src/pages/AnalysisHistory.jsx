import { useState, useEffect } from 'react';
import { getAnalyses } from '../services/api';
import { Search } from 'lucide-react';

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAnalyses().then(res => {
      setAnalyses(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = analyses.filter(a => 
    a.project_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.language?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Analysis History</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '200px', backgroundColor: 'transparent' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">Loading history...</div>
      ) : (
        <div style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Project</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Language</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Score</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Issues</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{a.project_name || 'N/A'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{a.language}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(a.created_at).toLocaleString()}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: '500' }}>{a.quality_score}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{a.issue_count}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No analyses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
