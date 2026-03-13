import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { setApiAccessToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrapAuth() {
      try {
        const refreshed = await authService.refresh();
        if (mounted) {
          setUser(refreshed.user || null);
        }
      } catch (_err) {
        if (mounted) {
          setUser(null);
          setApiAccessToken(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const { user: nextUser } = await authService.login({ email, password });
    setUser(nextUser);
    return nextUser;
  };

  const register = async (email, password) => {
    await authService.register({ email, password });
    const { user: nextUser } = await authService.login({ email, password });
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
