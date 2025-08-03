import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface MetricsHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date;
}

export function MetricsHeader({ onRefresh, isRefreshing, lastUpdated }: MetricsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-semibold">Key Metrics</h2>
        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {onRefresh && (
        <motion.button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : 0 }}
            transition={{ 
              duration: 1, 
              repeat: isRefreshing ? Infinity : 0,
              ease: "linear"
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </motion.div>
          Refresh
        </motion.button>
      )}
    </div>
  );
}