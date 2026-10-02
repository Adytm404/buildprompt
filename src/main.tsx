import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { ProjectProvider } from '@/context/ProjectContext';
import { AuthProvider } from '@/context/AuthContext';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
