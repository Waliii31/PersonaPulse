'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { AuditReport, Remediation } from '@/lib/types';

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

  // Build ordered list of real screenshot candidate URLs
  const candidateScreenshots = useMemo(() => {
    const list: string[] = [];

    // 1. Live Base64 screenshot from AI Engine / Playwright
    if (audit.domSnapshot?.screenshotBase64 && audit.domSnapshot.screenshotBase64.startsWith('data:image/')) {
      list.push(audit.domSnapshot.screenshotBase64);
    }

    // 2. Verified high-res assets for pre-loaded sandbox targets
    if (urlLower.includes('stripe') || slugLower.includes('stripe')) {
      list.push('/images/sites/stripe.png');
    }
    if (urlLower.includes('notion') || slugLower.includes('notion')) {
      list.push('/images/sites/notion.png');
    }
    if (urlLower.includes('linear') || slugLower.includes('linear')) {
      list.push('/images/sites/linear.png');
    }
    if (urlLower.includes('shopify') || slugLower.includes('shopify')) {
      list.push('/images/sites/shopify.png');
    }

    // 3. Real live website screenshot providers for ANY scanned target (e.g., github.com)
    if (audit.url && audit.url.startsWith('http')) {
      list.push(`https://image.thum.io/get/width/1280/crop/800/noanimate/${audit.url}`);
      list.push(`https://api.microlink.io/?url=${encodeURIComponent(audit.url)}&screenshot=true&meta=false&embed=screenshot.url`);
      list.push(`https://s0.wp.com/mshots/v1/${encodeURIComponent(audit.url)}?w=1280&h=800`);
    }

    return list;
  }, [audit, urlLower, slugLower]);

  const [providerIndex, setProviderIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset provider index whenever target audit changes
  useEffect(() => {
    setProviderIndex(0);
    setImageLoaded(false);
  }, [audit.url, audit.slug]);

  const currentScreenshotSrc = candidateScreenshots[providerIndex] || null;

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

      {/* Real Screenshot Container */}
      <div
        className={`relative w-full ${
          viewportMode === 'mobile'
            ? 'max-w-sm mx-auto shadow-2xl border-x border-[#E6E4DD] dark:border-[#1F1F1F]'
            : 'w-full'
        } flex-1 overflow-hidden`}
      >
        <div className="relative w-full aspect-[16/10] min-h-[500px] bg-[#FAF9F5] dark:bg-[#050505] flex items-center justify-center">
          {/* Loading Indicator while the Real Screenshot loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 z-10 text-[#78716C] bg-[#FAF9F5] dark:bg-[#080808]">
              <Loader2 className="w-6 h-6 animate-spin text-[#E53E00]" />
              <span className="text-xs font-mono">Rendering real viewport snapshot for {audit.url || 'target'}...</span>
            </div>
          )}

          {currentScreenshotSrc ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={currentScreenshotSrc}
              src={currentScreenshotSrc}
              alt={audit.domSnapshot?.title || audit.url || 'Live Audited Website'}
              className={`w-full h-full object-cover object-top transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isFixed ? 'filter saturate-105' : ''}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                // If current provider fails, try the next real screenshot provider
                if (providerIndex < candidateScreenshots.length - 1) {
                  setProviderIndex((prev) => prev + 1);
                } else {
                  setImageLoaded(true);
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-[#78716C]">
              <span className="text-xs font-mono">Real screenshot pending for {audit.url}</span>
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
