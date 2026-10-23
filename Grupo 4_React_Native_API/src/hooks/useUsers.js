import { useCallback, useEffect, useState } from 'react';
import { fetchUsers } from '../services/usersService';
import { getUsersLocally, saveUsersLocally } from '../storage/usersStorage';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [source, setSource] = useState('none');

  const loadUsers = useCallback(async ({ showFullLoading = true } = {}) => {
    if (showFullLoading) setLoading(true);
    else setRefreshing(true);
    setError('');

    try {
      const remoteUsers = await fetchUsers();
      setUsers(remoteUsers);
      setSource('api');
      try {
        await saveUsersLocally(remoteUsers);
      } catch (storageError) {
        // A API continua útil mesmo se o cache local falhar.
        console.warn('Não foi possível salvar o cache local:', storageError);
      }
    } catch (requestError) {
      setError(requestError.message || 'Ocorreu um erro inesperado.');
      try {
        const cachedUsers = await getUsersLocally();
        if (cachedUsers.length > 0) {
          setUsers(cachedUsers);
          setSource('cache');
          setError('Sem conexão com a API. Exibindo os últimos dados salvos no dispositivo.');
        }
      } catch (storageError) {
        setError('Falha na API e na leitura do armazenamento local.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, loading, refreshing, error, source, reload: loadUsers };
}
