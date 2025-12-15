// src/features/Waybills/services/waybillService.ts
import axios from 'axios';
import { Waybill } from '../types/types';

// Define the invoice interface
interface Invoice {
  id: string;
  invoiceNumber: string;
  waybillId: string;
  createdAt: string;
  dueDate: string;
  status: string;
  customer: {
    name: string;
    address: string;
    email?: string;
    phone?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax?: number;
  total: number;
  notes?: string;
}

// Create a basic client
const api = axios.create({
  baseURL: '/api',
});

/**
 * Get all waybills
 */
export const getWaybills = async (filters = {}): Promise<Waybill[]> => {
  try {
    const response = await api.get('/waybills', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching waybills:', error);
    throw error;
  }
};

/**
 * Get waybill by ID
 */
export const getWaybillById = async (id: string): Promise<Waybill> => {
  try {
    const response = await api.get(`/waybills/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching waybill with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new waybill
 */
export const createWaybill = async (waybillData: Omit<Waybill, 'id' | 'createdAt'>): Promise<Waybill> => {
  try {
    const response = await api.post('/waybills', waybillData);
    return response.data;
  } catch (error) {
    console.error('Error creating waybill:', error);
    throw error;
  }
};

/**
 * Update an existing waybill
 */
export const updateWaybill = async (id: string, waybillData: Partial<Waybill>): Promise<Waybill> => {
  try {
    const response = await api.put(`/waybills/${id}`, waybillData);
    return response.data;
  } catch (error) {
    console.error(`Error updating waybill with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a waybill
 */
export const deleteWaybill = async (id: string): Promise<void> => {
  try {
    await api.delete(`/waybills/${id}`);
  } catch (error) {
    console.error(`Error deleting waybill with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Generate PDF for waybill
 */
export const generateWaybillPdf = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/waybills/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  } catch (error) {
    console.error(`Error generating PDF for waybill with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Generate invoice from waybill
 */
export const generateInvoiceFromWaybill = async (id: string): Promise<Invoice> => {
  try {
    const response = await api.post(`/waybills/${id}/generate-invoice`);
    return response.data;
  } catch (error) {
    console.error(`Error generating invoice from waybill with ID ${id}:`, error);
    throw error;
  }
};