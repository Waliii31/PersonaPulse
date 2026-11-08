'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CrosshairMarker } from '../CrosshairMarker';
import { AnimatedCounter } from '../AnimatedCounter';

const PLATFORM_CARDS = [
  {
    num: '01. BEHAVIOR',
    title: 'See what synthetic buyers actually do',
    desc: 'Simulate impatient taps, hesitation latency, and abandonment before real users hit production.',
    image: '/images/persona-replay.png',
    alt: 'Multi-agent cursor behavior replay',
    statPrefix: '',
    statValue: 1420,
    statSuffix: 'ms Drop-off Lag',
  },
  {
    num: '02. JOURNEYS',
    title: 'Pinpoint exact drop-off coordinates',
    desc: 'Correlate spatial coordinates with checkout steps to isolate contrast failures and friction.',
    image: '/images/funnel-analytics.png',
    alt: 'Funnel analytics and drop-off coordinates',
    statPrefix: '+',
    statValue: 24,
    statSuffix: '% Lift Measured',
  },
  {
    num: '03. REMEDIATION',
    title: 'Approve copy-pasteable code patches',
    desc: 'Our engine rewrites broken elements in production React + Tailwind with WCAG 2.1 AA built-in.',
    image: '/images/code-diff-preview.png',
    alt: 'Synthesized React code patch diff',
    statPrefix: '',
    statValue: 100,
    statSuffix: '% Verified Patches',
  },
];

export function PlatformOverview() {
  return (
    <section id="platform" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Header Container with Spacious py-28 md:py-36 */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="py-28 md:py-36 px-6 md:px-12 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C]"
      >
        <div className="max-w-3xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
            THE PLATFORM
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-5">
            See the whole journey. Test the persona. Ship the exact fix.
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            Multi-agent browser simulation, WCAG contrast auditing, and React remediation in one autonomous workflow.
          </p>
        </div>
      </motion.div>

      {/* 3-Column Unified Vertical Cards with Generous Spacing & Hover Lift Physics */}
      <div className="p-6 md:p-12 bg-[#FAF9F5] dark:bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {PLATFORM_CARDS.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="p-8 lg:p-10 flex flex-col justify-between rounded-xl border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] shadow-lg hover:shadow-2xl hover:border-[#E53E00]/40 transition-all duration-300 group"
            >
              <div>
                {/* Card Eyebrow & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E53E00]">
                    {card.num}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-[#78716C] border border-[#E6E4DD] dark:border-[#262626] px-2.5 py-0.5 rounded bg-[#FAF9F5] dark:bg-[#141414]">
                    <AnimatedCounter
                      value={card.statValue}
                      prefix={card.statPrefix}
                      suffix={` ${card.statSuffix}`}
                    />
                  </span>
                </div>

                {/* Bold Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111] dark:text-white mb-3">
                  {card.title}
                </h3>

                {/* Concise 2-line Description */}
                <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6 line-clamp-2">
                  {card.desc}
                </p>
              </div>

              {/* Large High-Res Image Inside Frame */}
              <div className="relative aspect-[16/11] rounded-lg border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] overflow-hidden shadow-sm group-hover:border-[#E53E00]/30 transition-colors">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
