'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  MousePointer2,
  AlertTriangle,
  Flame,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { AuditReport, PersonaTrace, Remediation } from '@/lib/types';
import { RealisticSiteMockup } from './RealisticSiteMockup';
import { CrosshairMarker } from './CrosshairMarker';

interface ReplayCanvasProps {
  audit: AuditReport;
  isFixed?: boolean;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  onSelectRemediation: (remediation: Remediation) => void;
}

const personaAvatars: Record<string, string> = {
  maya: '/images/avatars/maya.jpg',
  darius: '/images/avatars/darius.jpg',
  sandra: '/images/avatars/sandra.jpg',
};

export function ReplayCanvas({
  audit,
  isFixed = false,
  currentStep: externalStep,
  onStepChange,
  onSelectRemediation,
}: ReplayCanvasProps) {
  const traces = audit.personaTraces || [];
  const maxSteps = Math.max(...traces.map((t) => t.steps.length), 1);

  const [internalStep, setInternalStep] = useState(0);
  const activeStep = externalStep !== undefined ? externalStep : internalStep;

  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [activePersonaFilter, setActivePersonaFilter] = useState<string>('all');

  const setStep = (val: number | ((prev: number) => number)) => {
    if (typeof val === 'function') {
      const next = val(activeStep);
      setInternalStep(next);
      if (onStepChange) onStepChange(next);
    } else {
      setInternalStep(val);
      if (onStepChange) onStepChange(val);
    }
  };

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = 2400 / playbackSpeed;
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % maxSteps);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, maxSteps, playbackSpeed]);

  const handlePrev = () => {
    setStep((prev) => (prev > 0 ? prev - 1 : maxSteps - 1));
  };

  const handleNext = () => {
    setStep((prev) => (prev + 1) % maxSteps);
  };

  const handleReset = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const filteredTraces =
    activePersonaFilter === 'all'
      ? traces
      : traces.filter((t) => t.personaName.toLowerCase().includes(activePersonaFilter));

  return (
    <div className="relative w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] flex flex-col shadow-sm">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      {/* Browser Chrome Header & Toolbar */}
      <div className="px-4 py-3 border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Window Dots & Target URL */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E53E00]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#57534E]/40 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E6E4DD] dark:bg-[#262626] inline-block" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#111] text-[11px] font-mono text-[#111111] dark:text-[#E6E4DD] max-w-xs truncate">
            <span className="w-2 h-2 rounded-full bg-[#E53E00] animate-pulse" />
            <span className="truncate">{audit.url}</span>
          </div>
        </div>

        {/* Right Toolbar: Viewport Switcher + Heatmap + Persona Filter */}
        <div className="flex items-center gap-2 text-xs">
          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border transition text-xs ${
              showHeatmap
                ? 'border-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] text-[#E53E00] font-bold'
                : 'border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#111] text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white'
            }`}
            title="Toggle spatial friction heatmap overlay"
          >
            <Flame className="w-3.5 h-3.5 text-[#E53E00]" />
            <span>Heatmap</span>
          </button>

          {/* Viewport Frame Switcher */}
          <div className="flex items-center rounded-sm border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#111] p-0.5">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`p-1.5 rounded-sm transition ${
                viewportMode === 'desktop'
                  ? 'bg-[#FAF9F5] dark:bg-[#222] text-[#111111] dark:text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`p-1.5 rounded-sm transition ${
                viewportMode === 'mobile'
                  ? 'bg-[#FAF9F5] dark:bg-[#222] text-[#111111] dark:text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Persona Filter Pills */}
          <div className="hidden sm:flex items-center rounded-sm border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#111] p-0.5 text-[11px]">
            <button
              onClick={() => setActivePersonaFilter('all')}
              className={`px-2 py-0.5 rounded-sm font-medium transition ${
                activePersonaFilter === 'all'
                  ? 'bg-[#E53E00] text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              All (3)
            </button>
            <button
              onClick={() => setActivePersonaFilter('maya')}
              className={`px-2 py-0.5 rounded-sm font-medium transition ${
                activePersonaFilter === 'maya'
                  ? 'bg-[#E53E00] text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              Maya
            </button>
            <button
              onClick={() => setActivePersonaFilter('darius')}
              className={`px-2 py-0.5 rounded-sm font-medium transition ${
                activePersonaFilter === 'darius'
                  ? 'bg-[#E53E00] text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              Darius
            </button>
            <button
              onClick={() => setActivePersonaFilter('sandra')}
              className={`px-2 py-0.5 rounded-sm font-medium transition ${
                activePersonaFilter === 'sandra'
                  ? 'bg-[#E53E00] text-white'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              Sandra
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage Area */}
      <div className="relative w-full flex-1 overflow-hidden bg-[#FAF9F5] dark:bg-[#050505]">
        <div className="relative w-full h-full min-h-[500px]">
          {/* Real Website Screen Mockup */}
          <RealisticSiteMockup
            audit={audit}
            isFixed={isFixed}
            viewportMode={viewportMode}
            showHeatmap={showHeatmap}
            onSelectFriction={onSelectRemediation}
          />

          {/* Animated AI Persona Cursors & Thought Overlays */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {filteredTraces.map((trace) => {
              const stepIndex = Math.min(activeStep, trace.steps.length - 1);
              const step = trace.steps[stepIndex];
              if (!step) return null;

              const leftPercent = Math.max(6, Math.min(94, (step.x / 1440) * 100));
              const topPercent = Math.max(6, Math.min(90, (step.y / 900) * 100));
              const isFail = step.status === 'fail';
              const isWarn = step.status === 'warn';

              const personaKey = trace.personaName.toLowerCase().includes('darius')
                ? 'darius'
                : trace.personaName.toLowerCase().includes('sandra')
                ? 'sandra'
                : 'maya';
              const avatarUrl = personaAvatars[personaKey] || '/images/avatars/maya.jpg';

              return (
                <motion.div
                  key={trace.personaName}
                  className="absolute pointer-events-auto"
                  animate={{
                    left: `${leftPercent}%`,
                    top: `${topPercent}%`,
                  }}
                  transition={{
                    type: 'spring',
                    damping: 24,
                    stiffness: 180,
                  }}
                  style={{ transform: 'translate(-12px, -12px)' }}
                >
                  {/* Click Ripple Effect */}
                  <motion.div
                    key={`${trace.personaName}-${stepIndex}`}
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute -top-3 -left-3 w-10 h-10 rounded-full border border-[#E53E00]"
                  />

                  {/* Cursor Indicator */}
                  <div className="flex items-center gap-1.5 cursor-pointer">
                    <MousePointer2
                      className="w-5 h-5 -rotate-45 drop-shadow-md text-[#E53E00] fill-[#E53E00]"
                    />
                    <div className="flex items-center gap-1 bg-[#111111] dark:bg-white text-white dark:text-[#111111] px-1.5 py-0.5 rounded-sm text-[10px] font-bold shadow-md">
                      <div className="relative w-3.5 h-3.5 rounded-full overflow-hidden">
                        <Image src={avatarUrl} alt={trace.personaName} fill className="object-cover" />
                      </div>
                      <span>{trace.personaName.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Floating Thought Pill */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`thought-${trace.personaName}-${stepIndex}`}
                      initial={{ opacity: 0, y: 8, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.94 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => {
                        const rem = audit.remediations?.[0];
                        if (rem && (isFail || isWarn)) {
                          onSelectRemediation(rem);
                        }
                      }}
                      className={`mt-2 p-2.5 rounded-sm text-[11px] leading-snug max-w-[240px] shadow-xl border transition cursor-pointer ${
                        isFail
                          ? 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#E53E00]'
                          : isWarn
                          ? 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#F59E0B]'
                          : 'bg-white dark:bg-[#141414] text-[#111111] dark:text-white border-[#E6E4DD] dark:border-[#262626]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase mb-1">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            isFail ? 'bg-[#E53E00]' : isWarn ? 'bg-[#F59E0B]' : 'bg-[#78716C]'
                          }`}
                        />
                        <span className={isFail ? 'text-[#E53E00]' : isWarn ? 'text-[#F59E0B]' : 'text-[#78716C]'}>
                          {isFail ? 'Friction Flaw' : isWarn ? 'Hesitation' : 'Observation'}
                        </span>
                        <span className="text-[#78716C] ml-auto">
                          {step.elementTag ? `<${step.elementTag}>` : ''}
                        </span>
                      </div>
                      <p className="text-[#57534E] dark:text-[#D6D3CD]">{step.thought}</p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Controls & Scrubber */}
      <div className="px-4 py-3 bg-[#FAF9F5] dark:bg-[#080808] border-t border-[#E6E4DD] dark:border-[#1F1F1F] flex items-center justify-between gap-4">
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-1.5 rounded text-[#78716C] hover:text-[#111111] dark:hover:text-white transition"
            title="Reset to step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 rounded text-[#78716C] hover:text-[#111111] dark:hover:text-white transition"
            title="Previous step"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-sm bg-[#E53E00] hover:bg-[#CC3500] text-white shadow-sm transition"
            title={isPlaying ? 'Pause simulation' : 'Play simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded text-[#78716C] hover:text-[#111111] dark:hover:text-white transition"
            title="Next step"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Scrubber */}
        <div className="flex-1 flex items-center gap-3 max-w-xl mx-2">
          <span className="font-mono text-[10px] text-[#78716C] whitespace-nowrap">
            STEP {activeStep + 1} / {maxSteps}
          </span>
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max={maxSteps - 1}
              value={activeStep}
              onChange={(e) => {
                setIsPlaying(false);
                setStep(parseInt(e.target.value, 10));
              }}
              className="w-full h-1 bg-[#E6E4DD] dark:bg-[#262626] rounded-none appearance-none cursor-pointer accent-[#E53E00]"
            />
          </div>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center gap-1">
          {[0.5, 1, 2].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                playbackSpeed === spd
                  ? 'border border-[#E53E00] text-[#E53E00] font-bold'
                  : 'text-[#78716C] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
