// src/pages/cargo/CargoList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CargoListComponent from '../components/CargoList';
import { Cargo } from '../types/cargo';
import CargoService from '../services/CargoService';

const CargoListPage: React.FC = () => {
  const [cargoItems, setCargoItems] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCargo = async () => {
      try {
        setIsLoading(true);
        const items = await CargoService.getAllCargo();
        setCargoItems(items);
      } catch (error) {
        console.error('Error fetching cargo items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCargo();
  }, []);

  const handleViewDetails = (cargoId: string) => {
    navigate(`/cargo/${cargoId}`);
  };

  const handleEdit = (cargoId: string) => {
    navigate(`/cargo/${cargoId}/edit`);
  };

  const handleDelete = async (cargoId: string) => {
    try {
      await CargoService.deleteCargo(cargoId);
      // Remove the deleted item from the state
      setCargoItems(prevItems => prevItems.filter(item => item.id !== cargoId));
    } catch (error) {
      console.error('Error deleting cargo:', error);
    }
  };

  const handleCreateShipment = (cargoId: string) => {
    navigate(`/shipments/new?cargoId=${cargoId}`);
  };

  return (
    <div className="p-4">
      <CargoListComponent
        cargoItems={cargoItems}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateShipment={handleCreateShipment}
      />
    </div>
  );
};

export default CargoListPage;