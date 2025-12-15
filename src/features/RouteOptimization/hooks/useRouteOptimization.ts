// src/features/RouteOptimization/hooks/useRouteOptimization.ts
import { useState } from 'react';
import { Location, RouteConstraint, OptimizationResult } from '../types';
import { optimizeRoutes, saveOptimizedRoute } from '../services/routeOptimizationService';

export const useRouteOptimization = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const optimize = async (
    locations: Location[],
    constraints: RouteConstraint = {}
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const optimizationResult = await optimizeRoutes(locations, constraints);
      setResult(optimizationResult);
      return optimizationResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to optimize routes');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveRoute = async (name: string) => {
    if (!result) {
      throw new Error('No optimization result to save');
    }
    
    setLoading(true);
    
    try {
      const savedResult = await saveOptimizedRoute(result, name);
      return savedResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save route');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    optimize,
    saveRoute,
  };
};