"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";
import { UserAnimeEntry } from "@/types/api";
import { ListEntryCard } from "@/components/ListEntryCard";
import { ListEntrySkeleton } from "@/components/Skeletons";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, LayoutList } from "lucide-react";
import Link from "next/link";

const TABS = ["All", "Watching", "Completed", "Plan to Watch", "Dropped", "On Hold"];

export default function MyListPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");

  const { data: entries, isLoading, error } = useQuery({
    queryKey: ["entries"],
    queryFn: () => ApiClient.get<UserAnimeEntry[]>("/entries"),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 text-center">
        <LayoutList className="mb-4 h-16 w-16 text-neutral-600" />
        <h2 className="text-2xl font-bold text-white">Your Anime List</h2>
        <p className="mt-2 text-neutral-400">Please log in to manage your anime list.</p>
        <Link href="/login" className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
          Sign In
        </Link>
      </div>
    );
  }

  const filteredEntries = entries?.filter(
    (entry) => activeTab === "All" || entry.status === activeTab
  );

  return (
    <div className="min-h-screen bg-neutral-950 p-4 pt-24 md:p-8 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              My List
            </h1>
            <p className="mt-2 text-neutral-400">
              Manage and track all your anime in one place.
            </p>
          </div>
          <Link 
            href="/search"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-500"
          >
            Find more anime
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex overflow-x-auto border-b border-neutral-800 pb-px scrollbar-hide">
          <div className="flex gap-6 px-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {tab}
                {entries && (
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                    activeTab === tab ? "bg-blue-500/10 text-blue-500" : "bg-neutral-800 text-neutral-300"
                  }`}>
                    {tab === "All" 
                      ? entries.length 
                      : entries.filter((e) => e.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              <ListEntrySkeleton />
              <ListEntrySkeleton />
              <ListEntrySkeleton />
              <ListEntrySkeleton />
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-red-900/50 bg-red-500/10 text-red-500">
              Failed to load your list. Please try again.
            </div>
          ) : !entries || entries.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <LayoutList className="mb-4 h-12 w-12 text-neutral-600" />
              <h3 className="text-xl font-bold text-white">Your list is empty</h3>
              <p className="mt-2 text-neutral-400">You haven't added any anime to your list yet.</p>
              <Link href="/search" className="mt-6 font-medium text-blue-500 hover:text-blue-400">
                Browse anime →
              </Link>
            </div>
          ) : filteredEntries?.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center text-neutral-500">
              <p>No anime found in the "{activeTab}" category.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredEntries?.map((entry) => (
                <ListEntryCard key={entry.anime_id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
