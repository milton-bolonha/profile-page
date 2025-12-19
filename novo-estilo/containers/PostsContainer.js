import React from "react";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/ui/PostCard";

export default function PostsContainer() {
  const posts = getAllPosts();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
