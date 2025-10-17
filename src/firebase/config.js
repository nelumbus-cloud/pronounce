import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAZ6qoPZdk5G3BHcf7Ww_nuEroOQNZ-WZc",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pronounce-488e2.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "pronounce-488e2",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pronounce-488e2.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1028143107975",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1028143107975:web:a5142cabcb2ceebf5c4d22",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-P4M8P4FQ6X",
};

// Initialize Firebase
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
