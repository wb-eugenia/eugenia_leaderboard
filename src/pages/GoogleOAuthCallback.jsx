import { useEffect } from 'react';

export default function GoogleOAuthCallback() {
  useEffect(() => {
    // Extract code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code) {
      // Send code to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_CODE',
        code: code
      }, window.location.origin);
      window.close();
    } else {
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error: 'No code received'
      }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Processing Google authentication...</p>
      </div>
    </div>
  );
}

