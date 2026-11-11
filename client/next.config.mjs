/** @type {import('next').NextConfig} */
const resolvedApiUrl =
  process.env.BACKEND_URL ||
  process.env.SERVER_URL ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://personapulse-7wsa.onrender.com'
    : 'http://localhost:4000');

const nextConfig = {
  reactStrictMode: true,
  env: {
    // Bridges any non-prefixed secret variables from Vercel to the client
    NEXT_PUBLIC_API_URL: resolvedApiUrl,
    NEXT_PUBLIC_BACKEND_URL: resolvedApiUrl,
    BACKEND_URL: resolvedApiUrl,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
