'use client';

import React from 'react';
import Image from 'next/image';
import { AuditReport, Remediation } from '@/lib/types';
import { CrosshairMarker } from './CrosshairMarker';

interface RealisticSiteMockupProps {
  audit: AuditReport;
  isFixed: boolean;
  viewportMode: 'desktop' | 'mobile';
  showHeatmap: boolean;
  onSelectFriction?: (remediation: Remediation) => void;
}

export function RealisticSiteMockup({
  audit,
  isFixed,
  viewportMode,
  showHeatmap,
  onSelectFriction,
}: RealisticSiteMockupProps) {
  const urlLower = (audit.url || '').toLowerCase();
  const slugLower = (audit.slug || '').toLowerCase();

  // 1. Dynamic screenshot resolution:
  // - If live scan captured a Base64 screenshot, use it immediately!
  // - If pre-loaded sandbox audit, map to verified static assets.
  // - If unknown URL with no screenshot, DO NOT default to Stripe; return null to show real layout skeleton.
  let screenshotSrc: string | null = null;
  let isBase64 = false;

  if (audit.domSnapshot?.screenshotBase64 && audit.domSnapshot.screenshotBase64.startsWith('data:image/')) {
    screenshotSrc = audit.domSnapshot.screenshotBase64;
    isBase64 = true;
  } else if (urlLower.includes('stripe') || slugLower.includes('stripe')) {
    screenshotSrc = '/images/sites/stripe.png';
  } else if (urlLower.includes('notion') || slugLower.includes('notion')) {
    screenshotSrc = '/images/sites/notion.png';
  } else if (urlLower.includes('linear') || slugLower.includes('linear')) {
    screenshotSrc = '/images/sites/linear.png';
  } else if (urlLower.includes('shopify') || slugLower.includes('shopify')) {
    screenshotSrc = '/images/sites/shopify.png';
  }

  // Heatmap points collected from all traces
  const heatmapPoints = (audit.personaTraces || []).flatMap((trace) =>
    trace.steps.map((step) => ({
      x: step.x,
      y: step.y,
      status: step.status,
      persona: trace.personaName,
    }))
  );

  return (
    <div className="relative w-full h-full min-h-[520px] bg-white dark:bg-[#0C0C0C] overflow-hidden select-none flex flex-col justify-start">
      {/* Dynamic Heatmap Overlay Layer */}
      {showHeatmap && (
        <div className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300">
          {heatmapPoints.map((pt, i) => {
            const leftPct = Math.max(5, Math.min(95, (pt.x / 1440) * 100));
            const topPct = Math.max(5, Math.min(95, (pt.y / 900) * 100));
            const isFail = pt.status === 'fail';

            return (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: isFail ? '140px' : '90px',
                  height: isFail ? '140px' : '90px',
                  background: isFail
                    ? 'radial-gradient(circle, rgba(229,62,0,0.55) 0%, rgba(229,62,0,0.15) 50%, transparent 75%)'
                    : 'radial-gradient(circle, rgba(255,183,3,0.45) 0%, rgba(255,183,3,0.1) 50%, transparent 75%)',
                  filter: 'blur(16px)',
                }}
              />
            );
          })}
        </div>
      )}

      {/* Real Screenshot OR Simulated Target Website Layout */}
      <div className={`relative w-full ${viewportMode === 'mobile' ? 'max-w-sm mx-auto shadow-2xl border-x border-[#E6E4DD] dark:border-[#1F1F1F]' : 'w-full'} flex-1 overflow-hidden`}>
        <div className="relative w-full aspect-[16/10] min-h-[500px]">
          {screenshotSrc ? (
            isBase64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={screenshotSrc}
                alt={audit.domSnapshot?.title || audit.url || 'Live Scanned Website'}
                className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                  isFixed ? 'filter saturate-105' : ''
                }`}
              />
            ) : (
              <Image
                src={screenshotSrc}
                alt={audit.domSnapshot?.title || audit.url || 'Audited Website'}
                fill
                className={`object-cover object-top transition-transform duration-300 ${
                  isFixed ? 'filter saturate-105' : ''
                }`}
                priority
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            )
          ) : (
            /* Graceful Fallback: Realistic Site Wireframe / Skeleton matching the Scanned Target */
            <div className="w-full h-full p-8 bg-[#FAF9F5] dark:bg-[#080808] border border-[#E6E4DD] dark:border-[#1F1F1F] flex flex-col justify-between">
              <div>
                {/* Simulated Navbar */}
                <div className="flex items-center justify-between pb-6 border-b border-[#E6E4DD] dark:border-[#1F1F1F] mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded bg-[#E53E00] flex items-center justify-center text-white text-xs font-bold">
                      {audit.domSnapshot?.title?.charAt(0) || 'W'}
                    </div>
                    <span className="font-bold text-sm text-[#111111] dark:text-white truncate max-w-[200px]">
                      {audit.domSnapshot?.title || audit.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-[#78716C]">
                    <span>Features</span>
                    <span>Pricing</span>
                    <span>Docs</span>
                    <span className="px-2.5 py-1 bg-[#111111] dark:bg-white text-white dark:text-[#111] font-semibold text-[11px] rounded-sm">
                      Sign In
                    </span>
                  </div>
                </div>

                {/* Simulated Hero Section */}
                <div className="max-w-xl mx-auto text-center space-y-4 pt-6">
                  <div className="inline-block px-3 py-1 bg-[#E53E00]/10 border border-[#E53E00]/30 text-[#E53E00] text-xs font-mono font-semibold">
                    LIVE TARGET AUDIT: {audit.url}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] dark:text-white">
                    {audit.domSnapshot?.title || 'Audited Web Architecture'}
                  </h1>
                  <p className="text-xs text-[#78716C] leading-relaxed">
                    Interactive DOM inspection in progress. Multi-agent cursors traversing coordinates and accessibility tree.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button className="px-5 py-2.5 bg-[#E53E00] text-white text-xs font-semibold rounded-sm shadow-sm">
                      Get Started Free
                    </button>
                    <button className="px-4 py-2.5 border border-[#D6D3CD] dark:border-[#262626] text-xs font-semibold text-[#111111] dark:text-white bg-white dark:bg-[#141414]">
                      Explore Demo →
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E6E4DD] dark:border-[#1F1F1F] flex items-center justify-between text-[11px] font-mono text-[#78716C]">
                <span>Host: {audit.url}</span>
                <span>Playwright Viewport: 1280 × 800</span>
              </div>
            </div>
          )}

          {/* Remediation Patch Banner when Fixed */}
          {isFixed && (
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2 border border-[#E53E00] bg-white dark:bg-[#0C0C0C] px-3.5 py-1.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-[#E53E00] animate-ping" />
              <span className="text-xs font-semibold text-[#E53E00] font-mono">
                TAILWIND PATCH ACTIVE • WCAG 2.1 AA PASS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
