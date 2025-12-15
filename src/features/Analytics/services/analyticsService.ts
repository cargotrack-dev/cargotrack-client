// src/features/Analytics/services/analyticsService.ts
// Import from the correct location based on your project structure
import axios from 'axios'; // Fallback if apiClient doesn't exist

// Define interfaces for report data
export interface ReportConfig {
  title: string;
  type: 'financial' | 'operational' | 'performance';
  dateRange: {
    start: string;
    end: string;
  };
  filters?: Record<string, string | number | boolean>;
  format?: 'pdf' | 'csv' | 'excel';
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  type?: string;
}

// Create a basic client if you don't have access to the existing apiClient
const client = axios.create({
  baseURL: '/api', // Adjust based on your API URL
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAnalyticsData = async (params: AnalyticsParams = {}) => {
  // Use the local client instead of importing apiClient
  const response = await client.get('/analytics', { params });
  return response.data;
};

export const getReportData = async (reportId: string) => {
  const response = await client.get(`/reports/${reportId}`);
  return response.data;
};

export const generateReport = async (config: ReportConfig) => {
  const response = await client.post('/reports/generate', config);
  return response.data;
};