import logo from '../assets/logo.png';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="EthioCred logo"
            className="mb-4 h-16 w-16 rounded-xl object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">EthioCred</h1>
          <p className="mt-1 text-sm text-gray-500">Platform administration</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
