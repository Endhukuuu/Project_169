import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectIntelligence from './pages/ProjectIntelligence';
import CodeAnalyzer from './pages/CodeAnalyzer';
import CodeReview from './pages/CodeReview';
import AnalysisHistory from './pages/AnalysisHistory';
import ReviewHistory from './pages/ReviewHistory';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="project-intelligence" element={<ProjectIntelligence />} />
          <Route path="analyzer" element={<CodeAnalyzer />} />
          <Route path="review" element={<CodeReview />} />
          <Route path="analysis-history" element={<AnalysisHistory />} />
          <Route path="review-history" element={<ReviewHistory />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
