'use client';

import React from 'react';

interface CrosshairMarkerProps {
  position?: 'tl' | 'tr' | 'bl' | 'br';
  className?: string;
}

export function CrosshairMarker({ position, className = '' }: CrosshairMarkerProps) {
  const posClasses = {
    tl: '-top-[5px] -left-[5px]',
    tr: '-top-[5px] -right-[5px]',
    bl: '-bottom-[5px] -left-[5px]',
    br: '-bottom-[5px] -right-[5px]',
  };

  return (
    <div
      className={`absolute ${position ? posClasses[position] : ''} pointer-events-none z-20 text-[#A8A29E] dark:text-[#525252] ${className}`}
      aria-hidden="true"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 0V10M0 5H10" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
