import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAdminStats, 
  getAdminUsers, 
  updateUserStatus, 
  updateUserRole 
} from '../services/api';
import { 
  Users, 
  UserCheck, 
  UserX, 
  FolderGit2, 
  BrainCircuit, 
  FileCode2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ShieldCheck, 
  User as UserIcon, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Activity 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        getAdminStats(),
        getAdminUsers({ search, role: roleFilter, status: statusFilter })
      ]);
      setStats(statsData);
      setUsers(usersData.users || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${user.name}'s account?`)) {
      return;
    }

    try {
      setUpdatingId(user._id);
      await updateUserStatus(user._id, newStatus);
      setUsers(users.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
      if (stats?.users) {
        setStats({
          ...stats,
          users: {
            ...stats.users,
            active: newStatus === 'active' ? stats.users.active + 1 : stats.users.active - 1,
            inactive: newStatus === 'inactive' ? stats.users.inactive + 1 : stats.users.inactive - 1
          }
        });
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'developer' : 'admin';
    if (!confirm(`Promote/Change role of ${user.name} to ${newRole.toUpperCase()}?`)) {
      return;
    }

    try {
      setUpdatingId(user._id);
      await updateUserRole(user._id, newRole);
      setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--text-secondary)' }}>
        <Loader2 size={32} className="animate-spin" style={{ marginRight: '12px' }} />
        <span>Loading Platform Administrator Console...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
              <ShieldCheck size={28} style={{ marginRight: '10px' }} />
              Platform Administration
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Platform-wide user management, project governance, and system-wide intelligence metrics
            </p>
          </div>
          <div style={{
            padding: '6px 14px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', marginRight: '8px' }} />
            Administrator Mode Active
          </div>
        </div>
      </div>

      {/* Platform KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL USERS</span>
            <Users size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats?.users?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            <span style={{ color: '#047857', fontWeight: '600' }}>{stats?.users?.online || 0} online</span> • {stats?.users?.total || 0} registered ({stats?.users?.inactive || 0} deactivated)
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL PROJECTS</span>
            <FolderGit2 size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats?.projects?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Across all platform accounts</div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>TOTAL ANALYSES</span>
            <BrainCircuit size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats?.analyses?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {stats?.analyses?.totalProjectAnalyses || 0} project • {stats?.analyses?.totalSingleAnalyses || 0} snippet
          </div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>CODE REVIEWS</span>
            <FileCode2 size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats?.reviews?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>AI-generated peer reviews</div>
        </div>

        <div style={{ padding: '20px', backgroundColor: 'var(--bg-primary)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', fontWeight: '600' }}>ISSUES IDENTIFIED</span>
            <AlertTriangle size={18} style={{ color: 'var(--text-tertiary)' }} />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>{stats?.issues?.total || 0}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Security & quality findings</div>
        </div>
      </div>

      {/* User Management Section */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '36px', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '600', marginBottom: '4px' }}>Registered Platform Users</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage accounts, track developer progress, and assign administrative roles</p>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '7px 12px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '230px',
                  backgroundColor: 'var(--bg-secondary)'
                }}
              />
            </form>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="developer">Developers</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="online">Online Only</option>
              <option value="offline">Offline Only</option>
              <option value="inactive">Deactivated Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 24px', fontWeight: '600' }}>User</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Presence / Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Projects</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Analyses</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Reviews</th>
                <th style={{ padding: '12px 16px', fontWeight: '600' }}>Registered</th>
                <th style={{ padding: '12px 24px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No users matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s' }}>
                    <td style={{ padding: '14px 24px' }}>
                      <Link to={`/admin/users/${u._id}`} style={{ fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                        {u.name}
                      </Link>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: u.role === 'admin' ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                        color: u.role === 'admin' ? 'var(--bg-primary)' : 'var(--text-primary)'
                      }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {u.status === 'inactive' ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#b91c1c'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                          DEACTIVATED
                        </span>
                      ) : u.isOnline ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          color: '#047857'
                        }}>
                          <span style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            backgroundColor: '#10b981',
                            boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3)'
                          }} />
                          ONLINE
                        </span>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: '#f3f4f6',
                            color: '#6b7280',
                            width: 'fit-content'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9ca3af' }} />
                            OFFLINE
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                            {u.lastActive ? `Active ${new Date(u.lastActive).toLocaleDateString()}` : 'Never active'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.projectCount || 0}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.analysisCount || 0}</td>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>{u.reviewCount || 0}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <Link
                          to={`/admin/users/${u._id}`}
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                        >
                          View Progress <ArrowUpRight size={13} style={{ marginLeft: '4px' }} />
                        </Link>

                        <button
                          type="button"
                          disabled={updatingId === u._id}
                          onClick={() => handleToggleStatus(u)}
                          style={{
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            border: '1px solid var(--border-color)',
                            borderRadius: '4px',
                            backgroundColor: u.status === 'active' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                            color: u.status === 'active' ? '#b91c1c' : '#047857'
                          }}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Activity Feed */}
      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '24px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <Activity size={20} style={{ marginRight: '10px' }} />
          Recent Platform Activity Audit Log
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {stats?.recentActivities?.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recorded platform activities yet.</div>
          ) : (
            stats?.recentActivities?.map((act) => (
              <div
                key={act._id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {act.details || act.action}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Triggered by <strong>{act.userName || act.userEmail || 'User'}</strong> • Action: <code style={{ fontSize: '0.75rem' }}>{act.action}</code>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                  {new Date(act.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
