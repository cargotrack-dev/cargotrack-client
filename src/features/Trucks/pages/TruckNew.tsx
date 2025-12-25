// src/features/Trucks/pages/TruckNew.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import TruckForm, { TruckFormData } from '../components/TruckForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../UI/components/ui/card';

interface Truck extends TruckFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const TruckNew: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (formData: TruckFormData) => {
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate new truck ID (timestamp)
      const newTruckId = Date.now().toString();

      // Create complete truck object
      const newTruck: Truck = {
        ...formData,
        id: newTruckId,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Get existing trucks from localStorage
      const existingTrucksJSON = localStorage.getItem('cargotrack_trucks');
      let existingTrucks: Record<string, Truck> = {};

      if (existingTrucksJSON) {
        try {
          existingTrucks = JSON.parse(existingTrucksJSON);
        } catch (error) {
          console.error('Error parsing localStorage:', error);
        }
      }

      // Add new truck
      existingTrucks[newTruckId] = newTruck;

      // Save back to localStorage
      localStorage.setItem('cargotrack_trucks', JSON.stringify(existingTrucks));

      console.log('✅ New truck created and saved:', newTruck);

      // Show success message
      setSuccessMessage('✅ Truck created successfully!');

      // Redirect after brief delay
      setTimeout(() => {
        navigate(`/trucks/${newTruckId}`);
      }, 1500);
    } catch (err) {
      setError('Failed to create truck. Please try again.');
      console.error('Error creating truck:', err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/trucks');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-orange-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Truck</h1>
            <p className="text-gray-600">Add a new truck to your CargoTrack fleet</p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto">
        {/* Wrap TruckForm with loading state */}
        <div className={isSubmitting ? 'opacity-60 pointer-events-none' : ''}>
          <TruckForm 
            onSubmit={handleSubmit}
            initialData={{
              licensePlate: '',
              driverName: '',
              driverLicense: '',
              loadingLocation: '',
              destination: '',
              cargoType: '',
              cargoWeight: '',
              loadDate: '',
              eta: '',
              status: 'available'
            }}
          />
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20">
            <Card className="bg-white">
              <CardContent className="pt-6 flex flex-col items-center gap-4">
                <div className="animate-spin">
                  <div className="h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full"></div>
                </div>
                <p className="text-gray-700 font-medium">Creating truck...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="max-w-4xl mx-auto mt-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">💡 Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2">
            <p>• Fill in all required fields before submitting</p>
            <p>• License plate format should match your country's standards</p>
            <p>• Driver license number is required for tracking purposes</p>
            <p>• Estimated arrival date should be after the loading date</p>
            <p>• Your truck information will be automatically saved</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TruckNew;