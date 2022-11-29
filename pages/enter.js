import React, { useContext, useEffect, useState, useCallback } from "react";

// Firebase
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";

import { UserContext } from "../lib/context";
import { doc, getDoc, writeBatch } from "firebase/firestore";

import debounce from "lodash.debounce";

import Loader from "../components/Loader";

function EnterPage() {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

export default EnterPage;

//  Sign in with Google Button
function SignInButton() {
  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  // Trigger and effect whenever the value of the form changes
  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    try {
      const userDoc = doc(db, `users/${user.uid}`);
      const usernameDoc = doc(db, `usernames/${formValue}`);

      // Commit the changes together as a batch write
      const batch = writeBatch(db);
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error.message);
    }
  };

  const nameChangeHandler = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        try {
          const docRef = doc(db, `usernames/${username}`);
          const docSnapshot = await getDoc(docRef);

          setIsValid(!docSnapshot.exists());
          setLoading(false);
        } catch (error) {
          console.log(error.message);
          setLoading(false);
        }
      }
    }, 500),
    []
  );
  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={nameChangeHandler}
          />

          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking..</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
