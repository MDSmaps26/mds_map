// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const login = (password) => {
    if (password === import.meta.env.VITE_LOGIN_PW) {
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => setAuthenticated(false);

  return (
    <AuthContext.Provider value={{ authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);