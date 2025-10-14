"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!token);

    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || "");
      } catch (e) {
        setUserRole("");
      }
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("token");
      const updatedUser = localStorage.getItem("user");
      setIsLoggedIn(!!updatedToken);
      if (updatedUser) {
        try {
          const userData = JSON.parse(updatedUser);
          setUserRole(userData.role || "");
        } catch (e) {
          setUserRole("");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
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
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ProfileHub
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <Link href="/Components/dashboard" className="hover:text-blue-600 transition">
                Dashboard
              </Link>
              <Link href="/Components/chat" className="hover:text-blue-600 transition">
                Messages
              </Link>
              {(userRole === "admin" || userRole === "superadmin") && (
                <Link href="/Components/admin-chat" className="hover:text-blue-600 transition">
                  Admin Chat
                </Link>
              )}
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
              <Link href="/Components/register" className="hover:text-blue-600 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
