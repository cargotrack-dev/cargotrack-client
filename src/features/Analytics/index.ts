// src/features/Analytics/index.ts

// Export components
export { default as AnalyticsDashboard } from './components/AnalyticsDashboard';

// Export pages
export { default as Dashboard } from './pages/Dashboard';
export { default as ReportDashboard } from './pages/ReportDashboard';
export { default as ReportViewer } from './pages/ReportViewer';

// Export hooks - fixed export name
export { useAnalytics } from './hooks/useAnalytics';

// Export services - fixed path
export { 
  getAnalyticsData,
  getReportData,
  generateReport 
} from './services/analyticsService.ts';

// Export types - fixed path
export type { 
  AnalyticsParams,
  ReportConfig 
} from './services/analyticsService.ts';

// Export utils
export {
  generateChartColors,
  formatDate,
  aggregateDataByPeriod
} from './utils/chartUtils';

// Export MonthlyStatistics page
export { default as MonthlyStatisticsPage } from './pages/MonthlyStatistics';