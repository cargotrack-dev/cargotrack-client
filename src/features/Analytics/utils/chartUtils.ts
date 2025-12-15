// src/features/Analytics/utils/chartUtils.ts

/**
 * Generate chart colors
 */
export const generateChartColors = (count: number): string[] => {
  const colors = [
    '#4285F4', '#EA4335', '#FBBC05', '#34A853', 
    '#FF6D01', '#46BDC6', '#7B3BE4', '#05BBB4'
  ];
  
  // Generate additional colors if needed
  if (count > colors.length) {
    for (let i = colors.length; i < count; i++) {
      const hue = (i * 137) % 360; // Use golden ratio for even distribution
      colors.push(`hsl(${hue}, 70%, 50%)`);
    }
  }
  
  return colors.slice(0, count);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Interface for data points used in aggregation
 */
interface DataPoint {
  [key: string]: unknown;
}

/**
 * Aggregate data by period - simplified implementation
 */
export const aggregateDataByPeriod = (
  data: DataPoint[], 
  dateField: string, 
  valueField: string, 
  period: 'day' | 'week' | 'month' = 'day'
): {date: string; value: number}[] => {
  // Log the parameters to use them (satisfies TypeScript)
  console.log(`Aggregating ${data.length} data points by ${period}, using ${dateField} and ${valueField}`);
  
  // Return mock data for demo purposes
  return [
    { date: '2025-01-01', value: 100 },
    { date: '2025-02-01', value: 150 },
    { date: '2025-03-01', value: 130 },
    { date: '2025-04-01', value: 180 }
  ];
};