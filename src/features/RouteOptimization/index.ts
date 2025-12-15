// src/features/RouteOptimization/index.ts
// Export components
export { default as RouteOptimizationForm } from './components/RouteOptimizationForm';
export { default as RouteOptimizationMap } from './components/RouteOptimizationMap';

// Export hooks
export { useRouteOptimization } from './hooks/useRouteOptimization';

// Export services
export {
  optimizeRoutes,
  getSavedRoutes,
  saveOptimizedRoute
} from './services/routeOptimizationService';

// Export types
export type {
  Location,
  RouteConstraint,
  RouteSegment,
  OptimizedRoute,
  OptimizationResult
} from './types';

// Export utils
export {
  calculateTotalDistance,
  calculateTotalDuration,
  formatDistance,
  formatDuration,
  getMapCenter,
  getMapBounds
} from './utils/routeUtils';