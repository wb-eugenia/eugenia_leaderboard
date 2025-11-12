import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function OAuthCredentialsConfig() {
  const [credentials, setCredentials] = useState({ clientId: '', clientSecret: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ loading: true, message: '' });
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const response = await fetch(`${API_URL}/oauth-credentials`);
      const data = await response.json();
      
      if (data.configured && data.clientId) {
        setCredentials({ 
          clientId: data.clientId, 
          clientSecret: '••••••••' // Masquer le secret existant
        });
      }
      
      setStatus({ loading: false, message: data.configured ? '✅ Configured' : 'Not configured' });
    } catch (error) {
      console.error('Error loading credentials:', error);
      setStatus({ loading: false, message: 'Error loading credentials' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!credentials.clientId || !credentials.clientSecret) {
      alert('⚠️ Please fill in both Client ID and Client Secret');
      return;
    }

    // Si le secret est masqué, ne pas l'envoyer
    if (credentials.clientSecret === '••••••••') {
      alert('ℹ️ Client Secret is already configured. Leave it blank to keep the existing value, or enter a new one to change it.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/oauth-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          clientId: credentials.clientId.trim(),
          clientSecret: credentials.clientSecret.trim()
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ loading: false, message: '✅ Saved successfully!' });
        setCredentials(prev => ({ ...prev, clientSecret: '••••••••' }));
        setShowSecret(false);
      } else {
        setStatus({ loading: false, message: `❌ Error: ${result.error}` });
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      setStatus({ loading: false, message: `❌ Error: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4">🔑 Google OAuth Credentials</h3>
      <p className="text-gray-600 mb-4 text-sm">
        Configure your Google OAuth Client ID and Secret here (like n8n). 
        No need to modify Cloudflare environment variables!
      </p>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client ID
          </label>
          <input
            type="text"
            value={credentials.clientId}
            onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
            placeholder="xxxxx.apps.googleusercontent.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Get this from <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-blue-600 hover:underline">Google Cloud Console</a>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Secret
          </label>
          <div className="relative">
            <input
              type={showSecret ? "text" : "password"}
              value={credentials.clientSecret}
              onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
              placeholder={credentials.clientSecret === '••••••••' ? 'Already configured (leave blank to keep)' : 'Enter your Client Secret'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={credentials.clientSecret !== '••••••••'}
            />
            {credentials.clientSecret === '••••••••' && (
              <button
                type="button"
                onClick={() => {
                  setShowSecret(true);
                  setCredentials({ ...credentials, clientSecret: '' });
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800"
              >
                Change
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {credentials.clientSecret === '••••••••' 
              ? 'Secret is already configured. Click "Change" to update it.'
              : '⚠️ You can only see this once when creating the OAuth client'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {status.message}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Credentials'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Note:</strong> These credentials are stored securely in your D1 database. 
          Once saved, you can connect your Google account using the "Sign in with Google" button.
        </p>
      </div>
    </div>
  );
}

