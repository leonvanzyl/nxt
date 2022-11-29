import { useState } from "react";

import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";

// Firebase
import { db, postToJSON } from "../lib/firebase";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  startAfter,
} from "firebase/firestore";

import toast from "react-hot-toast";

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const postQuery = query(
      collectionGroup(db, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const snap = await getDocs(postQuery);
    const newPosts = snap.docs.map(postToJSON);
    setPosts((currentState) => currentState.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}

const LIMIT = 1;

export async function getServerSideProps(context) {
  const postQuery = query(
    collectionGroup(db, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const snap = await getDocs(postQuery);
  const posts = snap.docs.map(postToJSON);

  return {
    props: { posts },
  };
}
