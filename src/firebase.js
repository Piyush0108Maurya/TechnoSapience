// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Use environment variables for security

// Debug: Check if environment variables are loaded
console.log('=== Firebase Debug Info ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('API Key exists:', !!process.env.REACT_APP_FIREBASE_API_KEY);
console.log('API Key length:', process.env.REACT_APP_FIREBASE_API_KEY?.length || 0);
console.log('API Key first 10 chars:', process.env.REACT_APP_FIREBASE_API_KEY?.substring(0, 10) || 'NOT_SET');
console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'NOT_SET');
console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID || 'NOT_SET');
console.log('========================');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyC7sq9Le-RtGxG9SmxSIcCbBqlH6BsB6BU',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'piyush-3f536.firebaseapp.com',
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || 'https://piyush-3f536-default-rtdb.firebaseio.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'piyush-3f536',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'piyush-3f536.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '199407994641',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:199407994641:web:f95b025f8d9038e8b5aeb0',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-FCBT00LK97'
};

console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Initialize Analytics conditionally (only in production and not in test environment)
let analyticsInstance = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && !process.env.JEST_WORKER_ID) {
  try {
    analyticsInstance = getAnalytics(app);
  } catch (error) {
    console.warn('Firebase Analytics initialization failed:', error);
  }
}

export const analytics = analyticsInstance;

export default app;
