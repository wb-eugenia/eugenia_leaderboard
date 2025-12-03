import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { StudentAuthProvider } from './contexts/StudentAuthContext'
import { useServiceWorker } from './hooks/useServiceWorker'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load App pour améliorer le temps de chargement initial
const App = lazy(() => import('./App'))

// Initialize PWA (Theme désactivé)
function AppInitializer({ children }) {
  useServiceWorker();
  return children;
}

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">🎓</div>
        <div className="text-white text-xl">Chargement...</div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppInitializer>
        <StudentAuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </StudentAuthProvider>
      </AppInitializer>
    </ErrorBoundary>
  </React.StrictMode>
)

