import { useState, useEffect } from 'react';
import { reviewCode, getProjects, updateReviewCommentStatus } from '../services/api';
import { Loader2, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';

export default function CodeReview() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ projectId: '', title: '', language: 'Python', code: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.title) return;
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await reviewCode(formData);
      setReview(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Review failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (commentId) => {
    try {
      await updateReviewCommentStatus(review.id, commentId, 'Resolved');
      setReview(prev => ({
        ...prev,
        comments: prev.comments.map(c => c.id === commentId ? { ...c, status: 'Resolved' } : c)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 140px)' }}>
      {/* Input Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Start Review</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Review Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Project</label>
            <select 
              value={formData.projectId}
              onChange={e => setFormData({...formData, projectId: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              <option value="">None</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Language</label>
            <select 
              value={formData.language}
              onChange={e => setFormData({...formData, language: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>C++</option>
              <option>SQL</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Context</label>
            <input 
              type="text" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '24px', minHeight: '300px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Source Code</label>
            <textarea 
              required
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              style={{ 
                flex: 1, width: '100%', padding: '16px', border: '1px solid var(--border-color)', 
                borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', resize: 'none'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              padding: '12px', border: 'none', backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', 
              borderRadius: '4px', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            {loading ? <Loader2 className="animate-spin" style={{ marginRight: '8px' }} size={20} /> : null}
            {loading ? 'Reviewing...' : 'Request AI Review'}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div style={{ 
        flex: 1, 
        backgroundColor: 'var(--bg-primary)', 
        border: '1px solid var(--border-color)', 
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Review Session</h2>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {error && (
            <div style={{ padding: '16px', border: '1px solid var(--text-primary)', borderRadius: '4px', marginBottom: '24px' }}>
              <div style={{ fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                <AlertCircle size={18} style={{ marginRight: '8px' }} /> Error
              </div>
              <p>{error}</p>
            </div>
          )}

          {!review && !error && !loading && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '64px' }}>
              Submit code to start a review session.
            </div>
          )}

          {review && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{review.title}</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '8px 16px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.875rem' }}>
                    Status: <strong>{review.status}</strong>
                  </div>
                  <div style={{ padding: '8px 16px', backgroundColor: 'var(--text-primary)', color: 'white', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 'bold' }}>
                    Score: {review.score}
                  </div>
                </div>
              </div>

              {review.ai_insights && (
                <div style={{ marginBottom: '32px', display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}><CheckCircle size={16} style={{ marginRight: '8px' }}/> Strengths</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.875rem' }}>
                      {review.ai_insights.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                    <h4 style={{ fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}><AlertCircle size={16} style={{ marginRight: '8px' }}/> Problems</h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.875rem' }}>
                      {review.ai_insights.problems?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <MessageSquare size={20} style={{ marginRight: '8px' }} />
                  Review Comments
                </h3>
                
                {review.comments?.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No comments on this review.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {review.comments.map(comment => (
                      <div key={comment.id} style={{ 
                        padding: '16px', 
                        border: '1px solid var(--border-color)', 
                        borderRadius: '8px',
                        opacity: comment.status === 'Resolved' ? 0.6 : 1 
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                            {comment.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                            {new Date(comment.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                          {comment.content}
                        </p>
                        
                        {comment.status !== 'Resolved' && (
                          <button 
                            onClick={() => handleResolve(comment.id)}
                            style={{
                              padding: '6px 12px', fontSize: '0.75rem', border: '1px solid var(--border-dark)', 
                              backgroundColor: 'transparent', borderRadius: '4px', cursor: 'pointer'
                            }}
                          >
                            Mark as Resolved
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
