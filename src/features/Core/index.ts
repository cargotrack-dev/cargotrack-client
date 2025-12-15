// src/features/Core/index.ts - Ultra-simple fix (no namespaces, no complex exports)

// Export pages
export { default as LandingPage } from './pages/LandingPage';
export { default as NotFoundPage } from './pages/NotFound';

// Export services
export * from './services/CompanyService';

// Export API client
export * from './services/api';

// 🔧 SIMPLE FIX: Export Location with alias to avoid Shipments conflict
export type { Location as GeographicLocation } from './types/common';

// Export lib utilities
export * from './lib/utils';
export * from './lib/api';

// Export routes
export * from './routes/AppRoutes';