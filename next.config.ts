import { withNextIntl } from '@/shared/internationalization/next-config';
import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  // Generate client side source maps
  productionBrowserSourceMaps: true,

  // Keystatic ships untranspiled ESM; let Next transpile it for the admin bundle.
  transpilePackages: ['@keystatic/core', '@keystatic/next'],

  // The dynamic /present/[slug]/control route reads deck markdoc from disk at
  // request time (Keystatic local reader). Next's tracer can't see that runtime
  // read, so without this the deck files are missing from the serverless bundle
  // and getDeck() returns null -> 404. Bundle the (tiny) deck content in.
  outputFileTracingIncludes: {
    '/**': ['./content/decks/**/*'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'im.runware.ai',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'flowpost.s3.eu-south-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
    ],
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
