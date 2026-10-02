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
  return <Navigate to={projectId ? `/project/${projectId}/prompt` : '/projects'} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/all" element={<AllProjectsPage />} />
        <Route path="/project/:projectId/interview" element={<InterviewPage />} />
        <Route path="/project/:projectId/review" element={<ReviewPage />} />
        <Route path="/project/:projectId/prompt" element={<PromptPage />} />
        <Route path="/project/:projectId/result" element={<ResultRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
