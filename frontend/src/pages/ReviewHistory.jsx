import { useState, useEffect } from 'react';
import { getReviews } from '../services/api';
import { Search } from 'lucide-react';

export default function ReviewHistory() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getReviews().then(res => {
      setReviews(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = reviews.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.project_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Review History</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', padding: '8px 12px', borderRadius: '4px' }}>
          <Search size={16} color="var(--text-tertiary)" style={{ marginRight: '8px' }} />
          <input 
            type="text" 
            placeholder="Search reviews..." 
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
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Title</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Project</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Date</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '600', fontSize: '0.875rem' }}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: '500' }}>{r.title}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{r.project_name || 'N/A'}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{new Date(r.created_at).toLocaleString()}</td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', 
                      backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' 
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.875rem' }}>{r.comment_count}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No reviews found.
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
