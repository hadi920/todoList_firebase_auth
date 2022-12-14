import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Error, setEror] = useState("");
  const userInfo = useRef();

  function signup(name, email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log(currentUser);
        console.log(currentUser.uid);
      })
      .catch((error) => setEror(error.code));
    return;
  }

  function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => console.log(currentUser))
      .catch((err) => {
        setEror(err.code);
      });
    return;
  }

  function logout() {
    signOut(auth);
    return;
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    userInfo,
    Error,
    setEror,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
