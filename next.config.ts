import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['recharts', 'framer-motion', 'lucide-react'],
  },
  
  // ESLint configuration - allow warnings during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript configuration - allow warnings during build
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Bundle analyzer and optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting for chart libraries
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          recharts: {
            name: 'recharts',
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            chunks: 'all',
            priority: 10,
          },
          framerMotion: {
            name: 'framer-motion',
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Compression
  compress: true,
  
  // Power optimizations
  poweredByHeader: false,
};
