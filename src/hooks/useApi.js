import { useState, useEffect, useCallback } from 'react';
import { api, ApiError } from '../services/api';

/**
 * Hook personnalisé pour les appels API avec gestion d'état
 * 
 * @param {Function} apiCall - Fonction qui retourne une promesse d'appel API
 * @param {Array} dependencies - Dépendances pour re-déclencher l'appel
 * @param {Object} options - Options (skip, onSuccess, onError)
 * 
 * @returns {Object} { data, loading, error, refetch }
 */
export function useApi(apiCall, dependencies = [], options = {}) {
  const { skip = false, onSuccess, onError } = options;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (skip) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall();
      setData(result);
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const apiError = err instanceof ApiError 
        ? err 
        : new ApiError(err.message || 'Unknown error', 0, err);
      
      setError(apiError);
      if (onError) {
        onError(apiError);
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, skip, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

/**
 * Hook pour les mutations (POST, PUT, DELETE)
 * 
 * @param {Function} mutationFn - Fonction de mutation
 * @param {Object} options - Options (onSuccess, onError)
 * 
 * @returns {Object} { mutate, loading, error, reset }
 */
export function useMutation(mutationFn, options = {}) {
  const { onSuccess, onError } = options;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (variables) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mutationFn(variables);
      if (onSuccess) {
        onSuccess(result, variables);
      }
      return result;
    } catch (err) {
      const apiError = err instanceof ApiError 
        ? err 
        : new ApiError(err.message || 'Unknown error', 0, err);
      
      setError(apiError);
      if (onError) {
        onError(apiError, variables);
      }
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, onSuccess, onError]);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { mutate, loading, error, reset };
}


