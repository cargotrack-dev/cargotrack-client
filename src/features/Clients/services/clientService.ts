// src/features/clients/services/clientService.ts
import axios from 'axios';
import { Client, ClientPreferences, ClientFeedback, Quote } from '../types';

// Create a basic API client (replace with your actual API client if needed)
const api = axios.create({
  baseURL: '/api',
});

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  const response = await api.get('/clients');
  return response.data;
};

export const getClientById = async (id: string): Promise<Client> => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> => {
  const response = await api.post('/clients', data);
  return response.data;
};

export const updateClient = async (id: string, data: Partial<Client>): Promise<Client> => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
};

// Client preferences
export const getClientPreferences = async (clientId: string): Promise<ClientPreferences> => {
  const response = await api.get(`/clients/${clientId}/preferences`);
  return response.data;
};

export const updateClientPreferences = async (clientId: string, preferences: Partial<ClientPreferences>): Promise<ClientPreferences> => {
  const response = await api.put(`/clients/${clientId}/preferences`, preferences);
  return response.data;
};

// Client feedback
export const getClientFeedback = async (clientId: string): Promise<ClientFeedback[]> => {
  const response = await api.get(`/clients/${clientId}/feedback`);
  return response.data;
};

export const submitClientFeedback = async (clientId: string, feedback: Omit<ClientFeedback, 'id' | 'clientId' | 'createdAt' | 'status'>): Promise<ClientFeedback> => {
  const response = await api.post(`/clients/${clientId}/feedback`, feedback);
  return response.data;
};

// Quotes
export const getClientQuotes = async (clientId: string): Promise<Quote[]> => {
  const response = await api.get(`/clients/${clientId}/quotes`);
  return response.data;
};

export const createQuote = async (clientId: string, quoteData: Omit<Quote, 'id' | 'clientId' | 'createdAt' | 'status'>): Promise<Quote> => {
  const response = await api.post(`/clients/${clientId}/quotes`, quoteData);
  return response.data;
};

export const updateQuoteStatus = async (quoteId: string, status: Quote['status']): Promise<Quote> => {
  const response = await api.patch(`/quotes/${quoteId}/status`, { status });
  return response.data;
};