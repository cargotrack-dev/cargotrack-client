// src/features/Dashboard/utils/dashboardUtils.ts
import { DashboardWidget } from '../types';

/**
 * Calculate grid position for dashboard widgets
 */
export const calculateWidgetPositions = (widgets: DashboardWidget[], columns = 4) => {
  const result = [...widgets];
  let currentRow = 0;
  let currentCol = 0;
  
  result.forEach(widget => {
    // Determine widget width in grid columns
    let widthInColumns;
    switch (widget.width) {
      case 'small': widthInColumns = 1; break;
      case 'medium': widthInColumns = 2; break;
      case 'large': widthInColumns = 3; break;
      case 'full': widthInColumns = columns; break;
      default: widthInColumns = 1;
    }
    
    // If widget doesn't fit in current row, move to next row
    if (currentCol + widthInColumns > columns) {
      currentCol = 0;
      currentRow++;
    }
    
    // Set position
    widget.position = {
      x: currentCol,
      y: currentRow
    };
    
    // Update current column position
    currentCol += widthInColumns;
    
    // If we filled a row, move to next row
    if (currentCol >= columns) {
      currentCol = 0;
      currentRow++;
    }
  });
  
  return result;
};

/**
 * Format summary numbers for display
 */
export const formatSummaryNumber = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get status color based on value
 */
export const getStatusColor = (status: string) => {
  const statusColors: Record<string, string> = {
    delivered: 'green',
    inTransit: 'blue',
    pending: 'amber',
    paid: 'green',
    overdue: 'red',
    active: 'green',
    maintenance: 'amber',
    inactive: 'gray'
  };
  
  return statusColors[status] || 'gray';
};