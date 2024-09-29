'use client';

import { useState } from 'react';

type Post = {
  id: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
};

export default function PostList({ posts }: { posts: Post[] }) {
  const [expandedComments, setExpandedComments] = useState<string | null>(null);

  const toggleComments = (postId: string) => {
    setExpandedComments(expandedComments === postId ? null : postId);
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-gray-800 p-4 rounded">
          <p>{post.content}</p>
          <p className="text-gray-400 mt-2">Posted by: {post.author}</p>
          <div className="mt-4 flex space-x-4">
            <button className="text-gray-400 hover:text-white">Like ({post.likes})</button>
            <button className="text-gray-400 hover:text-white" onClick={() => toggleComments(post.id)}>
              Comments ({post.comments})
            </button>
          </div>
          {expandedComments === post.id && (
            <div className="mt-4 bg-gray-700 p-2 rounded">
              {/* Add comment list and comment form here */}
              <p>Comments will be displayed here</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}