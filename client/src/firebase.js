// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "logistica-9abff.firebaseapp.com",
  projectId: "logistica-9abff",
  storageBucket: "logistica-9abff.appspot.com",
  messagingSenderId: "378666842817",
  appId: "1:378666842817:web:ae25331216b0a1823f3240"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);