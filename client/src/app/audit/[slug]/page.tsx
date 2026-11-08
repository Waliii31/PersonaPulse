'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Share2,
  Download,
  Printer,
  Zap,
  Bookmark,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { fetchAuditBySlug } from '@/lib/api';
import { AuditReport, Remediation } from '@/lib/types';
import { ReplayCanvas } from '@/components/ReplayCanvas';
import { InspectorPanel } from '@/components/InspectorPanel';
import { ScoreCard } from '@/components/ScoreCard';
import { ExportBriefModal } from '@/components/ExportBriefModal';
import { useAuth } from '@/lib/authContext';
import { CrosshairMarker } from '@/components/CrosshairMarker';

export default function AuditSlugPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IDE Workspace State
  const [currentStep, setCurrentStep] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [selectedRemediation, setSelectedRemediation] = useState<Remediation | null>(null);
  const [isBriefOpen, setIsBriefOpen] = useState(false);

  const [recruiterCopied, setRecruiterCopied] = useState(false);
  const [savedToWorkspace, setSavedToWorkspace] = useState(false);
  const { user, saveAudit, openAuthModal } = useAuth();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchAuditBySlug(slug)
      .then((data) => {
        setAudit(data);
        if (data.remediations && data.remediations.length > 0) {
          setSelectedRemediation(data.remediations[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load audit report');
        setLoading(false);
      });
  }, [slug]);

  const copyRecruiterLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setRecruiterCopied(true);
    setTimeout(() => setRecruiterCopied(false), 2000);
  };

  const handleSaveToWorkspace = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!audit) return;
    try {
      await saveAudit({
        slug,
        url: audit.url,
        title: audit.domSnapshot?.title || audit.url,
        overallGrade: audit.scores.overallGrade,
        usability: audit.scores.usability,
      });
      setSavedToWorkspace(true);
      setTimeout(() => setSavedToWorkspace(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] py-16 px-6 md:px-12">
        <div className="max-w-[1280px] mx-auto border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 space-y-6">
          <div className="h-6 w-48 bg-[#FAF9F5] dark:bg-[#1A1A1A] animate-pulse" />
          <div className="h-8 w-80 bg-[#FAF9F5] dark:bg-[#1A1A1A] animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
            <div className="lg:col-span-7 h-[500px] bg-[#FAF9F5] dark:bg-[#1A1A1A] animate-pulse" />
            <div className="lg:col-span-5 h-[500px] bg-[#FAF9F5] dark:bg-[#1A1A1A] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !audit) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] flex items-center justify-center p-6">
        <div className="relative max-w-md w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 text-center shadow-xl">
          <CrosshairMarker position="tl" />
          <CrosshairMarker position="tr" />
          <CrosshairMarker position="bl" />
          <CrosshairMarker position="br" />

          <div className="w-12 h-12 bg-[#FFF5F0] dark:bg-[#1A100C] border border-[#E53E00]/30 text-[#E53E00] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#111111] dark:text-white mb-2">Audit Report Not Found</h1>
          <p className="text-xs text-[#78716C] mb-6 font-mono">
            {error || `No report found for slug '${slug}'.`}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-xs shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Scanner
          </Link>
        </div>
      </div>
    );
  }

  const isCachedSource = audit.isSandbox || Boolean(audit.cachedAt);

  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] py-10 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Top Command Bar */}
        <div className="relative border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-5 shadow-sm">
          <CrosshairMarker position="tl" />
          <CrosshairMarker position="tr" />
          <CrosshairMarker position="bl" />
          <CrosshairMarker position="br" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Audit Title & Source Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href="/"
                  className="text-[#78716C] hover:text-[#111111] dark:hover:text-white transition flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Scanner
                </Link>
                <span className="text-[#D6D3CD] dark:text-[#333]">/</span>
                <span className="font-mono text-[#78716C] text-[11px]">{audit.slug}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white tracking-tight flex items-center gap-2">
                  {audit.domSnapshot?.title || audit.url}
                </h1>
                <a
                  href={audit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#78716C] hover:text-[#E53E00] transition"
                  title="Visit website"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {/* Cache Source Badge */}
                {isCachedSource ? (
                  <span className="inline-flex items-center gap-1 border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] px-2 py-0.5 text-[10px] font-mono font-bold text-[#E53E00]">
                    <Zap className="w-3 h-3 fill-[#E53E00]" />
                    0 TOKENS (MONGODB CACHED)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-2 py-0.5 text-[10px] font-mono font-bold text-[#111111] dark:text-white">
                    LIVE MULTI-AGENT SCAN
                  </span>
                )}
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={copyRecruiterLink}
                className="inline-flex items-center gap-1.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] px-3 py-1.5 text-xs font-semibold text-[#111111] dark:text-white transition"
              >
                {recruiterCopied ? <Check className="w-3.5 h-3.5 text-[#E53E00]" /> : <Share2 className="w-3.5 h-3.5" />}
                {recruiterCopied ? 'Link Copied' : 'Share Link'}
              </button>

              <button
                onClick={handleSaveToWorkspace}
                className="inline-flex items-center gap-1.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1C1C1C] px-3 py-1.5 text-xs font-semibold text-[#111111] dark:text-white transition"
              >
                {savedToWorkspace ? <Check className="w-3.5 h-3.5 text-[#E53E00]" /> : <Bookmark className="w-3.5 h-3.5" />}
                {savedToWorkspace ? 'Saved' : 'Save to Workspace'}
              </button>

              <button
                onClick={() => setIsBriefOpen(true)}
                className="inline-flex items-center gap-1.5 bg-[#E53E00] hover:bg-[#CC3500] text-white px-3.5 py-1.5 text-xs font-semibold transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                Export Brief
              </button>
            </div>
          </div>
        </div>

        {/* Replay Canvas & Inspector Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left / Center: Interactive Replay Canvas (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <ReplayCanvas
              audit={audit}
              isFixed={isFixed}
              currentStep={currentStep}
              onStepChange={setCurrentStep}
              onSelectRemediation={(rem) => {
                setSelectedRemediation(rem);
              }}
            />
          </div>

          {/* Right: Tabbed Inspector Panel (5 columns) */}
          <div className="lg:col-span-5 flex flex-col">
            <InspectorPanel
              audit={audit}
              currentStep={currentStep}
              onSelectStep={setCurrentStep}
              isFixed={isFixed}
              onToggleFix={setIsFixed}
              selectedRemediation={selectedRemediation}
              onSelectRemediation={setSelectedRemediation}
            />
          </div>
        </div>

        {/* Executive Scorecard Matrix */}
        <div className="pt-2">
          <ScoreCard scores={audit.scores} />
        </div>
      </div>

      {/* Export Brief Modal */}
      <ExportBriefModal
        audit={audit}
        isOpen={isBriefOpen}
        onClose={() => setIsBriefOpen(false)}
      />
    </div>
  );
}
