"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import { ApiClient } from "@/lib/api";
import { AnimeSearchResponse } from "@/types/api";
import { AnimeCard } from "@/components/AnimeCard";
import { Search, Loader2 } from "lucide-react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["animeSearch", debouncedSearch],
    queryFn: () => {
      if (!debouncedSearch.trim()) return null;
      return ApiClient.get<AnimeSearchResponse>("/anime/search", {
        params: { q: debouncedSearch },
      });
    },
    enabled: debouncedSearch.trim().length > 0,
  });

  return (
    <div className="min-h-screen bg-neutral-950 p-6 pt-24 md:p-12 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            Discover Anime
          </h1>
          <p className="mt-4 text-lg text-neutral-400">
            Search thousands of anime titles to add to your list.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mb-12 max-w-2xl relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-neutral-500" />
          </div>
          <input
            type="text"
            className="w-full rounded-full border border-neutral-800 bg-neutral-900/50 py-4 pl-12 pr-4 text-lg text-white shadow-sm backdrop-blur-sm placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search for an anime (e.g., Attack on Titan)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Results Area */}
        <div className="min-h-[400px]">
          {isLoading && debouncedSearch.trim() !== "" ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex h-64 items-center justify-center text-red-500">
              <p>Failed to load search results. Please try again.</p>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-6">
              {data.data.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime} />
              ))}
            </div>
          ) : debouncedSearch.trim() !== "" ? (
            <div className="flex h-64 flex-col items-center justify-center text-neutral-500">
              <Search className="mb-4 h-12 w-12 opacity-20" />
              <p>No anime found for "{debouncedSearch}"</p>
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center text-neutral-600">
              <Search className="mb-4 h-12 w-12 opacity-20" />
              <p>Start typing to search for anime...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
