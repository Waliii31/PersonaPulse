'use client';

import React from 'react';
import { HeroArchitecturalStage } from '@/components/landing/HeroArchitecturalStage';
import { EnterpriseMatrix } from '@/components/landing/EnterpriseMatrix';
import { PlatformOverview } from '@/components/landing/PlatformOverview';
import { VerticalSpineSection } from '@/components/landing/VerticalSpineSection';
import { AuditGallery } from '@/components/landing/AuditGallery';
import { PersonaFleet } from '@/components/landing/PersonaFleet';
import { PricingGrid } from '@/components/landing/PricingGrid';
import { ContactSection } from '@/components/landing/ContactSection';
import { FaqAndFooter } from '@/components/landing/FaqAndFooter';
import { ArchitecturalSpacer } from '@/components/ArchitecturalSpacer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] dark:bg-[#050505] text-[#111111] dark:text-[#F5F5F4] transition-colors">
      {/* Continuous Architectural Grid Container - Decompressed to 1280px */}
      <div className="max-w-[1280px] mx-auto border-x border-[#E6E4DD] dark:border-[#1F1F1F] bg-[#FAF9F5] dark:bg-[#050505] shadow-2xl">
        {/* Section 1: Hero & Architectural Product Stage (Humblytics Exact Layout) */}
        <HeroArchitecturalStage />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="01 // TELEMETRY & LOGO MATRIX" />

        {/* Section 2: Bordered Enterprise Social Proof Matrix & Velocity Marquee */}
        <EnterpriseMatrix />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="02 // THE PLATFORM ARCHITECTURE" />

        {/* Section 3: THE PLATFORM Editorial Overview & 3-Column Unified Cards */}
        <PlatformOverview />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="03 // MULTI-AGENT PIPELINE" />

        {/* Section 4: From Friction to Conversion Interactive Vertical Spine */}
        <VerticalSpineSection />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="04 // LIVE SANDBOX VAULT" />

        {/* Section 5: Pre-Loaded Live Website Audit Gallery (Zoom & Cursor Preview) */}
        <AuditGallery />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="05 // AUTONOMOUS PERSONA FLEET" />

        {/* Section 6: Meet the Autonomous Persona Fleet (Real Portrait Cards) */}
        <PersonaFleet />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="06 // ARCHITECTURAL PRICING" />

        {/* Section 7: Transparent Architectural Pricing Grid */}
        <PricingGrid />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="07 // RECRUITER & DIRECT INQUIRY" />

        {/* Section 8: Direct Contact & Recruiter Channel Section */}
        <ContactSection />

        {/* 48px Architectural Spacer Band */}
        <ArchitecturalSpacer label="08 // SPECIFICATIONS & FAQ" />

        {/* Section 9: Editorial FAQ & Massive Structural Footer */}
        <FaqAndFooter />
      </div>
    </div>
  );
}
