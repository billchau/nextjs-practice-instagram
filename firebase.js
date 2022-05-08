// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOAzJFrZFuXZ7BzLdh8HmAxaTzXpF3FHE",
  authDomain: "nextjs-instagram-practice.firebaseapp.com",
  projectId: "nextjs-instagram-practice",
  storageBucket: "nextjs-instagram-practice.appspot.com",
  messagingSenderId: "49617452056",
  appId: "1:49617452056:web:ddc8cea53235857717576d",
  measurementId: "G-X6XY53CFQ5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };