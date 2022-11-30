import React, { useState, useContext } from "react";
import Metatags from "../../components/Metatags";

import { useRouter } from "next/router";

import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";

import { UserContext } from "../../lib/context";

// Firebase
import {
  collection,
  query,
  serverTimestamp,
  orderBy,
  doc,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
// import { orderBy } from "lodash";

function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <Metatags title="Admin" />
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

export default AdminPostsPage;

function PostList() {
  const userId = auth.currentUser.uid;
  const colRef = collection(db, "users", userId, "posts");
  const q = query(colRef, orderBy("createdAt", "desc"));
  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;

    await setDoc(doc(db, "users", uid, "posts", slug), {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    });

    toast.success("Post created!");
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className=""
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create new post
      </button>
    </form>
  );
}
