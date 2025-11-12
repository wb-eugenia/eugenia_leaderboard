import { useState } from 'react';
import GoogleOAuthConnect from '../components/admin/GoogleOAuthConnect';
import OAuthCredentialsConfig from '../components/admin/OAuthCredentialsConfig';

export default function GoogleSheetsSetup() {
  const [activeTab, setActiveTab] = useState('guide');

  const userEmail = localStorage.getItem('adminEmail') || 'admin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Configuration Google Sheets
        </h1>
        <p className="text-gray-600">
          Guide complet pour connecter Google Sheets API et configurer les automatisations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'guide'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📖 Guide étape par étape
          </button>
          <button
            onClick={() => setActiveTab('connect')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connect'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔐 Se connecter
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            ❓ FAQ
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-blue-800">
                💡 <strong>Astuce :</strong> Si vos Google Sheets sont <strong>publics</strong>, vous pouvez ignorer ce guide ! 
                L'API publique fonctionne automatiquement. Sinon, suivez ce guide pour utiliser OAuth.
              </p>
            </div>

            {/* Étape 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Créer un projet Google Cloud</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Allez sur <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 hover:underline font-semibold">Google Cloud Console</a></li>
                    <li>Cliquez sur le <strong>sélecteur de projet</strong> en haut</li>
                    <li>Cliquez sur <strong>"Nouveau projet"</strong></li>
                    <li>Nommez-le (ex: "Eugenia Challenge")</li>
                    <li>Cliquez sur <strong>"Créer"</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Activer l'API Google Sheets</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Dans le menu, allez dans <strong>"APIs et services" → "Bibliothèque"</strong></li>
                    <li>Cherchez <strong>"Google Sheets API"</strong></li>
                    <li>Cliquez dessus puis sur <strong>"ACTIVER"</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Configurer l'écran de consentement OAuth</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Dans le menu, <strong>"APIs et services" → "Écran de consentement OAuth"</strong></li>
                    <li>Sélectionnez <strong>"Externe"</strong> (recommandé)</li>
                    <li>Cliquez sur <strong>"CRÉER"</strong></li>
                    <li>Remplissez :
                      <ul className="list-disc list-inside ml-6 mt-1">
                        <li><strong>Nom de l'application</strong> : Eugenia Challenge</li>
                        <li><strong>Email de support</strong> : Votre email</li>
                        <li><strong>Email développeur</strong> : Votre email</li>
                      </ul>
                    </li>
                    <li>Cliquez sur <strong>"Enregistrer et continuer"</strong> pour chaque étape</li>
                    <li>Cliquez sur <strong>"Retour au tableau de bord"</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Étape 4 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Créer les identifiants OAuth</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      <li>Dans le menu, <strong>"APIs et services" → "Identifiants"</strong></li>
                      <li>Cliquez sur <strong>"+ CRÉER DES IDENTIFIANTS" → "ID client OAuth"</strong></li>
                    <li>Sélectionnez <strong>"Application Web"</strong></li>
                    <li>Nommez-le : <code className="bg-gray-100 px-2 py-0.5 rounded">Eugenia Challenge Web Client</code></li>
                    <li>Dans <strong>"URI de redirection autorisés"</strong>, ajoutez :
                      <div className="bg-gray-50 p-3 rounded mt-2 font-mono text-sm">
                        <div className="text-blue-600">{window.location.origin}/google-oauth/callback</div>
                        <div className="text-gray-500 text-xs mt-1">
                          (Pour production : https://votre-domaine.pages.dev/google-oauth/callback)
                        </div>
                      </div>
                    </li>
                    <li>Cliquez sur <strong>"CRÉER"</strong></li>
                    <li className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-2">
                      ⚠️ <strong>IMPORTANT :</strong> Copiez le <strong>Client ID</strong> et le <strong>Client Secret</strong> maintenant ! 
                      Vous ne pourrez plus voir le secret après.
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Configurer dans Cloudflare Worker</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Allez sur <a href="https://dash.cloudflare.com/" target="_blank" className="text-blue-600 hover:underline font-semibold">Cloudflare Dashboard</a></li>
                    <li>Sélectionnez votre Worker (<code className="bg-gray-100 px-2 py-0.5 rounded">eugenia-challenge-api</code>)</li>
                      <li>Allez dans <strong>"Settings" → "Variables and Secrets"</strong></li>
                    <li>Ajoutez ces <strong>Secrets</strong> (pas Variables !) :
                      <div className="bg-gray-50 p-3 rounded mt-2 font-mono text-sm space-y-1">
                        <div><strong>GOOGLE_CLIENT_ID</strong> = [Votre Client ID]</div>
                        <div><strong>GOOGLE_CLIENT_SECRET</strong> = [Votre Client Secret]</div>
                      </div>
                    </li>
                    <li>Cliquez sur <strong>"Save"</strong></li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Étape 6 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Se connecter depuis l'interface</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Allez dans l'onglet <strong>"Se connecter"</strong> ci-dessus</li>
                    <li>Cliquez sur <strong>"Sign in with Google"</strong></li>
                    <li>Une popup s'ouvre, connectez-vous avec votre compte Google</li>
                    <li>Autorisez l'accès à Google Sheets</li>
                    <li className="text-green-600 font-semibold">✅ C'est fait ! Votre compte est connecté</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Alternative */}
            <div className="bg-green-50 border border-green-200 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2 text-green-800">✅ Alternative : API Publique (Plus Simple)</h3>
              <p className="text-green-700 mb-2">
                Si vos Sheets sont <strong>publics</strong>, vous n'avez <strong>PAS besoin</strong> d'OAuth :
              </p>
              <ol className="list-decimal list-inside space-y-1 text-green-700 ml-4">
                <li>Rendez votre Sheet public : <strong>Partager → Toute personne disposant du lien peut voir</strong></li>
                <li>C'est tout ! L'API publique fonctionne automatiquement</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'connect' && (
          <div className="max-w-2xl space-y-6">
            <OAuthCredentialsConfig />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">🔐 Connexion Google Sheets</h2>
              <p className="text-gray-600 mb-6">
                Une fois les credentials configurés ci-dessus, connectez votre compte Google pour utiliser l'API Google Sheets officielle (plus fiable que l'API publique).
              </p>
              
              <GoogleOAuthConnect userEmail={userEmail} />
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">❓ Pourquoi utiliser OAuth au lieu de l'API publique ?</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>✅ Accès aux <strong>Sheets privés</strong> (pas besoin de les rendre publics)</li>
                <li>✅ <strong>Plus fiable</strong> : API officielle Google Sheets v4</li>
                <li>✅ <strong>Meilleure sécurité</strong> : Contrôle d'accès granulaire</li>
                <li>✅ <strong>Rate limits élevés</strong> : Plus stable que l'API publique</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">❓ Erreur "redirect_uri_mismatch"</h3>
              <p className="text-gray-700">
                Vérifiez que l'URI de redirection dans Google Cloud correspond <strong>exactement</strong> à celui utilisé.
                Format : <code className="bg-gray-100 px-2 py-0.5 rounded">{window.location.origin}/google-oauth/callback</code> (sans <code>/</code> à la fin).
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">❓ Erreur "access_denied"</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Vérifiez que l'API Google Sheets est activée dans Google Cloud</li>
                <li>Vérifiez que l'écran de consentement OAuth est configuré</li>
                <li>Vérifiez que vous avez autorisé l'accès dans la popup</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">❓ Le bouton ne fonctionne pas</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Vérifiez que <code>GOOGLE_CLIENT_ID</code> et <code>GOOGLE_CLIENT_SECRET</code> sont bien configurés dans Cloudflare</li>
                <li>Vérifiez que <code>VITE_API_URL</code> est correct dans <code>.env.local</code></li>
                <li>Vérifiez la console du navigateur (F12) pour voir les erreurs</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold mb-2">❓ Puis-je utiliser l'API publique sans OAuth ?</h3>
              <p className="text-gray-700">
                Oui ! Si vos Google Sheets sont <strong>publics</strong>, l'API publique fonctionne automatiquement.
                Rendez simplement vos Sheets publics : <strong>Partager → Toute personne disposant du lien peut voir</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

