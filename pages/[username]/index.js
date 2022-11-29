import React from "react";

import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";

import { getUserWithUsername, postToJSON, db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

function UserProfilePage({ user, posts }) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}

export default UserProfilePage;

export async function getServerSideProps(context) {
  const { username } = context.query;
  let user = null;
  let posts = null;

  try {
    const userDoc = await getUserWithUsername(username);

    if (!userDoc) {
      return {
        notFound: true,
      };
    }

    user = userDoc.data();

    if (userDoc) {
      const postsRef = collection(db, `users/${userDoc.id}/posts`);
      const q = query(
        postsRef,
        where("published", "==", true),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const snap = await getDocs(q);

      posts = snap.docs.map(postToJSON);
    }
  } catch (error) {
    console.log("Error fetching posts: ", error.message);
  }

  return {
    props: { user, posts },
  };
}
