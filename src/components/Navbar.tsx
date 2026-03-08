import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LogIn, UserCircle, LogOut } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-indigo-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">CGC <span className="text-indigo-600">finds</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">Dashboard</Link>
              <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition">
                <UserCircle className="w-5 h-5 text-indigo-500" />
                <span className="hidden sm:inline">{session.user?.name || "Profile"}</span>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
