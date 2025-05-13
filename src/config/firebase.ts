// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // To import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWVzSP4Yf59ARIjuVXPN8kj041aKGH7UQ",
  authDomain: "escaperoom-101.firebaseapp.com",
  projectId: "escaperoom-101",
  storageBucket: "escaperoom-101.firebasestorage.app",
  messagingSenderId: "929666826823",
  appId: "1:929666826823:web:e553a575cb3f817215e762",
  measurementId: "G-V61D0R4PYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
