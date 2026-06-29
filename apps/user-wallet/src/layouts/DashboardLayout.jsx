import { LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-6">
        <h1 className="text-xl font-bold text-blue-700">EthioCred</h1>
        <p className="text-sm text-gray-500 mt-1">User Wallet</p>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">{user?.fullName || user?.email}</span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
