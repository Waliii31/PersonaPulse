'use client';

import React, { useState } from 'react';
import { useAuth } from '../lib/authContext';
import { Lock, Mail, User, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { CrosshairMarker } from './CrosshairMarker';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, login, register, demoLogin } =
    useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (authModalTab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please provide your name');
        }
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsDemoLoading(true);
    try {
      await demoLogin();
    } catch (err: any) {
      setError(err.message || 'Demo login failed. Please try again.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeAuthModal}
      />

      {/* Modal Card with Glassmorphic Backdrop Blur */}
      <div className="relative w-full max-w-md bg-white/95 dark:bg-[#0C0C0C]/95 backdrop-blur-xl border border-[#E6E4DD] dark:border-[#1F1F1F] p-6 sm:p-8 shadow-2xl">
        <CrosshairMarker position="tl" />
        <CrosshairMarker position="tr" />
        <CrosshairMarker position="bl" />
        <CrosshairMarker position="br" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded p-1.5 text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#E53E00] uppercase tracking-wider mb-2">
            <div className="w-2 h-2 bg-[#E53E00] rounded-sm" />
            PersonaPulse Workspace
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#111111] dark:text-white">
            {authModalTab === 'login' ? 'Sign in to your account' : 'Create an engineering account'}
          </h2>
          <p className="mt-1 text-xs text-[#57534E] dark:text-[#A8A29E]">
            {authModalTab === 'login'
              ? 'Access saved site audits, custom personas, and remediation patches.'
              : 'Start your zero-token sandbox and run live multi-agent scans.'}
          </p>
        </div>

        {/* 1-Click Recruiter Demo Login */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isDemoLoading}
            className="w-full flex items-center justify-between border border-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] p-3 text-left transition hover:bg-[#FFEAE0] dark:hover:bg-[#251510] disabled:opacity-60"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#E53E00] text-white">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#E53E00]">
                  Instant 1-Click Recruiter Demo Login
                </p>
                <p className="text-[10px] text-[#78716C] dark:text-[#A8A29E]">
                  Pre-seeded Pro account • Full access to Stripe, Linear, Notion audits
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#E53E00]" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="mb-5 flex border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className={`pb-2.5 text-xs font-semibold tracking-tight transition ${
              authModalTab === 'login'
                ? 'border-b-2 border-[#E53E00] text-[#E53E00]'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('register')}
            className={`ml-6 pb-2.5 text-xs font-semibold tracking-tight transition ${
              authModalTab === 'register'
                ? 'border-b-2 border-[#E53E00] text-[#E53E00]'
                : 'text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            Register New Account
          </button>
        </div>

        {error && (
          <div className="mb-4 border border-[#E53E00]/30 bg-[#FFF5F0] dark:bg-[#1A100C] p-2.5 text-xs text-[#E53E00]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {authModalTab === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-[#78716C]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 pl-9 pr-3 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-[#78716C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 pl-9 pr-3 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#57534E] dark:text-[#A8A29E] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[#78716C]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] py-2 pl-9 pr-3 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#E53E00] hover:bg-[#CC3500] py-2.5 text-xs font-semibold text-white transition disabled:opacity-60"
          >
            {isSubmitting
              ? 'Authenticating...'
              : authModalTab === 'login'
              ? 'Sign in to Workspace'
              : 'Create Free Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
