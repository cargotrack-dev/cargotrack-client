// src/features/clients/index.ts
// Export components
export { default as ClientPortal } from './components/ClientPortal';
export { default as CustomerFeedback } from './components/CustomerFeedback';
export { default as NotificationPreferences } from './components/NotificationPreferences';
export { default as QuoteBuilder } from './components/QuoteBuilder';

// Export pages
export { default as ClientDashboard } from './pages/ClientDashboard';
export { default as ClientDetails } from './pages/ClientDetails';
export { default as ClientNew } from './pages/ClientNew';
export { default as ClientEdit } from './pages/Clientedit';


// Export hooks
export { useClients, useClient } from './hooks/useClients.ts';
export { useClientPreferences } from './hooks/useClientPreferences';

// Export services
export {
  getClients,
  getClientById,
  createClient,
  updateClient,
  getClientPreferences,
  updateClientPreferences,
  getClientFeedback,
  submitClientFeedback,
  getClientQuotes,
  createQuote,
  updateQuoteStatus
} from './services/clientService';

//Clients Utils
export {
    formatClientName,
    formatClientAddress,
    getClientStatusColor,
    sortClients,
    filterClientsBySearchTerm,
    getClientInitials
} from './utils/clientUtils';

// Export types
export type {
  Client,
  ClientPreferences,
  ClientFeedback,
  Quote
} from './types';