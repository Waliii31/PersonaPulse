import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#FAF9F5] dark:bg-[#1A1A1A]" />
            <div className="h-7 w-64 bg-[#FAF9F5] dark:bg-[#1A1A1A]" />
          </div>
          <div className="h-9 w-40 bg-[#FAF9F5] dark:bg-[#1A1A1A]" />
        </div>

        {/* Scorecard Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border border-[#E6E4DD] dark:border-[#1F1F1F] p-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#FAF9F5] dark:bg-[#1A1A1A]" />
          ))}
        </div>

        {/* Stage Skeleton */}
        <div className="h-[460px] bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E6E4DD] dark:border-[#1F1F1F] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#E53E00] border-t-transparent animate-spin" />
          <div className="h-3 w-44 bg-[#E6E4DD] dark:bg-[#262626]" />
        </div>
      </div>
    </div>
  );
}
