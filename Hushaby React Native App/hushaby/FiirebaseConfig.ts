import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyBvTOguOnX3aMNNn9vUX25qe4l8fjbghbc",
    authDomain: "hushaby-9524d.firebaseapp.com",
    projectId: "hushaby-9524d",
    storageBucket: "hushaby-9524d.firebasestorage.app",
    messagingSenderId: "407976666638",
    appId: "1:407976666638:web:d46991b76f4eac6df5be5f",
    measurementId: "G-1ZLLCXTW8T"
  };
  
// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)