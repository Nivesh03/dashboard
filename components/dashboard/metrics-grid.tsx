import { MetricCard } from "./metric-card";
import { MetricsGridSkeleton } from "./skeletons";
import { MetricCard as MetricCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricsGridProps {
  metrics?: MetricCardType[];
  isLoading?: boolean;
  className?: string;
}

export function MetricsGrid({ metrics, isLoading, className }: MetricsGridProps) {
  if (isLoading) {
    return <MetricsGridSkeleton />;
  }

  if (!metrics || metrics.length === 0) {
    return (
      <motion.div 
        className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No metrics data available
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={cn(
        "grid gap-3 sm:gap-4", 
        "grid-cols-1 xs:grid-cols-2 lg:grid-cols-4",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <MetricCard metric={metric} />
        </motion.div>
      ))}
    </motion.div>
  );
}