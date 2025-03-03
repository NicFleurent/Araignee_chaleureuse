// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgglN4HhbpvKDCwAGsifw4somZI41Mndg",
  authDomain: "araignee-chaleureuse.firebaseapp.com",
  projectId: "araignee-chaleureuse",
  storageBucket: "araignee-chaleureuse.firebasestorage.app",
  messagingSenderId: "373434029425",
  appId: "1:373434029425:web:2bb6d98b20f35a901b52d0",
  measurementId: "G-P8TQPPVVHQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { auth, db }