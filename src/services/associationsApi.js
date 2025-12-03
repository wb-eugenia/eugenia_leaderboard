/**
 * Service API pour les associations
 */
import { api } from './api';

/**
 * Récupère toutes les associations
 */
export async function getAllAssociations() {
  return api.get('/associations');
}

/**
 * Récupère les top N associations (par nombre de membres)
 */
export async function getTopAssociations(limit = 3) {
  const associations = await getAllAssociations();
  // Les associations sont déjà triées par nombre de membres décroissant
  return associations.slice(0, limit);
}

/**
 * Récupère les détails d'une association
 */
export async function getAssociationById(id) {
  return api.get(`/associations/${id}`);
}

/**
 * Crée une nouvelle association
 */
export async function createAssociation(data) {
  return api.post('/associations', data);
}

/**
 * Met à jour une association (admin seulement)
 */
export async function updateAssociation(id, data) {
  return api.put(`/associations/${id}`, data);
}

/**
 * Supprime une association (admin seulement)
 */
export async function deleteAssociation(id, email) {
  return api.delete(`/associations/${id}?email=${encodeURIComponent(email)}`);
}

/**
 * Récupère les membres d'une association
 */
export async function getAssociationMembers(associationId) {
  return api.get(`/associations/${associationId}/members`);
}

/**
 * Ajoute un membre à une association (admin seulement)
 */
export async function addAssociationMember(associationId, data) {
  return api.post(`/associations/${associationId}/members`, data);
}

/**
 * Retire un membre d'une association
 */
export async function removeAssociationMember(associationId, email, requesterEmail) {
  return api.delete(`/associations/${associationId}/members/${encodeURIComponent(email)}?requesterEmail=${encodeURIComponent(requesterEmail)}`);
}

/**
 * Change le rôle d'un membre (admin seulement)
 */
export async function updateMemberRole(associationId, email, role, adminEmail) {
  return api.put(`/associations/${associationId}/members/${encodeURIComponent(email)}/role`, {
    role,
    adminEmail
  });
}

/**
 * Postule à une association
 */
export async function applyToAssociation(associationId, email, message = '') {
  return api.post(`/associations/${associationId}/apply`, {
    email,
    message
  });
}

/**
 * Récupère les candidatures d'une association (admin seulement)
 */
export async function getAssociationApplications(associationId, email) {
  return api.get(`/associations/${associationId}/applications?email=${encodeURIComponent(email)}`);
}

/**
 * Accepte une candidature (admin seulement)
 */
export async function acceptApplication(associationId, applicationId, adminEmail) {
  return api.post(`/associations/${associationId}/applications/${applicationId}/accept`, {
    adminEmail
  });
}

/**
 * Rejette une candidature (admin seulement)
 */
export async function rejectApplication(associationId, applicationId, adminEmail) {
  return api.post(`/associations/${associationId}/applications/${applicationId}/reject`, {
    adminEmail
  });
}

/**
 * Récupère les événements d'une association
 */
export async function getAssociationEvents(associationId) {
  return api.get(`/associations/${associationId}/events`);
}

/**
 * Crée un événement (admin seulement)
 */
export async function createAssociationEvent(associationId, data) {
  return api.post(`/associations/${associationId}/events`, data);
}

/**
 * Met à jour un événement (admin seulement)
 */
export async function updateAssociationEvent(associationId, eventId, data) {
  return api.put(`/associations/${associationId}/events/${eventId}`, data);
}

/**
 * Supprime un événement (admin seulement)
 */
export async function deleteAssociationEvent(associationId, eventId, email) {
  return api.delete(`/associations/${associationId}/events/${eventId}?email=${encodeURIComponent(email)}`);
}

/**
 * Récupère tous les événements (pour le calendrier)
 */
export async function getAllEvents(month, year) {
  const params = new URLSearchParams();
  if (month) params.append('month', month);
  if (year) params.append('year', year);
  const query = params.toString();
  return api.get(`/events${query ? `?${query}` : ''}`);
}

