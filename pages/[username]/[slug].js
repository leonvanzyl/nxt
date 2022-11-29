import { collection, doc, getDoc } from "firebase/firestore";
import React from "react";
import { db, getUserWithUsername, postToJSON } from "../../lib/firebase";

import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";

function PostPage(props) {
  const postRef = doc(db, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 💖</strong>
        </p>
      </aside>
    </main>
  );
}

export default PostPage;

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    try {
      const docRef = doc(db, userDoc.ref.path, "posts", slug);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.log("Document does not exist");
      }
      post = postToJSON(docSnap);
      path = docSnap.ref.path;
    } catch (error) {
      console.log(error.message);
    }
  }

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}
