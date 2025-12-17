// src/components/trucks/TruckForm.tsx
import React, { useState } from 'react';
import { Button } from '../../UI/components/ui/button';
import { Input } from '../../UI/components/ui/input';
import { Label } from '../../UI/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../UI/components/ui/select';
import { Truck, User, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';

interface TruckFormProps {
  onSubmit: (data: TruckFormData) => void;
  initialData?: TruckFormData;
}

export interface TruckFormData {
  licensePlate: string;
  driverName: string;
  driverLicense: string;
  loadingLocation: string;
  destination: string;
  cargoType: string;
  cargoWeight: string;
  loadDate: string;
  eta: string;
  status: 'available' | 'in_transit' | 'loading' | 'maintenance';
}

const TruckForm: React.FC<TruckFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<TruckFormData>(
    initialData || {
      licensePlate: '',
      driverName: '',
      driverLicense: '',
      loadingLocation: '',
      destination: '',
      cargoType: '',
      cargoWeight: '',
      loadDate: '',
      eta: '',
      status: 'available',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Truck Information Capture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Truck Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Truck Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="Enter truck license plate"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="loading">Loading</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Driver Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Driver Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="driverLicense">Driver License Number</Label>
                <Input
                  id="driverLicense"
                  name="driverLicense"
                  value={formData.driverLicense}
                  onChange={handleChange}
                  placeholder="Enter driver license number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Loading and Offloading Information */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-lg flex items-center mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              Loading & Destination Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loadingLocation">Loading Location</Label>
                <Input
                  id="loadingLocation"
                  name="loadingLocation"
                  value={formData.loadingLocation}
                  onChange={handleChange}
                  placeholder="Enter loading location"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  placeholder="Enter destination"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loadDate">Loading Date</Label>
                <Input
                  id="loadDate"
                  name="loadDate"
                  type="date"
                  value={formData.loadDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eta">Estimated Arrival Date</Label>
                <Input
                  id="eta"
                  name="eta"
                  type="date"
                  value={formData.eta}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Cargo Information */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-lg mb-4">Cargo Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cargoType">Cargo Type</Label>
                <Input
                  id="cargoType"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  placeholder="Enter cargo type"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                <Input
                  id="cargoWeight"
                  name="cargoWeight"
                  type="number"
                  value={formData.cargoWeight}
                  onChange={handleChange}
                  placeholder="Enter cargo weight"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="submit">Save Information</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TruckForm;