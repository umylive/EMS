/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This will not fail the build even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This will not fail the build even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

module.exports = nextConfig;
