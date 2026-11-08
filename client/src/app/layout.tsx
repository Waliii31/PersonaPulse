import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/authContext';
import { CommandPaletteProvider } from '@/lib/commandPaletteContext';
import { CommandPalette } from '@/components/CommandPalette';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { AuthModal } from '@/components/AuthModal';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PersonaPulse — Autonomous Multi-Agent User Testing & UI Remediation',
  description:
    'Synthetic AI personas navigate your site, identify UX & accessibility friction points, and generate copy-pasteable React + Tailwind CSS code patches.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#FAF9F5] dark:bg-[#050505] text-[#111111] dark:text-[#F5F5F4] min-h-screen flex flex-col selection:bg-[#E53E00] selection:text-white antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CommandPaletteProvider>
              <SmoothScrollProvider>
                <Navbar />
                <main className="flex-1">{children}</main>
                <AuthModal />
                <CommandPalette />
              </SmoothScrollProvider>
            </CommandPaletteProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
