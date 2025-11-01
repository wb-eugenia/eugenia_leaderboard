import { useState, useEffect } from 'react';
import { getActionTypes } from '../../services/configService';
import { processValidation } from '../../services/validationService';

export default function ActionDetailModal({ action, onClose, onActionComplete }) {
  const [points, setPoints] = useState(action.points || 50);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [actionTypes, setActionTypes] = useState([]);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    loadActionTypes();
  }, []);

  useEffect(() => {
    const type = actionTypes.find(t => t.id === action.type);
    setActionType(type);
  }, [actionTypes, action.type]);

  const loadActionTypes = async () => {
    const types = await getActionTypes();
    setActionTypes(types);
  };

  const emailParts = action.email.split('@')[0].split('.');
  const firstName = emailParts[0] || 'User';
  const lastName = emailParts[1] || '';
  const fullName = `${firstName} ${lastName}`;

  const handleValidate = async () => {
    setProcessing(true);
    setError('');

    try {
      const result = await processValidation(
        action.id,
        'validated',
        points,
        comment,
        'Admin'
      );

      if (result.success) {
        onActionComplete();
      } else {
        setError(result.error || 'Erreur lors de la validation');
      }
    } catch (err) {
      setError('Une erreur est survenue');
      console.error('Validation error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setError('Veuillez indiquer une raison pour le refus');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const result = await processValidation(
        action.id,
        'rejected',
        0,
        comment,
        'Admin'
      );

      if (result.success) {
        onActionComplete();
      } else {
        setError(result.error || 'Erreur lors du refus');
      }
    } catch (err) {
      setError('Une erreur est survenue');
      console.error('Rejection error:', err);
    } finally {
      setProcessing(false);
    }
  };

  const renderField = (fieldName, value) => {
    if (!value || value === '') return null;

    // Si c'est une URL, rendre cliquable
    if (typeof value === 'string' && value.startsWith('http')) {
      return (
        <div className="mb-4">
          <div className="font-semibold text-gray-700 mb-2">
            {fieldName}:
          </div>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {value}
          </a>
        </div>
      );
    }

    return (
      <div className="mb-4">
        <div className="font-semibold text-gray-700 mb-2">
          {fieldName}:
        </div>
        <div className="text-gray-900">
          {value}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            Détails de l'action
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Informations étudiant */}
        <div className="border-b pb-4 mb-4">
          <div className="text-xl font-bold text-gray-900 mb-2">
            {fullName}
          </div>
          <div className="text-gray-600">{action.email}</div>
        </div>

        {/* Type d'action */}
        <div className="border-b pb-4 mb-4">
          <div className="text-lg font-semibold text-gray-900 mb-2">
            {actionType ? `${actionType.emoji} ${actionType.label}` : action.type}
          </div>
        </div>

        {/* Données soumises */}
        {action.data && Object.keys(action.data).length > 0 && (
          <div className="border-b pb-4 mb-4">
            {Object.entries(action.data).map(([key, value]) => (
              <div key={key}>
                {renderField(key.charAt(0).toUpperCase() + key.slice(1), value)}
              </div>
            ))}
          </div>
        )}

        {/* Date de soumission */}
        <div className="border-b pb-4 mb-4">
          <div className="font-semibold text-gray-700 mb-2">
            Soumis le:
          </div>
          <div className="text-gray-900">
            {new Date(action.date).toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Commentaire admin */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            💬 Votre commentaire (optionnel):
          </label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajoutez un commentaire pour l'étudiant..."
          />
        </div>

        {/* Points */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">
            🎯 Points à attribuer:
          </label>
          <input
            type="number"
            className="form-control w-32"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
            min="0"
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            disabled={processing}
            className="btn btn-danger flex-1"
          >
            {processing ? 'Traitement...' : '❌ Refuser'}
          </button>
          <button
            onClick={handleValidate}
            disabled={processing}
            className="btn btn-success flex-1"
          >
            {processing ? 'Traitement...' : '✅ Valider et attribuer points'}
          </button>
        </div>
      </div>
    </div>
  );
}
