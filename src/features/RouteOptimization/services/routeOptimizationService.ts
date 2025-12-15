// src/features/RouteOptimization/services/routeOptimizationService.ts
import axios from 'axios';
import { Location, RouteConstraint, OptimizationResult } from '../types';

// Create a client
const api = axios.create({
  baseURL: '/api',
});

/**
 * Optimize routes for a set of locations
 */
export const optimizeRoutes = async (
  locations: Location[],
  constraints: RouteConstraint = {}
): Promise<OptimizationResult> => {
  try {
    const response = await api.post('/route-optimization', {
      locations,
      constraints,
    });
    return response.data;
  } catch (error) {
    console.error('Error optimizing routes:', error);
    throw error;
  }
};

/**
 * Get previously optimized routes
 */
export const getSavedRoutes = async (): Promise<OptimizationResult[]> => {
  try {
    const response = await api.get('/route-optimization/saved');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved routes:', error);
    throw error;
  }
};

/**
 * Save an optimized route
 */
export const saveOptimizedRoute = async (
  result: OptimizationResult,
  name: string
): Promise<OptimizationResult> => {
  try {
    const response = await api.post('/route-optimization/save', {
      result,
      name,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving optimized route:', error);
    throw error;
  }
};