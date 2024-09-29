import Link from 'next/link';
import SolanaWalletButton from './SolanaWalletButton';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          Continent
        </Link>
      </div>
      <SolanaWalletButton />
    </nav>
  );
}