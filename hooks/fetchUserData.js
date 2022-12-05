import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";

export default function useFetchUserData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const { currentUser } = useAuth();
  //console.log("USER", currentUser);

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = doc(db, "Users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("HERE2");
          setUserData(docSnap.data());
          console.log("HERE3", userData);
          // setTodos('todos' in docSnap.data() ? docSnap.data().todos : {})
        } else {
          setUserData({});
        }
      } catch (err) {
        setError("Failed to load todos");
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return {
    loading,
    error,
    userData,
  };
}
