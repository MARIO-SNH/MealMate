import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyBXQB-F9H24MZ25tvtbJWjx0FGuF5eTat8",
  authDomain: "mealmate-5b5dd.firebaseapp.com",
  projectId: "mealmate-5b5dd",
  storageBucket: "mealmate-5b5dd.firebasestorage.app",
  messagingSenderId: "101128190344",
  appId: "1:101128190344:web:aa9d64ccbaa475ad35a23d",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);