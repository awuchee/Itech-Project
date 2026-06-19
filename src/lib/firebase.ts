import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithCredential,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  updateDoc,
  serverTimestamp,
  Firestore
} from "firebase/firestore";

// Read environment variables (supports standard, NEXT_PUBLIC, or example defaults)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "AIzaSyBO6-6CTYpXP04imjuqUWM1adJ_KKjniCM",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "global-opportunities-hub-9b67b"}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "global-opportunities-hub-9b67b",
  storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "global-opportunities-hub-9b67b"}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || "1056432608949",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPLICATION_ID || process.env.FIREBASE_APPLICATION_ID || "1:1056432608949:web:3d407f7cb78fa9b51690fc"
};

// Initialize App
let app;
let auth: any;
let db: any;
let isMocked = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  console.log("Firebase initialized successfully with configuration:", configMask(firebaseConfig.projectId));
} catch (error) {
  console.error("Firebase initialization failed. Swapping to Mock-Safe client fallback storage scheme:", error);
  isMocked = true;
}

function configMask(id: string) {
  return id ? `${id.substring(0, 4)}***` : "None";
}

export { 
  app, 
  auth, 
  db, 
  isMocked, 
  firebaseConfig,
  // Direct Auth functions
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithCredential,
  // Direct Firestore functions
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
  serverTimestamp
};

export type { FirebaseUser };
