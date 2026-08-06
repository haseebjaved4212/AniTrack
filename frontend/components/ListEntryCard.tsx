import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserAnimeEntry } from "@/types/api";
import { Star, Plus, Trash2, Loader2, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";

interface ListEntryCardProps {
  entry: UserAnimeEntry;
}

const STATUS_OPTIONS = ["Watching", "Completed", "Plan to Watch", "Dropped", "On Hold"];

export function ListEntryCard({ entry }: ListEntryCardProps) {
  const queryClient = useQueryClient();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const anime = entry.anime;

  // Optimistic update for modifying entry
  const { mutate: updateEntry, isPending: isUpdating } = useMutation({
    mutationFn: (updates: { status?: string; progress?: number; rating?: number | null }) =>
      ApiClient.patch(`/entries/${entry.anime_id}`, updates),
    onMutate: async (updates) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ["entries"] });

      // Snapshot previous value
      const previousEntries = queryClient.getQueryData<UserAnimeEntry[]>(["entries"]);

      // Optimistically update
      if (previousEntries) {
        queryClient.setQueryData<UserAnimeEntry[]>(["entries"], (old) =>
          old?.map((item) =>
            item.anime_id === entry.anime_id ? { ...item, ...updates } : item
          )
        );
      }

      return { previousEntries };
    },
    onSuccess: () => {
      toast.success("Entry updated");
    },
    onError: (err, newEntry, context) => {
      // Rollback on error
      if (context?.previousEntries) {
        queryClient.setQueryData(["entries"], context.previousEntries);
      }
      toast.error("Failed to update entry");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      // Invalidate stats too, since they change when list changes
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const { mutate: deleteEntry, isPending: isDeleting } = useMutation({
    mutationFn: () => ApiClient.delete(`/user/anime-list/${entry.id}`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["entries"] });
      const previousEntries = queryClient.getQueryData<UserAnimeEntry[]>(["entries"]);
      if (previousEntries) {
        queryClient.setQueryData<UserAnimeEntry[]>(["entries"], (old) =>
          old?.filter((item) => item.id !== entry.id)
        );
      }
      return { previousEntries };
    },
    onSuccess: () => {
      toast.success("Entry removed");
    },
    onError: (err, variables, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(["entries"], context.previousEntries);
      }
      toast.error("Failed to remove entry");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  if (!anime) return null;

  return (
    <div className="group flex flex-col md:flex-row gap-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700">
      {/* Poster */}
      <Link href={`/anime/${anime.id}`} className="relative h-48 w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-800 hidden md:block">
        {anime.image_url && (
          <Image
            src={anime.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-start justify-between">
          <Link href={`/anime/${anime.id}`} className="font-bold text-lg text-white hover:text-blue-400 line-clamp-1">
            {anime.title}
          </Link>
          
          {showConfirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">Are you sure?</span>
              <button 
                onClick={() => deleteEntry()}
                className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white hover:bg-red-500"
              >
                {isDeleting ? "..." : "Yes"}
              </button>
              <button 
                onClick={() => setShowConfirmDelete(false)}
                className="rounded bg-neutral-700 px-2 py-1 text-xs font-medium text-white hover:bg-neutral-600"
              >
                No
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowConfirmDelete(true)}
              className="text-neutral-500 hover:text-red-500 transition-colors"
              title="Remove from list"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Controls Container */}
        <div className="mt-auto grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-800/50">
          
          {/* Status */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-neutral-500 mb-1">Status</label>
            <select
              value={entry.status}
              onChange={(e) => updateEntry({ status: e.target.value })}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Progress */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-neutral-500 mb-1">
              Progress {anime.episodes ? `(out of ${anime.episodes})` : ""}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                max={anime.episodes || undefined}
                value={entry.progress}
                onChange={(e) => updateEntry({ progress: parseInt(e.target.value) || 0 })}
                className="w-20 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => updateEntry({ progress: Math.min((anime.episodes || 9999), entry.progress + 1) })}
                disabled={entry.progress === anime.episodes}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Rating */}
          <div className="flex flex-col">
            <label className="text-xs font-medium text-neutral-500 mb-1">Rating</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateEntry({ rating: star === entry.rating ? null : star })}
                    className="group relative p-0.5"
                  >
                    <Star 
                      className={`h-4 w-4 md:h-5 md:w-5 ${
                        (entry.rating || 0) >= star 
                          ? "fill-yellow-500 text-yellow-500" 
                          : "text-neutral-700 hover:text-yellow-500/50"
                      } transition-colors`} 
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-yellow-500 w-4 text-center">
                {entry.rating || "-"}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
