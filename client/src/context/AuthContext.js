"use client";
import { createContext, useState, useContext, useEffect } from "react";

// 1. Create the context — think of it as a global variable container
const AuthContext = createContext();

// 2. The Provider — wraps the whole app and makes auth data available everywhere
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // The logged-in user's data
  const [token, setToken] = useState(null); // Their JWT token

  // When the app first loads, check if the user was already logged in
  // (their token and info saved in localStorage from a previous session)
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []); // Empty array = only run once, when the app first loads

  // Called after a successful login or register
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    // Save to localStorage so they stay logged in after refreshing the page
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Called when the user clicks logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    // 3. Pass the data and functions to every child component
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Custom hook — makes it easy to use auth anywhere with just:
// const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
