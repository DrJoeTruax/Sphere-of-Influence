"use client";
import { Shield, MapPin, Plus, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/20">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/galaxies" className="flex items-center gap-3 hover:opacity-80">
          <Shield className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold text-white">Kinddit</h1>
            <p className="text-xs text-blue-300">The nontoxic center of the world</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/local" className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
            <MapPin className="w-4 h-4" /> Local
          </Link>
          <Link href="/create" className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create
          </Link>
          <Link href="/profile/explorer_user" className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20">
            <User className="w-5 h-5" /> ??
          </Link>
        </div>
      </div>
    </div>
  );
}
