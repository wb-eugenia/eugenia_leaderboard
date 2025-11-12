import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function GoogleOAuthConnect({ userEmail }) {
  const [status, setStatus] = useState({ connected: false, loading: true });
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/google-oauth/status`);
      const data = await response.json();
      setStatus({ ...data, loading: false });
    } catch (error) {
      console.error('Error loading OAuth status:', error);
      setStatus({ connected: false, loading: false, clientId: 'not configured' });
    }
  };

  const handleConnect = async () => {
    if (!API_URL) {
      alert('❌ API_URL non configuré. Veuillez définir VITE_API_URL dans .env.local');
      setConnecting(false);
      return;
    }

    setConnecting(true);

    try {
      const redirectUri = `${window.location.origin}/google-oauth/callback`;
      
      // Get client ID from database (like n8n) - priority 1
      let clientId = null;
      
      try {
        // Try to get from DB first (endpoint we just created)
        const credentialsResponse = await fetch(`${API_URL}/oauth-credentials`);
        const credentialsData = await credentialsResponse.json();
        
        if (credentialsData.configured && credentialsData.clientId) {
          // Found in DB - use it!
          clientId = credentialsData.clientId;
          console.log('✅ Using Client ID from database');
        } else {
          // Not in DB, check status endpoint for fallback
          const statusResponse = await fetch(`${API_URL}/google-oauth/status`);
          const statusData = await statusResponse.json();
          
          if (statusData.clientId === 'not configured') {
            // Not configured at all - need to configure first
            alert('⚠️ Configuration requise\n\n' +
                  'Vous devez d\'abord configurer vos credentials OAuth dans la section "Google OAuth Credentials" ci-dessus.\n\n' +
                  '1. Entrez votre Client ID\n' +
                  '2. Entrez votre Client Secret\n' +
                  '3. Cliquez sur "Save Credentials"\n\n' +
                  'Ensuite, vous pourrez vous connecter avec "Sign in with Google".');
            setConnecting(false);
            return;
          }
          
          // Last fallback: env variable
          clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        }
      } catch (e) {
        console.error('Error fetching credentials:', e);
        // Last fallback: env variable
        clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      }
      
      // If still no client ID, error out
      if (!clientId || !clientId.trim()) {
        alert('❌ Client ID non trouvé\n\n' +
              'Veuillez configurer vos credentials OAuth dans la section "Google OAuth Credentials" ci-dessus,\n' +
              'ou configurez VITE_GOOGLE_CLIENT_ID dans vos variables d\'environnement.');
        setConnecting(false);
        return;
      }
      
      clientId = clientId.trim();

      // Build OAuth URL
      const scope = 'https://www.googleapis.com/auth/spreadsheets.readonly';
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scope)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Open popup (like n8n)
      const popup = window.open(
        oauthUrl,
        'Connexion Google',
        'width=500,height=600,left=100,top=100'
      );

      // Listen for callback
      const messageListener = async (event) => {
        if (event.data.type === 'GOOGLE_OAUTH_CODE' && event.data.code) {
          window.removeEventListener('message', messageListener);
          popup.close();

          try {
            // Send code to backend
            const response = await fetch(`${API_URL}/google-oauth/callback`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                code: event.data.code,
                userEmail: userEmail,
                redirectUri: redirectUri
              })
            });

            const result = await response.json();
            
            if (result.success) {
              alert('✅ Google account connected successfully!');
              await loadStatus();
            } else {
              alert(`❌ Failed to connect: ${result.error}`);
            }
          } catch (error) {
            console.error('Error connecting:', error);
            alert(`❌ Error: ${error.message}`);
          } finally {
            setConnecting(false);
          }
        }
      };

      window.addEventListener('message', messageListener);

      // Check if popup was closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          setConnecting(false);
        }
      }, 500);

    } catch (error) {
      console.error('Error connecting:', error);
      alert(`❌ Error: ${error.message}`);
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google account?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/google-oauth/disconnect`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        alert('✅ Google account disconnected');
        await loadStatus();
      } else {
        alert(`❌ Failed to disconnect: ${result.error}`);
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // Always show the component, even if not configured (to inform user)

  if (status.loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {status.connected ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <span>✅</span>
            <span>Connected to Google Sheets</span>
          </div>
          <p className="text-xs text-gray-500">
            Account: {status.userEmail}
          </p>
          <button
            onClick={handleDisconnect}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800 mb-2">
              💡 <strong>Astuce :</strong> Si vos Sheets sont <strong>publics</strong>, vous n'avez <strong>pas besoin</strong> de vous connecter ! 
              L'API publique fonctionne automatiquement.
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-blue-700 hover:text-blue-900 font-semibold">
                📖 Guide : Comment se connecter à Google Sheets API
              </summary>
              <div className="mt-2 text-blue-700 space-y-2 pl-4 border-l-2 border-blue-300">
                <p><strong>Étape 1 :</strong> Créez un projet sur <a href="https://console.cloud.google.com/" target="_blank" className="underline">Google Cloud Console</a></p>
                <p><strong>Étape 2 :</strong> Activez l'API Google Sheets</p>
                <p><strong>Étape 3 :</strong> Configurez l'écran de consentement OAuth</p>
                <p><strong>Étape 4 :</strong> Créez un ID client OAuth (Application Web)</p>
                <p><strong>Étape 5 :</strong> Ajoutez l'URI de redirection : <code className="bg-blue-100 px-1 rounded">{window.location.origin}/google-oauth/callback</code></p>
                <p><strong>Étape 6 :</strong> Copiez le Client ID et Secret dans Cloudflare Worker (Variables)</p>
                <p className="mt-2">
                  <button
                    onClick={() => {
                      const guideContent = `
📋 GUIDE COMPLET : Connexion Google Sheets API

ÉTAPE 1 : Créer un projet Google Cloud
  1. Allez sur https://console.cloud.google.com/
  2. Créez un nouveau projet
  3. Nommez-le (ex: "Eugenia Challenge")

ÉTAPE 2 : Activer l'API Google Sheets
  1. APIs et services > Bibliothèque
  2. Cherchez "Google Sheets API"
  3. Cliquez sur ACTIVER

ÉTAPE 3 : Configurer l'écran de consentement OAuth
  1. APIs et services > Écran de consentement OAuth
  2. Sélectionnez "Externe"
  3. Remplissez : Nom, Email de support
  4. Enregistrez et continuez

ÉTAPE 4 : Créer ID client OAuth
  1. APIs et services > Identifiants
  2. Créer des identifiants > ID client OAuth
  3. Type : Application Web
  4. URI de redirection : ${window.location.origin}/google-oauth/callback
  5. Créez et copiez Client ID + Secret

ÉTAPE 5 : Configurer dans Cloudflare
  1. Cloudflare Dashboard > Worker > Variables
  2. Ajoutez GOOGLE_CLIENT_ID (Secret)
  3. Ajoutez GOOGLE_CLIENT_SECRET (Secret)
  4. Sauvegardez

ÉTAPE 6 : Se connecter
  1. Cliquez sur "Sign in with Google"
  2. Autorisez l'accès
  3. ✅ C'est fait !
`;
                      alert(guideContent);
                    }}
                    className="text-blue-600 underline font-semibold hover:text-blue-800"
                  >
                    📚 Afficher le guide complet
                  </button>
                </p>
              </div>
            </details>
          </div>
          
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg hover:shadow-md transition-all font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              boxShadow: connecting ? 'none' : '0 1px 3px rgba(0,0,0,0.12)'
            }}
          >
            {connecting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

