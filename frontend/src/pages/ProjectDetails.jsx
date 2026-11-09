import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectDetails } from '../services/api';
import { 
  FolderGit2, 
  BrainCircuit, 
  FileCode2, 
  Layers, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  Activity, 
  Loader2, 
  ChevronRight,
  ShieldAlert,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function ProjectDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, reviews, analyses, files, issues, activity
  const [selectedReview, setSelectedReview] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await getProjectDetails(id);
      setData(res);
      if (res.reviews?.length > 0) {
        setSelectedReview(res.reviews[0]); // default to latest review
      }
      if (res.analyses?.length > 0) {
        setSelectedAnalysis(res.analyses[0]); // default to latest analysis
      }
    } catch (err) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Loader2 size={32} className="animate-spin" style={{ marginRight: '12px' }} />
        <span>Loading Persistent Project Identity & Review History...</span>
      </div>
    );
  }

  const { project, analyses, reviews, issues, files, activities } = data;
  const latestAnalysis = analyses[0];
  const latestReview = reviews[0];

  return (
    <div>
      {/* Navigation breadcrumb */}
      <div style={{ marginBottom: '16px' }}>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Projects Directory
        </Link>
      </div>

      {/* Project Identity Hero Card */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '700' }}>{project.name}</h1>
            <span style={{
              padding: '3px 10px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: project.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
              color: project.status === 'active' ? '#047857' : 'var(--text-primary)'
            }}>
              {project.status.toUpperCase()}
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px', maxWidth: '700px', lineHeight: '1.5' }}>
            {project.description || 'Permanent software project identity in UDIH intelligence hub.'}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.825rem' }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <User size={14} style={{ marginRight: '6px' }} /> Owner: <strong>{project.owner?.name || 'Administrator'}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={14} style={{ marginRight: '6px' }} /> Created: {new Date(project.createdAt).toLocaleDateString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <Clock size={14} style={{ marginRight: '6px' }} /> Last Updated: {new Date(project.updatedAt).toLocaleString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <FileText size={14} style={{ marginRight: '6px' }} /> {files.length || project.fileCount || 0} Files Recorded
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link
            to="/project-intelligence"
            state={{ selectedProjectId: project._id, selectedProjectName: project.name }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 18px',
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            <BrainCircuit size={16} style={{ marginRight: '8px' }} /> Run New AI Analysis
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '24px',
        gap: '24px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'overview', label: 'System Overview' },
          { id: 'reviews', label: `Review History (${reviews.length})` },
          { id: 'analyses', label: `Architecture Analyses (${analyses.length})` },
          { id: 'files', label: `Scanned Files (${files.length})` },
          { id: 'issues', label: `Issues Log (${issues.length})` },
          { id: 'activity', label: `Project Audit (${activities.length})` }
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
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <Sparkles size={18} style={{ marginRight: '8px' }} /> System Architecture Summary
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.925rem', marginBottom: '20px' }}>
                {latestAnalysis?.summary || 'No project-level architecture analysis recorded yet. Use the "Run New AI Analysis" button above to inspect this project repository.'}
              </p>

              {latestAnalysis?.architecture && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>PATTERN</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{latestAnalysis.architecture.pattern || 'Client-Server'}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>FRONTEND</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{latestAnalysis.architecture.frontend || 'Web Client'}</div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>BACKEND</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{latestAnalysis.architecture.backend || 'API Service'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Flow */}
            {latestAnalysis?.dataFlow && (
              <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '12px' }}>Inter-Module Data Flow</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  {latestAnalysis.dataFlow}
                </p>
              </div>
            )}

            {/* Cross-File Relationships */}
            {latestAnalysis?.relationships?.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Identified Relationships</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {latestAnalysis.relationships.map((rel, idx) => (
                    <div key={idx} style={{ padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                      {rel}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Rail Stats */}
          <div>
            <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>LATEST QUALITY SCORE</div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800' }}>
                {(latestAnalysis?.qualityScore ?? latestReview?.score) != null ? (
                  <>{latestAnalysis?.qualityScore ?? latestReview?.score} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ 100</span></>
                ) : (
                  <span style={{ fontSize: '1.75rem', color: 'var(--text-secondary)' }}>N/A</span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {(latestAnalysis || latestReview) ? 'Evaluated across architectural consistency, syntax, and security' : 'No analyses or reviews conducted yet'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Detected Languages</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.languages?.map((l) => (
                  <span key={l} style={{ padding: '4px 10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REVIEWS TAB (REQUIREMENT 6: PERSISTENT REVIEW HISTORY) */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: reviews.length > 0 ? '300px 1fr' : '1fr', gap: '24px' }}>
          {/* Review History Sidebar List */}
          {reviews.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Saved Review Timeline
              </div>
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  onClick={() => setSelectedReview(rev)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedReview?._id === rev._id ? 'var(--text-primary)' : 'var(--border-color)',
                    backgroundColor: selectedReview?._id === rev._id ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{rev.title}</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{rev.score}/100</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{rev.language}</span>
                    <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Review Details (Cached MongoDB Display, 0 AI calls) */}
          <div>
            {reviews.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                No code reviews have been conducted for this project yet. Use Code Review to inspect files.
              </div>
            ) : selectedReview ? (
              <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px' }}>{selectedReview.title}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Conducted on {new Date(selectedReview.createdAt).toLocaleString()} • Language: {selectedReview.language}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800' }}>{selectedReview.score} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ 100</span></div>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: selectedReview.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)',
                      color: selectedReview.status === 'Resolved' ? '#047857' : 'var(--text-primary)'
                    }}>
                      {selectedReview.status}
                    </span>
                  </div>
                </div>

                {/* Review Strengths & Recommendations */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px', color: '#047857' }}>Strengths Observed</h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {selectedReview.strengths?.length > 0 ? (
                        selectedReview.strengths.map((s, idx) => <li key={idx}>{s}</li>)
                      ) : (
                        <li>Standard syntax adhered to.</li>
                      )}
                    </ul>
                  </div>

                  <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Actionable Recommendations</h4>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {selectedReview.recommendations?.length > 0 ? (
                        selectedReview.recommendations.map((r, idx) => <li key={idx}>{r}</li>)
                      ) : (
                        <li>Review detected security and logic concerns.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Detected Issues */}
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>
                    Detected Issues & Guidance ({selectedReview.issues?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedReview.issues?.map((iss, idx) => (
                      <div key={idx} style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{iss.title}</span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: iss.severity === 'Critical' ? '#b91c1c' : iss.severity === 'High' ? '#ea580c' : 'var(--text-primary)',
                            color: '#fff'
                          }}>
                            {iss.severity}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>{iss.explanation}</p>
                        {iss.suggestedFix && (
                          <div style={{ fontSize: '0.825rem', padding: '8px 12px', backgroundColor: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                            <strong>Suggested Remediation:</strong> {iss.suggestedFix}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 3. ARCHITECTURE ANALYSES TAB */}
      {activeTab === 'analyses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {analyses.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              No full-project architecture analyses generated yet for this project.
            </div>
          ) : (
            analyses.map((an) => (
              <div key={an._id} style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Architecture Analysis Report</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Generated on {new Date(an.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {an.qualityScore}/100
                  </div>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {an.summary}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Pattern: <strong>{an.architecture?.pattern || 'Client-Server'}</strong></span> • 
                  <span>Files Processed: <strong>{an.fileCount || 0}</strong></span> • 
                  <span>Issues Detected: <strong>{an.issueCount || 0}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. SCANNED FILES TAB */}
      {activeTab === 'files' && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>File Path</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Language</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Size</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Imports</th>
                <th style={{ padding: '12px 20px', fontWeight: '600' }}>Exports</th>
              </tr>
            </thead>
            <tbody>
              {files.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No file metadata extracted yet.
                  </td>
                </tr>
              ) : (
                files.map((f) => (
                  <tr key={f._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontWeight: '500' }}>{f.path}</td>
                    <td style={{ padding: '12px 20px' }}>{f.language}</td>
                    <td style={{ padding: '12px 20px', color: 'var(--text-secondary)' }}>{(f.size / 1024).toFixed(1)} KB</td>
                    <td style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {f.imports?.slice(0, 3).join(', ') || 'None'}
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {f.exports?.slice(0, 3).join(', ') || 'None'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. ISSUES TAB */}
      {activeTab === 'issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {issues.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              No open issues detected across this project repository.
            </div>
          ) : (
            issues.map((iss) => (
              <div key={iss._id} style={{ padding: '18px', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{iss.title}</div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: iss.severity === 'Critical' ? '#b91c1c' : iss.severity === 'High' ? '#ea580c' : 'var(--text-primary)',
                    color: '#fff'
                  }}>
                    {iss.severity}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Location: <code style={{ fontSize: '0.75rem' }}>{iss.filePath}</code> ({iss.lineNumber}) • Category: {iss.category}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px' }}>{iss.description}</p>
                {iss.suggestedFix && (
                  <div style={{ fontSize: '0.825rem', padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <strong>Remediation:</strong> {iss.suggestedFix}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. ACTIVITY TAB */}
      {activeTab === 'activity' && (
        <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)', padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activities.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recorded project activities.</div>
            ) : (
              activities.map((act) => (
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
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>By: {act.userName || 'User'}</div>
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
