// src/features/Cargo/pages/CargoDetails.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/features/UI/components/ui/card';
import { Button } from '@/features/UI/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/features/UI/components/ui/tabs';
import { useCargoData } from '../hooks/useCargoData';
import { Cargo, CargoStatus, CargoType, HazardClass } from '../types/cargo';

const CargoDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useCargoData(id);
  const [activeTab, setActiveTab] = useState('details');
  
  const cargo = data as Cargo | null;

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
        <div className="text-red-500 mb-4">Error loading cargo details</div>
        <Button variant="outline" onClick={() => navigate('/cargo')}>
          Back to Cargo List
        </Button>
      </div>
    );
  }

  if (!cargo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-gray-500 mb-4">Cargo not found</div>
        <Button variant="outline" onClick={() => navigate('/cargo')}>
          Back to Cargo List
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: CargoStatus): string => {
    const statusColors: Partial<Record<CargoStatus, string>> = {
      [CargoStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [CargoStatus.SCHEDULED]: 'bg-blue-100 text-blue-800',
      [CargoStatus.IN_TRANSIT]: 'bg-indigo-100 text-indigo-800',
      [CargoStatus.DELIVERED]: 'bg-green-100 text-green-800',
      // Use the actual enum values from your cargo.ts file
      // [CargoStatus.RETURNED]: 'bg-purple-100 text-purple-800',
      // [CargoStatus.DAMAGED]: 'bg-orange-100 text-orange-800',
      // [CargoStatus.LOST]: 'bg-red-100 text-red-800',
      // [CargoStatus.ON_HOLD]: 'bg-gray-100 text-gray-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: CargoType): string => {
    const typeLabels: Partial<Record<CargoType, string>> = {
      [CargoType.GENERAL]: 'General Cargo',
      [CargoType.CONTAINER]: 'Container',
      [CargoType.LIQUID]: 'Liquid Bulk',
      [CargoType.PERISHABLE]: 'Perishable Goods',
      [CargoType.HAZARDOUS]: 'Hazardous Materials',
      // Add other cargo types from your enum as needed
      // [CargoType.BULK]: 'Bulk Cargo',
      // [CargoType.REFRIGERATED]: 'Refrigerated',
      // [CargoType.OVERSIZED]: 'Oversized',
      // [CargoType.LIVESTOCK]: 'Livestock',
    };
    return typeLabels[type] || 'Unknown';
  };

  const getHazardLabel = (hazardClass: HazardClass): string => {
    const hazardLabels: Partial<Record<HazardClass, string>> = {
      [HazardClass.NONE]: 'None',
      [HazardClass.EXPLOSIVE]: 'Class 1 - Explosive',
      [HazardClass.FLAMMABLE_LIQUID]: 'Class 3 - Flammable Liquid',
      [HazardClass.FLAMMABLE_SOLID]: 'Class 4 - Flammable Solid',
      [HazardClass.TOXIC]: 'Class 6 - Toxic Substance',
      [HazardClass.RADIOACTIVE]: 'Class 7 - Radioactive',
      [HazardClass.CORROSIVE]: 'Class 8 - Corrosive',
      [HazardClass.MISCELLANEOUS]: 'Class 9 - Miscellaneous',
      // Add other hazard classes from your enum as needed
      // [HazardClass.GASES]: 'Class 2 - Gases',
      // [HazardClass.OXIDIZER]: 'Class 5 - Oxidizers',
    };
    return hazardLabels[hazardClass] || 'Unknown';
  };

  const handleEdit = () => {
    navigate(`/cargo/edit/${cargo.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{cargo.reference}</h1>
          <p className="text-gray-500">Shipment ID: {cargo.shipmentId}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => navigate('/cargo')}>Back</Button>
          <Button onClick={handleEdit}>Edit Cargo</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-medium mb-4">Cargo Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(cargo.status)}`}>
                  {cargo.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">Type</span>
                <span>{getTypeLabel(cargo.type)}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Description</span>
                <span>{cargo.description}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Quantity</span>
                <span>{cargo.quantity} {cargo.quantityUnit}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Client</span>
                <span>{cargo.clientId}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Dimensions & Weight</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-gray-500 block">Length</span>
                  <span>{cargo.dimensions?.length} {cargo.dimensions?.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Width</span>
                  <span>{cargo.dimensions?.width} {cargo.dimensions?.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Height</span>
                  <span>{cargo.dimensions?.height} {cargo.dimensions?.unit}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block">Gross Weight</span>
                  <span>{cargo.weight?.gross} {cargo.weight?.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Net Weight</span>
                  <span>{cargo.weight?.net} {cargo.weight?.unit}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 block">Value</span>
                <span>{cargo.value?.amount} {cargo.value?.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
          <TabsTrigger value="hazard">Hazard Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6">
          <Card className="p-6">
            {cargo.handlingInstructions ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Handling Instructions</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-500 text-sm block">Orientation Required</span>
                      <span>{cargo.handlingInstructions.orientationRequired ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">Stackable</span>
                      <span>{cargo.handlingInstructions.stackable ? 'Yes' : 'No'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-sm block">Fragile</span>
                      <span>{cargo.handlingInstructions.fragile ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  {cargo.handlingInstructions.customInstructions && (
                    <div>
                      <span className="text-gray-500 text-sm block">Custom Instructions</span>
                      <p className="mt-1">{cargo.handlingInstructions.customInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Handling Instructions</h3>
                <p className="text-gray-500">No special handling instructions provided.</p>
              </div>
            )}

            {cargo.tags && cargo.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {cargo.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="hazard" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Hazard Classification</h3>
            <div className="mb-6">
              <span className="text-gray-500 block mb-2">Hazard Class</span>
              <span className={cargo.hazardClass !== HazardClass.NONE ? 'text-red-600 font-medium' : ''}>
                {getHazardLabel(cargo.hazardClass)}
              </span>
            </div>
            
            {cargo.hazardDetails && (
              <div className="mb-6">
                <span className="text-gray-500 block mb-2">Hazard Details</span>
                <p className="bg-red-50 p-4 rounded-md text-red-800">
                  {cargo.hazardDetails}
                </p>
              </div>
            )}
            
            {cargo.hazardClass === HazardClass.NONE && (
              <p className="text-gray-500">This cargo is not classified as hazardous.</p>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Associated Documents</h3>
            
            {cargo.documents && cargo.documents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cargo.documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {doc.notes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No documents attached to this cargo.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <div className="flex justify-between">
          <div>
            <span>Created by: {cargo.createdBy}</span>
            <span className="mx-2">•</span>
            <span>Created: {new Date(cargo.createdAt).toLocaleString()}</span>
          </div>
          <div>
            <span>Last updated: {new Date(cargo.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CargoDetails;