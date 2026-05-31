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
