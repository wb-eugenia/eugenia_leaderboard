import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // Vous pouvez aussi logger l'erreur à un service de reporting ici
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Une erreur est survenue
              </h1>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
              <p className="text-white mb-4">
                Désolé, une erreur inattendue s'est produite. Veuillez réessayer.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="text-yellow-300 cursor-pointer mb-2">
                    Détails de l'erreur (dev only)
                  </summary>
                  <pre className="bg-black/30 p-4 rounded text-xs text-red-200 overflow-auto max-h-64">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-white text-red-900 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all"
              >
                🔄 Réessayer
              </button>
              <Link
                to="/select-school"
                className="bg-white/10 text-white font-bold py-3 px-8 rounded-xl hover:bg-white/20 transition-all border border-white/20"
              >
                🏠 Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


