import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('userData');
        const token = localStorage.getItem('userToken');
        
        if (userData && token) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erreur de chargement des données utilisateur:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userToken', token);
    setUser(userData);
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('agencyData');
    localStorage.removeItem('refreshToken');
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isUser: user?.role === 'user',
    isAgency: user?.role === 'agency',
    isOrganizer: user?.role === 'organizer',
    isSuperAdmin: user?.role === 'superadmin',
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};