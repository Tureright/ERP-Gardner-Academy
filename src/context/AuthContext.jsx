// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [idToken, setIdToken] = useState(null);

  return (
    <AuthContext.Provider value={{ idToken, setIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
