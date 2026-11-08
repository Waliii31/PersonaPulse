'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  AlertTriangle,
  Code2,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Remediation } from '@/lib/types';
import { CrosshairMarker } from './CrosshairMarker';

interface RemediationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  remediation: Remediation | null;
}

export function RemediationDrawer({
  isOpen,
  onClose,
  remediation,
}: RemediationDrawerProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'original'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !remediation) return null;

  const isCritical = remediation.severity === 'critical';
  const isHigh = remediation.severity === 'high';

  const copyCode = () => {
    navigator.clipboard.writeText(remediation.fixedReactTailwindCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-[#0C0C0C] border-l border-[#E6E4DD] dark:border-[#1F1F1F] shadow-2xl flex flex-col z-10 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#E6E4DD] dark:border-[#1F1F1F] flex items-start justify-between bg-[#FAF9F5] dark:bg-[#080808]">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                  isCritical
                    ? 'bg-[#FFF5F0] dark:bg-[#1A100C] text-[#E53E00] border-[#E53E00]'
                    : isHigh
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-400'
                    : 'bg-[#FAF9F5] dark:bg-[#1A1A1A] text-[#57534E] dark:text-[#A8A29E] border-[#E6E4DD]'
                }`}
              >
                {remediation.severity} Severity
              </span>
              <span className="font-mono text-[11px] text-[#E53E00] font-semibold flex items-center gap-1">
                AI REMEDIATION PATCH
              </span>
            </div>
            <h2 className="font-semibold text-lg text-[#111111] dark:text-white">
              {remediation.issueTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#78716C] hover:text-[#111111] dark:hover:text-white transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808]">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'preview'
                ? 'bg-[#E53E00] text-white'
                : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Fixed Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'code'
                ? 'bg-[#E53E00] text-white'
                : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            React + Tailwind Code
          </button>
          <button
            onClick={() => setActiveTab('original')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'original'
                ? 'bg-[#E53E00] text-white'
                : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#E53E00]" />
            Original Broken HTML
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tab 1: Live Interactive Preview */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-mono font-semibold uppercase tracking-wider text-[#E53E00]">
                  Remediated Component Sandbox
                </span>
                <span className="font-mono text-[11px]">Production Tailwind CSS</span>
              </div>

              {/* Interactive Visual Render Box */}
              <div className="p-8 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] flex flex-col items-center justify-center min-h-[200px]">
                {remediation.issueTitle.toLowerCase().includes('email') ||
                remediation.issueTitle.toLowerCase().includes('input') ||
                remediation.issueTitle.toLowerCase().includes('label') ? (
                  <div className="flex flex-col gap-2 w-full max-w-sm">
                    <label
                      htmlFor="preview-input"
                      className="text-xs font-semibold uppercase font-mono tracking-wider text-[#111111] dark:text-white"
                    >
                      Work Email Address
                    </label>
                    <input
                      id="preview-input"
                      type="email"
                      placeholder="alex@company.com"
                      className="px-4 py-2.5 border border-[#E6E4DD] dark:border-[#262626] bg-white dark:bg-[#0C0C0C] text-[#111111] dark:text-white focus:outline-none focus:border-[#E53E00] text-xs transition-all"
                    />
                    <span className="text-[10px] text-[#78716C] font-mono">
                      ✓ Explicit label associated with htmlFor="preview-input"
                    </span>
                  </div>
                ) : (
                  <button className="px-6 py-3 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-xs transition-all shadow-sm">
                    Complete Purchase &gt;
                  </button>
                )}
              </div>

              {/* Explanation Card */}
              <div className="p-4 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold text-[#111111] dark:text-white">
                  Why this remediation works
                </span>
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed">
                  {remediation.explanation}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: React Code */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#78716C]">
                  React Component + Tailwind Utilities
                </span>
                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-[#E53E00] hover:bg-[#CC3500] text-white transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied to Clipboard' : 'Copy React Component'}
                </button>
              </div>

              <pre className="p-4 border border-[#E6E4DD] dark:border-[#262626] bg-[#111111] text-[#F5F5F4] text-xs font-mono overflow-x-auto whitespace-pre">
                {remediation.fixedReactTailwindCode}
              </pre>
            </div>
          )}

          {/* Tab 3: Broken Original */}
          {activeTab === 'original' && (
            <div className="space-y-4">
              <span className="font-mono text-xs text-[#E53E00]">
                Original Broken DOM Extracted by Playwright
              </span>
              <pre className="p-4 border border-[#E53E00]/20 bg-[#FFF8F5] dark:bg-[#1A100C] text-[#E53E00] text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                {remediation.brokenHtml}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
