import React, { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // O estado global de autenticação fica armazenado aqui.
  const [user, setUser] = useState(null);

  const signIn = useCallback((name, email) => {
    setUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
  }, []);

  // useMemo evita criar um novo objeto de contexto em cada renderização
  // quando user, signIn e signOut não mudaram.
  const value = useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}