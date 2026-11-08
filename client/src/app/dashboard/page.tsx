'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/authContext';
import { CustomPersonaModal } from '@/components/CustomPersonaModal';
import { CrosshairMarker } from '@/components/CrosshairMarker';
import {
  Bot,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  ExternalLink,
  Lock,
  Target,
  ArrowLeft,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading, openAuthModal, demoLogin } = useAuth();
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F5] dark:bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 border-2 border-[#E53E00] border-t-transparent animate-spin rounded-full" />
          <p className="text-xs font-mono text-[#78716C]">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] flex items-center justify-center py-20 px-4">
        <div className="relative max-w-lg w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 sm:p-10 text-center shadow-xl">
          <CrosshairMarker position="tl" />
          <CrosshairMarker position="tr" />
          <CrosshairMarker position="bl" />
          <CrosshairMarker position="br" />

          <div className="w-12 h-12 bg-[#FFF5F0] dark:bg-[#1A100C] border border-[#E53E00]/30 text-[#E53E00] flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00] block mb-1">
            WORKSPACE ACCESS
          </span>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white mb-2">Personal Engineering Workspace</h1>
          <p className="text-xs text-[#57534E] dark:text-[#A8A29E] mb-6 leading-relaxed">
            Sign in to track your saved website audits, manage custom AI persona swarms, and access your daily live scanning quota.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => demoLogin()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E53E00] hover:bg-[#CC3500] px-5 py-2.5 text-xs font-semibold text-white transition shadow-sm"
            >
              <Zap className="h-4 w-4" />
              1-Click Recruiter Demo Login
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] px-5 py-2.5 text-xs font-semibold text-[#111111] dark:text-white transition"
            >
              Sign In with Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scansRemaining = user.scansRemaining ?? 3;
  const maxScans = 5;
  const quotaPercent = Math.min(100, Math.round((scansRemaining / maxScans) * 100));

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] py-10 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-6 sm:p-8 shadow-sm">
          <CrosshairMarker position="tl" />
          <CrosshairMarker position="tr" />
          <CrosshairMarker position="bl" />
          <CrosshairMarker position="br" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="h-14 w-14 flex items-center justify-center text-xl font-bold text-white bg-[#E53E00] shadow-sm shrink-0"
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#E53E00] block mb-0.5">
                  MY WORKSPACE
                </span>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white">
                    Welcome back, {user.name}
                  </h1>
                  <span className="border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] px-2 py-0.5 text-[10px] font-mono font-bold text-[#E53E00] uppercase">
                    {user.role || 'Pro Member'}
                  </span>
                </div>
                <p className="text-xs text-[#78716C] mt-1 font-mono">
                  {user.email} &bull; Autonomous Multi-Agent Testing Deck
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/#hero"
                className="inline-flex items-center gap-2 bg-[#E53E00] hover:bg-[#CC3500] px-4 py-2.5 text-xs font-semibold text-white transition shadow-sm"
              >
                Scan New Target &gt;
              </Link>
            </div>
          </div>

          {/* Quota Ribbon */}
          <div className="mt-6 pt-6 border-t border-[#E6E4DD] dark:border-[#1F1F1F] grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#78716C] uppercase">Daily Live Scans Quota</span>
                <span className="text-xs font-mono font-bold text-[#E53E00]">
                  {scansRemaining} / {maxScans} Available
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E6E4DD] dark:bg-[#262626]">
                <div
                  className="h-full bg-[#E53E00] transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] text-[#78716C] font-mono flex items-center gap-1">
                <Clock className="h-3 w-3" /> Resets every 24 hours
              </p>
            </div>

            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-4">
              <span className="text-xs font-mono font-bold text-[#78716C] uppercase block mb-1">
                Zero-Token Sandbox Access
              </span>
              <p className="text-sm font-bold text-[#111111] dark:text-white">Unlimited Instant Replays</p>
              <p className="mt-1 text-[10px] text-[#E53E00] font-mono">
                0 API tokens billed for pre-indexed company profiles
              </p>
            </div>

            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-4">
              <span className="text-xs font-mono font-bold text-[#78716C] uppercase block mb-1">
                Active Persona Fleet
              </span>
              <p className="text-sm font-bold text-[#111111] dark:text-white">
                {user.customPersonas?.length || 0} Custom + 3 Core Personas
              </p>
              <p className="mt-1 text-[10px] text-[#78716C] font-mono">
                Ready to dispatch on any live URL
              </p>
            </div>
          </div>
        </div>

        {/* Custom Persona Builder Deck */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E53E00]">
                PERSONA MANAGEMENT
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white mt-0.5">
                Synthetic Persona Fleet
              </h2>
            </div>

            <button
              onClick={() => setIsPersonaModalOpen(true)}
              className="inline-flex items-center gap-1.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] px-3.5 py-2 text-xs font-semibold text-[#111111] dark:text-white transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Build Custom Persona
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Maya Chen */}
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E6E4DD] dark:border-[#262626]">
                    <Image src="/images/avatars/maya.jpg" alt="Maya Chen" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">Maya Chen</h3>
                    <p className="text-xs text-[#E53E00] font-mono">Impatient Mobile Buyer</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
                  <p>&bull; Viewport: iPhone 16 Pro (393 × 852)</p>
                  <p>&bull; Trigger: Cart drop-off, form friction</p>
                </div>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#78716C] border-t border-[#E6E4DD] dark:border-[#1F1F1F] pt-2">
                CORE FLEET AGENT
              </span>
            </div>

            {/* Darius Okafor */}
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E6E4DD] dark:border-[#262626]">
                    <Image src="/images/avatars/darius.jpg" alt="Darius Okafor" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">Darius Okafor</h3>
                    <p className="text-xs text-[#E53E00] font-mono">WCAG Accessibility Auditor</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
                  <p>&bull; Viewport: Desktop Screen Reader</p>
                  <p>&bull; Trigger: Contrast &lt; 4.5:1, missing ARIA</p>
                </div>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#78716C] border-t border-[#E6E4DD] dark:border-[#1F1F1F] pt-2">
                CORE FLEET AGENT
              </span>
            </div>

            {/* Sandra Wu */}
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E6E4DD] dark:border-[#262626]">
                    <Image src="/images/avatars/sandra.jpg" alt="Sandra Wu" fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">Sandra Wu</h3>
                    <p className="text-xs text-[#E53E00] font-mono">Enterprise Executive</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
                  <p>&bull; Viewport: 1440x900 Laptop</p>
                  <p>&bull; Trigger: Value proposition clarity, CTA</p>
                </div>
              </div>
              <span className="mt-4 text-[10px] font-mono text-[#78716C] border-t border-[#E6E4DD] dark:border-[#1F1F1F] pt-2">
                CORE FLEET AGENT
              </span>
            </div>

            {/* Custom User-Defined Personas */}
            {(user.customPersonas || []).map((cp, idx) => (
              <div
                key={idx}
                className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: cp.color || '#E53E00' }}
                    >
                      {cp.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111111] dark:text-white">{cp.name}</h3>
                      <p className="text-xs text-[#E53E00] font-mono">{cp.role}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
                    <p>&bull; Viewport: {cp.viewportSize}</p>
                    <p>&bull; Focus: {cp.focusArea}</p>
                  </div>
                </div>
                <span className="mt-4 text-[10px] font-mono text-[#E53E00] border-t border-[#E6E4DD] dark:border-[#1F1F1F] pt-2">
                  CUSTOM USER PERSONA
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Audits Section */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E53E00]">
              REPORTS & TELEMETRY
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white mt-0.5">
              Saved Audits & Reports
            </h2>
          </div>

          <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] divide-y divide-[#E6E4DD] dark:divide-[#1F1F1F]">
            {user.savedAudits && user.savedAudits.length > 0 ? (
              user.savedAudits.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF9F5] dark:hover:bg-[#141414] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#111111] dark:text-white">
                        {item.title}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#E53E00]">
                        Grade {item.overallGrade}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-[#78716C]">{item.url}</p>
                  </div>

                  <Link
                    href={`/audit/${item.slug}`}
                    className="inline-flex items-center gap-1.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#111] px-3.5 py-1.5 text-xs font-semibold text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition"
                  >
                    <span>Inspect Audit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-[#78716C]">
                No audits saved to your workspace yet. Explore the sandbox audits or run a live scan!
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomPersonaModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />
    </div>
  );
}
