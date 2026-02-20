"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold hover:text-gray-300 transition">
        BandMate
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/explore" className="hover:text-gray-300 transition">
          Explore
        </Link>
        <Link href="/gigs" className="hover:text-gray-300 transition">
          Gigs
        </Link>

        {user ? (
          <>
            <Link href="/profile" className="hover:text-gray-300 transition">
              My Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-gray-300 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
