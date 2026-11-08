'use client';

import React from 'react';
import { ShieldCheck, Target, Eye, Award } from 'lucide-react';
import { Scores } from '@/lib/types';
import { CrosshairMarker } from './CrosshairMarker';

interface ScoreCardProps {
  scores: Scores;
}

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] divide-y sm:divide-y-0 sm:divide-x divide-[#E6E4DD] dark:divide-[#1F1F1F] shadow-sm">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Overall Grade */}
      <div className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase text-[#78716C] dark:text-[#A8A29E]">
            Executive Grade
          </span>
          <Award className="w-4 h-4 text-[#78716C]" />
        </div>
        <div className="my-3 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-[#E53E00]">
            {scores.overallGrade}
          </span>
          <span className="text-xs text-[#78716C]">
            Consensus
          </span>
        </div>
        <p className="text-[11px] text-[#78716C]">
          Synthesized from 3 persona journeys across 1,000+ viewport checkpoints.
        </p>
      </div>

      {/* Usability Score */}
      <div className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase text-[#78716C] dark:text-[#A8A29E]">
            Usability Score
          </span>
          <Eye className="w-4 h-4 text-[#78716C]" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#111111] dark:text-white">
              {scores.usability}
            </span>
            <span className="text-xs text-[#78716C]">/ 100</span>
          </div>
          <div className="w-full bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E6E4DD] dark:border-[#262626] h-1.5 mt-2">
            <div
              className="bg-[#E53E00] h-full"
              style={{ width: `${scores.usability}%` }}
            />
          </div>
        </div>
        <span className="text-[11px] text-[#78716C]">
          Navigation clarity & cognitive load
        </span>
      </div>

      {/* Accessibility Score */}
      <div className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase text-[#78716C] dark:text-[#A8A29E]">
            WCAG Accessibility
          </span>
          <ShieldCheck className="w-4 h-4 text-[#78716C]" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#111111] dark:text-white">
              {scores.accessibility}
            </span>
            <span className="text-xs text-[#78716C]">/ 100</span>
          </div>
          <div className="w-full bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E6E4DD] dark:border-[#262626] h-1.5 mt-2">
            <div
              className="bg-[#E53E00] h-full"
              style={{ width: `${scores.accessibility}%` }}
            />
          </div>
        </div>
        <span className="text-[11px] text-[#78716C]">
          WCAG 2.1 AA contrast & screen-reader tags
        </span>
      </div>

      {/* Conversion Readiness */}
      <div className="p-5 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase text-[#78716C] dark:text-[#A8A29E]">
            Conversion Readiness
          </span>
          <Target className="w-4 h-4 text-[#78716C]" />
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#111111] dark:text-white">
              {scores.conversionReadiness}
            </span>
            <span className="text-xs text-[#78716C]">/ 100</span>
          </div>
          <div className="w-full bg-[#FAF9F5] dark:bg-[#1A1A1A] border border-[#E6E4DD] dark:border-[#262626] h-1.5 mt-2">
            <div
              className="bg-[#E53E00] h-full"
              style={{ width: `${scores.conversionReadiness}%` }}
            />
          </div>
        </div>
        <span className="text-[11px] text-[#78716C]">
          Checkout friction & hesitation risk
        </span>
      </div>
    </div>
  );
}
