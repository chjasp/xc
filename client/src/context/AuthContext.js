import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

const AuthContext = React.createContext();

/*
Used demo-accounts to demonstrate
data retrieval based on a specific sensor owner.

Two demo-accounts used. Authentification via mail & pw:
mail account 1: dqr356@development.com
pw account 1: dqradar468

mail account 2: dqr357@development.com
pw account 2: dqradar468
*/

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  const logout = () => {
    return auth.signOut();
  };

  // Runs only once
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // unsubscribe from listener
    return unsubscribe
  }, []);

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
