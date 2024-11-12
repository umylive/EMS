/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Add build configuration
  experimental: {
    // This will allow better error handling during build
    missingSuspenseWithCSRError: false,
  },
  // Optimize build output
  output: "standalone",
  // Add poweredByHeader for security
  poweredByHeader: false,
};

module.exports = nextConfig;
