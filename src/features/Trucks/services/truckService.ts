// src/features/Trucks/services/truckService.ts
import axios from 'axios';
import { Truck, TruckFilter, MaintenanceRecord } from '../types/truck.types';

// Create a basic client
const api = axios.create({
  baseURL: '/api',
});

/**
 * Get all trucks with optional filtering
 */
export const getTrucks = async (filters: TruckFilter = {}): Promise<Truck[]> => {
  try {
    const response = await api.get('/trucks', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching trucks:', error);
    throw error;
  }
};

/**
 * Get a single truck by ID
 */
export const getTruckById = async (id: string): Promise<Truck> => {
  try {
    const response = await api.get(`/trucks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching truck with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new truck
 */
export const createTruck = async (truckData: Omit<Truck, 'id'>): Promise<Truck> => {
  try {
    const response = await api.post('/trucks', truckData);
    return response.data;
  } catch (error) {
    console.error('Error creating truck:', error);
    throw error;
  }
};

/**
 * Update an existing truck
 */
export const updateTruck = async (id: string, truckData: Partial<Truck>): Promise<Truck> => {
  try {
    const response = await api.put(`/trucks/${id}`, truckData);
    return response.data;
  } catch (error) {
    console.error(`Error updating truck with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a truck
 */
export const deleteTruck = async (id: string): Promise<void> => {
  try {
    await api.delete(`/trucks/${id}`);
  } catch (error) {
    console.error(`Error deleting truck with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get maintenance records for a truck
 */
export const getTruckMaintenanceRecords = async (truckId: string): Promise<MaintenanceRecord[]> => {
  try {
    const response = await api.get(`/trucks/${truckId}/maintenance`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance records for truck with ID ${truckId}:`, error);
    throw error;
  }
};

/**
 * Assign driver to truck
 */
export const assignDriverToTruck = async (truckId: string, driverId: string): Promise<Truck> => {
  try {
    const response = await api.post(`/trucks/${truckId}/driver`, { driverId });
    return response.data;
  } catch (error) {
    console.error(`Error assigning driver to truck with ID ${truckId}:`, error);
    throw error;
  }
};