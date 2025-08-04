"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverEffectProps {
  children: ReactNode;
  effect?: "lift" | "scale" | "glow" | "rotate" | "bounce" | "slide";
  className?: string;
  disabled?: boolean;
}

export function HoverEffect({
  children,
  effect = "lift",
  className,
  disabled = false,
}: HoverEffectProps) {
  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  const effects = {
    lift: {
      whileHover: {
        y: -2,
        boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
      },
      transition: { duration: 0.2 },
    },
    scale: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.2 },
    },
    glow: {
      whileHover: {
        boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
      },
      transition: { duration: 0.3 },
    },
    rotate: {
      whileHover: { rotate: 2 },
      transition: { duration: 0.2 },
    },
    bounce: {
      whileHover: {
        y: [-2, -4, -2],
      },
      transition: {
        duration: 0.6,
        times: [0, 0.5, 1],
      },
    },
    slide: {
      whileHover: { x: 4 },
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className={cn("cursor-pointer", className)}
      {...effects[effect]}
    >
      {children}
    </motion.div>
  );
}

// Interactive card wrapper
export function InteractiveCard({
  children,
  className,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        !disabled && "cursor-pointer",
        className
      )}
      whileHover={
        !disabled
          ? {
              y: -2,
              boxShadow: "0 4px 12px hsl(var(--foreground) / 0.1)",
            }
          : {}
      }
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

// Animated button wrapper
export function AnimatedButton({
  children,
  className,
  variant = "default",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  variant?: "default" | "ghost" | "outline";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline:
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2",
        variants[variant],
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
}

// Floating action button
export function FloatingButton({
  children,
  className,
  onClick,
  position = "bottom-right",
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}) {
  const positions = {
    "bottom-right": "fixed bottom-6 right-6",
    "bottom-left": "fixed bottom-6 left-6",
    "top-right": "fixed top-6 right-6",
    "top-left": "fixed top-6 left-6",
  };

  return (
    <motion.button
      className={cn(
        "z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg",
        positions[position],
        className
      )}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 8px 25px hsl(var(--primary) / 0.3)",
      }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.button>
  );
}

// Ripple effect component
export function RippleEffect({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      whileTap="tap"
      variants={{
        tap: {
          scale: 0.98,
        },
      }}
    >
      {children}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        variants={{
          tap: {
            scale: 4,
            opacity: [0, 1, 0],
            transition: { duration: 0.3 },
          },
        }}
      />
    </motion.div>
  );
}
