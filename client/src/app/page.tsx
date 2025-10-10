// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Profile Hub</h1>
        <p className="text-gray-600 mb-8">
          A small user-management demo (roles: user, admin, superadmin).
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-5 py-3 bg-blue-600 text-white rounded-md shadow"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-3 border border-blue-600 text-blue-600 rounded-md"
          >
            Register
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-3 bg-gray-100 text-gray-800 rounded-md"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
