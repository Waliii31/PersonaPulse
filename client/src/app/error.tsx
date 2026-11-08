'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { CrosshairMarker } from '@/components/CrosshairMarker';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 bg-[#FAF9F5] dark:bg-[#050505]">
      <div className="relative max-w-md w-full p-8 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] text-center shadow-xl space-y-6">
        <CrosshairMarker position="tl" />
        <CrosshairMarker position="tr" />
        <CrosshairMarker position="bl" />
        <CrosshairMarker position="br" />

        <div className="w-12 h-12 bg-[#FFF5F0] dark:bg-[#1A100C] border border-[#E53E00]/30 text-[#E53E00] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-bold text-xl text-[#111111] dark:text-white">
            Something went wrong
          </h1>
          <p className="text-xs text-[#78716C] leading-relaxed font-mono">
            {error.message || 'An unexpected error occurred during rendering.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-xs shadow-sm transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] text-[#111111] dark:text-white font-semibold text-xs transition"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
