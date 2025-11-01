'use client';

import { getAll } from "./actions/post";
import { PostType } from "@/lib/definitions";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/Create";

import { useEffect, useState } from "react";


const Home = () => {
  const [posts, setPosts] = useState<PostType[] | undefined>([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await getAll();

      console.log(res);
      
      setPosts(res.data);
    };

    getPosts();
  }, []);

  return (
    <main>
      <div className="flex flex-col items-center">
        { posts?.map((p) => (
          <Post
            key={p.id}
            id={p.id}
            authorId={String(p.author_id)}
            authorName={p.author_name}
            authorAvatar={`${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_DOMAIN}/${p.author_id}.png`}
            content={p.content}
            likes={p.likes}
            reposts={p.reposts}
            comments={p.comments}
            createdAt={p.created_at}
          />
        ))}
      </div>

      <CreatePost />
    </main>
  );
};

export default Home;