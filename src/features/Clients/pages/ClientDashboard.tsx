// src/features/Clients/pages/ClientDashboard.tsx
import React, { useState } from 'react';
import { Card } from '../../UI/components/ui/card';
import { useClients } from '../hooks/useClients';
import { Button } from '../../UI/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../UI/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../UI/components/ui/tabs';

const ClientDashboard: React.FC = () => {
  const { clients, loading } = useClients();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredClients = clients.filter(client => {
    // Filter by status if not "all"
    if (activeTab !== 'all' && client.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !client.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !client.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading client data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <p className="text-gray-500">Manage your clients and their information</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate('/clients/new')}>
            Add New Client
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Clients</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">{clients.length}</span>
            <span className="ml-2 text-sm text-gray-500">clients</span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Active Clients</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {clients.filter(c => c.status === 'active').length}
            </span>
            <span className="ml-2 text-sm text-gray-500">clients</span>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Pending Clients</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {clients.filter(c => c.status === 'pending').length}
            </span>
            <span className="ml-2 text-sm text-gray-500">clients</span>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        <Tabs 
          defaultValue="all" 
          className="w-full md:w-auto mb-4 md:mb-0"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="w-full md:w-64">
          <Input 
            placeholder="Search clients..." 
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 px-6 py-3">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </div>
              <div className="col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </div>
              <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </div>
              <div className="col-span-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div key={client.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-4 flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {getInitials(client.name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-sm text-gray-500">
                          {client.company && <span>{client.company}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 flex flex-col justify-center">
                      <div className="text-sm text-gray-900">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(client.status)}`}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </span>
                    </div>
                    <div className="col-span-3 flex justify-end items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/clients/edit/${client.id}`)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-gray-500">
                No clients found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;