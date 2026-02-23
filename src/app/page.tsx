import Link from 'next/link';
import { ShoppingBag, LayoutDashboard, QrCode } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-white flex flex-col items-center text-center">
          <div className="bg-blue-100 p-6 rounded-full text-blue-600 mb-6">
            <ShoppingBag size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Guest Menu</h1>
          <p className="text-gray-500 mb-8">Access the ordering system (Rooms 101-306)</p>
// ... imports ...
          <div className="grid grid-cols-3 gap-2 w-full">
            {[101, 201, 301].map(num => (
              <Link
                key={num}
                href={`/guest/${num}`}
                className="bg-gray-50 hover:bg-blue-600 hover:text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-95 border border-gray-100"
              >
                Room {num}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-8 flex flex-col justify-center">
          <Link href="/admin" className="group block bg-white p-8 rounded-3xl shadow-xl border border-white transition-all hover:translate-y-[-4px] active:scale-95">
            <div className="flex items-center gap-6">
              <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutDashboard size={32} />
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-900">Admin Login</h2>
                <p className="text-gray-500 font-medium">Protected access for hotel staff</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
