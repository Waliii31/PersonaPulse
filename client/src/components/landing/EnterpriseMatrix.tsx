'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CrosshairMarker } from '../CrosshairMarker';

const ENTERPRISE_LOGOS = [
  { name: 'Stripe', label: 'stripe' },
  { name: 'Linear', label: 'Linear' },
  { name: 'Notion', label: 'Notion' },
  { name: 'Shopify', label: 'shopify' },
  { name: 'Vercel', label: '▲ Vercel' },
  { name: 'Raycast', label: 'RAYCAST' },
  { name: 'Supabase', label: 'supabase' },
  { name: 'Atlassian', label: 'ATLASSIAN' },
  { name: 'GitHub', label: 'GitHub' },
  { name: 'Figma', label: 'Figma' },
];

const MARQUEE_TECH = [
  'PLAYWRIGHT HEADLESS CHROMIUM',
  'ZERO-COST TOKEN GUARDRAIL <1,000 TOKENS',
  'GROQ LLAMA-3.3-70B SPEED LAYER',
  'WCAG 2.1 LEVEL AA CONTRAST RADAR',
  'CLAUDE DESKTOP & CURSOR MCP BRIDGE',
  'MONGODB 7-DAY CACHED AUDITS',
  'AST REACT + TAILWIND SYNTHESIS',
  '120FPS LENIS KINETIC SCROLL',
];

export function EnterpriseMatrix() {
  return (
    <section className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] overflow-hidden">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Top Telemetry Header */}
      <div className="py-3 px-6 text-center border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808]">
        <span className="font-mono text-[10px] tracking-widest uppercase text-[#78716C] dark:text-[#A8A29E]">
          TRUSTED TO AUDIT ARCHITECTURES ACROSS HIGH-CONVERTING ENGINEERING TEAMS
        </span>
      </div>

      {/* Infinite Smooth-Scrolling Logo Marquee */}
      <div className="relative w-full py-4 overflow-hidden flex items-center group">
        {/* Left & Right gradient fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-[#0C0C0C] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-[#0C0C0C] to-transparent z-10" />

        <div className="flex shrink-0 animate-marquee whitespace-nowrap gap-4 group-hover:[animation-play-state:paused]">
          {[...ENTERPRISE_LOGOS, ...ENTERPRISE_LOGOS, ...ENTERPRISE_LOGOS].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center h-14 px-7 rounded-lg border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5]/60 dark:bg-[#080808] hover:bg-[#E53E00]/5 hover:border-[#E53E00]/30 hover:text-[#E53E00] dark:hover:text-[#E53E00] text-[#78716C] dark:text-[#A8A29E] transition-all duration-200 cursor-default font-mono text-sm font-semibold select-none transform hover:scale-105"
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity-Aware Marquee Ribbon */}
      <div className="border-t border-[#E6E4DD] dark:border-[#1F1F1F] py-2.5 overflow-hidden bg-[#FAF9F5]/80 dark:bg-[#070707] flex items-center">
        <div className="flex shrink-0 animate-marquee whitespace-nowrap gap-10 text-[10px] font-mono text-[#78716C] dark:text-[#A8A29E]">
          {[...MARQUEE_TECH, ...MARQUEE_TECH, ...MARQUEE_TECH].map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E53E00]" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
      `}</style>
    </section>
  );
}
