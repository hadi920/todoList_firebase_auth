import React, { useState, useEffect, useRef } from "react";
import { doc, getDocs, collection, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";

export default function useFetchTodos() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const docRef = collection(db, "tasks");
        const q = query(docRef, where("userId", "==", `${currentUser.uid}`));
        const querySnapshot = await getDocs(q);
        // setTodos(querySnapshot);
        const temp = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, " => ", doc.data());
          temp.push(doc.data());
        });
        setTodos(temp);
        // const docSnap = await getDoc(q);
        // if (docSnap.exists()) {
        //   console.log("HERE2");
        //   setTodos(docSnap.data());
        // } else {
        //   setTodos({});
        // }
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
    todos,
    setTodos,
  };
}
