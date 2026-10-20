import { useState, useEffect } from 'react';
import { getProjects, uploadProjectZip, analyzeFullProject } from '../services/api';
import { Loader2, UploadCloud, FolderTree, AlertTriangle, ShieldAlert, Layers, CheckCircle2, FileText, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon } from 'lucide-react';

const FileTreeNode = ({ node, onSelect, selectedPath }) => {
  const [expanded, setExpanded] = useState(true);
  
  if (node.isDir) {
    return (
      <div style={{ marginLeft: node.name !== 'root' ? '16px' : '0' }}>
        {node.name !== 'root' && (
          <div 
            onClick={() => setExpanded(!expanded)} 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px 4px', color: 'var(--text-primary)', fontWeight: '600', fontSize: '0.875rem' }}
          >
            {expanded ? <ChevronDown size={14} style={{ marginRight: '4px' }}/> : <ChevronRightIcon size={14} style={{ marginRight: '4px' }}/>} 
            📁 {node.name}/
          </div>
        )}
        {expanded && Object.values(node.children).sort((a,b) => b.isDir - a.isDir || a.name.localeCompare(b.name)).map(child => (
          <FileTreeNode key={child.path} node={child} onSelect={onSelect} selectedPath={selectedPath} />
        ))}
      </div>
    );
  }

  const hasIssues = node.issues && node.issues.length > 0;

  return (
    <div 
      onClick={() => onSelect(node)}
      style={{ 
        marginLeft: '16px', 
        padding: '6px 8px', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: selectedPath === node.path ? 'var(--bg-tertiary)' : 'transparent',
        border: selectedPath === node.path ? '1px solid var(--border-dark)' : '1px solid transparent',
        borderRadius: '4px',
        fontSize: '0.875rem',
        fontFamily: 'var(--font-mono)'
      }}
    >
      <span>📄 {node.name}</span>
      {hasIssues ? (
        <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', backgroundColor: '#e5e5e5', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
          <AlertTriangle size={12} style={{ marginRight: '4px' }}/> {node.issues.length} issue{node.issues.length > 1 ? 's' : ''}
        </span>
      ) : (
        <span style={{ color: 'var(--text-tertiary)' }}><CheckCircle2 size={14}/></span>
      )}
    </div>
  );
};

export default function ProjectIntelligence() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('upload'); // upload, analyzing, result
  const [manifest, setManifest] = useState(null);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [progressData, setProgressData] = useState({ percent: 0, message: '', filesProcessed: 0, totalFiles: 0 });
  const [treeRoot, setTreeRoot] = useState(null);
  const [selectedFileNode, setSelectedFileNode] = useState(null);

  useEffect(() => {
    getProjects().then(setProjects).catch(console.error);
  }, []);

  const buildTree = (files, issues) => {
    const root = { name: 'root', isDir: true, children: {}, path: '' };
    files.forEach(f => {
      // normalize path
      const parts = f.path.replace(/\\/g, '/').split('/');
      let current = root;
      let currPath = '';
      parts.forEach((part, i) => {
        currPath += (currPath ? '/' : '') + part;
        if (!current.children[part]) {
          const isFile = i === parts.length - 1;
          const fileIssues = isFile ? issues.filter(issue => issue.file_path && issue.file_path.replace(/\\/g, '/') === f.path.replace(/\\/g, '/')) : [];
          current.children[part] = {
            name: part,
            isDir: !isFile,
            path: currPath,
            children: {},
            file: isFile ? f : null,
            issues: fileIssues
          };
        }
        current = current.children[part];
      });
    });
    return root;
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStep('analyzing');
    setError(null);
    setProgressData({ percent: 10, message: 'Uploading and Extracting...', filesProcessed: 0, totalFiles: 0 });
    
    try {
      const formData = new FormData();
      formData.append('project', file);
      if (selectedProjectId) formData.append('projectId', selectedProjectId);
      
      const res = await uploadProjectZip(formData);
      setManifest(res.manifest);
      
      const total = res.manifest.fileCount;
      setProgressData({ percent: 30, message: 'Scanning Project & Building Manifest...', filesProcessed: 0, totalFiles: total });
      
      // Simulate progress
      let simPercent = 30;
      const interval = setInterval(() => {
        simPercent += 5;
        if (simPercent > 95) simPercent = 95;
        
        let msg = 'Analyzing Files...';
        let done = 0;
        if (simPercent < 70) {
          msg = 'Analyzing Files...';
          done = Math.floor(total * ((simPercent - 30) / 40));
        } else if (simPercent < 90) {
          msg = 'Understanding File Relationships...';
          done = total;
        } else {
          msg = 'Generating Project Report...';
          done = total;
        }
        
        setProgressData(p => ({ ...p, percent: simPercent, message: msg, filesProcessed: done }));
      }, 2000);

      const reportRes = await analyzeFullProject({
        projectId: selectedProjectId,
        manifest: res.manifest,
        files: res.extractedFiles
      });
      
      clearInterval(interval);
      setReport(reportRes);
      setTreeRoot(buildTree(reportRes.files || res.manifest.files, reportRes.issues || []));
      setStep('result');
      
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed');
      setStep('upload');
    }
  };

  const renderTabs = () => (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', overflowX: 'auto' }}>
      {['overview', 'architecture', 'files', 'issues', 'security'].map(t => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: activeTab === t ? '2px solid var(--text-primary)' : '2px solid transparent',
            color: activeTab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === t ? '600' : '400',
            textTransform: 'capitalize',
            cursor: 'pointer'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Project Intelligence</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Upload a complete codebase (ZIP) for full-project semantic analysis.</p>
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
          <AlertTriangle size={20} style={{ marginRight: '12px' }} />
          <span>{error}</span>
        </div>
      )}

      {step === 'upload' && (
        <div style={{ 
          flex: 1, backgroundColor: 'var(--bg-primary)', border: '1px dashed var(--border-dark)', 
          borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px'
        }}>
          <UploadCloud size={64} color="var(--border-dark)" style={{ marginBottom: '24px' }} />
          
          <div style={{ width: '100%', maxWidth: '400px', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '8px' }}>Target Project (Optional)</label>
            <select 
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
            >
              <option value="">None</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <label style={{
            padding: '12px 24px', backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)',
            borderRadius: '4px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px', border: '1px solid var(--border-dark)'
          }}>
            Select ZIP File
            <input type="file" accept=".zip" style={{ display: 'none' }} onChange={handleFileChange} />
          </label>
          
          {file && (
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', padding: '8px 16px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
              <FileText size={16} style={{ marginRight: '8px' }} />
              <span style={{ fontWeight: '500' }}>{file.name}</span>
            </div>
          )}

          <button 
            onClick={handleUpload}
            disabled={!file}
            style={{
              padding: '12px 32px', border: '1px solid var(--border-dark)', backgroundColor: 'var(--bg-primary)', 
              color: 'var(--text-primary)', borderRadius: '4px', fontWeight: '600', opacity: !file ? 0.5 : 1, cursor: file ? 'pointer' : 'not-allowed'
            }}
          >
            Start Project Analysis
          </button>
        </div>
      )}

      {step === 'analyzing' && (
        <div style={{ 
          flex: 1, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', 
          borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '32px' }}>Analyzing Project</h2>
          
          <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '16px' }}>{progressData.percent}%</div>
          
          {progressData.totalFiles > 0 && (
            <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              {progressData.filesProcessed} / {progressData.totalFiles} files processed
            </div>
          )}
          
          <div style={{ width: '100%', maxWidth: '400px', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '24px' }}>
             <div style={{ width: `${progressData.percent}%`, height: '100%', backgroundColor: 'var(--text-primary)', transition: 'width 0.5s ease' }}></div>
          </div>

          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>Current step:</span>
            <span>{progressData.message}</span>
          </div>
        </div>
      )}

      {step === 'result' && report && (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>{manifest.projectName || 'Project Analysis Report'}</h2>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>{manifest.fileCount} Files</span>
                <span>Languages: {manifest.languages.join(', ') || 'Unknown'}</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px 24px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>Quality Score</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{report.quality_score}/100</div>
            </div>
          </div>

          <div style={{ padding: '0 24px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {renderTabs()}
            
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '24px' }}>
              
              {activeTab === 'overview' && (
                <div style={{ maxWidth: '800px' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Project Summary</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>{report.summary}</p>
                  
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '12px' }}>Data Flow</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>{report.dataFlow || 'No clear data flow extracted.'}</p>
                  
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>Recommendations</h3>
                  <ul style={{ paddingLeft: '24px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {report.recommendations?.map((r, i) => <li key={i} style={{ marginBottom: '12px' }}>{r}</li>)}
                  </ul>
                </div>
              )}

              {activeTab === 'architecture' && (
                <div style={{ maxWidth: '800px' }}>
                  <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '32px', backgroundColor: 'var(--bg-secondary)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center' }}><Layers size={20} style={{ marginRight: '12px' }}/> System Architecture</h3>
                    {(() => {
                      try {
                        const arch = JSON.parse(report.architecture);
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div><strong style={{ display: 'inline-block', width: '120px', color: 'var(--text-secondary)' }}>Pattern:</strong> <span style={{ fontWeight: '500' }}>{arch.pattern || 'Unknown'}</span></div>
                            {arch.frontend && <div><strong style={{ display: 'inline-block', width: '120px', color: 'var(--text-secondary)' }}>Frontend:</strong> <span>{arch.frontend}</span></div>}
                            {arch.backend && <div><strong style={{ display: 'inline-block', width: '120px', color: 'var(--text-secondary)' }}>Backend:</strong> <span>{arch.backend}</span></div>}
                            {arch.database && <div><strong style={{ display: 'inline-block', width: '120px', color: 'var(--text-secondary)' }}>Database:</strong> <span>{arch.database}</span></div>}
                          </div>
                        );
                      } catch (e) {
                        return <div>Failed to parse architecture data.</div>;
                      }
                    })()}
                  </div>

                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>Key Relationships</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {report.relationships?.map((r, i) => (
                      <div key={i} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={16} style={{ marginRight: '12px', color: 'var(--text-tertiary)' }}/>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div style={{ display: 'flex', gap: '24px', height: '100%' }}>
                  <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflowY: 'auto', padding: '16px', backgroundColor: 'var(--bg-secondary)' }}>
                     <div style={{ marginBottom: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                       <FolderTree size={18} style={{ marginRight: '8px' }}/> Project Structure
                     </div>
                     {treeRoot && <FileTreeNode node={treeRoot} onSelect={setSelectedFileNode} selectedPath={selectedFileNode?.path} />}
                  </div>
                  
                  <div style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '8px', overflowY: 'auto', padding: '24px', backgroundColor: 'var(--bg-primary)' }}>
                    {selectedFileNode ? (
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px', wordBreak: 'break-all' }}>{selectedFileNode.name}</h3>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>{selectedFileNode.path}</div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', marginBottom: '32px', fontSize: '0.875rem' }}>
                          <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Language</div>
                          <div>{selectedFileNode.file?.language || 'Unknown'}</div>
                          <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Size</div>
                          <div>{selectedFileNode.file?.size ? `${(selectedFileNode.file.size / 1024).toFixed(2)} KB` : 'Unknown'}</div>
                          
                          {(() => {
                            let imports = [], exports = [];
                            if (selectedFileNode.file?.imports) {
                              try { imports = JSON.parse(selectedFileNode.file.imports); } catch(e){}
                            }
                            if (selectedFileNode.file?.exports) {
                              try { exports = JSON.parse(selectedFileNode.file.exports); } catch(e){}
                            }
                            return (
                              <>
                                <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Imports</div>
                                <div>{imports.length > 0 ? imports.join(', ') : 'None detected'}</div>
                                <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Exports</div>
                                <div>{exports.length > 0 ? exports.join(', ') : 'None detected'}</div>
                              </>
                            )
                          })()}
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-color)' }}>Issues in File</h4>
                        {selectedFileNode.issues && selectedFileNode.issues.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {selectedFileNode.issues.map((issue, idx) => (
                              <div key={idx} style={{ padding: '16px', border: '1px solid var(--border-dark)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <AlertTriangle size={16} />
                                  <strong style={{ fontSize: '0.875rem' }}>{issue.title}</strong>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                  <span style={{ border: '1px solid var(--border-color)', padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>{issue.severity}</span>
                                  {issue.line_number && issue.line_number !== 'File-level issue' ? `Line: ${issue.line_number}` : 'File-level issue'}
                                </div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{issue.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>
                            <CheckCircle2 size={16} style={{ marginRight: '8px' }}/> No issues detected in this file.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
                        <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>Select a file to view details</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'issues' && (
                <div style={{ maxWidth: '900px' }}>
                   {report.issues?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {report.issues.map((issue, idx) => (
                        <div key={idx} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <AlertTriangle size={20} />
                            <strong style={{ fontSize: '1.125rem' }}>{issue.title}</strong>
                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', border: '1px solid var(--border-dark)', borderRadius: '4px', fontWeight: 'bold' }}>
                              {issue.severity}
                            </span>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '0.875rem', marginBottom: '20px' }}>
                            <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>File:</div>
                            <div style={{ fontFamily: 'var(--font-mono)' }}>{issue.file_path || 'Unknown'}</div>
                            
                            <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Location:</div>
                            <div style={{ fontFamily: 'var(--font-mono)' }}>{issue.line_number && issue.line_number !== 'File-level issue' ? `Line ${issue.line_number}` : 'File-level issue'}</div>
                            
                            <div style={{ color: 'var(--text-tertiary)', fontWeight: '600' }}>Category:</div>
                            <div>{issue.category}</div>
                          </div>

                          <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                              <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>Explanation:</strong>
                              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{issue.description}</p>
                            </div>
                            {issue.impact && (
                              <div>
                                <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>Impact:</strong>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{issue.impact}</p>
                              </div>
                            )}
                            <div>
                              <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-primary)' }}>Suggested Fix:</strong>
                              <div style={{ padding: '12px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)' }}>
                                {issue.suggested_fix}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={24} /> <span style={{ fontSize: '1.125rem' }}>No major issues detected across the project.</span>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'security' && (
                <div style={{ maxWidth: '800px' }}>
                   {report.securityFindings?.length > 0 ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {report.securityFindings.map((finding, idx) => (
                          <div key={idx} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'flex-start' }}>
                            <ShieldAlert size={24} style={{ marginRight: '16px', marginTop: '2px', color: 'var(--text-primary)' }} />
                            <span style={{ fontSize: '0.9375rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>{finding}</span>
                          </div>
                        ))}
                     </div>
                   ) : (
                    <div style={{ padding: '24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={24} /> <span style={{ fontSize: '1.125rem' }}>No high-level security concerns found in the project.</span>
                    </div>
                   )}
                   <p style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>
                     Note: Discovered secrets (if any) are evaluated but raw values are masked and never stored in analytics.
                   </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
