'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Search,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../lib/authContext';
import { useCommandPalette } from '@/lib/commandPaletteContext';

export function Navbar() {
  const { user, openAuthModal, logout } = useAuth();
  const { openPalette } = useCommandPalette();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside or escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5]/90 dark:bg-[#050505]/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Desktop Nav Links */}
        <div className="flex items-center gap-6 xl:gap-8 min-w-0">
          {/* Custom Brand Logo: Pulse Wave combined with the letter 'P' in #E53E00 */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-[6px] bg-[#FFF5F0] dark:bg-[#1A100C] border border-[#E53E00]/30 flex items-center justify-center text-[#E53E00] shadow-sm group-hover:scale-105 group-hover:border-[#E53E00] transition-all">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-[#E53E00]"
                aria-hidden="true"
              >
                {/* Cardiogram Pulse Waveform */}
                <path
                  d="M2 13H5.5L7.5 7L10 18L12.5 11.5L14 13H16"
                  stroke="#E53E00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Modern Letter 'P' Loop & Stem */}
                <path
                  d="M13.5 5H18C19.6569 5 21 6.34315 21 8C21 9.65685 19.6569 11 18 11H13.5V19"
                  stroke="#E53E00"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-[17px] tracking-tight text-[#111111] dark:text-white whitespace-nowrap">
              PersonaPulse
            </span>
          </Link>

          {/* Desktop Navigation Links: Visible on xl+ with strict whitespace-nowrap */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 text-[13px] font-medium text-[#57534E] dark:text-[#A8A29E]">
            <Link
              href="/#platform"
              className="hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Platform
            </Link>
            <Link
              href="/#use-cases"
              className="hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Use Cases
            </Link>
            <Link
              href="/#audits"
              className="hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Audits
            </Link>
            <Link
              href="/#fleet"
              className="hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Persona Fleet
            </Link>
            <Link
              href="/#pricing"
              className="hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-[#E53E00] hover:underline font-semibold whitespace-nowrap shrink-0"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Controls: [Dashboard] [Search ⌘K] [User Dropdown / Auth Buttons] [Theme Toggle] [Hamburger] */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Dashboard Button (when logged in) */}
          {user && (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-[#E6E4DD] dark:border-[#262626] bg-white dark:bg-[#0C0C0C] hover:bg-[#FAF9F5] dark:hover:bg-[#161616] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#E53E00] transition shadow-sm whitespace-nowrap shrink-0"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}

          {/* 2. Cmd+K Quick Search Button */}
          <motion.button
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={openPalette}
            className="hidden md:inline-flex items-center gap-2 rounded-md border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] px-2.5 py-1.5 text-xs text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white transition shadow-sm whitespace-nowrap shrink-0"
            title="Quick Search (Cmd+K)"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="font-mono text-[11px]">Search</span>
            <kbd className="rounded border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#1A1A1A] px-1 py-0.2 text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E]">
              ⌘K
            </kbd>
          </motion.button>

          {/* 3. User Profile Dropdown (when logged in) OR Login/Start Buttons (when logged out) */}
          {user ? (
            <div className="relative shrink-0" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] px-2.5 sm:px-3 py-1.5 text-xs font-medium text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition shadow-sm whitespace-nowrap"
                aria-expanded={dropdownOpen}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#E53E00] shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[75px] sm:max-w-[110px] truncate">{user.name}</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#57534E] transition-transform duration-200 shrink-0 ${
                    dropdownOpen ? 'rotate-180 text-[#E53E00]' : ''
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-md border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] p-2 shadow-2xl z-50 text-xs"
                  >
                    <div className="px-3 py-2 border-b border-[#E6E4DD] dark:border-[#1F1F1F]">
                      <p className="font-semibold text-[#111111] dark:text-white">{user.name}</p>
                      <p className="text-[#57534E] dark:text-[#A8A29E] truncate text-[11px]">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[#57534E] dark:text-[#A8A29E] hover:text-[#111111] dark:hover:text-white hover:bg-[#FAF9F5] dark:hover:bg-[#161616] rounded transition font-medium"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-[#E53E00]" />
                      My Workspace / Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[#E53E00] hover:bg-[#FFF5F0] dark:hover:bg-[#1F120E] rounded transition font-medium text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('login')}
                className="group inline-flex items-center gap-1.5 text-xs font-medium border border-[#D6D3CD] dark:border-[#333] bg-white dark:bg-[#111] text-[#111111] dark:text-white rounded-md px-3 py-1.5 hover:bg-[#F5F4EF] dark:hover:bg-[#1A1A1A] transition shadow-sm whitespace-nowrap"
              >
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#78716C] group-hover:text-[#111111] dark:group-hover:text-white group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openAuthModal('register')}
                className="group inline-flex items-center gap-1.5 text-xs font-medium bg-[#E53E00] hover:bg-[#CC3500] text-white rounded-md px-3.5 py-1.5 shadow-sm transition whitespace-nowrap"
              >
                <span>Start free audit</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          )}

          {/* 4. Theme Toggle Button */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>

          {/* 5. Mobile/Tablet Hamburger Menu Button: Visible below xl, hidden on xl+ */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden inline-flex items-center justify-center p-2 rounded-md border border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] text-[#111111] dark:text-white shadow-sm shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile/Tablet Animated Dropdown Menu Drawer (Visible below xl) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="xl:hidden border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-white dark:bg-[#0C0C0C] px-6 py-5 shadow-2xl overflow-hidden"
          >
            <div className="space-y-4">
              <nav className="flex flex-col space-y-3 font-medium text-sm text-[#57534E] dark:text-[#A8A29E]">
                <Link
                  href="/#platform"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#111111] dark:hover:text-white py-1 transition-colors"
                >
                  Platform
                </Link>
                <Link
                  href="/#use-cases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#111111] dark:hover:text-white py-1 transition-colors"
                >
                  Use Cases
                </Link>
                <Link
                  href="/#audits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#111111] dark:hover:text-white py-1 transition-colors"
                >
                  Audits
                </Link>
                <Link
                  href="/#fleet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#111111] dark:hover:text-white py-1 transition-colors"
                >
                  Persona Fleet
                </Link>
                <Link
                  href="/#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#111111] dark:hover:text-white py-1 transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#E53E00] font-semibold py-1 hover:underline"
                >
                  Hire / Contact
                </Link>
                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#E53E00] font-semibold py-1 flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>My Workspace / Dashboard</span>
                  </Link>
                )}
              </nav>

              <div className="pt-4 border-t border-[#E6E4DD] dark:border-[#1F1F1F]">
                {user ? (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 py-1">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-[#E53E00]">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-[#111111] dark:text-white">{user.name}</p>
                        <p className="text-[#78716C] truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-[#E53E00] hover:bg-[#CC3500] text-white text-xs font-semibold py-2.5 rounded-md transition shadow-sm"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#141414] text-[#E53E00] text-xs font-semibold py-2.5 rounded-md transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('login');
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 border border-[#D6D3CD] dark:border-[#262626] bg-white dark:bg-[#141414] text-[#111111] dark:text-white text-xs font-semibold py-2.5 rounded-md shadow-sm"
                    >
                      <span>Login</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openAuthModal('register');
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-[#E53E00] hover:bg-[#CC3500] text-white text-xs font-semibold py-2.5 rounded-md shadow-sm"
                    >
                      <span>Start audit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
