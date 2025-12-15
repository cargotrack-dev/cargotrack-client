// src/features/Invoices/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Environment-specific configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.cargotrack.com/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Creates a configured Axios instance for API requests
 * @returns Configured Axios instance
 */
export const createApiClient = (): AxiosInstance => {
  const instance = axios.create(API_CONFIG);
  
  // Request interceptor for adding auth tokens
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor for handling auth errors and refreshing tokens
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // Handle 401 errors with token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Attempt to refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          
          if (!refreshToken) {
            // No refresh token available, redirect to login
            handleAuthError();
            return Promise.reject(error);
          }
          
          // Call refresh token endpoint
          const refreshResponse = await axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { token, refresh_token } = refreshResponse.data;
          
          // Store new tokens
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Update authorization headers
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Retry the original request
          return instance(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, log out the user
          handleAuthError();
          return Promise.reject(refreshError);
        }
      }
      
      // Handle 403 Forbidden errors (insufficient permissions)
      if (error.response?.status === 403) {
        window.dispatchEvent(new Event('auth:forbidden'));
      }
      
      // Handle offline status
      if (!error.response) {
        window.dispatchEvent(new Event('app:offline'));
      }
      
      return Promise.reject(error);
    }
  );
  
  return instance;
};

/**
 * Handle authentication errors by clearing tokens and redirecting
 */
const handleAuthError = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  
  // Dispatch event for unauthorized access
  window.dispatchEvent(new Event('auth:unauthorized'));
};

// Export pre-configured Axios instance
export const apiClient = createApiClient();

// Export generic typed request methods
export const apiRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T, AxiosResponse<T>>(url, config),
    
  post: <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig) => 
    apiClient.post<T, AxiosResponse<T>>(url, data, config),
    
  put: <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig) => 
    apiClient.put<T, AxiosResponse<T>>(url, data, config),
    
  patch: <T, D = Record<string, unknown>>(url: string, data?: D, config?: AxiosRequestConfig) => 
    apiClient.patch<T, AxiosResponse<T>>(url, data, config),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T, AxiosResponse<T>>(url, config),
};

export default apiClient;