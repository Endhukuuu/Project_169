import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderGit2, ArrowRight, FileText, AlertTriangle, Layers, Calendar } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', language: 'JavaScript' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then(res => {
        setProjects(Array.isArray(res) ? res : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      setSubmitting(true);
      const created = await createProject(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', language: 'JavaScript' });
      fetchProjects();
      if (created?._id) {
        navigate(`/projects/${created._id}`);
      }
    } catch (err) {
      console.error('Failed to create project', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em', margin: 0 }}>
            Projects Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '6px 0 0 0' }}>
            Permanent project repositories with persistent AI intelligence and review history.
          </p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#000000',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '64px 32px', 
          backgroundColor: '#ffffff', 
          border: '1px solid var(--border-color)',
          borderRadius: '8px' 
        }}>
          <FolderGit2 size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
            No projects registered yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 20px' }}>
            Create a permanent project to analyze repository ZIP archives, save AI code reviews, and track code health metrics over time.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#111827',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {projects.map(p => {
            const projectId = p._id || p.id;
            return (
              <div 
                key={projectId}
                onClick={() => navigate(`/projects/${projectId}`)}
                style={{
                  backgroundColor: '#ffffff',
                  padding: '24px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#111827';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      fontSize: '0.72rem', 
                      backgroundColor: '#f3f4f6', 
                      color: '#374151',
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {p.languages?.length > 0 ? p.languages.join(', ') : (p.language || 'Multi-language')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      {new Date(p.createdAt || p.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
                    {p.name}
                  </h3>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.85rem', 
                    marginBottom: '16px', 
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {p.description || 'No description provided.'}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#4b5563' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={14} />
                        {p.filesCount ?? 0} files
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={14} />
                        {p.issuesCount ?? 0} issues
                      </span>
                    </div>

                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      color: '#111827' 
                    }}>
                      View Details <ArrowRight size={14} />
                    </span>
                  </div>

                  {user?.role === 'admin' && p.userId && typeof p.userId === 'object' && (
                    <div style={{ marginTop: '8px', fontSize: '0.72rem', color: '#9ca3af' }}>
                      Owner: {p.userId.name} ({p.userId.email})
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '28px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '480px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.01em' }}>
              Create New Project
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#6b7280', marginBottom: '20px' }}>
              Permanent project repositories store analysis scans, issues, and AI code review histories.
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>
                  Project Name *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. backend-api-service"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea 
                  rows={3}
                  placeholder="Brief summary of the repository purpose and tech stack..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', marginBottom: '6px' }}>
                  Primary Language
                </label>
                <select 
                  value={formData.language}
                  onChange={e => setFormData({...formData, language: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '9px 12px', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="C#">C#</option>
                  <option value="C++">C++</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  disabled={submitting}
                  style={{
                    padding: '8px 16px', 
                    border: '1px solid var(--border-color)', 
                    backgroundColor: '#fff', 
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    padding: '8px 18px', 
                    border: 'none', 
                    backgroundColor: '#000', 
                    color: '#fff', 
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
