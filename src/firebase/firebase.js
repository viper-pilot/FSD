// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyARXpR4K42EgXmK229ajqm3x7fniguCXw8",
    authDomain: "ai-resume-classifier.firebaseapp.com",
    projectId: "ai-resume-classifier",
    storageBucket: "ai-resume-classifier.firebasestorage.app",
    messagingSenderId: "200609564028",
    appId: "1:200609564028:web:95c933e46ad15c0fd8d0f9",
    measurementId: "G-54X2FZV9M1"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
