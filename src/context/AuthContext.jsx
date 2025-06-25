// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Carga inicial desde sessionStorage
  const [idToken, setIdTokenState] = useState(() => {
    return sessionStorage.getItem("idToken") || null;
  });
  const [userData, setUserDataState] = useState(() => {
    const stored = sessionStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const [loadingAuth, setLoadingAuth] = useState(false);

  // Cuando cambia idToken, guardarlo en sessionStorage
  useEffect(() => {
    if (idToken) {
      sessionStorage.setItem("idToken", idToken);
    } else {
      sessionStorage.removeItem("idToken");
      sessionStorage.removeItem("userData");
    }
  }, [idToken]);

  // Cuando cambia userData, guardarlo en sessionStorage
  useEffect(() => {
    if (userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  // Wrapper para limpiar token y datos
  const setIdToken = (token) => {
    setIdTokenState(token);
    if (!token) {
      setUserDataState(null);
    }
  };

  const setUserData = (data) => {
    setUserDataState(data);
  };

  return (
    <AuthContext.Provider
      value={{ idToken, setIdToken, userData, setUserData, loadingAuth, setLoadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
