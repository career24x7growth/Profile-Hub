"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/Components/login");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ProfileHub
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <Link href="/Components/dashboard" className="hover:text-blue-600 transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/Components/login" className="hover:text-blue-600 transition">
                Login
              </Link>
              <Link href="/register" className="hover:text-blue-600 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
