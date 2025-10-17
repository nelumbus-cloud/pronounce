import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAZ6qoPZdk5G3BHcf7Ww_nuEroOQNZ-WZc",
    authDomain: "pronounce-488e2.firebaseapp.com",
    projectId: "pronounce-488e2",
    storageBucket: "pronounce-488e2.firebasestorage.app",
    messagingSenderId: "1028143107975",
    appId: "1:1028143107975:web:a5142cabcb2ceebf5c4d22",
    measurementId: "G-P4M8P4FQ6X"
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
