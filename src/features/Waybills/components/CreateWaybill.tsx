// src/pages/waybills/CreateWaybill.tsx
import WaybillForm from '../components/WaybillForm';
import { WaybillFormData } from '../types/types';

const CreateWaybillPage = () => {
  const mockTrucks = [
    { id: '1', licensePlate: 'TRK-001' },
    { id: '2', licensePlate: 'TRK-002' },
  ];
  
  const mockClients = [
    { id: '1', name: 'ACME Corp' },
    { id: '2', name: 'Global Shipping Ltd' },
  ];
  
  const handleSubmit = (data: WaybillFormData) => {
    console.log('Form submitted:', data);
    // Send to API
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Waybill</h1>
      <WaybillForm 
        onSubmit={handleSubmit}
        trucks={mockTrucks}
        clients={mockClients}
      />
    </div>
  );
};

export default CreateWaybillPage;