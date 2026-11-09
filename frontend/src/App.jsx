import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Public Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Standard App Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectIntelligence from './pages/ProjectIntelligence';
import CodeAnalyzer from './pages/CodeAnalyzer';
import CodeReview from './pages/CodeReview';
import AnalysisHistory from './pages/AnalysisHistory';
import ReviewHistory from './pages/ReviewHistory';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

// Admin Portal Pages
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated Application Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="project-intelligence" element={<ProjectIntelligence />} />
            <Route path="analyzer" element={<CodeAnalyzer />} />
            <Route path="review" element={<CodeReview />} />
            <Route path="analysis-history" element={<AnalysisHistory />} />
            <Route path="review-history" element={<ReviewHistory />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />

            {/* Admin-Only Routes */}
            <Route
              path="admin"
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="admin/users/:id"
              element={
                <PrivateRoute adminOnly={true}>
                  <UserDetails />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
