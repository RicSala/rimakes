import { withNextIntl } from '@/shared/internationalization/next-config';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Generate client side source maps
  productionBrowserSourceMaps: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.basehub.com',
      },
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

export default withNextIntl(nextConfig);
