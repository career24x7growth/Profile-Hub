"use client";
import "./globals.css";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      setIsLoggedIn(false);
    }
    setIsLoggedIn(!!token);
    
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/Components/login");
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">
              Profile Hub
            </Link>

            <nav className="space-x-4 text-sm">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="hover:underline text-red-600"
                  >
                    Logout
                  </button>
                  <Link href="/Components/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/Components/login" className="hover:underline">
                    Login
                  </Link>
                  <Link href="/Components/register" className="hover:underline">
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
