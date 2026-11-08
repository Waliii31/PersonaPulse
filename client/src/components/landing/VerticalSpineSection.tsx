'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { CrosshairMarker } from '../CrosshairMarker';

const SPINE_STEPS = [
  {
    title: 'Extract Compact DOM',
    subtext: 'Playwright strips scripts and CSS to isolate interactive nodes under 1,000 tokens.',
    badge: 'STAGE 01 • PLAYWRIGHT',
    image: '/images/sites/stripe.png',
    hotspot: { top: '28%', left: '22%', width: '38%', height: '18%', label: 'COMPACT DOM NODE' },
    thoughtTitle: 'Playwright MCP Worker',
    thought: 'Sanitized 42,000 raw DOM characters down to 680 tokens in 142ms.',
  },
  {
    title: 'Spawn 3 AI Personas',
    subtext: 'Deploy Maya (Mobile), Darius (WCAG), and Sandra (C-Suite) concurrently across the page.',
    badge: 'STAGE 02 • MULTI-AGENT',
    image: '/images/funnel-analytics.png',
    hotspot: { top: '35%', left: '30%', width: '40%', height: '22%', label: 'PERSONA SWARM ACTIVE' },
    thoughtTitle: 'Swarm Coordinator',
    thought: '3 independent cognitive heuristics dispatched across iPhone and Desktop viewports.',
  },
  {
    title: 'Map Click Hesitation',
    subtext: 'Pinpoint mouse dwell latency, rage-taps, and abandonment coordinates.',
    badge: 'STAGE 03 • TELEMETRY',
    image: '/images/heatmap-preview.png',
    hotspot: { top: '40%', left: '25%', width: '42%', height: '20%', label: 'FRICTION DETECTED (1,420ms)' },
    thoughtTitle: 'Maya Chen • Impatient Buyer',
    thought: 'Clicked payment CTA 3 times. The tactile state was obscured by an unstyled container.',
  },
  {
    title: 'Verify WCAG 2.1 AA',
    subtext: 'Audit foreground/background contrast ratios against the 4.5:1 minimum and verify ARIA.',
    badge: 'STAGE 04 • COMPLIANCE',
    image: '/images/sites/notion.png',
    hotspot: { top: '30%', left: '20%', width: '45%', height: '20%', label: 'CONTRAST FAIL 2.4:1' },
    thoughtTitle: 'Darius Okafor • Accessibility Lead',
    thought: 'Credit card input field fails WCAG AA minimum. Screen-reader landmark was missing.',
  },
  {
    title: 'Export React Patch',
    subtext: 'Synthesize verified React + Tailwind CSS code patches with 1-click clipboard copy.',
    badge: 'STAGE 05 • REMEDIATION',
    image: '/images/code-diff-preview.png',
    hotspot: { top: '25%', left: '15%', width: '55%', height: '28%', label: 'REACT DIFF SYNTHESIZED' },
    thoughtTitle: 'Automated Remediation Engine',
    thought: 'Clean AST patch ready for merge: accessible 7.4:1 AAA contrast with native focus rings.',
  },
];

export function VerticalSpineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-cycle every 3.5 seconds with animated progress
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % SPINE_STEPS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const float1 = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const float2 = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  const currentStepData = SPINE_STEPS[activeStep];

  return (
    <section
      id="use-cases"
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]"
    >
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E4DD] dark:divide-[#1F1F1F]">
        {/* Left Column: Vertical Spine (5 cols) with Spacious py-28 md:py-36 */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 py-28 md:py-36 px-8 sm:px-12 flex flex-col justify-between bg-white dark:bg-[#0C0C0C]"
        >
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
              THE WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-10">
              From friction <br className="hidden sm:block" />
              to conversion
            </h2>

            {/* Vertical Spine Nodes - Mathematically Centered Alignment */}
            <div className="relative">
              {/* Perfectly Centered Straight Vertical Line */}
              {/* The node container is w-8 (32px), so its horizontal center is at left-4 (16px). */}
              {/* -translate-x-1/2 centers the 1px line precisely on the 16.0px coordinate through all nodes. */}
              <div className="absolute top-3.5 bottom-3.5 left-4 -translate-x-1/2 w-[1px] bg-[#E6E4DD] dark:bg-[#262626]" />

              <div className="space-y-6">
                {SPINE_STEPS.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className="relative flex items-start gap-4 cursor-pointer group"
                    >
                      {/* Square Node Marker Container (w-8 flex justify-center) */}
                      <div className="relative w-8 shrink-0 flex items-center justify-center pt-1 z-10">
                        <div
                          className={`w-3.5 h-3.5 border transition-all ${
                            isActive
                              ? 'bg-[#E53E00] border-[#E53E00] shadow-sm scale-110 ring-4 ring-[#E53E00]/15'
                              : 'bg-white dark:bg-[#0C0C0C] border-[#A8A29E] dark:border-[#525252] group-hover:border-[#111111] dark:group-hover:border-white'
                          }`}
                        />
                      </div>

                      {/* Step Text & Details */}
                      <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[#E53E00] font-semibold">
                            0{idx + 1}.
                          </span>
                          <h4
                            className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                              isActive
                                ? 'text-[#111111] dark:text-white'
                                : 'text-[#78716C] dark:text-[#737373] group-hover:text-[#111111] dark:group-hover:text-white'
                            }`}
                          >
                            {step.title}
                          </h4>
                        </div>

                        {isActive && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm text-[#57534E] dark:text-[#A8A29E] leading-relaxed line-clamp-2">
                              {step.subtext}
                            </p>

                            {/* Animated Progress Bar */}
                            <div className="w-full h-1 bg-[#E6E4DD] dark:bg-[#262626] rounded-full overflow-hidden">
                              <motion.div
                                key={activeStep}
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 3.5, ease: 'linear' }}
                                className="h-full bg-[#E53E00]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-8 mt-10 border-t border-[#E6E4DD] dark:border-[#1F1F1F]">
            <span className="font-mono text-xs text-[#78716C]">
              Zero full-page HTML sent to LLMs • Stripped token budget &lt; 1,000 tokens
            </span>
          </div>
        </motion.div>

        {/* Right Column: Visual Showcase (7 cols) with Parallax Cards */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 py-24 md:py-36 px-6 sm:px-12 flex items-center justify-center bg-[#FAF9F5] dark:bg-[#080808]"
        >
          <div className="relative w-full max-w-xl border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] shadow-2xl p-6 sm:p-8 rounded-xl">
            <CrosshairMarker position="tl" />
            <CrosshairMarker position="tr" />
            <CrosshairMarker position="bl" />
            <CrosshairMarker position="br" />

            {/* Stage Badge */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
              <span className="font-mono text-[10px] font-bold text-[#E53E00] uppercase tracking-wider">
                {currentStepData.badge}
              </span>
              <span className="font-mono text-[10px] text-[#78716C]">
                STEP {activeStep + 1} OF {SPINE_STEPS.length}
              </span>
            </div>

            {/* Live Audit Frame with Smooth Crossfade */}
            <div className="relative w-full aspect-[16/11] border border-[#E6E4DD] dark:border-[#1F1F1F] rounded-lg overflow-hidden bg-[#FAF9F5] dark:bg-[#141414] mb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={currentStepData.image}
                    alt={currentStepData.title}
                    fill
                    className="object-cover object-top opacity-90"
                    sizes="(max-width: 1024px) 100vw, 500px"
                  />

                  {/* Dynamic Hotspot Box */}
                  <div
                    className="absolute border-2 border-dashed border-[#E53E00] bg-[#E53E00]/15 flex items-start justify-end p-1 transition-all duration-300"
                    style={{
                      top: currentStepData.hotspot.top,
                      left: currentStepData.hotspot.left,
                      width: currentStepData.hotspot.width,
                      height: currentStepData.hotspot.height,
                    }}
                  >
                    <span className="font-mono text-[9px] bg-[#E53E00] text-white px-1.5 py-0.5 font-bold">
                      {currentStepData.hotspot.label}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Overlaid Critique Bubbles with Parallax */}
            <div className="space-y-3">
              <motion.div
                style={{ y: float1 }}
                className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-4 rounded-lg flex items-start gap-3 shadow-md"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#E6E4DD] dark:border-[#262626]">
                  <Image src="/images/avatars/maya.jpg" alt="Agent Avatar" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111] dark:text-white">
                      {currentStepData.thoughtTitle}
                    </span>
                    <span className="font-mono text-[10px] text-[#E53E00] font-semibold">
                      Live Trace
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mt-1 leading-relaxed">
                    &quot;{currentStepData.thought}&quot;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
