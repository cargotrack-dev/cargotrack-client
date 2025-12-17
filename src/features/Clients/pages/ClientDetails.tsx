// src/features/Clients/pages/ClientDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../UI/components/ui/card';
import { Button } from '../../UI/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../UI/components/ui/tabs';
import { useClient } from '../hooks/useClients';
import { ClientPortal } from '../components/ClientPortal';
import { QuoteBuilder } from '../components/QuoteBuilder';
import { NotificationPreferences } from '../components/NotificationPreferences';

const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { client, loading, error } = useClient(id);
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 mb-4">Error loading client details</div>
        <Button variant="outline" onClick={() => navigate('/clients')}>
          Back to Clients
        </Button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-500 mb-4">Client not found</div>
        <Button variant="outline" onClick={() => navigate('/clients')}>
          Back to Clients
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleEdit = () => {
    navigate(`/clients/edit/${client.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          {client.company && <p className="text-gray-500">{client.company}</p>}
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/clients')}>Back</Button>
          <Button onClick={handleEdit}>Edit Client</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-500 block text-sm">Email</span>
              <span className="font-medium">{client.email}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-sm">Phone</span>
              <span className="font-medium">{client.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-sm">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block text-sm">Client Since</span>
              <span className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Address</h3>
          {client.address ? (
            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block text-sm">Street</span>
                <span className="font-medium">{client.address.street}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">City, State, Zip</span>
                <span className="font-medium">
                  {client.address.city}, {client.address.state} {client.address.postalCode}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-sm">Country</span>
                <span className="font-medium">{client.address.country}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No address information provided</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button className="w-full" onClick={() => setActiveTab('quotes')}>
              Create Quote
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate(`/shipments/new?clientId=${client.id}`)}>
              New Shipment
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate(`/invoices/new?clientId=${client.id}`)}>
              Generate Invoice
            </Button>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="portal">Client Portal</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Client Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                {/* This would be populated from actual activity data */}
                <p className="text-gray-500">No recent activity to display</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Account Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Active Shipments:</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pending Quotes:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Open Invoices:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Spend:</span>
                    <span className="font-medium">$12,450.00</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipments" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Client Shipments</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/shipments/new?clientId=${client.id}`)}
              >
                New Shipment
              </Button>
            </div>
            <p className="text-gray-500">This tab would display shipments associated with this client.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Quote Builder</h3>
            <QuoteBuilder clientId={client.id} />
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="mt-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Client Invoices</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/invoices/new?clientId=${client.id}`)}
              >
                New Invoice
              </Button>
            </div>
            <p className="text-gray-500">This tab would display invoices associated with this client.</p>
          </Card>
        </TabsContent>
        
        <TabsContent value="portal" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Client Portal Management</h3>
            <ClientPortal clientId={client.id} />
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <NotificationPreferences clientId={client.id} />
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <div>
            <span>Created: {new Date(client.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span>Last updated: {new Date(client.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;