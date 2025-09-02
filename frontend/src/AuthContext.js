import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  // ✅ Updated signup function to include username
  const signup = async (username, email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),  // Send username, email, and password
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Signup failed');
    
    // Optionally auto-login after signup
    login(data.token);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Export this hook for use in Login/Register
export const useAuth = () => useContext(AuthContext);
