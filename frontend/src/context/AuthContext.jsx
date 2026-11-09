import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout, ping } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('udih_user');
      return stored ? JSON.parse(stored) : null;
    } catch (_) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('udih_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and verify user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('udih_token');
      if (storedToken) {
        try {
          const res = await getMe();
          setUser(res.user);
          localStorage.setItem('udih_user', JSON.stringify(res.user));
        } catch (err) {
          console.warn('[Auth] Token verification failed:', err.message);
          localStorage.removeItem('udih_token');
          localStorage.removeItem('udih_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Real-time presence heartbeat: ping server every 45s while active in tab
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      ping().catch(() => {});
    }, 45000);
    return () => clearInterval(interval);
  }, [token]);

  const loginUser = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('udih_token', res.token);
    localStorage.setItem('udih_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const registerUser = async (name, email, password) => {
    const res = await apiRegister({ name, email, password });
    localStorage.setItem('udih_token', res.token);
    localStorage.setItem('udih_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    return res;
  };

  const logoutUser = async () => {
    try {
      if (token) await apiLogout();
    } catch (_) {}
    localStorage.removeItem('udih_token');
    localStorage.removeItem('udih_user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    loginUser,
    login: loginUser,
    registerUser,
    register: registerUser,
    logoutUser,
    logout: logoutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
