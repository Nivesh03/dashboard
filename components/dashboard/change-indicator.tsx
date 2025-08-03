import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChangeIndicatorProps {
  value: number;
  type: 'increase' | 'decrease';
  className?: string;
}

export function ChangeIndicator({ value, type, className }: ChangeIndicatorProps) {
  const isPositive = type === 'increase';
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  return (
    <motion.div
      className={cn(
        "flex items-center gap-1 text-xs font-medium",
        isPositive 
          ? "text-green-600 dark:text-green-400" 
          : "text-red-600 dark:text-red-400",
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <motion.div
        animate={{ 
          rotate: isPositive ? 0 : 180,
          y: isPositive ? -1 : 1 
        }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="h-3 w-3" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </motion.span>
    </motion.div>
  );
}