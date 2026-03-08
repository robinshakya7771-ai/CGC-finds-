"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
      aria-label="Logout"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
