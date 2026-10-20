import { useState, useEffect } from 'react';
import { analyzeCode, getProjects } from '../services/api';
import { Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function CodeAnalyzer() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ projectId: '', language: 'Python', code: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzeCode(formData);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity?.toLowerCase()) {
      case 'critical':
      case 'high': return <AlertCircle size={18} />;
      case 'medium': return <AlertCircle size={18} />;
      case 'low': return <Info size={18} />;
      default: return <Info size={18} />;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 140px)' }}>
      {/* Input Section */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Code Analyzer</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Project (Optional)</label>
              <select 
                value={formData.projectId}
                onChange={e => setFormData({...formData, projectId: e.target.value})}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
              >
                <option value="">None</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
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
                <option>C</option>
                <option>SQL</option>
              </select>
            </div>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Description (Optional)</label>
            <input 
              type="text" 
              placeholder="What is this code supposed to do?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
            />
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Source Code</label>
            <textarea 
              required
              value={formData.code}
              onChange={e => setFormData({...formData, code: e.target.value})}
              style={{ 
                flex: 1, width: '100%', padding: '16px', border: '1px solid var(--border-color)', 
                borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', resize: 'none'
              }}
              placeholder="Paste your code here..."
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
            {loading ? 'Analyzing Code...' : 'Analyze Code'}
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Analysis Results</h2>
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

          {!result && !error && !loading && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '64px' }}>
              Submit code to view semantic analysis and issues.
            </div>
          )}

          {result && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>Summary</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{result.summary}</p>
                </div>
                <div style={{ 
                  textAlign: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', minWidth: '100px'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Score</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.quality_score}</div>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '8px' }}>Intent & Complexity</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{result.intent}</p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                    <strong>Time:</strong> {result.complexity_time || 'N/A'}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', fontSize: '0.875rem' }}>
                    <strong>Space:</strong> {result.complexity_space || 'N/A'}
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>Detected Issues ({result.issues?.length || 0})</h3>
                {result.issues && result.issues.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {result.issues.map((issue, idx) => (
                      <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          {getSeverityIcon(issue.severity)}
                          <strong style={{ fontSize: '1rem' }}>{issue.title}</strong>
                          <span style={{ fontSize: '0.75rem', padding: '2px 8px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                            {issue.severity}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', marginBottom: '8px', color: 'var(--text-secondary)' }}><strong>Explanation:</strong> {issue.explanation}</p>
                        <p style={{ fontSize: '0.875rem', marginBottom: '16px', color: 'var(--text-secondary)' }}><strong>Fix:</strong> {issue.suggested_fix}</p>
                        
                        {issue.corrected_code && (
                          <div style={{ marginTop: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '500', marginBottom: '8px' }}>Suggested Code:</div>
                            <pre style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', overflowX: 'auto', margin: 0 }}>
                              <code>{issue.corrected_code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> No major issues detected.
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
