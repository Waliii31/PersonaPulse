'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  LayoutDashboard,
  Zap,
  ArrowRight,
  X,
  Sun,
  Moon,
  Sliders,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useTheme } from '@/components/ThemeProvider';
import { useCommandPalette } from '@/lib/commandPaletteContext';
import { submitScanUrl } from '@/lib/api';
import { CrosshairMarker } from './CrosshairMarker';

interface PaletteItem {
  id: string;
  name: string;
  category: string;
  shortcut?: string;
  badge?: string;
  icon: any;
  action: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, closePalette } = useCommandPalette();
  const { user, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleScanTarget = async (url: string) => {
    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = `https://${target}`;
    }
    setIsScanning(true);
    try {
      const res = await submitScanUrl(target);
      if (res.success && res.data?.slug) {
        closePalette();
        router.push(`/audit/${res.data.slug}`);
      }
    } catch (err) {
      console.error(err);
      closePalette();
      router.push(`/#scanner`);
    } finally {
      setIsScanning(false);
    }
  };

  const ITEMS: PaletteItem[] = [
    // Sandbox Audits
    {
      id: 'stripe',
      name: 'Stripe Checkout — Multi-Currency Flow',
      category: 'Sandbox Audits (Zero-Token)',
      shortcut: 'S',
      badge: 'Score 92/100',
      icon: Sparkles,
      action: () => {
        closePalette();
        router.push('/audit/stripe-checkout-v4');
      },
    },
    {
      id: 'notion',
      name: 'Notion Pricing & Feature Matrix',
      category: 'Sandbox Audits (Zero-Token)',
      shortcut: 'N',
      badge: 'Score 86/100',
      icon: Sparkles,
      action: () => {
        closePalette();
        router.push('/audit/notion-pricing-2024');
      },
    },
    {
      id: 'shopify',
      name: 'Shopify Merchant Onboarding Funnel',
      category: 'Sandbox Audits (Zero-Token)',
      shortcut: 'H',
      badge: 'Score 89/100',
      icon: Sparkles,
      action: () => {
        closePalette();
        router.push('/audit/shopify-admin-storefront');
      },
    },

    // Actions & Tools
    {
      id: 'demo-login',
      name: user ? 'Re-authenticate as Recruiter Demo' : '1-Click Recruiter Demo Login',
      category: 'Fast-Track Auth',
      shortcut: 'D',
      badge: 'Instant Pro',
      icon: Zap,
      action: async () => {
        closePalette();
        await demoLogin();
      },
    },
    {
      id: 'toggle-theme',
      name: `Toggle Theme (${theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'})`,
      category: 'Preferences',
      shortcut: 'T',
      badge: theme === 'dark' ? 'Dark Mode' : 'Light Mode',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        toggleTheme();
        closePalette();
      },
    },
    {
      id: 'workspace',
      name: 'Open Personal Workspace & Fleet',
      category: 'Navigation',
      shortcut: 'W',
      badge: user ? 'Active' : 'Login Req',
      icon: LayoutDashboard,
      action: () => {
        closePalette();
        router.push('/dashboard');
      },
    },
    {
      id: 'remediation',
      name: 'Interactive UI Remediation Diff',
      category: 'Navigation',
      badge: 'React Diff',
      icon: Sliders,
      action: () => {
        closePalette();
        router.push('/#remediation');
      },
    },
  ];

  const filteredItems = ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const isUrlInput = query.includes('.') && !query.includes(' ');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closePalette();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isUrlInput) {
        handleScanTarget(query);
      } else if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closePalette}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0C0C0C] border border-[#E6E4DD] dark:border-[#1F1F1F] shadow-2xl transition-all">
        <CrosshairMarker position="tl" />
        <CrosshairMarker position="tr" />
        <CrosshairMarker position="bl" />
        <CrosshairMarker position="br" />

        {/* Search Bar */}
        <div className="flex items-center gap-3 border-b border-[#E6E4DD] dark:border-[#1F1F1F] px-4 py-3.5">
          <Search className="h-4 w-4 text-[#E53E00]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search audits, commands, or enter URL to audit..."
            className="flex-1 bg-transparent text-xs text-[#111111] dark:text-white placeholder-[#78716C] focus:outline-none"
          />
          {isScanning && <Loader2 className="h-4 w-4 text-[#E53E00] animate-spin" />}
          <kbd className="hidden sm:inline-block rounded border border-[#E6E4DD] dark:border-[#262626] bg-[#FAF9F5] dark:bg-[#1A1A1A] px-1.5 py-0.5 text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E]">
            ESC
          </kbd>
          <button onClick={closePalette} className="text-[#57534E] dark:text-[#A8A29E] sm:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* URL Quick Action */}
        {isUrlInput && (
          <div
            onClick={() => handleScanTarget(query)}
            className="border-b border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FFF5F0] dark:bg-[#1A100C] px-4 py-2.5 flex items-center justify-between cursor-pointer text-xs"
          >
            <div className="flex items-center gap-2 text-[#E53E00] font-medium">
              <span>Scan live target: <strong>{query}</strong></span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-[#E53E00]">
              Press ↵ Enter <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 && !isUrlInput ? (
            <div className="p-6 text-center text-xs text-[#78716C]">
              No matching commands found. Type a website URL to scan.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#FAF9F5] dark:bg-[#161616] text-[#111111] dark:text-white border-l-2 border-[#E53E00]'
                      : 'text-[#57534E] dark:text-[#A8A29E] hover:bg-[#FAF9F5] dark:hover:bg-[#161616]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isSelected ? 'text-[#E53E00]' : 'text-[#78716C]'
                      }`}
                    />
                    <div className="truncate">
                      <span className="font-semibold">{item.name}</span>
                      <span className="ml-2 text-[10px] text-[#78716C]">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="border border-[#E6E4DD] dark:border-[#262626] bg-white dark:bg-[#111] px-2 py-0.5 text-[10px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <kbd className="border border-[#E6E4DD] dark:border-[#262626] bg-white dark:bg-[#111] px-1.5 py-0.5 text-[9px] font-mono text-[#57534E] dark:text-[#A8A29E]">
                        {item.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#080808] px-4 py-2 flex items-center justify-between text-[11px] text-[#78716C] font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-[#E53E00]">PersonaPulse Architectural Search</span>
        </div>
      </div>
    </div>
  );
}
