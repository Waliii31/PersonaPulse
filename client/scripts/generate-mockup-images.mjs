import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../public/images');

async function main() {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2 // High-DPI retina screenshot
  });

  console.log('Rendering 6 high-res SaaS visual images...');

  // 1. HERO DASHBOARD (Exact Humblytics Swiss Editorial layout from reference image)
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          overflow: hidden;
          padding: 32px;
        }
        .window {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E4DD;
          box-shadow: 0 20px 50px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
        }
        .window-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          border-bottom: 1px solid #E6E4DD;
          background: #FAF9F5;
        }
        .tabs {
          display: flex;
          gap: 24px;
          font-size: 13px;
          font-weight: 500;
          color: #78716C;
        }
        .tab.active {
          color: #E53E00;
          font-weight: 600;
          border-bottom: 2px solid #E53E00;
          padding-bottom: 8px;
          margin-bottom: -10px;
        }
        .main-body {
          display: flex;
          flex: 1;
        }
        .sidebar {
          width: 220px;
          border-right: 1px solid #E6E4DD;
          padding: 20px 16px;
          background: #FAF9F5;
          font-size: 13px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 4px;
          color: #57534E;
          font-weight: 500;
        }
        .sidebar-item.active {
          background: #FFFFFF;
          color: #111111;
          font-weight: 600;
          border: 1px solid #E6E4DD;
        }
        .content {
          flex: 1;
          padding: 28px 36px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .metric-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border: 1px solid #E6E4DD;
          background: #FFFFFF;
        }
        .metric-cell {
          padding: 16px 14px;
          border-right: 1px solid #E6E4DD;
        }
        .metric-cell:last-child {
          border-right: none;
          background: #FFF7F2;
        }
        .metric-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.05em;
          color: #78716C;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .metric-val {
          font-size: 20px;
          font-weight: 700;
          color: #111111;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .metric-cell:last-child .metric-val {
          color: #E53E00;
        }
        .metric-badge {
          font-size: 11px;
          font-weight: 500;
          color: #E53E00;
        }
        .chart-box {
          border: 1px solid #E6E4DD;
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .chart-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 200px;
          border-bottom: 1px solid #E6E4DD;
          padding-bottom: 8px;
        }
        .bar-group {
          display: flex;
          gap: 8px;
          align-items: flex-end;
          width: 90px;
        }
        .bar {
          flex: 1;
          border-radius: 2px 2px 0 0;
          position: relative;
        }
        .bar.control {
          background: #E6E4DD;
        }
        .bar.variant {
          background: #E53E00;
        }
        .bar-tag {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 10px;
          font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          color: #57534E;
        }
        .bar.variant .bar-tag {
          color: #E53E00;
        }
        .bottom-table {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          border: 1px solid #E6E4DD;
          font-size: 12px;
        }
        .t-row {
          display: contents;
        }
        .t-cell {
          padding: 10px 16px;
          border-bottom: 1px solid #E6E4DD;
        }
        .t-cell.hdr {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          color: #78716C;
          background: #FAF9F5;
        }
      </style>
    </head>
    <body>
      <div class="window">
        <div class="window-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:12px; height:12px; background:#E53E00; border-radius:2px;"></div>
            <span style="font-weight:700; font-size:14px; letter-spacing:-0.02em;">acme-checkout.com</span>
            <span style="background:#FAF0EA; color:#E53E00; font-size:11px; padding:2px 8px; border-radius:3px; font-weight:600;">Autonomous Scan Active</span>
          </div>
          <div class="tabs">
            <span class="tab active">01. Behavior Analytics</span>
            <span class="tab">02. Persona Drop-off</span>
            <span class="tab">03. Tailwind Remediation</span>
          </div>
          <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#78716C; border:1px solid #E6E4DD; padding:4px 10px; background:#FFF;">
            7 DAYS • STRIPE VERIFIED
          </div>
        </div>
        <div class="main-body">
          <div class="sidebar">
            <div class="sidebar-item active">📊 Live Analytics</div>
            <div class="sidebar-item">👥 Persona Fleet (3)</div>
            <div class="sidebar-item">🔥 Friction Heatmaps</div>
            <div class="sidebar-item">♿ WCAG 2.1 Audit</div>
            <div class="sidebar-item">⚡ React Diff Patches</div>
            <div class="sidebar-item">🔌 MCP Engine Bridge</div>
          </div>
          <div class="content">
            <div class="metric-grid">
              <div class="metric-cell">
                <div class="metric-label">Visitors</div>
                <div class="metric-val">12,480 <span class="metric-badge">+14%</span></div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Pageviews</div>
                <div class="metric-val">38,912 <span class="metric-badge">+11%</span></div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Bounce Rate</div>
                <div class="metric-val">32.4% <span class="metric-badge">-6.8%</span></div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Avg Duration</div>
                <div class="metric-val">3m 12s</div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Rev / Visitor</div>
                <div class="metric-val">$2.84</div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Conv. Rate</div>
                <div class="metric-val">4.6% <span class="metric-badge">+1.8%</span></div>
              </div>
              <div class="metric-cell">
                <div class="metric-label">Pipeline Lift</div>
                <div class="metric-val">$18,420 <span class="metric-badge">+24%</span></div>
              </div>
            </div>

            <div class="chart-box">
              <div class="chart-head">
                <div>
                  <h3 style="font-size:15px; font-weight:700;">Revenue Lift by Persona Patch</h3>
                  <p style="font-size:12px; color:#78716C; margin-top:2px;">Comparing baseline UX vs. remediated autonomous test variant</p>
                </div>
                <div style="display:flex; gap:16px; font-size:12px; font-weight:500;">
                  <span style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:#E6E4DD; display:inline-block;"></span> Control</span>
                  <span style="display:flex; align-items:center; gap:6px;"><span style="width:10px; height:10px; background:#E53E00; display:inline-block;"></span> Remediated Variant (+28%)</span>
                </div>
              </div>
              <div class="chart-bars">
                <div class="bar-group">
                  <div class="bar control" style="height: 70px;"><span class="bar-tag">$1.8k</span></div>
                  <div class="bar variant" style="height: 120px;"><span class="bar-tag">$3.1k</span></div>
                </div>
                <div class="bar-group">
                  <div class="bar control" style="height: 90px;"><span class="bar-tag">$2.4k</span></div>
                  <div class="bar variant" style="height: 165px;"><span class="bar-tag">$4.8k</span></div>
                </div>
                <div class="bar-group">
                  <div class="bar control" style="height: 50px;"><span class="bar-tag">$1.2k</span></div>
                  <div class="bar variant" style="height: 110px;"><span class="bar-tag">$2.9k</span></div>
                </div>
                <div class="bar-group">
                  <div class="bar control" style="height: 110px;"><span class="bar-tag">$3.6k</span></div>
                  <div class="bar variant" style="height: 185px;"><span class="bar-tag">$7.6k</span></div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-around; font-size:11px; font-family:'JetBrains Mono', monospace; color:#78716C; margin-top:10px;">
                <span>Hero CTA Above-Fold</span>
                <span>Mobile One-Click ApplePay</span>
                <span>WCAG Low-Contrast Form</span>
                <span>Pricing Tier Comparison</span>
              </div>
            </div>

            <div class="bottom-table">
              <div class="t-row">
                <div class="t-cell hdr">Friction Target</div>
                <div class="t-cell hdr">Persona Hesitation</div>
                <div class="t-cell hdr">Remediation Status</div>
              </div>
              <div class="t-row">
                <div class="t-cell" style="font-weight:600;">button#cta-checkout (Contrast 2.4:1)</div>
                <div class="t-cell" style="color:#E53E00; font-family:'JetBrains Mono', monospace;">1,420ms hesitation</div>
                <div class="t-cell" style="color:#059669; font-weight:600;">✓ Patched (4.8:1 WCAG AA)</div>
              </div>
              <div class="t-row">
                <div class="t-cell" style="font-weight:600;">input#card-expiry (Missing aria-label)</div>
                <div class="t-cell" style="color:#E53E00; font-family:'JetBrains Mono', monospace;">840ms screenreader lag</div>
                <div class="t-cell" style="color:#059669; font-weight:600;">✓ ARIA attributes applied</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'hero-dashboard.png')
  });
  console.log('✓ Created hero-dashboard.png');

  // 2. FUNNEL ANALYTICS
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          padding: 40px;
        }
        .card {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E4DD;
          padding: 48px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #E6E4DD;
          padding-bottom: 24px;
        }
        .funnel-row {
          display: grid;
          grid-template-columns: 240px 1fr 140px;
          align-items: center;
          gap: 24px;
          padding: 20px 0;
          border-bottom: 1px solid #FAF9F5;
        }
        .bar-wrap {
          height: 44px;
          background: #FAF9F5;
          border: 1px solid #E6E4DD;
          position: relative;
          display: flex;
          align-items: center;
        }
        .bar-fill {
          height: 100%;
          background: #E53E00;
        }
        .drop-pill {
          position: absolute;
          right: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          color: #E53E00;
          background: #FFF;
          padding: 4px 8px;
          border: 1px solid #E6E4DD;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div>
            <div style="font-family:'JetBrains Mono', monospace; color:#E53E00; font-size:12px; font-weight:600; margin-bottom:8px;">02. JOURNEYS</div>
            <h1 style="font-size:32px; font-weight:700; letter-spacing:-0.03em;">Synthetic Persona Conversion Funnel</h1>
            <p style="color:#57534E; font-size:15px; margin-top:4px;">Measuring step completion across 15 simulated synthetic buyer sessions</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:36px; font-weight:800; color:#E53E00;">71.4%</div>
            <div style="font-size:12px; color:#78716C; font-family:'JetBrains Mono', monospace;">REMEDIATED PASS RATE</div>
          </div>
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div class="funnel-row">
            <div>
              <div style="font-weight:700; font-size:16px;">1. Homepage Landing</div>
              <div style="font-size:12px; color:#78716C;">100% Persona Traffic</div>
            </div>
            <div class="bar-wrap">
              <div class="bar-fill" style="width: 100%;"></div>
              <span class="drop-pill" style="color:#111;">1,000 visitors</span>
            </div>
            <div style="font-weight:700; font-size:18px;">100%</div>
          </div>

          <div class="funnel-row">
            <div>
              <div style="font-weight:700; font-size:16px;">2. Pricing Selection</div>
              <div style="font-size:12px; color:#78716C;">Interactive plan toggle</div>
            </div>
            <div class="bar-wrap">
              <div class="bar-fill" style="width: 78%; background:#E53E00;"></div>
              <span class="drop-pill">-22% Drop (Missing monthly badge)</span>
            </div>
            <div style="font-weight:700; font-size:18px;">78.2%</div>
          </div>

          <div class="funnel-row">
            <div>
              <div style="font-weight:700; font-size:16px;">3. Sign Up Form</div>
              <div style="font-size:12px; color:#78716C;">OAuth + Password field</div>
            </div>
            <div class="bar-wrap">
              <div class="bar-fill" style="width: 61%;"></div>
              <span class="drop-pill">-17% Drop (WCAG input contrast)</span>
            </div>
            <div style="font-weight:700; font-size:18px;">61.5%</div>
          </div>

          <div class="funnel-row">
            <div>
              <div style="font-weight:700; font-size:16px;">4. Stripe Checkout</div>
              <div style="font-size:12px; color:#78716C;">Payment submit button</div>
            </div>
            <div class="bar-wrap">
              <div class="bar-fill" style="width: 48%; background:#111111;"></div>
              <span class="drop-pill" style="color:#059669; font-weight:700;">+24% Post-Remediation</span>
            </div>
            <div style="font-weight:700; font-size:18px; color:#E53E00;">48.1%</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'funnel-analytics.png')
  });
  console.log('✓ Created funnel-analytics.png');

  // 3. HEATMAP PREVIEW
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          padding: 40px;
        }
        .container {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E4DD;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .topbar {
          padding: 16px 24px;
          border-bottom: 1px solid #E6E4DD;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #FAF9F5;
        }
        .site-canvas {
          flex: 1;
          position: relative;
          background: #FFFFFF;
          padding: 60px 80px;
        }
        .heatmap-spot {
          position: absolute;
          border-radius: 50%;
          filter: blur(28px);
          opacity: 0.65;
          pointer-events: none;
        }
        .pin {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 1px solid #111111;
          padding: 6px 12px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.1);
          font-size: 12px;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="topbar">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color:#E53E00;">02. HEATMAPS</span>
            <span style="font-size:14px; font-weight:600;">Persona Friction & Click Intensity Density</span>
          </div>
          <div style="display:flex; gap:16px; font-size:12px; font-family:'JetBrains Mono', monospace;">
            <span>TOTAL CLICKS: 1,842</span>
            <span>RAGE CLICKS: 42</span>
            <span style="color:#E53E00; font-weight:700;">HESITATION: 1.8s AVG</span>
          </div>
        </div>
        <div class="site-canvas">
          <!-- Warm Heatmap Spots -->
          <div class="heatmap-spot" style="top:140px; left:220px; width:220px; height:220px; background:#E53E00;"></div>
          <div class="heatmap-spot" style="top:180px; left:260px; width:120px; height:120px; background:#FFB703;"></div>
          <div class="heatmap-spot" style="top:320px; left:680px; width:180px; height:180px; background:#E53E00;"></div>

          <div style="max-width:680px;">
            <div style="display:inline-block; border:1px solid #E6E4DD; padding:4px 12px; font-size:12px; font-weight:500; margin-bottom:16px; background:#FAF9F5;">
              Enterprise Infrastructure Platform
            </div>
            <h1 style="font-size:46px; font-weight:800; letter-spacing:-0.04em; line-height:1.1; margin-bottom:20px;">
              Scale telemetry without query timeouts.
            </h1>
            <p style="font-size:18px; color:#57534E; line-height:1.5; margin-bottom:32px;">
              Deploy autonomous ingest workers on any cloud in seconds. Real-time observability for high-throughput distributed architectures.
            </p>
            <div style="display:flex; gap:16px;">
              <button style="background:#E53E00; color:#FFF; font-size:15px; font-weight:600; padding:14px 28px; border:none; cursor:pointer;">
                Start 14-Day Free Trial
              </button>
              <button style="background:#FFF; color:#111; font-size:15px; font-weight:600; padding:14px 28px; border:1px solid #D6D3CD; cursor:pointer;">
                Schedule Enterprise Demo
              </button>
            </div>
          </div>

          <!-- Persona Pins -->
          <div class="pin" style="top:250px; left:480px;">
            <div style="width:8px; height:8px; background:#E53E00; border-radius:50%;"></div>
            <span>Maya Chen: "Clicked 3 times, button lacked active feedback"</span>
          </div>

          <div class="pin" style="top:380px; left:720px;">
            <div style="width:8px; height:8px; background:#2563EB; border-radius:50%;"></div>
            <span>Darius Okafor: "Text contrast 2.8:1 below WCAG threshold"</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'heatmap-preview.png')
  });
  console.log('✓ Created heatmap-preview.png');

  // 4. PERSONA REPLAY
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          padding: 40px;
        }
        .container {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E4DD;
          display: grid;
          grid-template-columns: 360px 1fr;
        }
        .sidebar {
          border-right: 1px solid #E6E4DD;
          padding: 32px;
          background: #FAF9F5;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .stage {
          padding: 40px;
          position: relative;
          background: #FFF;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .step-node {
          border-left: 2px solid #E6E4DD;
          padding-left: 16px;
          position: relative;
          margin-bottom: 20px;
        }
        .step-node.active {
          border-color: #E53E00;
        }
        .step-node::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 0;
          width: 10px;
          height: 10px;
          background: #FFF;
          border: 2px solid #E6E4DD;
          border-radius: 50%;
        }
        .step-node.active::before {
          background: #E53E00;
          border-color: #E53E00;
        }
        .cursor-bubble {
          position: absolute;
          background: #111111;
          color: #FFFFFF;
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 13px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="sidebar">
          <div>
            <div style="font-family:'JetBrains Mono', monospace; font-size:11px; color:#E53E00; font-weight:600;">SYNTHETIC LOG</div>
            <h2 style="font-size:20px; font-weight:700; margin-top:4px;">Autonomous Multi-Agent Trace</h2>
          </div>
          <div>
            <div class="step-node">
              <div style="font-size:11px; font-family:'JetBrains Mono', monospace; color:#78716C;">00:01.24 • PLAYWRIGHT DOM</div>
              <div style="font-size:13px; font-weight:600; margin-top:2px;">Scraped 42 interactive elements under 800 tokens</div>
            </div>
            <div class="step-node active">
              <div style="font-size:11px; font-family:'JetBrains Mono', monospace; color:#E53E00;">00:03.88 • MAYA CHEN (MOBILE)</div>
              <div style="font-size:13px; font-weight:600; margin-top:2px;">Friction detected on pricing slider (no touch target)</div>
            </div>
            <div class="step-node">
              <div style="font-size:11px; font-family:'JetBrains Mono', monospace; color:#78716C;">00:05.10 • DARIUS OKAFOR (WCAG)</div>
              <div style="font-size:13px; font-weight:600; margin-top:2px;">Contrast violation detected on #submit-button</div>
            </div>
            <div class="step-node">
              <div style="font-size:11px; font-family:'JetBrains Mono', monospace; color:#78716C;">00:07.45 • SYNTHESIS ENGINE</div>
              <div style="font-size:13px; font-weight:600; margin-top:2px;">Generated React + Tailwind remediation diff</div>
            </div>
          </div>
        </div>
        <div class="stage">
          <div style="border:1px solid #E6E4DD; padding:20px; background:#FAF9F5; display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:14px; font-weight:600;">Replay Canvas: Stripe Checkout Flow (1440x900)</div>
            <div style="font-family:'JetBrains Mono', monospace; font-size:12px; color:#E53E00;">AGENT 1 OF 3 ACTIVE</div>
          </div>
          <div style="flex:1; border:1px solid #E6E4DD; background:#FFF; position:relative; padding:48px;">
            <div style="max-width:500px; border:1px solid #E6E4DD; padding:32px;">
              <h3 style="font-size:22px; font-weight:700; margin-bottom:12px;">Payment Details</h3>
              <p style="font-size:13px; color:#57534E; margin-bottom:24px;">Enter card details to confirm subscription.</p>
              <div style="border:1px solid #E53E00; padding:12px; background:#FFF7F2; margin-bottom:16px;">
                <span style="font-size:12px; color:#E53E00; font-weight:600;">⚠ Target: #pay-button (Missing touch active state)</span>
              </div>
              <button style="width:100%; padding:14px; background:#E53E00; color:#FFF; font-weight:600; border:none;">Pay $29.00 USD</button>
            </div>

            <!-- Animated Cursor Simulation -->
            <div class="cursor-bubble" style="top:260px; right:120px;">
              <span style="font-weight:700; color:#FFB703;">Maya Chen:</span>
              <span>"Why is the payment button not indicating loading feedback on tap?"</span>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'persona-replay.png')
  });
  console.log('✓ Created persona-replay.png');

  // 5. WCAG AUDIT
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          padding: 40px;
        }
        .card {
          width: 100%;
          height: 100%;
          background: #FFFFFF;
          border: 1px solid #E6E4DD;
          padding: 44px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          flex: 1;
        }
        .box {
          border: 1px solid #E6E4DD;
          padding: 28px;
          background: #FAF9F5;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          padding: 12px 0;
          border-bottom: 1px solid #E6E4DD;
          font-size: 13px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E6E4DD; padding-bottom:20px;">
          <div>
            <div style="font-family:'JetBrains Mono', monospace; color:#E53E00; font-size:11px; font-weight:600;">WCAG 2.1 AA COMPLIANCE RADAR</div>
            <h1 style="font-size:28px; font-weight:700; margin-top:4px;">Automated Color Contrast & Screen Reader Heuristics</h1>
          </div>
          <div style="border:1px solid #E53E00; background:#FFF7F2; padding:8px 16px; font-weight:700; font-size:16px; color:#E53E00;">
            Grade: A- (91 / 100)
          </div>
        </div>

        <div class="grid-2">
          <div class="box">
            <h3 style="font-size:16px; font-weight:700;">Color Contrast Audit (Minimum 4.5:1 required)</h3>
            <div style="margin-top:16px;">
              <div class="table-row" style="font-weight:600; font-family:'JetBrains Mono', monospace; font-size:11px; color:#78716C;">
                <span>ELEMENT</span>
                <span>RATIO</span>
                <span>STATUS</span>
              </div>
              <div class="table-row">
                <span>button.cta-primary (#71717A on #FFFFFF)</span>
                <span style="color:#DC2626; font-weight:700;">2.4:1</span>
                <span style="color:#DC2626; font-weight:700;">FAIL (WCAG AA)</span>
              </div>
              <div class="table-row">
                <span>p.subheadline-muted (#A1A1AA on #090A0F)</span>
                <span style="color:#DC2626; font-weight:700;">3.1:1</span>
                <span style="color:#DC2626; font-weight:700;">FAIL (WCAG AA)</span>
              </div>
              <div class="table-row">
                <span>a.nav-link (#111111 on #FAF9F5)</span>
                <span style="color:#059669; font-weight:700;">14.2:1</span>
                <span style="color:#059669; font-weight:700;">PASS (AAA)</span>
              </div>
              <div class="table-row">
                <span>button.vermilion-action (#FFFFFF on #E53E00)</span>
                <span style="color:#059669; font-weight:700;">4.8:1</span>
                <span style="color:#059669; font-weight:700;">PASS (AA)</span>
              </div>
            </div>
            <div style="font-size:12px; color:#78716C; margin-top:12px;">Audited according to W3C Web Content Accessibility Guidelines 2.1 Level AA</div>
          </div>

          <div class="box">
            <h3 style="font-size:16px; font-weight:700;">ARIA & Keyboard Traversal Matrix</h3>
            <div style="margin-top:16px;">
              <div class="table-row" style="font-weight:600; font-family:'JetBrains Mono', monospace; font-size:11px; color:#78716C;">
                <span>HEURISTIC</span>
                <span>RESULT</span>
                <span>SCORE</span>
              </div>
              <div class="table-row">
                <span>Keyboard Tab Trap Focus</span>
                <span style="color:#059669; font-weight:700;">Passed (No Traps)</span>
                <span>100%</span>
              </div>
              <div class="table-row">
                <span>Form Label Association</span>
                <span style="color:#059669; font-weight:700;">100% Explicit</span>
                <span>100%</span>
              </div>
              <div class="table-row">
                <span>Interactive Target Size (>= 44x44px)</span>
                <span style="color:#DC2626; font-weight:700;">2 Under-sized</span>
                <span>82%</span>
              </div>
              <div class="table-row">
                <span>Screen Reader Live Region Announcements</span>
                <span style="color:#059669; font-weight:700;">aria-live present</span>
                <span>95%</span>
              </div>
            </div>
            <div style="font-size:12px; color:#78716C; margin-top:12px;">Tested with synthetic screen-reader heuristics by Persona: Darius Okafor</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'wcag-audit.png')
  });
  console.log('✓ Created wcag-audit.png');

  // 6. CODE DIFF PREVIEW
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'JetBrains Mono', monospace;
          background: #FAF9F5;
          color: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1440px;
          height: 900px;
          padding: 40px;
        }
        .editor {
          width: 100%;
          height: 100%;
          background: #111111;
          color: #E6E4DD;
          border: 1px solid #292524;
          display: flex;
          flex-direction: column;
        }
        .editor-top {
          background: #1C1917;
          padding: 12px 20px;
          border-bottom: 1px solid #292524;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .code-area {
          flex: 1;
          padding: 28px;
          font-size: 14px;
          line-height: 1.7;
          overflow: hidden;
        }
        .diff-del {
          background: rgba(229, 62, 0, 0.2);
          color: #FF8A65;
          display: block;
          padding: 2px 8px;
          border-left: 3px solid #E53E00;
        }
        .diff-add {
          background: rgba(34, 197, 94, 0.15);
          color: #86EFAC;
          display: block;
          padding: 2px 8px;
          border-left: 3px solid #22C55E;
        }
        .diff-neutral {
          padding: 2px 8px;
          color: #A8A29E;
        }
      </style>
    </head>
    <body>
      <div class="editor">
        <div class="editor-top">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="color:#E53E00; font-weight:700;">● REVERT</span>
            <span style="color:#22C55E; font-weight:700;">● APPLY PATCH</span>
            <span style="color:#A8A29E; margin-left:12px;">CheckoutButton.tsx — Automated Persona Remediation</span>
          </div>
          <span style="color:#78716C; font-size:12px;">React + Tailwind CSS Patch • 1-Click Copy</span>
        </div>
        <div class="code-area">
          <span class="diff-neutral">// Remediation ID: patch-wcag-402 • Tested on Stripe & Notion</span>
          <span class="diff-neutral">export const CheckoutCTA = ({ onCheckout, loading, price }: CheckoutProps) => {</span>
          <span class="diff-neutral">&nbsp;&nbsp;return (</span>
          <span class="diff-del">-   &lt;button className="bg-gray-400 text-white px-3 py-1 text-sm rounded"&gt;</span>
          <span class="diff-del">-     Complete Purchase (\${price})</span>
          <span class="diff-del">-   &lt;/button&gt;</span>
          <span class="diff-add">+   &lt;button</span>
          <span class="diff-add">+     onClick={onCheckout}</span>
          <span class="diff-add">+     aria-label={\`Complete purchase for \${price} dollars\`}</span>
          <span class="diff-add">+     className="w-full sm:w-auto px-6 py-3.5 bg-[#E53E00] hover:bg-[#CC3500] text-white font-semibold text-base rounded-md shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#E53E00] focus:ring-offset-2 active:scale-[0.98] min-h-[44px]"</span>
          <span class="diff-add">+   &gt;</span>
          <span class="diff-add">+     {loading ? &lt;LoadingSpinner /&gt; : \`Complete purchase • \${price}\`}</span>
          <span class="diff-add">+   &lt;/button&gt;</span>
          <span class="diff-neutral">&nbsp;&nbsp;);</span>
          <span class="diff-neutral">};</span>
        </div>
      </div>
    </body>
    </html>
  `);

  await page.screenshot({
    path: path.join(imagesDir, 'code-diff-preview.png')
  });
  console.log('✓ Created code-diff-preview.png');

  await browser.close();
  console.log('All 6 visual images successfully generated!');
}

main().catch(console.error);
