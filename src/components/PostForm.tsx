"use client";
import { useState } from "react";
import { useCreatePost } from "@/lib/hooks";

export default function PostForm({ sectorId }: { sectorId: number }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPost = useCreatePost();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    createPost.mutate({ title, content, sectorId });
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={submit} className="space-y-3 mt-4">
      <input
        className="w-full p-2 rounded bg-white/10 text-white"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 rounded bg-white/10 text-white"
        placeholder="Write your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 text-white"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}
