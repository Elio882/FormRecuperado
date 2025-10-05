import { useEffect } from 'react';
import { useApi } from './useApi';
import { User, UserService } from '@/services/userService';

export function useUser(userId?: string) {
  const { data: user, loading, error, get } = useApi<User>();

  useEffect(() => {
    if (userId) {
      get(`/users/${userId}`);
    }
  }, [userId, get]);

  return {
    user,
    loading,
    error,
    refetch: () => userId ? get(`/users/${userId}`) : null,
  };
}

export function useCurrentUser() {
  const { data: user, loading, error, get } = useApi<User>();

  useEffect(() => {
    get('/auth/profile');
  }, [get]);

  return {
    user,
    loading,
    error,
    refetch: () => get('/auth/profile'),
  };
}

export function useUsers() {
  const { data: users, loading, error, get } = useApi<User[]>();

  useEffect(() => {
    get('/users');
  }, [get]);

  return {
    users,
    loading,
    error,
    refetch: () => get('/users'),
  };
}