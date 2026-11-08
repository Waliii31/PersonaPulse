'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Zap,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { CrosshairMarker } from '../CrosshairMarker';
import { useAuth } from '@/lib/authContext';
import { submitContactMessage } from '@/lib/api';

const TOPIC_OPTIONS = [
  'Job / Recruiter Inquiry',
  'Enterprise Audit Demo',
  'Custom MCP Integration',
  'General Feedback',
];

export function ContactSection() {
  const { demoLogin } = useAuth();

  const [selectedTopic, setSelectedTopic] = useState('Job / Recruiter Inquiry');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successPayload, setSuccessPayload] = useState<{ ticketId?: string; message: string } | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  const directEmail = 'waliizafri@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitContactMessage({
        name,
        email,
        company,
        topic: selectedTopic,
        message,
      });

      setSuccessPayload({
        ticketId: res.ticketId || 'CONTACT-' + Date.now().toString().slice(-6),
        message: res.message || 'Contact saved',
      });

      // Clear fields
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505]">
      <CrosshairMarker position="tl" />
      <CrosshairMarker position="tr" />
      <CrosshairMarker position="bl" />
      <CrosshairMarker position="br" />

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E4DD] dark:divide-[#1F1F1F]">
        {/* Left Column: Direct Recruiter Channel & Fast Action Cards (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 py-24 md:py-32 px-8 sm:px-12 flex flex-col justify-between bg-white dark:bg-[#0C0C0C]"
        >
          <div>
            {/* Live Availability Status Indicator */}
            <div className="inline-flex items-center gap-2 border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-3.5 py-1.5 rounded-full mb-6 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#E53E00] animate-ping" />
              <span className="text-[#111111] dark:text-white font-semibold">
                Available for Full-Stack & Agentic AI Roles
              </span>
            </div>

            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#E53E00] block mb-3">
              08. DIRECT CHANNEL
            </span>

            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.08] mb-6">
              Hiring an AI Full-Stack Engineer or scaling your UX team?
            </h2>

            <p className="text-base text-[#57534E] dark:text-[#A8A29E] leading-relaxed mb-10">
              Let’s talk architectures, multi-agent systems, or autonomous web tooling. Send a direct note through this terminal or connect via my live links below.
            </p>

            {/* Fast Action Cards */}
            <div className="space-y-3.5">
              {/* 1-Click Copy Email */}
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCopyEmail}
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] hover:bg-white dark:hover:bg-[#1A1A1A] hover:border-[#111111] dark:hover:border-white p-4 flex items-center justify-between text-left transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#E53E00] text-white flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111111] dark:text-white block">
                      Direct Developer Email
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">{directEmail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-mono text-xs text-[#E53E00] font-semibold">
                  {emailCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{emailCopied ? 'Copied!' : 'Copy'}</span>
                </div>
              </motion.button>

              {/* Live Portfolio Link */}
              <motion.a
                href="https://waliii31.xyz"
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#141414] hover:bg-white dark:hover:bg-[#1A1A1A] hover:border-[#111111] dark:hover:border-white p-4 flex items-center justify-between text-left transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-bold">
                    W
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#111111] dark:text-white block">
                      Wali’s Engineering Portfolio
                    </span>
                    <span className="text-xs font-mono text-[#78716C]">waliii31.xyz</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#78716C]" />
              </motion.a>

              {/* Instant Recruiter Demo Login */}
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => demoLogin()}
                className="w-full border border-[#E53E00]/40 bg-[#FFF5F0] dark:bg-[#1A100C] p-4 flex items-center justify-between text-left transition shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-[#E53E00] text-white flex items-center justify-center font-bold">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#E53E00] block">
                      Instant 1-Click Recruiter Demo Login
                    </span>
                    <span className="text-[11px] text-[#78716C] dark:text-[#A8A29E]">
                      Auto-sign in as Pro engineer with pre-loaded scans
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E53E00]" />
              </motion.button>
            </div>
          </div>

          <div className="pt-8 mt-12 border-t border-[#E6E4DD] dark:border-[#1F1F1F]">
            <span className="font-mono text-xs text-[#78716C]">
              Backed by MongoDB Atlas • REST API: /api/contact • Instant Notification
            </span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Contact Form (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 py-20 md:py-28 px-8 sm:px-14 flex items-center justify-center bg-[#FAF9F5] dark:bg-[#080808]"
        >
          <div className="relative w-full max-w-xl border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-8 sm:p-10 shadow-2xl">
            <CrosshairMarker position="tl" />
            <CrosshairMarker position="tr" />
            <CrosshairMarker position="bl" />
            <CrosshairMarker position="br" />

            <div className="mb-6">
              <span className="font-mono text-[10px] uppercase font-bold text-[#E53E00]">
                DISPATCH INQUIRY
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-white mt-1">
                Send a Message to Wali
              </h3>
            </div>

            {/* Success Celebration Alert */}
            <AnimatePresence>
              {successPayload && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-4 border border-[#E53E00] bg-[#FFF5F0] dark:bg-[#1A100C] text-[#111111] dark:text-white space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#E53E00]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Inquiry Logged in MongoDB!</span>
                  </div>
                  <p className="text-xs text-[#57534E] dark:text-[#A8A29E]">
                    {successPayload.message}
                  </p>
                  <p className="font-mono text-[10px] text-[#78716C]">
                    Ticket ID: <strong>{successPayload.ticketId}</strong>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {errorMessage && (
              <div className="mb-6 p-3 border border-[#E53E00]/40 bg-[#FFF5F0] dark:bg-[#1A100C] text-xs text-[#E53E00]">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Animated Topic Pills */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#78716C] mb-2.5">
                  Select Topic
                </label>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_OPTIONS.map((topic) => {
                    const isSelected = selectedTopic === topic;
                    return (
                      <motion.button
                        key={topic}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedTopic(topic)}
                        className={`px-3 py-1.5 text-xs font-medium border transition ${
                          isSelected
                            ? 'border-[#E53E00] bg-[#E53E00] text-white font-semibold shadow-sm'
                            : 'border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white'
                        }`}
                      >
                        {topic}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Name & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#78716C] mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="w-full border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-3.5 py-2.5 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase font-bold text-[#78716C] mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-3.5 py-2.5 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Company Field */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#78716C] mb-1.5">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp / Series A Startup"
                  className="w-full border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] px-3.5 py-2.5 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none transition-colors"
                />
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-[11px] font-mono uppercase font-bold text-[#78716C] mb-1.5">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hey Wali, saw PersonaPulse and loved the autonomous multi-agent architecture. Would love to discuss a Senior Full-Stack / AI role at our company..."
                  className="w-full border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] p-3.5 text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:border-[#E53E00] focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button with Spring Physics */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ y: -2, scale: 1.015 }}
                whileTap={{ scale: 0.97 }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-xs sm:text-sm py-3.5 transition shadow-sm disabled:opacity-60 group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message Directly to Wali</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
