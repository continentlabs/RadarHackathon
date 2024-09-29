'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostForm({ communityId }: { communityId: string }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to submit the post to Supabase
    // Reset the form after submission
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 text-black rounded"
        placeholder="What's on your mind?"
        rows={4}
      />
      <button type="submit" className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Post
      </button>
    </form>
  );
}