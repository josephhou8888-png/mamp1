import React, { lazy, Suspense } from 'react';
import MampaniLogo from './components/ui/MampaniLogo';
import { ToastProvider, ToastContainer } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ContentProvider } from './contexts/ContentContext';

const AppContent = lazy(() => import('./AppContent'));

const App: React.FC = () => (
    <ToastProvider>
      <ContentProvider>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-pulse">
                    <MampaniLogo logoUrl="https://www.zoji.me/images/logo1.png" />
                </div>
            </div>
          }>
            <AppContent />
          </Suspense>
        </AuthProvider>
      </ContentProvider>
      <ToastContainer />
    </ToastProvider>
);

export default App;