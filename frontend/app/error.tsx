"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-neutral-950 p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertOctagon className="h-12 w-12" />
      </div>
      <h2 className="mb-2 text-3xl font-bold tracking-tight text-white">
        Something went wrong!
      </h2>
      <p className="mb-8 max-w-md text-neutral-400">
        An unexpected error occurred while loading this page.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
        >
          Try again
        </button>
        <Link 
          href="/"
          className="rounded-lg border border-neutral-700 bg-neutral-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
