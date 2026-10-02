import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { InterviewPage } from '@/pages/InterviewPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PricingPage } from '@/pages/PricingPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { AllProjectsPage } from '@/pages/AllProjectsPage';
import { PromptPage } from '@/pages/PromptPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { SharedProjectPage } from '@/pages/SharedProjectPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function ResultRedirect() {
  const { projectId } = useParams();
  return <Navigate to={projectId ? `/dashboard/project/${projectId}/prompt` : '/dashboard/projects'} replace />;
}

function LegacyProjectRedirect({ target }: { target: 'interview' | 'review' | 'prompt' }) {
  const { projectId } = useParams();
  return <Navigate to={projectId ? `/dashboard/project/${projectId}/${target}` : '/dashboard/projects'} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public & Authentication */}
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/share/:projectId" element={<SharedProjectPage />} />

        {/* Dashboard Workspace Routes (Semua halaman ber-sidebar berada di bawah /dashboard) */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/projects" replace />} />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/projects/all" element={<AllProjectsPage />} />
        <Route
          path="/dashboard/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/project/:projectId/interview" element={<InterviewPage />} />
        <Route path="/dashboard/project/:projectId/review" element={<ReviewPage />} />
        <Route path="/dashboard/project/:projectId/prompt" element={<PromptPage />} />
        <Route path="/dashboard/project/:projectId/result" element={<ResultRedirect />} />

        {/* Backward Compatibility Redirects */}
        <Route path="/pricing" element={<Navigate to="/dashboard/pricing" replace />} />
        <Route path="/projects" element={<Navigate to="/dashboard/projects" replace />} />
        <Route path="/projects/all" element={<Navigate to="/dashboard/projects/all" replace />} />
        <Route path="/project/:projectId/interview" element={<LegacyProjectRedirect target="interview" />} />
        <Route path="/project/:projectId/review" element={<LegacyProjectRedirect target="review" />} />
        <Route path="/project/:projectId/prompt" element={<LegacyProjectRedirect target="prompt" />} />
        <Route path="/project/:projectId/result" element={<LegacyProjectRedirect target="prompt" />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
