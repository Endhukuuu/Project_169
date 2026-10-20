import { useState, useEffect } from 'react';
import { getHealth } from '../services/api';
import { Settings as SettingsIcon, ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

export default function Settings() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHealth().then(res => {
      setHealth(res);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setHealth({ status: 'error', ai_status: 'Offline', db_status: 'Disconnected' });
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <SettingsIcon size={32} style={{ marginRight: '16px' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
        
        {/* AI Provider Settings */}
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            <Cpu size={20} style={{ marginRight: '8px' }} /> AI Provider Configuration
          </h2>
          
          <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '500' }}>Current Provider:</span>
              <span>{health?.ai_provider || 'Gemini API'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '500' }}>Status:</span>
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                {loading ? 'Checking...' : health?.ai_status === 'Online' ? (
                  <><ShieldCheck size={16} style={{ marginRight: '4px' }} /> Online Mode</>
                ) : (
                  <><ShieldAlert size={16} style={{ marginRight: '4px' }} /> Offline Mode</>
                )}
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            The API key is securely managed on the server side via environment variables (`process.env.GEMINI_API_KEY`). 
            Future capabilities will be added here.
          </p>
        </div>

        {/* System Health */}
        <div style={{ backgroundColor: 'var(--bg-primary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>System Health</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Backend Server</div>
              <div style={{ fontWeight: 'bold' }}>{loading ? 'Checking...' : health?.status === 'ok' ? 'Running' : 'Down'}</div>
            </div>
            <div style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Database (SQLite)</div>
              <div style={{ fontWeight: 'bold' }}>{loading ? 'Checking...' : health?.db_status || 'Disconnected'}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
