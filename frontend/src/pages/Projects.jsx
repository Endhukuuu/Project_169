import { useEffect, useState } from 'react';
import { getProjects, createProject } from '../services/api';
import { Plus, FolderGit2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', language: 'Python' });

  const fetchProjects = () => {
    setLoading(true);
    getProjects().then(res => {
      setProjects(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      await createProject(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', language: 'Python' });
      fetchProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Projects</h1>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: '500'
          }}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          New Project
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '64px', 
          backgroundColor: 'var(--bg-primary)', 
          border: '1px solid var(--border-color)',
          borderRadius: '8px' 
        }}>
          <FolderGit2 size={48} color="var(--border-dark)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '8px' }}>No projects yet</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Create your first project to begin analyzing code.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {projects.map(p => (
            <div key={p.id} style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>{p.name}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px', minHeight: '40px' }}>
                {p.description || 'No description provided.'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '0.75rem', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {p.language}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {new Date(p.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '32px',
            borderRadius: '8px',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px' }}>Create Project</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Project Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', minHeight: '80px' }}
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>Primary Language</label>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{
                  padding: '8px 16px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--btn-secondary-bg)', borderRadius: '4px'
                }}>Cancel</button>
                <button type="submit" style={{
                  padding: '8px 16px', border: 'none', backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)', borderRadius: '4px'
                }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
