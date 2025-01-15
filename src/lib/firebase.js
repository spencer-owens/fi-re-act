// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4obfBZLIOnV8r08MyNWgf7u3_1MbKLYA",
  authDomain: "fi-re-7647c.firebaseapp.com",
  projectId: "fi-re-7647c",
  storageBucket: "fi-re-7647c.firebasestorage.app",
  messagingSenderId: "860855607295",
  appId: "1:860855607295:web:206b08da7c75aaec7411ca",
  measurementId: "G-98XCEMDBFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics }; 