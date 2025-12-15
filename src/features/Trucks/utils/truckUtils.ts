// src/features/Trucks/utils/truckUtils.ts
import { MaintenanceRecord, TruckStatus } from '../types/truck.types';

/**
 * Format license plate for display
 */
export const formatLicensePlate = (licensePlate: string): string => {
  // Implement based on your plate format requirements
  return licensePlate.toUpperCase();
};

/**
 * Calculate truck age in years
 */
export const calculateTruckAge = (manufacturingYear: number): number => {
  const currentYear = new Date().getFullYear();
  return currentYear - manufacturingYear;
};

/**
 * Check if truck is due for maintenance
 */
export const isDueForMaintenance = (
  lastMaintenanceDate: string | Date,
  maintenanceIntervalDays: number
): boolean => {
  const today = new Date();
  const lastMaintenance = new Date(lastMaintenanceDate);
  const daysSinceLastMaintenance = Math.floor(
    (today.getTime() - lastMaintenance.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceLastMaintenance >= maintenanceIntervalDays;
};

/**
 * Calculate total maintenance cost
 */
export const calculateTotalMaintenanceCost = (records: MaintenanceRecord[]): number => {
  return records.reduce((total, record) => total + (record.cost || 0), 0);
};

/**
 * Get color for truck status
 */
export const getTruckStatusColor = (status: TruckStatus): string => {
  const colors: Record<string, string> = {
    ACTIVE: 'green',
    MAINTENANCE: 'amber',
    OUT_OF_SERVICE: 'red',
    IDLE: 'gray',
    ASSIGNED: 'blue'
  };
  
  return colors[status] || 'gray';
};

/**
 * Format odometer reading with commas
 */
export const formatOdometer = (kilometers: number): string => {
  return kilometers.toLocaleString() + ' km';
};

/**
 * Calculate fuel efficiency
 */
export const calculateFuelEfficiency = (distanceKm: number, fuelLiters: number): number => {
  if (fuelLiters === 0) return 0;
  return distanceKm / fuelLiters;
};