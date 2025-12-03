import { useState } from 'react';

export default function ProfileMediaUpload({ onMediaAdded, existingMedia = [] }) {
  const [mediaType, setMediaType] = useState('image'); // image, video, document
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mediaUrl || !mediaTitle) return;

    setUploading(true);
    try {
      const newMedia = {
        id: Date.now().toString(),
        type: mediaType,
        url: mediaUrl,
        title: mediaTitle,
        description: mediaDescription,
        addedAt: new Date().toISOString()
      };

      onMediaAdded(newMedia);
      
      // Reset form
      setMediaUrl('');
      setMediaTitle('');
      setMediaDescription('');
    } catch (error) {
      console.error('Error adding media:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (mediaId) => {
    if (window.confirm('Supprimer ce média ?')) {
      // Callback pour supprimer
      if (onMediaAdded) {
        onMediaAdded({ action: 'delete', id: mediaId });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulaire d'ajout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          ➕ Ajouter un média
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de média */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Type de média
            </label>
            <div className="flex gap-2">
              {['image', 'video', 'document'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMediaType(type)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    mediaType === type
                      ? 'bg-eugenia-burgundy text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {type === 'image' ? '🖼️ Image' : type === 'video' ? '🎥 Vidéo' : '📄 Document'}
                </button>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              URL {mediaType === 'image' ? '(image)' : mediaType === 'video' ? '(YouTube, Vimeo, etc.)' : '(PDF, Google Drive, etc.)'}
            </label>
            <input
              type="url"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Titre
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={mediaTitle}
              onChange={(e) => setMediaTitle(e.target.value)}
              placeholder="Titre du média"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description (optionnel)
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={mediaDescription}
              onChange={(e) => setMediaDescription(e.target.value)}
              placeholder="Description du média"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !mediaUrl || !mediaTitle}
            className="w-full bg-eugenia-burgundy text-white py-2 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '⏳ Ajout...' : '✅ Ajouter le média'}
          </button>
        </form>
      </div>

      {/* Liste des médias existants */}
      {existingMedia && existingMedia.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            📚 Médias existants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {existingMedia.map((media) => (
              <div
                key={media.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {media.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {media.type === 'image' ? '🖼️ Image' : media.type === 'video' ? '🎥 Vidéo' : '📄 Document'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(media.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                {media.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {media.description}
                  </p>
                )}
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-eugenia-burgundy hover:underline"
                >
                  Voir le média →
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}







