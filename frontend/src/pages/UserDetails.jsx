import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminUser, updateUserStatus, updateUserRole } from '../services/api';
import { 
  User, 
  Mail, 
  Calendar, 
  FolderGit2, 
  BrainCircuit, 
  FileCode2, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Loader2, 
  Percent, 
  Award,
  AlertTriangle
} from 'lucide-react';

export default function UserDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'analyses', 'reviews', 'activity'
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const res = await getAdminUser(id);
      setData(res);
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!data?.user) return;
    const newStatus = data.user.status === 'active' ? 'inactive' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this user?`)) return;

    try {
      setActionLoading(true);
      await updateUserStatus(data.user._id, newStatus);
      setData({
        ...data,
        user: { ...data.user, status: newStatus }
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Loader2 size={32} className="animate-spin" style={{ marginRight: '12px' }} />
        <span>Loading Developer Profile & Progress Analytics...</span>
      </div>
    );
  }

  const { user, progress, projects, projectAnalyses, singleAnalyses, codeReviews, recentActivities } = data;

  return (
    <div>
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to User Management
        </Link>
      </div>

      {/* User Header Card */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        padding: '28px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{user.name}</h1>
              <span style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: user.role === 'admin' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                color: user.role === 'admin' ? 'var(--bg-primary)' : 'var(--text-primary)'
              }}>
                {user.role.toUpperCase()}
              </span>
              {user.status === 'inactive' ? (
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#b91c1c'
                }}>
                  DEACTIVATED
                </span>
              ) : user.isOnline ? (
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#047857',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  ONLINE
                </span>
              ) : (
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
                  OFFLINE
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center' }}><Mail size={14} style={{ marginRight: '6px' }} /> {user.email}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}><Calendar size={14} style={{ marginRight: '6px' }} /> Registered: {new Date(user.createdAt).toLocaleDateString()}</span>
              <span style={{ display: 'flex', alignItems: 'center' }}><Clock size={14} style={{ marginRight: '6px' }} /> Last Active: {new Date(user.lastActive).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div>
          <button
            type="button"
            disabled={actionLoading}
            onClick={handleToggleStatus}
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: '600',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: user.status === 'active' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
              color: user.status === 'active' ? '#b91c1c' : '#047857',
              cursor: 'pointer'
            }}
          >
            {user.status === 'active' ? 'Deactivate Account' : 'Reactivate Account'}
          </button>
        </div>
      </div>

      {/* Progress & Real Activity KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>PROJECT COMPLETION</span>
            <Percent size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{progress.projectCompletionRate}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {progress.analyzedProjectsCount} of {progress.totalProjects} projects analyzed
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>AVG QUALITY SCORE</span>
            <Award size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
            {progress.totalAnalyses > 0 ? (
              <>{progress.avgQualityScore} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100</span></>
            ) : (
              <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {progress.totalAnalyses > 0 ? `Based on ${progress.totalAnalyses} completed analyses` : 'No analyses conducted yet'}
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>CODE REVIEWS</span>
            <FileCode2 size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{progress.totalReviews}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {progress.resolvedReviews} marked resolved ({progress.reviewResolutionRate}%)
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>OWNED REPOSITORIES</span>
            <FolderGit2 size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{projects.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Permanent project records</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        gap: '24px'
      }}>
        {[
          { id: 'projects', label: `Projects (${projects.length})` },
          { id: 'analyses', label: `Analyses (${projectAnalyses.length + singleAnalyses.length})` },
          { id: 'reviews', label: `Reviews (${codeReviews.length})` },
          { id: 'activity', label: `Activity Trail (${recentActivities.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--text-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? '600' : '400',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', gridColumn: '1 / -1' }}>
              No projects created or uploaded by this developer yet.
            </div>
          ) : (
            projects.map((p) => (
              <div key={p._id} style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '6px' }}>{p.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px', lineHeight: '1.4' }}>
                    {p.description || 'No description provided.'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {p.languages?.map((lang) => (
                      <span key={lang} style={{
                        padding: '2px 8px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '0.75rem'
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>{p.fileCount || 0} source files</span>
                  <Link to={`/projects/${p._id}`} style={{ fontWeight: '600', color: 'var(--text-primary)', textDecoration: 'underline' }}>
                    Inspect Project
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'analyses' && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Type</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Target / Project</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Quality Score</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {projectAnalyses.length === 0 && singleAnalyses.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No analyses recorded for this user.
                  </td>
                </tr>
              ) : (
                [
                  ...projectAnalyses.map(pa => ({ ...pa, isProject: true })),
                  ...singleAnalyses.map(sa => ({ ...sa, isProject: false }))
                ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((an) => (
                  <tr key={an._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: an.isProject ? 'var(--text-primary)' : 'var(--bg-secondary)',
                        color: an.isProject ? 'var(--bg-primary)' : 'var(--text-primary)'
                      }}>
                        {an.isProject ? 'FULL PROJECT' : 'SNIPPET'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', fontWeight: '600' }}>
                      {an.projectName || an.language || 'Snippet'}
                    </td>
                    <td style={{ padding: '12px 20px', fontWeight: '600' }}>
                      {an.qualityScore}/100
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(an.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Title</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Language</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Score</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {codeReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No code reviews recorded for this user.
                  </td>
                </tr>
              ) : (
                codeReviews.map((r) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 20px', fontWeight: '600' }}>{r.title}</td>
                    <td style={{ padding: '12px 20px' }}>{r.language}</td>
                    <td style={{ padding: '12px 20px', fontWeight: '600' }}>{r.score}/100</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: r.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                        color: r.status === 'Resolved' ? '#047857' : 'var(--text-primary)'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentActivities.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recorded user activities.</div>
            ) : (
              recentActivities.map((act) => (
                <div key={act._id} style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{act.details || act.action}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Action: <code>{act.action}</code></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {new Date(act.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
