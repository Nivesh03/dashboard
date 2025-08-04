import { Variants } from 'framer-motion';

// Optimized animation variants for better performance - prevents flash
export const fadeInVariants: Variants = {
  initial: { 
    opacity: 0
  },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const slideUpVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

export const scaleVariants: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 }
  }
};

// Reduced motion variants for accessibility
export const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } }
};

// Chart-specific animations
export const chartFadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
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