'use client';

import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Printer,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AuditReport } from '@/lib/types';
import { CrosshairMarker } from './CrosshairMarker';

interface ExportBriefModalProps {
  audit: AuditReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportBriefModal({
  audit,
  isOpen,
  onClose,
}: ExportBriefModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);

  if (!isOpen) return null;

  const recruiterUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/audit/${audit.slug}`
      : `https://personapulse.dev/audit/${audit.slug}`;

  const copyRecruiterUrl = () => {
    navigator.clipboard.writeText(recruiterUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getMarkdownBrief = () => {
    return `# PersonaPulse — Executive Audit Brief
**Target**: ${audit.domSnapshot?.title || audit.url}
**Scanned URL**: ${audit.url}
**Audit Slug**: ${audit.slug}
**Date**: ${new Date(audit.cachedAt).toUTCString()}
**Shareable Recruiter Link**: ${recruiterUrl}

## Executive Scorecard
- Overall Grade: ${audit.scores.overallGrade}
- Usability Score: ${audit.scores.usability}%
- WCAG Accessibility: ${audit.scores.accessibility}%
- Conversion Readiness: ${audit.scores.conversionReadiness}%

## Automated Remediation Patches (${(audit.remediations || []).length})
${(audit.remediations || [])
  .map(
    (rem, idx) => `
### Patch ${idx + 1}: ${rem.issueTitle} [${rem.severity.toUpperCase()}]
${rem.explanation}

\`\`\`tsx
${rem.fixedReactTailwindCode}
\`\`\`
`
  )
  .join('\n')}
`;
  };

  const copyMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownBrief());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] shadow-2xl flex flex-col">
        <CrosshairMarker position="tl" />
        <CrosshairMarker position="tr" />
        <CrosshairMarker position="bl" />
        <CrosshairMarker position="br" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] px-6 py-4">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#E53E00] mb-0.5">
              <div className="w-2 h-2 bg-[#E53E00] rounded-sm" />
              Executive Audit Brief & Scorecard
            </div>
            <h2 className="text-base font-bold text-[#111111] dark:text-white">
              {audit.domSnapshot?.title || audit.url}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#111111] dark:hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Metadata Banner */}
          <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00]">
                Audited Website Target
              </span>
              <span className="font-mono text-[10px] text-[#78716C]">
                {new Date(audit.cachedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-mono text-xs text-[#111111] dark:text-[#E6E4DD]">{audit.url}</p>
          </div>

          {/* Executive Scorecard Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
              <span className="font-mono text-[10px] uppercase text-[#78716C] block mb-1">
                Overall Grade
              </span>
              <span className="text-2xl font-bold text-[#E53E00] font-mono">
                {audit.scores.overallGrade}
              </span>
            </div>
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
              <span className="font-mono text-[10px] uppercase text-[#78716C] block mb-1">
                Usability
              </span>
              <span className="text-2xl font-bold text-[#111111] dark:text-white font-mono">
                {audit.scores.usability}%
              </span>
            </div>
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
              <span className="font-mono text-[10px] uppercase text-[#78716C] block mb-1">
                Accessibility
              </span>
              <span className="text-2xl font-bold text-[#111111] dark:text-white font-mono">
                {audit.scores.accessibility}%
              </span>
            </div>
            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
              <span className="font-mono text-[10px] uppercase text-[#78716C] block mb-1">
                Conversion
              </span>
              <span className="text-2xl font-bold text-[#E53E00] font-mono">
                {audit.scores.conversionReadiness}%
              </span>
            </div>
          </div>

          {/* Remediation Summary */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase font-bold text-[#111111] dark:text-white block">
              Autonomous Remediation Patches ({(audit.remediations || []).length})
            </span>
            {(audit.remediations || []).map((rem, idx) => (
              <div
                key={idx}
                className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#111111] dark:text-white">
                    {idx + 1}. {rem.issueTitle}
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00]">
                    {rem.severity}
                  </span>
                </div>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  {rem.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={copyRecruiterUrl}
              className="inline-flex items-center gap-1.5 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-[#E53E00]" /> : <Share2 className="h-3.5 w-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share Recruiter URL'}
            </button>
            <button
              onClick={copyMarkdown}
              className="inline-flex items-center gap-1.5 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#141414] px-3 py-1.5 text-xs font-medium text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition"
            >
              {copiedMarkdown ? <Check className="h-3.5 w-3.5 text-[#E53E00]" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedMarkdown ? 'Markdown Copied' : 'Copy Markdown'}
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-[#E53E00] hover:bg-[#CC3500] px-4 py-1.5 text-xs font-semibold text-white transition"
          >
            <Printer className="h-3.5 w-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
