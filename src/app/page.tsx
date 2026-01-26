'use client';

import { getFeed } from "@/app/actions/post";
import { PostType } from "@/lib/definitions";
import Post from "@/components/post/Post";
import CreatePost from "@/components/post/modals/AddPost";

import { useEffect, useState } from "react";


const Home = () => {
  const [posts, setPosts] = useState<PostType[] | undefined>([]);

  useEffect(() => {
    const getPosts = async () => {
      const res = await getFeed();

      console.log('res', res)

      // if (res.data) {
      //   for (const p of res.data) {
      //   };
      // };
      
      setPosts(res.data);
    };

    getPosts();
  }, []);

  return (
    <main>
      <div className="flex flex-col items-center gap-2">
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
            shares={p.shares}
            createdAt={p.created_at}
            liked={p.liked}
            reposted={p.reposted}
            shared={p.shared}
            onUpdate={({
              like = null,
              repost = null,
              share = null
            }: {
              like?: '+' | '-' | null;
              repost?: '+' | '-' | null;
              share?: true | false | null;
            }) => {
              console.log('updateing post')
              console.log(like, repost)
              if (like) {
                console.log('like', like)
                setPosts((prevPosts) => 
                  prevPosts?.map((post) => 
                    post.id === p.id 
                      ? {
                        ...post,
                        likes: like === '+' ? post.likes + 1 : post.likes - 1,
                        liked: like === '+' 
                      } 
                      : post
                  )
                );
              } else if (repost) {
                setPosts((prevPosts) => 
                  prevPosts?.map((post) => 
                    post.id === p.id 
                      ? {
                        ...post,
                        reposts: repost === '+' ? post.reposts + 1 : post.reposts - 1,
                        repost: repost === '+' 
                      } 
                      : post
                  )
                );
              } else if (share) {

              }
            }}
          />
        ))}
      </div>

      <CreatePost />
    </main>
  );
};

export default Home;