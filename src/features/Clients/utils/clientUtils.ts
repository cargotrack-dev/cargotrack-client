// src/features/clients/utils/clientUtils.ts

/**
 * Format client name for display - combines name and company if available
 */
export const formatClientName = (client: { name: string; company?: string }) => {
    if (client.company) {
      return `${client.name} (${client.company})`;
    }
    return client.name;
  };
  
  /**
   * Format client address into a single string
   */
  export const formatClientAddress = (address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    if (!address) return 'No address provided';
    
    const { street, city, state, postalCode, country } = address;
    return `${street}, ${city}, ${state} ${postalCode}, ${country}`;
  };
  
  /**
   * Get client status badge color
   */
  export const getClientStatusColor = (status: 'active' | 'inactive' | 'pending') => {
    const statusColors = {
      active: 'green',
      inactive: 'gray',
      pending: 'amber'
    };
    
    return statusColors[status] || 'gray';
  };
  
  /**
   * Sort clients by name, company, or status
   */
  export const sortClients = (
    clients: Array<{ name: string; company?: string; status: string }>,
    sortBy: 'name' | 'company' | 'status' = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ) => {
    return [...clients].sort((a, b) => {
      let valA: string;
      let valB: string;
      
      if (sortBy === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
      } else if (sortBy === 'company') {
        valA = (a.company || '').toLowerCase();
        valB = (b.company || '').toLowerCase();
      } else {
        valA = a.status.toLowerCase();
        valB = b.status.toLowerCase();
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };
  
  /**
   * Filter clients by search term (matches against name, company, or email)
   */
  export const filterClientsBySearchTerm = (
    clients: Array<{ name: string; company?: string; email: string }>,
    searchTerm: string
  ) => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(
      client => 
        client.name.toLowerCase().includes(term) ||
        (client.company && client.company.toLowerCase().includes(term)) ||
        client.email.toLowerCase().includes(term)
    );
  };
  
  /**
   * Generate initials from client name for avatar placeholders
   */
  export const getClientInitials = (name: string) => {
    if (!name) return '';
    
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };