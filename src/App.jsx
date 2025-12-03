import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getAllRoutes } from './routes';
import ErrorBoundary from './components/ErrorBoundary';

// Loading component pour les routes lazy
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <div className="text-white">Chargement...</div>
      </div>
    </div>
  );
}

function App() {
  const routes = getAllRoutes();

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {routes.map((route, index) => {
              // Gérer les routes avec children (admin routes)
              if (route.children) {
                return (
                  <Route key={index} path={route.path} element={route.element}>
                    {route.children.map((child, childIndex) => (
                      <Route
                        key={childIndex}
                        index={child.index}
                        path={child.path}
                        element={child.element}
                      />
                    ))}
                  </Route>
                );
              }
              
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              );
            })}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
