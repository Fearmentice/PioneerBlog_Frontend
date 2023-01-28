// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCDyyN06L-9gn4VoHuT8cHsKPWhTjRXMxw",
    authDomain: "vocham-api.firebaseapp.com",
    projectId: "vocham-api",
    storageBucket: "vocham-api.appspot.com",
    messagingSenderId: "203325301117",
    appId: "1:203325301117:web:90a8078baa03957f3aac14",
    measurementId: "G-Q1BCQWF20E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);