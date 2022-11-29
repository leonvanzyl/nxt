// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-Sr-f9ma6v6SSopgBpAGtjUVWXd2B3Lw",
  authDomain: "nextfire-7a539.firebaseapp.com",
  projectId: "nextfire-7a539",
  storageBucket: "nextfire-7a539.appspot.com",
  messagingSenderId: "721976185854",
  appId: "1:721976185854:web:b851ddc0da1b8ec354e6af",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
