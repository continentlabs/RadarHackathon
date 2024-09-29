import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchCommunities() {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(8);  // Fetch the 8 most recent communities

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching communities:', error);
    return [];
  }
}

export default async function Home() {
  const communities = await fetchCommunities();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow grid grid-rows-[auto_1fr_auto] items-start justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 items-center sm:items-start w-full">
          {/* ... (rest of your existing main content) ... */}
          
          <section className="w-full mt-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Communities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {communities.map((community) => (
                <Link href={`/community/${community.id}`} key={community.id} className="block">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-w-1 aspect-h-1">
                      <Image
                        src={community.profile_picture}
                        alt={community.name}
                        width={300}
                        height={300}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{community.name}</h3>
                      <p className="text-sm text-gray-600">{community.members.length} members</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </main>
        <footer className="flex gap-6 flex-wrap items-center justify-center">
          {/* ... (your existing footer content) ... */}
        </footer>
      </div>
    </div>
  );
}
