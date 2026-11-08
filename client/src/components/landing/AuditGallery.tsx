'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MousePointer2, ShieldCheck, Zap } from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';
import { AnimatedCounter } from '../AnimatedCounter';

interface AuditItem {
  company: string;
  slug: string;
  title: string;
  image: string;
  grade: string;
  score: number;
  metric1: string;
  metric2: string;
  summary: string;
  personaAvatar: string;
}

const PRELOADED_AUDITS: AuditItem[] = [
  {
    company: 'Stripe',
    slug: 'stripe-checkout-v4',
    title: 'Stripe Checkout — Global Multi-Currency Funnel',
    image: '/images/sites/stripe.png',
    grade: 'A',
    score: 92,
    metric1: '92/100 Usability',
    metric2: '2 Patches Ready',
    summary: 'Audited ApplePay friction, missing active states, and mobile touch targets.',
    personaAvatar: '/images/avatars/maya.jpg',
  },
  {
    company: 'Notion',
    slug: 'notion-pricing-2024',
    title: 'Notion Pricing & Feature Comparison Matrix',
    image: '/images/sites/notion.png',
    grade: 'B+',
    score: 86,
    metric1: '86/100 Usability',
    metric2: '3 Patches Ready',
    summary: 'Resolved annual billing toggle contrast and keyboard focus outline traps.',
    personaAvatar: '/images/avatars/darius.jpg',
  },
  {
    company: 'Shopify',
    slug: 'shopify-admin-storefront',
    title: 'Shopify Merchant Onboarding & Trial Funnel',
    image: '/images/sites/shopify.png',
    grade: 'A-',
    score: 89,
    metric1: '89/100 Usability',
    metric2: '2 Patches Ready',
    summary: 'Fixed store name input validation lag and ARIA screen reader hints.',
    personaAvatar: '/images/avatars/sandra.jpg',
  },
];

export function AuditGallery() {
  return (
    <section id="audits" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Section Header with Spacious py-28 md:py-36 */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="py-28 md:py-36 px-6 md:px-12 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
      >
        <div>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
            PRE-LOADED SANDBOX AUDITS
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08]">
            Explore audited architectures with 0 token cost
          </h2>
        </div>
        <span className="font-mono text-xs text-[#78716C] border border-[#E6E4DD] dark:border-[#262626] px-3.5 py-2 rounded-md bg-[#FAF9F5] dark:bg-[#141414] whitespace-nowrap shadow-sm">
          CACHED IN MONGODB • INSTANT 120FPS REPLAY
        </span>
      </motion.div>

      {/* 3 Large De-congested Architectural Cards with Gap & Hover Lift */}
      <div className="p-6 md:p-12 bg-[#FAF9F5] dark:bg-[#050505]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {PRELOADED_AUDITS.map((item, idx) => (
            <motion.div
              key={item.slug}
              initial={{ opacity: 0, y: 48, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="flex flex-col justify-between rounded-xl border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] shadow-lg hover:shadow-2xl hover:border-[#E53E00]/40 transition-all duration-300 p-8 lg:p-10 group"
            >
              <div>
                {/* Screenshot with Live Hover Zoom & Gliding Cursor */}
                <div className="relative aspect-[16/10] border border-[#E6E4DD] dark:border-[#1F1F1F] rounded-lg overflow-hidden bg-[#FAF9F5] dark:bg-[#141414] mb-7 shadow-sm">
                  <Image
                    src={item.image}
                    alt={`${item.company} Homepage Audit Screenshot`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />

                  {/* Miniature Animated AI Persona Cursor (revealed on hover) */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-1/3 left-1/4 transform group-hover:translate-x-12 group-hover:translate-y-8 transition-transform duration-700 ease-out flex items-center gap-1.5 z-20">
                      <MousePointer2 className="w-4 h-4 text-[#E53E00] fill-[#E53E00] -rotate-45 drop-shadow-md" />
                      <div className="flex items-center gap-1 bg-[#111] dark:bg-white text-white dark:text-[#111] px-1.5 py-0.5 rounded-sm text-[9px] font-bold font-mono shadow-md">
                        <span>Inspecting UX</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Score Pill Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-[#0C0C0C]/95 backdrop-blur-md border border-[#E6E4DD] dark:border-[#1F1F1F] px-3 py-1 rounded-md text-xs font-mono font-bold text-[#E53E00] shadow-sm flex items-center gap-1.5">
                    <span>Score:</span>
                    <AnimatedCounter value={item.score} />
                    <span>/ 100</span>
                  </div>
                </div>

                {/* Company Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#E53E00] uppercase tracking-wide">
                    {item.company}
                  </span>
                  <span className="text-xs font-mono text-[#78716C] font-semibold">
                    Grade: {item.grade}
                  </span>
                </div>

                {/* Bold Title */}
                <h3 className="text-xl font-bold text-[#111111] dark:text-white leading-snug mb-3">
                  {item.title}
                </h3>

                {/* Punchy 2-Line Summary */}
                <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-6 line-clamp-2">
                  {item.summary}
                </p>

                {/* Clean Metric Pills */}
                <div className="flex items-center gap-2 mb-8">
                  <span className="border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-2.5 py-1 rounded text-[11px] font-mono text-[#111111] dark:text-white">
                    {item.metric1}
                  </span>
                  <span className="border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] px-2.5 py-1 rounded text-[11px] font-mono text-[#E53E00] font-semibold">
                    {item.metric2}
                  </span>
                </div>
              </div>

              {/* Tactile Action Button */}
              <Link href={`/audit/${item.slug}`}>
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-between border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] hover:border-[#111111] dark:hover:border-white px-5 py-3 rounded-lg text-xs font-semibold text-[#111111] dark:text-white transition shadow-sm group/btn"
                >
                  <span>View Full Audit Report</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
