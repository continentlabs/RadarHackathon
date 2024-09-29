'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProfileContent() {
  const { publicKey, connected } = useWallet();
  const [assets, setAssets] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [communities, setCommunities] = useState<any[]>([]);
  const [existingCommunities, setExistingCommunities] = useState<Set<string>>(new Set());
  const [assetCommunities, setAssetCommunities] = useState<Record<string, string>>({});

  useEffect(() => {
    setIsClient(true);
    if (connected && publicKey) {
      fetchAssets(publicKey.toString());
      fetchCommunities();
      fetchExistingCommunities();
      fetchAssetCommunities();
    } else {
      setAssets([]);
      setCommunities([]);
      setExistingCommunities(new Set());
      setAssetCommunities({});
    }
  }, [connected, publicKey]);

  async function fetchAssets(ownerAddress: string) {
    try {
      const response = await fetch('https://mainnet.helius-rpc.com/?api-key=fdbdb45b-2417-4149-b2bf-df6fba2066ab', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "jsonrpc": "2.0",
          "id": "text",
          "method": "searchAssets",
          params: {
            ownerAddress: ownerAddress,
          },
        }),
      });
      const data = await response.json();
      console.log(data);
      setAssets(data.result.items);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function createCommunity(asset: any) {
    if (!publicKey) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .insert([
          {
            name: asset.content.metadata.name,
            creator: publicKey.toString(),
            members: [publicKey.toString()],
            profile_picture: asset.content.links.image
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setCommunities(prev => [...prev, data[0]]);
        alert(`Community created for ${asset.content.metadata.name}`);
      }
    } catch (error) {
      console.error('Error creating community:', error);
      alert('Failed to create community. Please try again.');
    }
  }

  async function fetchCommunities() {
    if (!publicKey) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .contains('members', [publicKey.toString()]);

      if (error) throw error;

      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    }
  }

  async function fetchExistingCommunities() {
    if (!publicKey) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id')
        .contains('members', [publicKey.toString()]);

      if (error) throw error;

      setExistingCommunities(new Set(data.map(item => item.id)));
    } catch (error) {
      console.error('Error fetching existing communities:', error);
    }
  }

  async function fetchAssetCommunities() {
    if (!publicKey) return;

    try {
      const { data, error } = await supabase
        .from('communities')
        .select('id, name');

      if (error) throw error;

      const communityMap: Record<string, string> = {};
      data.forEach(community => {
        communityMap[community.name] = community.id;
      });
      setAssetCommunities(communityMap);
    } catch (error) {
      console.error('Error fetching asset communities:', error);
    }
  }

  async function joinCommunity(communityId: string) {
    if (!publicKey) return;

    try {
      // const { data, error } = await supabase
      //   .from('communities')
      //   .update({ members: supabase.sql`array_append(members, ${publicKey.toString()})` })
      //   .eq('id', communityId)
      //   .select();

      // if (error) throw error;

      // if (data) {
      //   setCommunities(prev => [...prev, data[0]]);
      //   alert(`Joined community successfully`);
      // }
    } catch (error) {
      console.error('Error joining community:', error);
      alert('Failed to join community. Please try again.');
    }
  }

  if (!isClient) {
    return null; // or a loading spinner
  }

  return (
    <div>
      {connected && publicKey ? (
        <div>
          <p className="mb-4">Connected wallet: <span className="font-mono bg-gray-100 p-1 rounded">{publicKey.toString()}</span></p>
          <h2 className="text-2xl font-semibold mb-4">Your Collections</h2>
          {assets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {assets.map((asset, index) => {
                const imageUrl = asset.content.links.image;
                const assetName = asset.content.metadata.name || 'Unnamed Asset';
                const communityId = assetCommunities[assetName];
                return (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`${imageUrl}`}><h1>imageUrl</h1></Link>
                    <div className="aspect-w-1 aspect-h-1">
                      <Image
                        src={imageUrl}
                        alt={assetName}
                        width={300}
                        height={300}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={true}
                        onError={(e) => {
                          e.currentTarget.src = '';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg truncate">{assetName}</h3>
                      {communityId ? (
                        <button 
                          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => joinCommunity(communityId)}
                        >
                          Join Community
                        </button>
                      ) : (
                        <button 
                          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          onClick={() => createCommunity(asset)}
                        >
                          Create Community
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No assets found for this wallet.</p>
          )}
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Communities</h2>
          {communities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {communities.map((community, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1">
                    <Image
                      src={community.profile_picture}
                      alt={community.name}
                      width={300}
                      height={300}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={true}
                      onError={(e) => {
                        e.currentTarget.src = '';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">{community.name}</h3>
                    <p className="text-sm text-gray-500">{community.members.length} members</p>
                    <Link href={`/community/${community.id}`} className="mt-2 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      View Community
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't joined any communities yet.</p>
          )}
          
          <Link href="/communities" className="mt-4 inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Browse All Communities
          </Link>
        </div>
      ) : (
        <p className="text-gray-600">Please connect your wallet to view your profile.</p>
      )}
    </div>
  );
}