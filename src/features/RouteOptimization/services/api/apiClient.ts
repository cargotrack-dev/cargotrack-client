// src/features/RouteOptimization/services/api/apiClient.ts
import axios from 'axios';

// Create a base axios instance with default configuration
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - can be used to add auth headers, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage if it exists
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - can be used for error handling, etc.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Remove auth token and redirect to login if needed
        localStorage.removeItem('authToken');
        
        // You could also redirect to login page if needed:
        // window.location.href = '/login';
      }
      
      // You could also handle other specific status codes here
      
      // Return structured error data if available
      if (error.response.data) {
        return Promise.reject(error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// You can also create specialized API methods here
export const api = {
  get: async <T>(url: string, params?: object) => {
    const response = await apiClient.get<T>(url, { params });
    return response.data;
  },
  
  post: async <T>(url: string, data?: object) => {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  },
  
  put: async <T>(url: string, data?: object) => {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  },
  
  delete: async <T>(url: string) => {
    const response = await apiClient.delete<T>(url);
    return response.data;
  }
};