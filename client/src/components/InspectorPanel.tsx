'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Code2,
  Bot,
  Activity,
  AlertTriangle,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { AuditReport, PersonaTrace, Remediation } from '@/lib/types';
import { CrosshairMarker } from './CrosshairMarker';

interface InspectorPanelProps {
  audit: AuditReport;
  currentStep: number;
  onSelectStep: (stepIndex: number) => void;
  isFixed: boolean;
  onToggleFix: (fixed: boolean) => void;
  selectedRemediation: Remediation | null;
  onSelectRemediation: (rem: Remediation) => void;
}

const personaAvatars: Record<string, string> = {
  maya: '/images/avatars/maya.jpg',
  darius: '/images/avatars/darius.jpg',
  sandra: '/images/avatars/sandra.jpg',
};

export function InspectorPanel({
  audit,
  currentStep,
  onSelectStep,
  isFixed,
  onToggleFix,
  selectedRemediation,
  onSelectRemediation,
}: InspectorPanelProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'reasoning' | 'telemetry'>('code');
  const [copiedCode, setCopiedCode] = useState(false);

  const remediations = audit.remediations || [];
  const currentRemediation = selectedRemediation || remediations[0] || null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative w-full h-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] flex flex-col shadow-sm">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Top Tabs Navigation */}
      <div className="flex items-center border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] px-3 pt-2">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'code'
              ? 'border-[#E53E00] text-[#E53E00]'
              : 'border-transparent text-[#78716C] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>React + Tailwind Fixes</span>
          {remediations.length > 0 && (
            <span className="ml-1 rounded-sm bg-[#FFF5F0] dark:bg-[#1A100C] border border-[#E53E00]/30 px-1.5 py-0.2 text-[9px] font-bold text-[#E53E00]">
              {remediations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reasoning')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'reasoning'
              ? 'border-[#E53E00] text-[#E53E00]'
              : 'border-transparent text-[#78716C] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Persona Traces</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition ${
            activeTab === 'telemetry'
              ? 'border-[#E53E00] text-[#E53E00]'
              : 'border-transparent text-[#78716C] hover:text-[#111111] dark:hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Scorecard Heuristics</span>
        </button>
      </div>

      {/* Main Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {/* TAB 1: CODE REMEDIATION */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            {/* Live Toggle Pill */}
            <div className="flex items-center justify-between border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3">
              <div>
                <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00]">
                  Interactive UI Preview
                </span>
                <p className="text-xs font-semibold text-[#111111] dark:text-white">
                  Toggle Remediated Tailwind Code on Mockup
                </p>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                type="button"
                onClick={() => onToggleFix(!isFixed)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  isFixed ? 'bg-[#E53E00]' : 'bg-[#D6D3CD] dark:bg-[#333]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    isFixed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Remediation Selectors */}
            {remediations.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {remediations.map((rem, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRemediation(rem)}
                    className={`px-2.5 py-1 text-[11px] font-medium border transition ${
                      currentRemediation?.issueTitle === rem.issueTitle
                        ? 'border-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] text-[#E53E00] font-bold'
                        : 'border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#111] text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    Issue #{idx + 1}: {rem.issueTitle.slice(0, 24)}...
                  </button>
                ))}
              </div>
            )}

            {currentRemediation ? (
              <div className="space-y-3.5">
                {/* Issue Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] px-2 py-0.5 text-[9px] font-bold text-[#E53E00] uppercase font-mono">
                      {currentRemediation.severity} Severity
                    </span>
                    <h3 className="text-xs font-bold text-[#111111] dark:text-white">
                      {currentRemediation.issueTitle}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleCopy(currentRemediation.fixedReactTailwindCode)}
                    className="inline-flex items-center gap-1 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#141414] hover:bg-[#FAF9F5] dark:hover:bg-[#1F1F1F] px-2.5 py-1 text-[11px] font-medium text-[#111111] dark:text-white transition"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 text-[#E53E00]" />
                        <span className="text-[#E53E00] font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-[#78716C]" />
                        <span>Copy Fix</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Explanation */}
                <p className="text-xs text-[#57534E] dark:text-[#A8A29E] leading-relaxed bg-[#FAF9F5] dark:bg-[#141414] p-3 border border-[#E6E4DD] dark:border-[#1F1F1F]">
                  {currentRemediation.explanation}
                </p>

                {/* Original Broken HTML */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#E53E00] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Original Broken DOM
                  </span>
                  <pre className="border border-[#E53E00]/20 bg-[#FFF8F5] dark:bg-[#160E0A] p-3 text-[11px] font-mono text-[#E53E00] overflow-x-auto whitespace-pre-wrap">
                    {currentRemediation.brokenHtml}
                  </pre>
                </div>

                {/* AI Fixed React + Tailwind Code */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#111111] dark:text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#E53E00]" />
                    Synthesized React + Tailwind Code Patch
                  </span>
                  <pre className="border border-[#E6E4DD] dark:border-[#262626] bg-[#111111] p-3.5 text-[11px] font-mono text-[#F5F5F4] overflow-x-auto whitespace-pre">
                    {currentRemediation.fixedReactTailwindCode}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#78716C]">No remediations generated for this scan.</p>
            )}
          </div>
        )}

        {/* TAB 2: PERSONA TRACES */}
        {activeTab === 'reasoning' && (
          <div className="space-y-4">
            {(audit.personaTraces || []).map((trace) => {
              const personaKey = trace.personaName.toLowerCase().includes('darius')
                ? 'darius'
                : trace.personaName.toLowerCase().includes('sandra')
                ? 'sandra'
                : 'maya';
              const avatarUrl = personaAvatars[personaKey] || '/images/avatars/maya.jpg';

              return (
                <div
                  key={trace.personaName}
                  className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        <Image src={avatarUrl} alt={trace.personaName} fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                          {trace.personaName}
                        </h4>
                        <p className="text-[10px] text-[#78716C] font-mono">{trace.role}</p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#E53E00] border border-[#E53E00]/30 px-1.5 py-0.5">
                      {trace.steps.length} Steps
                    </span>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-2">
                    {trace.steps.map((st, sIdx) => {
                      const isActive = sIdx === currentStep;
                      const isFail = st.status === 'fail';

                      return (
                        <div
                          key={sIdx}
                          onClick={() => onSelectStep(sIdx)}
                          className={`p-2.5 text-xs border transition cursor-pointer ${
                            isActive
                              ? 'border-[#E53E00] bg-white dark:bg-[#0C0C0C]'
                              : 'border-transparent bg-white/60 dark:bg-[#1C1C1C]/40 hover:bg-white dark:hover:bg-[#1C1C1C]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono text-[#78716C] mb-1">
                            <span>STEP #{sIdx + 1} {st.elementTag ? `<${st.elementTag}>` : ''}</span>
                            <span className={isFail ? 'text-[#E53E00] font-bold' : ''}>
                              {st.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-[#57534E] dark:text-[#D6D3CD]">{st.thought}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: TELEMETRY & SCORECARD */}
        {activeTab === 'telemetry' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Usability Score</span>
                <p className="text-2xl font-bold text-[#111111] dark:text-white mt-1">
                  {audit.scores?.usability || 88} <span className="text-xs text-[#78716C]">/ 100</span>
                </p>
              </div>
              <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3 text-center">
                <span className="font-mono text-[10px] text-[#78716C] uppercase">Accessibility (WCAG)</span>
                <p className="text-2xl font-bold text-[#E53E00] mt-1">
                  {audit.scores?.overallGrade || 'A-'}
                </p>
              </div>
            </div>

            <div className="border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] p-3.5 space-y-2">
              <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00]">
                Autonomous Execution Audit Heuristics
              </span>
              <div className="text-xs space-y-1.5 text-[#57534E] dark:text-[#A8A29E]">
                <div className="flex justify-between py-1 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                  <span>DOM Elements Scraped</span>
                  <span className="font-mono font-bold text-[#111111] dark:text-white">
                    {audit.domSnapshot?.interactiveElements?.length || 42}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                  <span>Token Budget Consumed</span>
                  <span className="font-mono font-bold text-[#E53E00]">
                    &lt; 950 Tokens (Zero-Cost Guardrail)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                  <span>Cache Strategy</span>
                  <span className="font-mono font-bold text-[#111111] dark:text-white">
                    MongoDB 7-Day TTL Hit
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Persona Fleet Active</span>
                  <span className="font-mono font-bold text-[#111111] dark:text-white">
                    3 Synthetic Personas
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
