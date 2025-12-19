import React from "react";
import Layout from "@/components/layout/Layout";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/ui/PostCard";

export default function PostsPage({ posts }) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-6">Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  return { props: { posts } };
}
