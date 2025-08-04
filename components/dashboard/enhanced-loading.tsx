"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingProps {
  variant?: "spinner" | "dots" | "bars" | "pulse" | "skeleton";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function EnhancedLoading({
  variant = "spinner",
  size = "md",
  text,
  className,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const containerClasses = cn("flex items-center justify-center", className);

  if (variant === "spinner") {
    return (
      <div className={containerClasses}>
        <motion.div
          className={cn(
            "rounded-full border-2 border-muted border-t-primary",
            sizeClasses[size]
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        {text && (
          <span className="ml-2 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2 w-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <span className="ml-3 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "bars") {
    return (
      <div className={containerClasses}>
        <div className="flex space-x-1 items-end">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className="w-1 bg-primary rounded-full"
              animate={{
                height: ["8px", "20px", "8px"],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        {text && (
          <span className="ml-3 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={containerClasses}>
        <motion.div
          className={cn("bg-primary rounded-full", sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <span className="ml-2 text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        <motion.div
          className="h-4 bg-muted rounded animate-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="h-4 bg-muted rounded animate-pulse w-3/4"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.2,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="h-4 bg-muted rounded animate-pulse w-1/2"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.4,
            ease: "easeInOut",
          }}
        />
      </div>
    );
  }

  return null;
}

// Overlay loading component
export function LoadingOverlay({
  isVisible,
  text = "Loading...",
  variant = "spinner",
}: {
  isVisible: boolean;
  text?: string;
  variant?: LoadingProps["variant"];
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border rounded-lg p-6 shadow-lg"
      >
        <EnhancedLoading variant={variant} text={text} />
      </motion.div>
    </motion.div>
  );
}

// Button loading state
export function ButtonLoading({
  isLoading,
  children,
  loadingText = "Loading...",
  className,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      animate={{
        opacity: isLoading ? 0.7 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <EnhancedLoading variant="spinner" size="sm" />
          <span className="ml-2">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
