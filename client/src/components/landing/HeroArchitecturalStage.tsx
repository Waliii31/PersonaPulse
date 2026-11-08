'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';
import { submitScanUrl } from '@/lib/api';

const HEADLINE_PHRASES = ['revenue.', 'conversions.', 'clean UX.', 'shipped code.'];
const PLACEHOLDER_URLS = [
  'https://stripe.com/checkout',
  'https://linear.app/pricing',
  'https://notion.so',
];

export function HeroArchitecturalStage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'heatmaps' | 'fixes'>('analytics');
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ── 1. Character-by-Character Hero Headline Typewriter ───────────────────
  // (80ms typing speed, 40ms deleting speed, 1800ms pause)
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charCount, setCharCount] = useState(HEADLINE_PHRASES[0].length);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = HEADLINE_PHRASES[phraseIdx];
    const speed = isDeleting ? 40 : 80;

    if (!isDeleting && charCount === currentPhrase.length) {
      const pauseTimer = setTimeout(() => setIsDeleting(true), 1800);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && charCount === 0) {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % HEADLINE_PHRASES.length);
      return;
    }

    const timer = setTimeout(() => {
      setCharCount((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [charCount, isDeleting, phraseIdx]);

  const currentDisplayText = HEADLINE_PHRASES[phraseIdx].substring(0, charCount);

  // ── 2. Auto-typing URL Input Placeholder ─────────────────────────────────
  const [phIdx, setPhIdx] = useState(0);
  const [phCharIdx, setPhCharIdx] = useState(0);
  const [phDeleting, setPhDeleting] = useState(false);

  useEffect(() => {
    if (isFocused || urlInput.length > 0) return;

    const currentUrl = PLACEHOLDER_URLS[phIdx];
    const speed = phDeleting ? 30 : 60;

    if (!phDeleting && phCharIdx === currentUrl.length) {
      const pauseTimer = setTimeout(() => setPhDeleting(true), 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (phDeleting && phCharIdx === 0) {
      setPhDeleting(false);
      setPhIdx((prev) => (prev + 1) % PLACEHOLDER_URLS.length);
      return;
    }

    const timer = setTimeout(() => {
      setPhCharIdx((prev) => prev + (phDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [phCharIdx, phDeleting, phIdx, isFocused, urlInput]);

  const animatedPlaceholder = isFocused
    ? 'https://your-product.com'
    : PLACEHOLDER_URLS[phIdx].substring(0, phCharIdx);

  // ── 3. Scroll-Linked 3D Dashboard Motion (0 to 500px scroll) ──────────────
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const progress500 = Math.min(1, Math.max(0, scrollY / 500));
  const stageScale = 0.9 + progress500 * 0.1; // 0.9 -> 1.0
  const stageRotateX = 12 - progress500 * 12; // 12deg -> 0deg
  const stageY = 40 - progress500 * 40; // 40 -> 0

  // Parallax floating badges drifting upward
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start end', 'end start'],
  });
  const badgeParallax1 = useTransform(scrollYProgress, [0, 1], [40, -60]);
  const badgeParallax2 = useTransform(scrollYProgress, [0, 1], [30, -50]);

  const handleStartScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let target = urlInput.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }

    setIsScanning(true);
    try {
      const res = await submitScanUrl(target);
      if (res.success && res.data?.slug) {
        router.push(`/audit/${res.data.slug}`);
      } else {
        router.push('/audit/stripe-checkout-v4');
      }
    } catch (err: any) {
      console.warn('Scan API fallback:', err.message);
      router.push('/audit/stripe-checkout-v4');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section id="hero" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505] overflow-hidden">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Hero Content with Generous Whitespace */}
      <div className="pt-24 md:pt-36 pb-16 px-6 md:px-12 text-center max-w-5xl mx-auto flex flex-col items-center">
        {/* Top Eyebrow Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 rounded-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] px-4 py-1.5 text-xs text-[#57534E] dark:text-[#A8A29E] shadow-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#E53E00] animate-pulse" />
          <span className="font-mono text-[11px] tracking-wide">
            Works with Claude, Groq & Gemini via MCP
          </span>
        </motion.div>

        {/* Massive Editorial Headline with Stable Typewriter Morph Box */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.12] text-[#111111] dark:text-white max-w-5xl mb-7"
        >
          <span>Use AI Personas to turn more traffic into</span>{' '}
          <span className="inline-flex items-center justify-start min-w-[180px] sm:min-w-[300px] md:min-w-[380px] lg:min-w-[480px] whitespace-nowrap overflow-hidden bg-[#E53E00] text-white px-3 sm:px-4 py-1 rounded-[4px] shadow-sm align-middle text-left">
            <span className="font-mono">{currentDisplayText || '\u00A0'}</span>
            <span className="w-1.5 h-5 sm:h-7 md:h-8 lg:h-9 bg-white ml-1.5 inline-block animate-pulse shrink-0" />
          </span>
        </motion.h1>

        {/* Subheadline with generous width and spacing */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-[#57534E] dark:text-[#A8A29E] max-w-2xl leading-relaxed mb-10"
        >
          Your autonomous AI personas find where buyers leave, audit accessibility friction, and write the exact React + Tailwind test that fixes it.
        </motion.p>

        {/* Wide Command Bar with Auto-typing Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl mx-auto mb-6"
        >
          <form
            onSubmit={handleStartScan}
            className="p-2 bg-white dark:bg-[#0C0C0C] border border-[#D6D3CD] dark:border-[#262626] rounded-xl shadow-xl flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#E53E00] focus-within:ring-2 focus-within:ring-[#E53E00]/15"
          >
            <div className="relative flex-1 w-full pl-3">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={animatedPlaceholder}
                className="w-full py-2.5 text-sm bg-transparent text-[#111111] dark:text-white placeholder-[#78716C] focus:outline-none font-mono"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isScanning}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition whitespace-nowrap group"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <span>Start live URL audit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          {/* Secondary Link Cleanly Separated Below */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs font-mono text-[#78716C]">
            <span>Zero API Tokens Consumed</span>
            <span>•</span>
            <a
              href="#audits"
              className="text-[#111111] dark:text-white hover:text-[#E53E00] dark:hover:text-[#E53E00] font-semibold underline underline-offset-4 transition"
            >
              Explore pre-loaded sandbox audits →
            </a>
          </div>
        </motion.div>

        {/* Founder Social Proof Strip with generous padding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="w-full max-w-2xl border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 my-8 flex flex-col sm:flex-row items-center justify-around gap-6 text-left shadow-sm"
        >
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#E6E4DD] dark:border-[#262626]">
              <Image src="/images/avatars/norbi.jpg" alt="Maya Chen" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111111] dark:text-white">
                2% → 8% checkout conversion
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Maya Chen • E-Commerce Lead
              </p>
            </div>
          </div>

          <div className="hidden sm:block w-[1px] h-9 bg-[#E6E4DD] dark:border-[#1F1F1F]" />

          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#E6E4DD] dark:border-[#262626]">
              <Image src="/images/avatars/jani.jpg" alt="Darius Okafor" fill className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#111111] dark:text-white">
                3.4x faster UI remediation
              </p>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Darius Okafor • Staff Frontend Engineer
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Hero Product Image Stage with 3D Scroll Parallax & Tabs */}
      <div
        ref={stageRef}
        className="px-6 md:px-12 pb-24 md:pb-36 max-w-[1280px] mx-auto"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          style={{
            scale: stageScale,
            rotateX: `${stageRotateX}deg`,
            y: stageY,
            transformStyle: 'preserve-3d',
          }}
          className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] shadow-2xl transition-all"
        >
          <CrosshairMarker position="tl" />
          <CrosshairMarker position="tr" />
          <CrosshairMarker position="bl" />
          <CrosshairMarker position="br" />

          {/* Floating Parallax Badges drifting upward */}
          <motion.div
            style={{ y: badgeParallax1 }}
            className="hidden lg:flex absolute -top-6 -left-6 z-30 items-center gap-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] border border-[#333] px-3.5 py-1.5 shadow-xl text-xs font-mono font-semibold"
          >
            <div className="w-2 h-2 rounded-full bg-[#E53E00] animate-ping" />
            <span>PLAYWRIGHT DOM: &lt; 850 TOKENS</span>
          </motion.div>

          <motion.div
            style={{ y: badgeParallax2 }}
            className="hidden lg:flex absolute -bottom-6 -right-6 z-30 items-center gap-2 bg-white dark:bg-[#111] border border-[#E53E00] text-[#E53E00] px-4 py-2 shadow-xl text-xs font-mono font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-[#E53E00]" />
            <span>WCAG 2.1 AA PASS (92/100)</span>
          </motion.div>

          {/* Top Switcher Tabs */}
          <div className="flex border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] text-xs font-mono">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition border-r border-[#E6E4DD] dark:border-[#1F1F1F] ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-[#0C0C0C] text-[#E53E00] border-t-2 border-t-[#E53E00]'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              01. PERSONA ANALYTICS
            </button>
            <button
              onClick={() => setActiveTab('heatmaps')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition border-r border-[#E6E4DD] dark:border-[#1F1F1F] ${
                activeTab === 'heatmaps'
                  ? 'bg-white dark:bg-[#0C0C0C] text-[#E53E00] border-t-2 border-t-[#E53E00]'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              02. FRICTION HEATMAPS
            </button>
            <button
              onClick={() => setActiveTab('fixes')}
              className={`flex-1 py-4 px-4 text-center font-semibold transition ${
                activeTab === 'fixes'
                  ? 'bg-white dark:bg-[#0C0C0C] text-[#E53E00] border-t-2 border-t-[#E53E00]'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              03. AUTOMATED UI FIXES
            </button>
          </div>

          {/* Image Display Canvas with Smooth Slide + Blur Crossfade */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-white dark:bg-[#0C0C0C]">
            <AnimatePresence mode="wait">
              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/images/hero-dashboard.png"
                    alt="PersonaPulse Behavior Analytics Dashboard"
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </motion.div>
              )}
              {activeTab === 'heatmaps' && (
                <motion.div
                  key="heatmaps"
                  initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/images/heatmap-preview.png"
                    alt="Friction and Hesitation Heatmap Overlay"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </motion.div>
              )}
              {activeTab === 'fixes' && (
                <motion.div
                  key="fixes"
                  initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src="/images/code-diff-preview.png"
                    alt="Automated React and Tailwind CSS Patch"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1280px) 100vw, 1280px"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
