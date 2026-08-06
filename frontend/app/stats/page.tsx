"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/api";
import { Stats } from "@/types/api";
import { useAuth } from "@/components/AuthProvider";
import { Loader2, LayoutList, Star, PlayCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  Watching: "#3b82f6", // Blue
  Completed: "#22c55e", // Green
  "Plan to Watch": "#eab308", // Yellow
  Dropped: "#ef4444", // Red
  "On Hold": "#f97316", // Orange
};

export default function StatsPage() {
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: () => ApiClient.get<Stats>("/users/me/stats"),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-4 text-center">
        <BarChart3 className="mb-4 h-16 w-16 text-neutral-600" />
        <h2 className="text-2xl font-bold text-white">Your Anime Stats</h2>
        <p className="mt-2 text-neutral-400">Please log in to view your statistics.</p>
        <Link href="/login" className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500">
          Sign In
        </Link>
      </div>
    );
  }

  // Format data for Recharts
  const pieData = stats ? (Object.entries(stats.status_distribution) as [string, number][]).map(([name, value]) => ({
    name,
    value,
  })).filter(entry => entry.value > 0) : [];

  return (
    <div className="min-h-screen bg-neutral-950 p-4 pt-24 md:p-8 md:pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            My Statistics
          </h1>
          <p className="mt-2 text-neutral-400">
            A breakdown of your anime journey.
          </p>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-red-900/50 bg-red-500/10 text-red-500">
            Failed to load stats. Please try again.
          </div>
        ) : !stats || stats.total_anime === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <LayoutList className="mb-4 h-12 w-12 text-neutral-600" />
            <h3 className="text-xl font-bold text-white">No data yet</h3>
            <p className="mt-2 text-neutral-400">Add some anime to your list to see your stats.</p>
            <Link href="/search" className="mt-6 font-medium text-blue-500 hover:text-blue-400">
              Browse anime →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Metric Cards */}
            <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                  <LayoutList className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-400">Total Anime</p>
                  <p className="text-3xl font-bold text-white">{stats.total_anime}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-400">Total Episodes</p>
                  <p className="text-3xl font-bold text-white">{stats.total_episodes}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 lg:col-span-1 md:col-span-2">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-400">Average Rating</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-bold text-white">{stats.average_rating > 0 ? stats.average_rating.toFixed(1) : "-"}</p>
                    {stats.average_rating > 0 && <span className="text-sm text-neutral-400">/ 10</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            {pieData.length > 0 && (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:col-span-2 lg:col-span-3">
                <h3 className="mb-6 text-lg font-semibold text-white">Status Breakdown</h3>
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[entry.name as keyof typeof COLORS] || "#525252"} 
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#171717", 
                          borderColor: "#262626",
                          borderRadius: "0.5rem",
                          color: "#fff"
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value) => <span className="text-neutral-300">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
