"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-neutral-950 p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
        404
      </h1>
      <h2 className="mb-6 text-xl text-neutral-400">
        Page Not Found
      </h2>
      <p className="mb-8 max-w-md text-neutral-500">
        Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        href="/"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Return Home
      </Link>
    </div>
  );
}
