/**
 * PersonaPulse Server Automated Test Suite
 * Tests:
 * 1. Security URL Validator (SSRF prevention)
 * 2. API Gateway Health (/api/health)
 * 3. Pre-loaded Sandbox Audits (/api/audits)
 * 4. Audit Report Retrieval by Slug (/api/audits/:slug)
 * 5. SSRF Rejection on Scan endpoint (/api/audits/scan)
 * 6. 1-Click Recruiter Demo Login (/api/auth/demo)
 * 7. Protected Route Authentication (/api/auth/me)
 * 8. Contact & Recruiter Inquiries (/api/contact)
 */

import assert from 'node:assert/strict';
import { validateSafeUrl } from '../utils/urlValidator';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:4000';

async function runTests() {
  console.log('\n🧪 ========================================================');
  console.log('🧪 Starting PersonaPulse API Gateway Automated Tests');
  console.log(`🧪 Target Gateway: ${BASE_URL}`);
  console.log('🧪 ========================================================\n');

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message || err}`);
      failed++;
    }
  }

  // ── 1. Security Unit Tests ────────────────────────────────────────────────
  console.log('📦 1. Security & SSRF Protection Tests:');

  await test('Should approve safe public HTTPS domains', async () => {
    const res1 = validateSafeUrl('https://stripe.com');
    assert.equal(res1.isValid, true);
    assert.equal(res1.normalized, 'https://stripe.com');

    const res2 = validateSafeUrl('notion.so/pricing');
    assert.equal(res2.isValid, true);
    assert.equal(res2.normalized, 'https://notion.so/pricing');
  });

  await test('Should reject localhost, 127.0.0.1, and loopback', async () => {
    const res1 = validateSafeUrl('http://localhost:8000');
    assert.equal(res1.isValid, false);
    assert.match(res1.error || '', /forbidden/i);

    const res2 = validateSafeUrl('http://127.0.0.1:4000');
    assert.equal(res2.isValid, false);
  });

  await test('Should reject cloud metadata addresses (169.254.169.254)', async () => {
    const res = validateSafeUrl('http://169.254.169.254/latest/meta-data/');
    assert.equal(res.isValid, false);
    assert.match(res.error || '', /forbidden/i);
  });

  await test('Should reject private RFC1918 IPs (10.x, 192.168.x, 172.16.x)', async () => {
    const res1 = validateSafeUrl('http://10.0.0.1/admin');
    assert.equal(res1.isValid, false);

    const res2 = validateSafeUrl('http://192.168.1.100');
    assert.equal(res2.isValid, false);

    const res3 = validateSafeUrl('http://172.20.0.5:8080');
    assert.equal(res3.isValid, false);
  });

  await test('Should reject non-HTTP protocols (file://, ftp://, gopher://)', async () => {
    const res1 = validateSafeUrl('file:///etc/passwd');
    assert.equal(res1.isValid, false);

    const res2 = validateSafeUrl('ftp://example.com/file');
    assert.equal(res2.isValid, false);
  });

  // ── 2. Endpoint Integration Tests ─────────────────────────────────────────
  console.log('\n📦 2. API Gateway Integration Tests:');

  await test('GET /api/health returns 200 OK with service info', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.status, 'ok');
    assert.equal(data.service, 'PersonaPulse API Gateway');
  });

  await test('GET /api/audits returns pre-seeded sandbox audits', async () => {
    const res = await fetch(`${BASE_URL}/api/audits`);
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 3, 'Expected at least 3 sandbox audits (Stripe, Notion, Shopify)');
  });

  await test('GET /api/audits/stripe-checkout-v4 returns full audit report', async () => {
    const res = await fetch(`${BASE_URL}/api/audits/stripe-checkout-v4`);
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.data.scores, 'Audit report should have scores');
    assert.ok(data.data.scores.usability > 0, 'Usability score should be positive');
    assert.ok(Array.isArray(data.data.personaTraces), 'Audit report should have personaTraces');
    assert.ok(Array.isArray(data.data.remediations), 'Audit report should have remediations');
  });

  await test('POST /api/audits/scan rejects SSRF attempts with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/audits/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://169.254.169.254/latest/meta-data' }),
    });
    assert.equal(res.status, 400);
    const data: any = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /forbidden|invalid/i);
  });

  // ── 3. Authentication & User Tests ────────────────────────────────────────
  console.log('\n📦 3. Authentication & Session Tests:');

  let demoToken = '';
  await test('POST /api/auth/demo logs into 1-Click Recruiter Demo', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token, 'Demo login must return JWT token');
    assert.ok(data.user, 'Demo login must return user object');
    assert.equal(data.user.role, 'pro-recruiter');
    demoToken = data.token;
  });

  await test('GET /api/auth/me succeeds with valid Bearer token', async () => {
    assert.ok(demoToken, 'demoToken must be present from previous test');
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${demoToken}` },
    });
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.role, 'pro-recruiter');
  });

  await test('GET /api/auth/me rejects missing or invalid token with 401', async () => {
    const res1 = await fetch(`${BASE_URL}/api/auth/me`);
    assert.equal(res1.status, 401);

    const res2 = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: 'Bearer invalid_garbage_token' },
    });
    assert.equal(res2.status, 401);
  });

  // ── 4. Contact Form Inquiries ─────────────────────────────────────────────
  console.log('\n📦 4. Contact & Recruiter Inquiries:');

  await test('POST /api/contact validates required fields and email', async () => {
    const resInvalid = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', email: 'not-an-email', message: 'Hello' }),
    });
    assert.equal(resInvalid.status, 400);

    const resValid = await fetch(`${BASE_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Recruiter',
        email: 'recruiter.test@personapulse.dev',
        company: 'Venture Capital Partners',
        topic: 'Job / Recruiter Inquiry',
        message: 'This is an automated verification inquiry for PersonaPulse v2.0.',
      }),
    });
    assert.equal(resValid.status, 201);
    const data: any = await resValid.json();
    assert.equal(data.success, true);
    assert.ok(data.ticketId, 'Contact ticket ID should be generated');
  });

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n========================================================');
  console.log(`🎯 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
