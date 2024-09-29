'use client';

import { useState, useRef, useEffect } from 'react';

import { useRouter } from 'next/navigation';
// Extend the Window interface to include the solana property
declare global {
  interface Window {
    solana?: {
      connect(): Promise<{ publicKey: { toString(): string } }>;
    };
  }
}

export default function SolanaWalletButton() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const connectWallet = async () => {
    if (typeof window.solana !== 'undefined') {
      try {
        const response = await window.solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("Failed to connect wallet:", err);
      }
    } else {
      alert("Solana object not found! Get a Phantom Wallet 👻");
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsDropdownOpen(false);
  };

  const viewProfile = () => {
    // Implement view profile functionality
    console.log("View profile clicked");
    router.push('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={walletAddress ? () => setIsDropdownOpen(!isDropdownOpen) : connectWallet}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        {walletAddress ? `Connected: ${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
      </button>
      {walletAddress && isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <button
            onClick={viewProfile}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            View Profile
          </button>
          <button
            onClick={disconnectWallet}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}