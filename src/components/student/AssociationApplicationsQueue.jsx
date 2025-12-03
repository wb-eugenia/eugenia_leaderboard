import { useState, useEffect } from 'react';
import { getAssociationApplications, acceptApplication, rejectApplication } from '../../services/associationsApi';
import { useStudentAuth } from '../../contexts/StudentAuthContext';

export default function AssociationApplicationsQueue({ associationId, onUpdate }) {
  const { student } = useStudentAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (associationId && student?.email) {
      fetchApplications();
    }
  }, [associationId, student?.email]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const data = await getAssociationApplications(associationId, student.email);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAccept = async (applicationId) => {
    if (!confirm('Êtes-vous sûr de vouloir accepter cette candidature ?')) {
      return;
    }

    try {
      setProcessing(applicationId);
      await acceptApplication(associationId, applicationId, student.email);
      await fetchApplications();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('Erreur lors de l\'acceptation : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (applicationId) => {
    if (!confirm('Êtes-vous sûr de vouloir rejeter cette candidature ?')) {
      return;
    }

    try {
      setProcessing(applicationId);
      await rejectApplication(associationId, applicationId, student.email);
      await fetchApplications();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Erreur lors du rejet : ' + (error.message || 'Erreur inconnue'));
    } finally {
      setProcessing(null);
    }
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const processedApplications = applications.filter(app => app.status !== 'pending');

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des candidatures...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Candidatures en attente */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Candidatures en attente ({pendingApplications.length})
        </h3>
        
        {pendingApplications.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-500">Aucune candidature en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApplications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-xl p-6 border-2 border-yellow-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {app.firstName} {app.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">{app.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Candidature du {new Date(app.appliedAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    En attente
                  </span>
                </div>

                {app.message && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 italic">"{app.message}"</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(app.id)}
                    disabled={processing === app.id}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing === app.id ? '⏳' : '✅'} Accepter
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    disabled={processing === app.id}
                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing === app.id ? '⏳' : '❌'} Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidatures traitées */}
      {processedApplications.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Candidatures traitées ({processedApplications.length})
          </h3>
          <div className="space-y-3">
            {processedApplications.map(app => (
              <div
                key={app.id}
                className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {app.firstName} {app.lastName}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      app.status === 'accepted' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {app.status === 'accepted' ? '✅ Acceptée' : '❌ Rejetée'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {app.email} • {app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString('fr-FR') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

