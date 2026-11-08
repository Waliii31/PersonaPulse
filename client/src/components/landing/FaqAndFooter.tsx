'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';

const FAQS = [
  {
    q: 'How does PersonaPulse keep token consumption near zero?',
    a: 'We never dump raw full-page HTML into LLMs. Playwright extracts only interactive nodes (buttons, inputs, headings) with their spatial bounding boxes, compressing the DOM tree to under 1,000 tokens before dispatching to synthetic agents.',
  },
  {
    q: 'How does the 7-day MongoDB caching work?',
    a: 'When any user submits a URL, our Express gateway checks MongoDB for an identical URL scanned within the last 7 days. If a cache entry exists, the full multi-agent trajectory, heatmaps, and React patches load instantaneously with zero backend AI compute.',
  },
  {
    q: 'Can I use PersonaPulse with Claude Desktop and Cursor via MCP?',
    a: 'Yes. PersonaPulse exposes an MCP (Model Context Protocol) engine endpoint. You can ask Claude or Cursor to inspect your localhost preview URL, run synthetic personas, and apply the generated React diff directly to your local file.',
  },
  {
    q: 'What accessibility standards are verified?',
    a: 'Our accessibility persona tests against W3C WCAG 2.1 Level AA and AAA specifications, measuring color contrast ratios (4.5:1 minimum for normal text, 3:1 for large text), ARIA role completeness, and keyboard tab order focus traps.',
  },
  {
    q: 'What format are the UI fixes provided in?',
    a: 'Every remediation is generated as ready-to-use React components styled with utility Tailwind CSS classes. You can copy the code with 1 click or export the diff into your git repository.',
  },
];

export function FaqAndFooter() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />

      {/* 2-Column Split FAQ with Generous Whitespace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E4DD] dark:divide-[#1F1F1F] border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C]">
        {/* Left Column: Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 py-20 md:py-24 px-8 sm:px-14 flex flex-col justify-between"
        >
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-5">
              Everything you need to know about autonomous testing
            </h2>
            <p className="text-sm sm:text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              Have other questions? Reach out directly through our contact terminal or connect via MCP in Claude Desktop.
            </p>
          </div>
          <div className="pt-8 mt-12 border-t border-[#E6E4DD] dark:border-[#1F1F1F]">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E53E00] hover:underline"
            >
              <span>Contact Wali directly</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        {/* Right Column: Clean 1px Bordered Accordions */}
        <div className="lg:col-span-7 divide-y divide-[#E6E4DD] dark:divide-[#1F1F1F]">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-8 sm:p-10"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-base sm:text-lg font-bold text-[#111111] dark:text-white group-hover:text-[#E53E00] transition-colors pr-6">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#78716C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#E53E00]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed mt-4 pt-4 border-t border-[#FAF9F5] dark:border-[#1A1A1A]">
                    {faq.a}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Massive Structural Footer */}
      <footer className="border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C]">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#E6E4DD] dark:divide-[#1F1F1F]">
          {/* Brand Info */}
          <div className="p-8 sm:p-12 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 bg-[#E53E00] rounded-[3px] flex items-center justify-center text-white font-bold text-xs">
                p
              </div>
              <span className="font-bold text-base tracking-tight text-[#111111] dark:text-white">
                personapulse
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
              Autonomous multi-agent user testing & React UI remediation SaaS.
            </p>
            <div className="font-mono text-[10px] text-[#78716C]">
              HUMBLYTICS × DOVETAIL ARCHITECTURAL GRID
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="p-8 sm:p-12 space-y-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white block">
              Product
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
              <li><a href="#platform" className="hover:text-[#111111] dark:hover:text-white transition">Behavior Simulator</a></li>
              <li><a href="#use-cases" className="hover:text-[#111111] dark:hover:text-white transition">Autonomous Pipeline</a></li>
              <li><a href="#audits" className="hover:text-[#111111] dark:hover:text-white transition">Sandbox Vault</a></li>
              <li><a href="#pricing" className="hover:text-[#111111] dark:hover:text-white transition">Pricing Matrix</a></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="p-8 sm:p-12 space-y-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white block">
              Engine & MCP
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
              <li><span className="hover:text-[#111111] dark:hover:text-white transition cursor-pointer">Playwright Extractor</span></li>
              <li><span className="hover:text-[#111111] dark:hover:text-white transition cursor-pointer">Claude MCP Server</span></li>
              <li><span className="hover:text-[#111111] dark:hover:text-white transition cursor-pointer">Groq Llama-3 Speed Layer</span></li>
              <li><span className="hover:text-[#111111] dark:hover:text-white transition cursor-pointer">WCAG 2.1 Heuristics</span></li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="p-8 sm:p-12 space-y-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111111] dark:text-white block">
              Direct Contact
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#57534E] dark:text-[#A8A29E]">
              <li><a href="#contact" className="hover:text-[#111111] dark:hover:text-white transition">Contact Wali</a></li>
              <li><a href="https://waliii31.xyz" target="_blank" rel="noreferrer" className="hover:text-[#111111] dark:hover:text-white transition flex items-center gap-1">Portfolio (waliii31.xyz) <ArrowUpRight className="w-3 h-3" /></a></li>
              <li><Link href="/audit/stripe-checkout-v4" className="hover:text-[#111111] dark:hover:text-white transition">Stripe Checkout Audit</Link></li>
              <li><Link href="/dashboard" className="text-[#E53E00] hover:underline font-semibold">Recruiter Workspace →</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-8 sm:px-12 py-6 border-t border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <span>© 2026 PersonaPulse Inc. Built by Wali.</span>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>120FPS Lenis Scroll</span>
            <span>Zero Emerald Slop</span>
            <span>Swiss Alabaster #FAF9F5</span>
          </div>
        </div>
      </footer>
    </section>
  );
}
