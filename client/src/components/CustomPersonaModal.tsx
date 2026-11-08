'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Bot, X, Monitor, Smartphone, Tablet } from 'lucide-react';
import { CrosshairMarker } from './CrosshairMarker';

interface CustomPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_VIEWPORTS = [
  { label: 'Mobile (iPhone 16)', value: 'iPhone 16 Pro (393x852)', icon: Smartphone },
  { label: 'Tablet (iPad Pro)', value: 'iPad Pro (820x1180)', icon: Tablet },
  { label: 'Desktop Standard', value: 'Desktop (1440x900)', icon: Monitor },
  { label: 'Ultrawide 4K', value: 'Ultrawide 4K (2560x1440)', icon: Monitor },
];

const PRESET_COLORS = [
  { label: 'Vermilion', value: '#E53E00' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Indigo', value: '#4F46E5' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#E11D48' },
  { label: 'Slate', value: '#475569' },
];

const PRESET_FOCUS_AREAS = [
  'Frictionless Checkout & Rapid Purchase Funnel',
  'WCAG 2.1 AA / AAA Accessibility & Contrast Ratios',
  'Enterprise Security, Pricing & SOC2 Verification',
  'Navigation Hierarchy & Mobile Thumb Zone Reachability',
  'Form Input Usability & Error State Clarity',
];

export function CustomPersonaModal({ isOpen, onClose }: CustomPersonaModalProps) {
  const { addCustomPersona } = useAuth();

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [viewportSize, setViewportSize] = useState('iPhone 16 Pro (393x852)');
  const [focusArea, setFocusArea] = useState('Frictionless Checkout & Rapid Purchase Funnel');
  const [color, setColor] = useState('#E53E00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('Please provide both persona name and role title');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await addCustomPersona({
        name: name.trim(),
        role: role.trim(),
        viewportSize,
        focusArea,
        color,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save custom persona');
    } finally {
      setIsSubmitting(false);
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
      <div className="relative w-full max-w-lg border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-6 sm:p-8 shadow-2xl">
        <CrosshairMarker position="tl" />
        <CrosshairMarker position="tr" />
        <CrosshairMarker position="bl" />
        <CrosshairMarker position="br" />

        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-[#78716C] hover:text-[#111111] dark:hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-[#E53E00] mb-1">
            <div className="w-2 h-2 bg-[#E53E00] rounded-sm" />
            PersonaPulse Engine
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
            Custom Synthetic Persona Builder
          </h2>
          <p className="mt-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
            Configure simulated agent heuristics, viewport resolution, and friction sensitivity.
          </p>
        </div>

        {error && (
          <div className="mb-4 border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] p-2.5 text-xs text-[#E53E00]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
                Persona Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Marcus Vance"
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 px-3 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
                Role / Title
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Procurement Lead"
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 px-3 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
              Simulated Viewport Frame
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_VIEWPORTS.map((vp) => {
                const Icon = vp.icon;
                const isSelected = viewportSize === vp.value;
                return (
                  <button
                    key={vp.value}
                    type="button"
                    onClick={() => setViewportSize(vp.value)}
                    className={`flex items-center gap-2 p-2.5 border text-left text-xs transition ${
                      isSelected
                        ? 'border-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] text-[#E53E00] font-bold'
                        : 'border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] text-[#57534E] dark:text-[#A8A29E]'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{vp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
              Cognitive Focus & Friction Priority
            </label>
            <select
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 px-3 text-xs text-[#111111] dark:text-white focus:border-[#E53E00] focus:outline-none"
            >
              {PRESET_FOCUS_AREAS.map((fa) => (
                <option key={fa} value={fa} className="dark:bg-[#141414]">
                  {fa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
              Trace Marker Accent Color
            </label>
            <div className="flex items-center gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-sm border transition flex items-center justify-center ${
                    color === c.value
                      ? 'border-[#111111] dark:border-white ring-2 ring-[#E53E00]'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E53E00] hover:bg-[#CC3500] py-2.5 text-xs font-semibold text-white transition disabled:opacity-60"
            >
              {isSubmitting ? 'Deploying Persona...' : 'Deploy Custom Persona to Fleet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
