import Image from "next/image";
import Link from "next/link";
import { Anime } from "@/types/api";
import { Star } from "lucide-react";

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.mal_id}`} className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 transition-all hover:border-neutral-600 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800">
        {anime.image_url ? (
          <Image
            src={anime.image_url}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-500">
            No Image
          </div>
        )}
        
        {/* Status Badge */}
        {anime.status && (
          <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
            {anime.status}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-white group-hover:text-blue-400">
          {anime.title}
        </h3>
        
        <div className="mt-auto pt-3 flex items-center justify-between text-sm text-neutral-400">
          {anime.score ? (
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{anime.score}</span>
            </div>
          ) : (
            <span className="text-xs">Unrated</span>
          )}
          
          {anime.episodes && (
            <span className="text-xs">{anime.episodes} eps</span>
          )}
        </div>
      </div>
    </Link>
  );
}
