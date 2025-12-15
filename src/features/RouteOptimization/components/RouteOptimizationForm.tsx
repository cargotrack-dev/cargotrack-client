// client/src/components/RouteOptimization/RouteOptimizationForm.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Autocomplete, 
  Divider, 
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { apiClient } from '../services/api/apiClient';

interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  model: string;
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
}

interface OptimizationParameters {
  prioritizeFuel?: boolean;
  prioritizeTime?: boolean;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  preferredStopLocations?: string[];
  maxDrivingHoursPerDay?: number;
  requiredRestHours?: number;
  avoidWeatherConditions?: string[];
}

interface RouteOptimizationFormProps {
  onRouteCreated: (routeId: string) => void;
}

const RouteOptimizationForm: React.FC<RouteOptimizationFormProps> = ({ onRouteCreated }) => {
  // Form state
  const [originAddress, setOriginAddress] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [cargoWeight, setCargoWeight] = useState<number | ''>('');
  const [departureTime, setDepartureTime] = useState<Date | null>(new Date());
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  
  // Optimization parameters
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParameters>({
    prioritizeFuel: false,
    prioritizeTime: true,
    avoidTolls: false,
    avoidHighways: false,
    preferredStopLocations: [],
    maxDrivingHoursPerDay: 11,
    requiredRestHours: 10,
    avoidWeatherConditions: ['heavy snow', 'ice', 'thunderstorm']
  });
  
  // Data for selectors
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const weatherConditions = [
    'heavy rain', 'thunderstorm', 'snow', 'ice', 'fog', 'high winds', 'hail'
  ];
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Load vehicles and drivers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch vehicles
        const vehiclesResponse = await apiClient.get('/api/vehicles');
        if (vehiclesResponse.data.success) {
          setVehicles(vehiclesResponse.data.data);
        }
        
        // Fetch drivers
        const driversResponse = await apiClient.get('/api/drivers');
        if (driversResponse.data.success) {
          setDrivers(driversResponse.data.data);
        }
        
        // Fetch preferred truck stop locations
        const locationsResponse = await apiClient.get('/api/preferences/truck-stops');
        if (locationsResponse.data.success) {
          setPreferredLocations(locationsResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching form data:', err);
        setError('Failed to load vehicles and drivers data.');
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!originAddress || !destinationAddress || !selectedVehicleId || !selectedDriverId) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/api/routes/optimize', {
        originAddress,
        destinationAddress,
        cargoWeight: cargoWeight === '' ? 0 : cargoWeight,
        departureTime,
        vehicleId: selectedVehicleId,
        driverId: selectedDriverId,
        parameters: optimizationParams
      });
      
      if (response.data.success) {
        setSuccess(true);
        
        // Call the callback with the new route ID
        onRouteCreated(response.data.data.routeId);
        
        // Reset form after successful submission
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to create optimized route.');
      }
    } catch (err) {
      console.error('Error creating optimized route:', err);
      setError('An error occurred while creating the optimized route.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptimizationParamChange = (
    param: keyof OptimizationParameters,
    value: unknown
  ) => {
    setOptimizationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h5" gutterBottom>Create Optimized Route</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Route optimization created successfully!
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Basic Route Information */}
          <Box>
            <TextField
              label="Origin Address"
              fullWidth
              required
              value={originAddress}
              onChange={(e) => setOriginAddress(e.target.value)}
              margin="normal"
            />
          </Box>
          
          <Box>
            <TextField
              label="Destination Address"
              fullWidth
              required
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              margin="normal"
            />
          </Box>
          
          <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
            <TextField
              label="Cargo Weight (kg)"
              fullWidth
              type="number"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(e.target.value === '' ? '' : Number(e.target.value))}
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
          
          <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="vehicle-select-label">Vehicle</InputLabel>
              <Select
                labelId="vehicle-select-label"
                value={selectedVehicleId}
                label="Vehicle"
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                required
              >
                {vehicles.map(vehicle => (
                  <MenuItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name} ({vehicle.licensePlate})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="driver-select-label">Driver</InputLabel>
              <Select
                labelId="driver-select-label"
                value={selectedDriverId}
                label="Driver"
                onChange={(e) => setSelectedDriverId(e.target.value)}
                required
              >
                {drivers.map(driver => (
                  <MenuItem key={driver.id} value={driver.id}>
                    {driver.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Departure Time"
                value={departureTime}
                onChange={(newValue) => setDepartureTime(newValue)}
                sx={{ width: '100%', mt: 2 }}
              />
            </LocalizationProvider>
          </Box>
          
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Optimization Parameters</Typography>
          </Box>
          
          {/* Optimization Priorities */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Priorities</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimizationParams.prioritizeFuel}
                    onChange={(e) => handleOptimizationParamChange('prioritizeFuel', e.target.checked)}
                  />
                }
                label="Prioritize Fuel Efficiency"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimizationParams.prioritizeTime}
                    onChange={(e) => handleOptimizationParamChange('prioritizeTime', e.target.checked)}
                  />
                }
                label="Prioritize Time Efficiency"
              />
            </FormGroup>
          </Box>
          
          {/* Route Preferences */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Route Preferences</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimizationParams.avoidTolls}
                    onChange={(e) => handleOptimizationParamChange('avoidTolls', e.target.checked)}
                  />
                }
                label="Avoid Tolls"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={optimizationParams.avoidHighways}
                    onChange={(e) => handleOptimizationParamChange('avoidHighways', e.target.checked)}
                  />
                }
                label="Avoid Highways"
              />
            </FormGroup>
          </Box>
          
          {/* Driver Hours */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Driver Hours</Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Max Driving Hours/Day"
                type="number"
                value={optimizationParams.maxDrivingHoursPerDay}
                onChange={(e) => handleOptimizationParamChange(
                  'maxDrivingHoursPerDay', 
                  e.target.value === '' ? '' : Number(e.target.value)
                )}
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 14 } }}
              />
              
              <TextField
                label="Required Rest Hours"
                type="number"
                value={optimizationParams.requiredRestHours}
                onChange={(e) => handleOptimizationParamChange(
                  'requiredRestHours', 
                  e.target.value === '' ? '' : Number(e.target.value)
                )}
                margin="normal"
                InputProps={{ inputProps: { min: 1, max: 24 } }}
              />
            </Stack>
          </Box>
          
          {/* Weather Conditions to Avoid */}
          <Box>
            <Typography variant="subtitle1" gutterBottom>Weather Conditions to Avoid</Typography>
            <Autocomplete
              multiple
              options={weatherConditions}
              value={optimizationParams.avoidWeatherConditions || []}
              onChange={(_, newValue) => handleOptimizationParamChange('avoidWeatherConditions', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Weather Conditions"
                  margin="normal"
                />
              )}
            />
          </Box>
          
          {/* Preferred Stop Locations */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography variant="subtitle1" gutterBottom>Preferred Stop Locations</Typography>
            <Autocomplete
              multiple
              options={preferredLocations}
              value={optimizationParams.preferredStopLocations || []}
              onChange={(_, newValue) => handleOptimizationParamChange('preferredStopLocations', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Preferred Stop Locations"
                  margin="normal"
                />
              )}
            />
          </Box>
          
          {/* Submit Button */}
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Create Optimized Route'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default RouteOptimizationForm;