// @ts-check 
/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  reactStrictMode: true, 
  skipTrailingSlashRedirect: true, 
  experimental: { 
    scrollRestoration: true, 
  }, 
  onDemandEntries: { 
    maxInactiveAge: 25 * 1000, 
    pagesBufferLength: 2, 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} 
module.exports = nextConfig 
