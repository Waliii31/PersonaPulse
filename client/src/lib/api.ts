import { AuditReport } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://personapulse-7wsa.onrender.com'
    : 'http://localhost:4000');

export async function fetchSandboxAudits(): Promise<AuditReport[]> {
  const res = await fetch(`${API_BASE_URL}/api/audits`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch audits: ${res.statusText}`);
  }
  const json = await res.json();
  return json.data || [];
}

export async function fetchAuditBySlug(slug: string): Promise<AuditReport> {
  const res = await fetch(`${API_BASE_URL}/api/audits/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`Audit '${slug}' not found (${res.status})`);
  }
  const json = await res.json();
  return json.data;
}

export async function submitScanUrl(
  url: string
): Promise<{ success: boolean; cached: boolean; data: AuditReport }> {
  const res = await fetch(`${API_BASE_URL}/api/audits/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `Scan request failed with status ${res.status}`);
  }
  return json;
}

// ── Auth Endpoints ─────────────────────────────────────────────────────────

export async function loginDemoUser(): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Demo login failed');
  }
  return json;
}

export async function loginUser(email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Login failed');
  }
  return json;
}

export async function registerUser(name: string, email: string, password: string): Promise<{ success: boolean; token: string; user: any }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Registration failed');
  }
  return json;
}

export async function fetchCurrentUser(token: string): Promise<{ success: boolean; user: any }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to authenticate');
  }
  return json;
}

export async function createCustomPersona(token: string, persona: { name: string; role: string; viewportSize: string; focusArea: string; color: string }): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/auth/personas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(persona),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to create persona');
  }
  return json;
}

export async function saveAuditToWorkspace(token: string, audit: { slug: string; url: string; title: string; overallGrade: string; usability?: number }): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/auth/save-audit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(audit),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to save audit');
  }
  return json;
}

// ── Contact / Recruiter Reach-Out Endpoint ─────────────────────────────────

export async function submitContactMessage(payload: {
  name: string;
  email: string;
  company?: string;
  topic: string;
  message: string;
}): Promise<{ success: boolean; message: string; ticketId: string; data: any }> {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to send message');
  }
  return json;
}
