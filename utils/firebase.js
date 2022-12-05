import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEVRDJjW0P_9kR0uXcxMNrhAl3AnWbE9I",
  authDomain: "todo-4d3e1.firebaseapp.com",
  projectId: "todo-4d3e1",
  storageBucket: "todo-4d3e1.appspot.com",
  messagingSenderId: "28452799477",
  appId: "1:28452799477:web:2abff5a813a8dde95456bc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
