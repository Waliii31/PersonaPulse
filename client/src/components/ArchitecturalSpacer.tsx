'use client';

import React from 'react';
import { CrosshairMarker } from './CrosshairMarker';

interface ArchitecturalSpacerProps {
  label?: string;
}

export function ArchitecturalSpacer({ label }: ArchitecturalSpacerProps) {
  return (
    <div className="relative h-12 w-full border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5]/70 dark:bg-[#070707] flex items-center justify-between px-6 overflow-hidden select-none">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Diagonal Architectural Hatch Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 0, transparent 16px)',
          color: '#E6E4DD',
        }}
      />

      {/* Optional center coordinate or section label */}
      <div className="relative z-10 flex items-center gap-4 text-[10px] font-mono text-[#A8A29E] dark:text-[#525252]">
        <span>+ 00.48PX SECTION INTERSECTION</span>
        {label && <span className="uppercase font-semibold text-[#E53E00]">// {label}</span>}
      </div>

      <div className="relative z-10 hidden sm:flex items-center gap-3 text-[10px] font-mono text-[#A8A29E] dark:text-[#525252]">
        <span>GRID COORDINATE 1280W</span>
        <span>•</span>
        <span>120FPS LENIS SYNC</span>
      </div>
    </div>
  );
}
