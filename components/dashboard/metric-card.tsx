import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangeIndicator } from "./change-indicator";
import { MetricCard as MetricCardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MetricCardProps {
  metric: MetricCardType;
  className?: string;
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const { title, value, change, changeType, icon: Icon, format } = metric;
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate value changes
  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  // Format the value based on the format type
  const formatValue = (val: string | number): string => {
    const numValue = typeof val === 'string' ? parseFloat(val) : val;
    
    // Handle invalid numbers
    if (isNaN(numValue)) {
      return 'N/A';
    }
    
    try {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(numValue);
        case 'percentage':
          return `${numValue.toFixed(1)}%`;
        case 'number':
        default:
          return new Intl.NumberFormat('en-US').format(numValue);
      }
    } catch (error) {
      console.warn('Error formatting value:', error);
      return String(numValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("transition-all duration-200 hover:shadow-md", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div
            animate={{ 
              scale: isAnimating ? 1.1 : 1,
              rotate: isAnimating ? 5 : 0 
            }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <motion.div 
                className="text-2xl font-bold tracking-tight"
                animate={{ 
                  scale: isAnimating ? 1.05 : 1,
                  color: isAnimating ? "hsl(var(--primary))" : "hsl(var(--foreground))"
                }}
                transition={{ duration: 0.2 }}
              >
                {formatValue(displayValue)}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <ChangeIndicator value={change} type={changeType} />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}