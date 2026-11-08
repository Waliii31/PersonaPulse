'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, ArrowRight, ShieldCheck, Activity, Target } from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';
import { useAuth } from '@/lib/authContext';
import { AnimatedCounter } from '../AnimatedCounter';

interface PersonaItem {
  name: string;
  role: string;
  avatar: string;
  device: string;
  deviceIcon: any;
  metric1Val: number;
  metric1Prefix?: string;
  metric1Suffix: string;
  metric1Label: string;
  metric2Val: number;
  metric2Suffix: string;
  metric2Label: string;
  statBadge: string;
  quote: string;
}

const PERSONAS: PersonaItem[] = [
  {
    name: 'Maya Chen',
    role: 'Impatient Mobile Buyer',
    avatar: '/images/avatars/maya.jpg',
    device: 'iPhone 16 Pro (393 × 852)',
    deviceIcon: Smartphone,
    metric1Val: 1200,
    metric1Suffix: 'ms',
    metric1Label: 'Max Latency Tolerance',
    metric2Val: 98,
    metric2Suffix: '%',
    metric2Label: 'Thumb Reach Accuracy',
    statBadge: 'High Drop-Off Sensitivity',
    quote:
      'If checkout takes more than two thumb taps or hides total shipping fees until the final screen, I bounce immediately.',
  },
  {
    name: 'Darius Okafor',
    role: 'WCAG Accessibility Auditor',
    avatar: '/images/avatars/darius.jpg',
    device: 'Desktop Screen Reader (1440 × 900)',
    deviceIcon: Monitor,
    metric1Val: 4.5,
    metric1Suffix: ':1',
    metric1Label: 'Strict Contrast Ratio',
    metric2Val: 100,
    metric2Suffix: '%',
    metric2Label: 'ARIA Trap Detection',
    statBadge: 'W3C Level AA Compliant',
    quote:
      'Low-contrast gray-on-white text and unlabelled SVG icons lock out millions of users. I audit against W3C Level AA standards.',
  },
  {
    name: 'Sandra Wu',
    role: 'Enterprise Executive & Buyer',
    avatar: '/images/avatars/sandra.jpg',
    device: 'MacBook Pro 16" (1728 × 1117)',
    deviceIcon: Monitor,
    metric1Val: 30,
    metric1Suffix: 's',
    metric1Label: 'Procurement Decision SLA',
    metric2Val: 100,
    metric2Suffix: '%',
    metric2Label: 'SOC2 / SLA Verification',
    statBadge: 'Executive Conversion Focus',
    quote:
      'I need to verify enterprise security certifications and tier pricing in under 30 seconds before routing to procurement.',
  },
];

export function PersonaFleet() {
  const { openAuthModal } = useAuth();

  return (
    <section id="fleet" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Header with generous breathing space */}
      <motion.div
        initial={{ opacity: 0, y: 36, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="py-24 md:py-28 px-6 md:px-12 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C]"
      >
        <div className="max-w-3xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
            05 // THE SYNTHETIC FLEET
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-4">
            Meet the autonomous personas navigating your product
          </h2>
          <p className="text-base sm:text-lg text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
            Each agent simulates distinct human psychologies, device form factors, and cognitive expectations. Zero generic synthetic output.
          </p>
        </div>
      </motion.div>

      {/* 3 Airy Editorial Portrait Cards with Proper Gap & Hover Lift */}
      <div className="py-20 md:py-28 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {PERSONAS.map((persona, idx) => {
            const DeviceIcon = persona.deviceIcon;

            return (
              <motion.div
                key={persona.name}
                initial={{ opacity: 0, y: 48, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, transition: { duration: 0.25, ease: 'easeOut' } }}
                className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 lg:p-9 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#E53E00]/60 dark:hover:border-[#E53E00]/60 transition-all duration-300 group"
              >
                <CrosshairMarker position="tl" />
                <CrosshairMarker position="tr" />
                <CrosshairMarker position="bl" />
                <CrosshairMarker position="br" />

                <div>
                  {/* Top Status Badge */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] px-2.5 py-1 border border-[#E53E00]/20">
                      {persona.statBadge}
                    </span>
                    <span className="font-mono text-[11px] text-[#78716C]">
                      AGENT #{idx + 1}
                    </span>
                  </div>

                  {/* Large Portrait Photography */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-[#E6E4DD] dark:border-[#262626] shadow-sm group-hover:border-[#E53E00] transition-colors">
                      <Image
                        src={persona.avatar}
                        alt={persona.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#111111] dark:text-white">
                        {persona.name}
                      </h3>
                      <p className="font-mono text-xs text-[#E53E00] font-semibold">
                        {persona.role}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#78716C] mt-1 font-mono">
                        <DeviceIcon className="w-3.5 h-3.5" />
                        <span>{persona.device}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Animated Quantitative Telemetry Counters */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] p-3">
                      <div className="text-xl font-bold font-mono text-[#111111] dark:text-white flex items-baseline">
                        <AnimatedCounter
                          target={persona.metric1Val}
                          decimals={persona.metric1Val % 1 !== 0 ? 1 : 0}
                          duration={1.6}
                        />
                        <span className="text-xs text-[#E53E00] font-bold ml-0.5">
                          {persona.metric1Suffix}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#78716C] uppercase block mt-0.5">
                        {persona.metric1Label}
                      </span>
                    </div>

                    <div className="border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] p-3">
                      <div className="text-xl font-bold font-mono text-[#111111] dark:text-white flex items-baseline">
                        <AnimatedCounter
                          target={persona.metric2Val}
                          duration={1.6}
                        />
                        <span className="text-xs text-[#E53E00] font-bold ml-0.5">
                          {persona.metric2Suffix}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#78716C] uppercase block mt-0.5">
                        {persona.metric2Label}
                      </span>
                    </div>
                  </div>

                  {/* Punchy Critique Quote */}
                  <p className="text-xs sm:text-sm italic text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-8 bg-[#FAF9F5] dark:bg-[#111111] p-3.5 border-l-2 border-[#E53E00]">
                    "{persona.quote}"
                  </p>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ y: -2, scale: 1.015 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openAuthModal('register')}
                  className="w-full inline-flex items-center justify-between border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] hover:border-[#111111] dark:hover:border-white px-5 py-3.5 text-xs font-semibold text-[#111111] dark:text-white transition shadow-sm group/btn"
                >
                  <span>Simulate with {persona.name.split(' ')[0]}</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
