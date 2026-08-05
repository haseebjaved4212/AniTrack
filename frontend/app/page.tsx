"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-linear-to-t from-neutral-900 via-neutral-900 to-transparent lg:static lg:h-auto lg:w-auto lg:bg-none">
          {user ? (
            <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Welcome back, {user.username}!
              </h1>
              <p className="text-lg text-neutral-400">
                You are securely logged in with HTTP-Only cookies.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/search"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Search Anime
                </Link>
                <Link
                  href="/my-list"
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  My List
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg border border-red-900/50 bg-neutral-900 px-6 py-3 font-semibold text-red-400 transition-colors hover:bg-red-950/50"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                Track your anime journey
              </h1>
              <p className="text-lg text-neutral-400 max-w-[600px]">
                AniTrack is a modern anime tracking application built with Next.js and FastAPI.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/search"
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
                >
                  Search Anime
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Create Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
