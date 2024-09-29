import Image from "next/image";
import { createClient } from '@supabase/supabase-js';
import PostForm from '../../components/PostForm';
import PostList from '../../components/PostList';
import AboutCommunity from '../../components/AboutCommunity';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchCommunity(id: string) {
  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

async function fetchPosts(communityId: string) {
  // You'll need to create a posts table or adjust this function
  // based on how you're storing posts for communities
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

export default async function CommunityPage({ params }: { params: { id: string } }) {
  const community = await fetchCommunity(params.id);
  const posts = await fetchPosts(params.id);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto">
        {/* Remove max-width constraint */}
        <header className="border-b border-gray-700 p-4">
          <div className="max-w-7xl mx-auto">
            <button className="text-2xl mb-4">←</button>
            <h1 className="text-xl font-bold">{community.name}</h1>
            <p className="text-gray-400">{posts.length} posts</p>
          </div>
        </header>

        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
          <div className="max-w-7xl mx-auto relative h-full">
            <div className="absolute -bottom-16 left-4">
              <Image
                src={community.profile_picture || '/default-profile.png'}
                alt={community.name}
                width={88}
                height={88}
                className="rounded-full border-4 border-black"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 p-4">
          <h2 className="text-xl font-bold">{community.name}</h2>
          <p className="text-gray-400">Created by: {community.creator}</p>
          <p className="mt-2">{community.description}</p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Join Community
          </button>
        </div>

        <nav className="flex border-b border-gray-700">
          <div className="max-w-7xl mx-auto w-full flex">
            <button className="flex-1 py-4 font-semibold border-b-2 border-blue-500">Posts</button>
            <button className="flex-1 py-4 text-gray-400">About</button>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto p-4">
          <PostForm communityId={params.id} />
          <PostList posts={posts} />
          <AboutCommunity community={community} />
        </div>
      </div>
    </div>
  );
}