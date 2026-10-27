import React, { createContext, useContext, useMemo, useState } from "react";
import { api, setToken } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [busy, setBusy] = useState(false);

  const value = useMemo(
    () => ({
      user,
      busy,
      async login(email, password) {
        setBusy(true);
        try {
          const data = await api.login(email, password);
          setToken(data.token);
          setUser(data.user);
          return data.user;
        } finally {
          setBusy(false);
        }
      },
      async logout() {
        try {
          await api.logout();
        } catch {
          /* ignore */
        }
        setToken(null);
        setUser(null);
      },
    }),
    [user, busy]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
