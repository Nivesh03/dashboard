import { Variants } from 'framer-motion';

// Optimized animation variants for better performance
export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    transition: { duration: 0.3 }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

// Reduced motion variants for accessibility
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } }
};

// Chart-specific animations
export const chartFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

export const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.15 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.15, ease: 'easeOut' }
  }
};

// Performance-optimized transition presets
export const fastTransition = { duration: 0.15, ease: 'easeOut' };
export const normalTransition = { duration: 0.3, ease: 'easeOut' };
export const slowTransition = { duration: 0.5, ease: 'easeOut' };

// Utility function to check for reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get appropriate variants based on motion preference
export const getMotionVariants = (variants: Variants) => {
  return shouldReduceMotion() ? reducedMotionVariants : variants;
};