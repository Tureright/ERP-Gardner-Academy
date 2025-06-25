// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Aquí va tu configuración Firebase (la sacas de la consola Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCccMiKVIl9d3_86pHClqTdqCW3IxizH_8",
  authDomain: "erp-ga-school.firebaseapp.com",
  databaseURL: "https://erp-ga-school-default-rtdb.firebaseio.com",
  projectId: "erp-ga-school",
  storageBucket: "erp-ga-school.firebasestorage.app",
  messagingSenderId: "753857222184",
  appId: "1:753857222184:web:dee39518a94c2098cc871d",
  measurementId: "G-W85N3M3WFW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export { app, db, auth };
