// src/features/Waybills/utils/waybillUtils.ts
import { Waybill } from '../types/types';

/**
 * Format waybill number
 */
export const formatWaybillNumber = (number: string): string => {
  // Implement based on your waybill number format
  return number.toUpperCase();
};

/**
 * Calculate total weight of a waybill
 */
export const calculateTotalWeight = (waybill: Waybill): number => {
  return waybill.items.reduce((total, item) => total + (item.weight || 0), 0);
};

/**
 * Calculate total volume of a waybill
 */
export const calculateTotalVolume = (waybill: Waybill): number => {
  return waybill.items.reduce((total, item) => {
    const itemVolume = (item.dimensions?.length || 0) * 
                       (item.dimensions?.width || 0) * 
                       (item.dimensions?.height || 0);
    return total + itemVolume;
  }, 0);
};

/**
 * Calculate total value of a waybill
 */
export const calculateTotalValue = (waybill: Waybill): number => {
  return waybill.items.reduce((total, item) => total + (item.declaredValue || 0), 0);
};

/**
 * Check if waybill is valid
 */
export const isWaybillValid = (waybill: Waybill): boolean => {
  // Check required fields
  return !!(
    waybill.shipper &&
    waybill.consignee &&
    waybill.origin &&
    waybill.destination &&
    waybill.items && 
    waybill.items.length > 0
  );
};

/**
 * Generate waybill number
 */
export const generateWaybillNumber = (): string => {
  const prefix = 'WB';
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `${prefix}${datePart}${randomPart}`;
};