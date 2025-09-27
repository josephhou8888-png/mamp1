import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const MampaniLogo = () => (
    <div className="flex items-center space-x-2">
        <img src="https://www.zoji.me/images/logo1.png" alt="Mampani Logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-[#0D1B3A]">Mampani</span>
    </div>
);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={
        <div className="flex items-center justify-center h-screen">
            <div className="animate-pulse">
                <MampaniLogo />
            </div>
        </div>
    }>
      <App />
    </React.Suspense>
  </React.StrictMode>
);