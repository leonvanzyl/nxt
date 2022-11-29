// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";
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

// Helper Functions

/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  let userDoc;
  try {
    const userSnap = await getDocs(q);
    userDoc = userSnap.docs[0];
  } catch (error) {
    console.log("Get user with username failed: ", error.message);
  }

  return userDoc;
}

/**
 * Converts a firebase document to JSON
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();

  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
