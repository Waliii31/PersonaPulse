/**
 * Security URL Validator
 * Prevents SSRF (Server-Side Request Forgery) attacks by verifying that
 * target scan URLs are valid external HTTP/HTTPS domains and not internal
 * network endpoints, cloud metadata endpoints (169.254.169.254), or loopback addresses.
 */

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254',
  'metadata.google.internal',
  'instance-data',
]);

const PRIVATE_IP_REGEXES = [
  /^127\./,                         // Loopback IPv4
  /^10\./,                          // RFC1918 Private Class A
  /^192\.168\./,                    // RFC1918 Private Class C
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // RFC1918 Private Class B
  /^169\.254\./,                    // Link-Local / Cloud Metadata
  /^fc00:/i,                        // Unique Local IPv6
  /^fe80:/i,                        // Link-Local IPv6
];

export function validateSafeUrl(rawUrl: string): { isValid: boolean; normalized?: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmed = rawUrl.trim();
  // If a scheme is explicitly provided, it MUST be http or https
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
  }

  const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? trimmed
    : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return { isValid: false, error: 'Malformed URL syntax' };
  }

  // Only allow standard http and https protocols
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block known internal hostnames
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { isValid: false, error: 'Scanning localhost or internal cloud metadata addresses is forbidden for security' };
  }

  // Block internal domain suffixes
  if (
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.test') ||
    hostname.endsWith('.corp') ||
    hostname.endsWith('.home')
  ) {
    return { isValid: false, error: 'Scanning internal and private domain extensions is forbidden' };
  }

  // Block private and link-local IP addresses
  for (const regex of PRIVATE_IP_REGEXES) {
    if (regex.test(hostname)) {
      return { isValid: false, error: 'Scanning private or loopback IP ranges is forbidden' };
    }
  }

  // Standard clean normalized URL
  const normalized = `${parsed.protocol}//${parsed.hostname}${parsed.port ? `:${parsed.port}` : ''}${parsed.pathname.replace(/\/$/, '')}`;
  return { isValid: true, normalized };
}
