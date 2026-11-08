'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';
import { useAuth } from '@/lib/authContext';
import { AnimatedCounter } from '../AnimatedCounter';

export function PricingGrid() {
  const { openAuthModal } = useAuth();

  return (
    <section id="pricing" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Section Header with generous breathing room */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 md:py-28 px-6 md:px-12 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] text-center"
      >
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
            06 // TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-4">
            Deploy autonomous multi-agent testing without token bloat
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            Free forever for sandbox audits. Scale to automated CI/CD scans when you're ready to ship bulletproof checkouts.
          </p>
        </div>
      </motion.div>

      {/* 3-Column Spaced Cards with Responsive Grid & Hover Lift Physics */}
      <div className="py-20 md:py-28 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {/* Tier 1: Sandbox Free */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#111111] dark:hover:border-white transition-all duration-300"
          >
            <CrosshairMarker position="tl" />
            <CrosshairMarker position="tr" />
            <CrosshairMarker position="bl" />
            <CrosshairMarker position="br" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                <span className="font-mono text-xs font-bold text-[#78716C] uppercase tracking-wider">
                  Free Sandbox
                </span>
                <span className="font-mono text-[10px] text-[#78716C] bg-[#FAF9F5] dark:bg-[#141414] px-2 py-0.5 border border-[#E6E4DD] dark:border-[#262626]">
                  0 TOKENS
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold font-mono text-[#111111] dark:text-white">$0</span>
                <span className="text-xs text-[#78716C] font-mono">/ forever</span>
              </div>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-8">
                Explore pre-audited enterprise apps (Stripe, Notion, Shopify) with 0 API tokens consumed.
              </p>

              <ul className="space-y-3.5 mb-10">
                {[
                  'Full access to pre-loaded sandbox vault',
                  'Multi-agent cursor replay simulations',
                  'WCAG 2.1 AA accessibility grades',
                  'Copy React + Tailwind remediation diffs',
                  'Community Discord support',
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
                    <Check className="w-4 h-4 text-[#E53E00] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAuthModal('register')}
              className="w-full border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] text-[#111111] dark:text-white font-semibold text-xs sm:text-sm py-3.5 transition shadow-sm"
            >
              Start Free Sandbox
            </motion.button>
          </motion.div>

          {/* Tier 2: Pro Engineer */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="relative border-2 border-[#E53E00] bg-[#FFFBF9] dark:bg-[#120B08] p-8 sm:p-10 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#E53E00]" />
            <CrosshairMarker position="tl" />
            <CrosshairMarker position="tr" />
            <CrosshairMarker position="bl" />
            <CrosshairMarker position="br" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E53E00]/20">
                <span className="font-mono text-xs font-bold text-[#E53E00] uppercase tracking-wider">
                  Pro Engineer
                </span>
                <span className="font-mono text-[10px] font-bold bg-[#E53E00] text-white px-2.5 py-0.5 rounded-sm shadow-sm">
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold font-mono text-[#111111] dark:text-white flex items-baseline">
                  $
                  <AnimatedCounter target={29} duration={1.2} />
                </span>
                <span className="text-xs text-[#78716C] font-mono">/ month</span>
              </div>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-8">
                For indie hackers and frontend engineers shipping revenue-critical checkouts and funnels.
              </p>

              <ul className="space-y-3.5 mb-10">
                {[
                  'Everything in Free Sandbox',
                  '15 Live URL scans per month',
                  'Playwright compact DOM extraction (<1,000 tokens)',
                  '7-Day MongoDB audit cache hits',
                  'Custom Persona Builder (device + cognitive profile)',
                  'Executive printable PDF briefs & share links',
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#111111] dark:text-white font-medium">
                    <Check className="w-4 h-4 text-[#E53E00] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => openAuthModal('register')}
              className="w-full bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-xs sm:text-sm py-3.5 transition shadow-sm"
            >
              Start 14-Day Pro Trial
            </motion.button>
          </motion.div>

          {/* Tier 3: Team CI/CD */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
            className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#111111] dark:hover:border-white transition-all duration-300"
          >
            <CrosshairMarker position="tl" />
            <CrosshairMarker position="tr" />
            <CrosshairMarker position="bl" />
            <CrosshairMarker position="br" />

            <div>
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                <span className="font-mono text-xs font-bold text-[#78716C] uppercase tracking-wider">
                  Team CI/CD
                </span>
                <span className="font-mono text-[10px] text-[#78716C] bg-[#FAF9F5] dark:bg-[#141414] px-2 py-0.5 border border-[#E6E4DD] dark:border-[#262626]">
                  ENTERPRISE
                </span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold font-mono text-[#111111] dark:text-white flex items-baseline">
                  $
                  <AnimatedCounter target={99} duration={1.4} />
                </span>
                <span className="text-xs text-[#78716C] font-mono">/ month</span>
              </div>
              <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-8">
                Automated multi-agent regression tests integrated directly into GitHub Actions and Vercel.
              </p>

              <ul className="space-y-3.5 mb-10">
                {[
                  'Unlimited Live URL scans',
                  'MCP Engine Integration (Claude, Groq, Gemini)',
                  'GitHub Actions PR comment bot',
                  'Automated AST code diff patches in PRs',
                  'Multi-user shared team workspace',
                  'Dedicated SLA & private Slack channel',
                ].map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
                    <Check className="w-4 h-4 text-[#E53E00] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.a
              href="#contact"
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-center border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] text-[#111111] dark:text-white font-semibold text-xs sm:text-sm py-3.5 transition shadow-sm"
            >
              Inquire for Team CI/CD →
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
