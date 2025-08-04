'use client';

import { useEffect } from 'react';

// Component to preload critical resources
export function PreloadResources() {
  useEffect(() => {
    // Preload critical chart libraries
    const preloadScript = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = src;
      document.head.appendChild(link);
    };

    // Preload Recharts components (these will be lazy loaded)
    if (typeof window !== 'undefined') {
      // Only preload on fast connections
      const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection;
      const isSlowConnection = connection && 
        (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      
      if (!isSlowConnection) {
        // Preload chart libraries after initial page load
        setTimeout(() => {
          preloadScript('/node_modules/recharts/es6/index.js');
          preloadScript('/node_modules/framer-motion/dist/es/index.mjs');
        }, 1000);
      }
    }

    // Prefetch next pages
    const prefetchPages = () => {
      const router = document.createElement('link');
      router.rel = 'prefetch';
      router.href = '/dashboard/analytics';
      document.head.appendChild(router);

      const dataPage = document.createElement('link');
      dataPage.rel = 'prefetch';
      dataPage.href = '/dashboard/data';
      document.head.appendChild(dataPage);
    };

    // Prefetch after initial load
    setTimeout(prefetchPages, 2000);

    // Cleanup function
    return () => {
      // Remove preload links if needed
      const preloadLinks = document.querySelectorAll('link[rel="modulepreload"], link[rel="prefetch"]');
      preloadLinks.forEach(link => {
        if (link.getAttribute('href')?.includes('recharts') || 
            link.getAttribute('href')?.includes('framer-motion') ||
            link.getAttribute('href')?.includes('/dashboard/')) {
          link.remove();
        }
      });
    };
  }, []);

  return null; // This component doesn't render anything
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}