import { useEffect, useState } from "react";

// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(userRef, (doc) => {
          setUsername(doc.data()?.username);
        });
      } catch (error) {
        console.log(error.message);
      }
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
