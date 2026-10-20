import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderGit2, 
  BrainCircuit,
  Code2, 
  FileCode2, 
  History, 
  ScrollText, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Project Intelligence', path: '/project-intelligence', icon: BrainCircuit },
  { name: 'Code Analyzer', path: '/analyzer', icon: Code2 },
  { name: 'Code Review', path: '/review', icon: FileCode2 },
  { name: 'Analysis History', path: '/analysis-history', icon: History },
  { name: 'Review History', path: '/review-history', icon: ScrollText },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '250px', 
        backgroundColor: 'var(--bg-primary)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid var(--border-color)',
          fontWeight: '700',
          fontSize: '1.25rem',
          color: 'var(--text-primary)'
        }}>
          UDIH
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                borderRight: isActive ? '3px solid var(--text-primary)' : '3px solid transparent',
              })}
            >
              <item.icon size={20} style={{ marginRight: '12px' }} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '73px',
          backgroundColor: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          fontWeight: '500',
          fontSize: '1.125rem'
        }}>
          Developer Intelligence Hub
        </header>
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
