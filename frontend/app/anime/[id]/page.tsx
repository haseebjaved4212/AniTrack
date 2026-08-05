"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";
import { Anime } from "@/types/api";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Star, ArrowLeft, Plus, Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [added, setAdded] = useState(false);

  const { data: anime, isLoading, error } = useQuery({
    queryKey: ["anime", id],
    queryFn: () => ApiClient.get<Anime>(`/anime/${id}`),
    enabled: !!id,
  });

  const { mutate: addToList, isPending: isAdding } = useMutation({
    mutationFn: () =>
      ApiClient.post(`/entries/${id}`, {
        status: "Plan to Watch",
        progress: 0,
      }),
    onSuccess: () => {
      setAdded(true);
      // Invalidate the entries list so the dashboard refreshes
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 text-white">
        <h2 className="text-2xl font-bold">Anime not found</h2>
        <p className="mt-2 text-neutral-400">The anime you're looking for doesn't exist or there was an error.</p>
        <button 
          onClick={() => router.back()}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 font-semibold hover:bg-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Banner (blurred background) */}
      <div className="relative h-64 w-full overflow-hidden bg-neutral-900 md:h-80">
        {anime.image_url && (
          <Image
            src={anime.image_url}
            alt={anime.title}
            fill
            className="object-cover opacity-20 blur-xl"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
        
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 text-sm font-medium backdrop-blur-md transition-colors hover:bg-black/80"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
        <div className="relative -mt-24 flex flex-col gap-8 md:-mt-32 md:flex-row">
          
          {/* Poster */}
          <div className="mx-auto w-48 shrink-0 md:mx-0 md:w-64">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border-4 border-neutral-950 bg-neutral-800 shadow-2xl">
              {anime.image_url ? (
                <Image
                  src={anime.image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-500">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col pt-4 md:pt-36">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              {anime.title}
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium">
              {anime.score && (
                <div className="flex items-center gap-1 rounded-md bg-yellow-500/10 px-2.5 py-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{anime.score} Score</span>
                </div>
              )}
              {anime.status && (
                <div className="rounded-md bg-neutral-800 px-2.5 py-1 text-neutral-300">
                  {anime.status}
                </div>
              )}
              {anime.episodes && (
                <div className="rounded-md bg-neutral-800 px-2.5 py-1 text-neutral-300">
                  {anime.episodes} Episodes
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold">Synopsis</h2>
              <p className="mt-3 leading-relaxed text-neutral-400">
                {anime.synopsis || "No synopsis available for this anime."}
              </p>
            </div>

            <div className="mt-10">
              {user ? (
                <button 
                  onClick={() => addToList()}
                  disabled={isAdding || added}
                  className={`flex items-center gap-2 rounded-lg px-8 py-3.5 font-bold text-white transition-all ${
                    added 
                      ? "bg-green-600 hover:bg-green-500"
                      : "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-600/20 active:scale-95"
                  } disabled:opacity-75 disabled:active:scale-100`}
                >
                  {isAdding ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : added ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {added ? "Added to List" : "Add to My List"}
                </button>
              ) : (
                <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 font-bold text-white transition-all hover:bg-blue-500">
                  Login to add to List
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
