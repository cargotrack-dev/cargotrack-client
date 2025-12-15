// src/features/cargo/index.ts

// Export components
export { default as CargoDashboard } from './components/CargoDashboard';
export { default as CargoDetails } from './components/CargoDetails';
export { default as CargoForm } from './components/CargoForm';
export { default as CargoList } from './components/CargoList';

// Export pages
export { default as CargoDetailsPage } from './pages/CargoDetails';
export { default as CargoListPage } from './pages/CargoList';

// Export hooks
export { useCargoData } from './hooks/useCargoData';

// Re-export types
export * from './types/cargo';