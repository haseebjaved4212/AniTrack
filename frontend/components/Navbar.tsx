"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Menu, X, Search, LayoutList, BarChart3, LogOut, Tv2 } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const NavLinks = () => (
    <>
      <Link
        href="/search"
        onClick={closeMenu}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
          pathname === "/search" ? "text-blue-500" : "text-neutral-400 hover:text-white"
        }`}
      >
        <Search className="h-4 w-4" />
        Search
      </Link>
      
      {user && (
        <>
          <Link
            href="/my-list"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/my-list" ? "text-blue-500" : "text-neutral-400 hover:text-white"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            My List
          </Link>
          <Link
            href="/stats"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/stats" ? "text-blue-500" : "text-neutral-400 hover:text-white"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Stats
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Tv2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">AniTrack</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLinks />
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-400">
                  {user.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-neutral-900 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-900">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <NavLinks />
          </div>
          <div className="border-t border-neutral-800 pb-3 pt-4">
            {user ? (
              <div className="px-5">
                <div className="mb-3 text-sm font-medium text-neutral-400">
                  Signed in as <span className="text-white">{user.username}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg border border-red-900/50 bg-neutral-950 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-950/50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="px-5">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
