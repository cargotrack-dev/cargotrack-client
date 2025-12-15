// client/src/components/RouteOptimization/RouteOptimizationMap.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Chip, Stack, Card, CardContent } from '@mui/material';
import { apiClient } from '../services/api/apiClient';

// You'll need to install this package:
// npm install --save @react-google-maps/api @types/google-maps
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow } from '@react-google-maps/api';

interface RouteOptimizationMapProps {
  routeId: string;
}

interface RouteData {
  routeId: string;
  originalDistance: number;
  optimizedDistance: number;
  originalDuration: number;
  optimizedDuration: number;
  fuelSavings: number;
  timeSavings: number;
  optimizedWaypoints: Array<{
    location: {
      lat: number;
      lng: number;
    };
    address: string;
    estimatedArrivalTime: string;
    stopDuration?: number;
  }>;
  weatherAlerts: Array<{
    location: {
      lat: number;
      lng: number;
    };
    condition: string;
    severity: 'low' | 'medium' | 'high';
    timeFrame: {
      start: string;
      end: string;
    };
  }>;
  trafficAlerts: Array<{
    location: {
      lat: number;
      lng: number;
    };
    description: string;
    severity: 'low' | 'medium' | 'high';
    estimatedDelay: number;
  }>;
  estimatedArrival: string;
  restStops: Array<{
    location: {
      lat: number;
      lng: number;
    };
    address: string;
    facilities: string[];
    arrivalTime: string;
    departureTime: string;
    durationMinutes: number;
  }>;
}

const RouteOptimizationMap: React.FC<RouteOptimizationMapProps> = ({ routeId }) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  
  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/routes/optimize/${routeId}`);
        
        if (response.data.success) {
          setRouteData(response.data.data);
          
          // Set map center to the middle of the route
          if (response.data.data.optimizedWaypoints && response.data.data.optimizedWaypoints.length > 0) {
            const midpointIndex = Math.floor(response.data.data.optimizedWaypoints.length / 2);
            setMapCenter(response.data.data.optimizedWaypoints[midpointIndex].location);
          }
        } else {
          setError('Failed to fetch route data');
        }
      } catch (err) {
        setError('An error occurred while fetching route data');
        console.error('Error fetching route data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (routeId) {
      fetchRouteData();
    }
  }, [routeId]);

  // Fixed getMarkerIcon function to use google.maps.Size
  const getMarkerIcon = (type: 'start' | 'end' | 'waypoint' | 'rest' | 'weather' | 'traffic') => {
    let url = '';
    
    switch (type) {
      case 'start':
        url = '/icons/start-marker.svg';
        break;
      case 'end':
        url = '/icons/end-marker.svg';
        break;
      case 'waypoint':
        url = '/icons/waypoint-marker.svg';
        break;
      case 'rest':
        url = '/icons/rest-marker.svg';
        break;
      case 'weather':
        url = '/icons/weather-marker.svg';
        break;
      case 'traffic':
        url = '/icons/traffic-marker.svg';
        break;
      default:
        url = '/icons/default-marker.svg';
    }
    
    // Just return the URL - or use proper Size objects in LoadScript context
    return url;
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low':
        return '#FFCC00'; // Yellow
      case 'medium':
        return '#FF9900'; // Orange
      case 'high':
        return '#FF0000'; // Red
      default:
        return '#FFCC00';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="500px">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading route data...</Typography>
      </Box>
    );
  }

  if (error || !routeData) {
    return (
      <Paper elevation={3} sx={{ p: 3, bgcolor: '#FFF5F5' }}>
        <Typography variant="h6" color="error">Error Loading Route</Typography>
        <Typography variant="body1">{error || 'No route data available'}</Typography>
      </Paper>
    );
  }

  // Format timestamps to readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Calculate path from waypoints for Polyline
  const routePath = routeData.optimizedWaypoints.map(waypoint => waypoint.location);

  return (
    <Box sx={{ mb: 4 }}>
      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Route Summary</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="subtitle2">Original Distance</Typography>
              <Typography variant="body1">{routeData.originalDistance.toFixed(1)} km</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Optimized Distance</Typography>
              <Typography variant="body1">{routeData.optimizedDistance.toFixed(1)} km</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Fuel Savings</Typography>
              <Typography variant="body1">{routeData.fuelSavings.toFixed(1)} L</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Time Savings</Typography>
              <Typography variant="body1">{routeData.timeSavings.toFixed(0)} min</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2">Estimated Arrival</Typography>
              <Typography variant="body1">{formatTime(routeData.estimatedArrival)}</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {routeData.weatherAlerts.length > 0 && (
              <Chip 
                label={`${routeData.weatherAlerts.length} Weather Alerts`} 
                color="warning" 
                size="small"
              />
            )}
            {routeData.trafficAlerts.length > 0 && (
              <Chip 
                label={`${routeData.trafficAlerts.length} Traffic Alerts`} 
                color="error" 
                size="small"
              />
            )}
            {routeData.restStops.length > 0 && (
              <Chip 
                label={`${routeData.restStops.length} Rest Stops`} 
                color="info" 
                size="small"
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={6}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true
          }}
        >
          {/* Route Polyline */}
          <Polyline
            path={routePath}
            options={{
              strokeColor: '#4285F4',
              strokeWeight: 5,
              strokeOpacity: 0.8
            }}
          />

          {/* Waypoint Markers */}
          {routeData.optimizedWaypoints.map((waypoint, index) => {
            // Determine marker type
            let markerType: 'start' | 'end' | 'waypoint' | 'rest' = 'waypoint';
            if (index === 0) markerType = 'start';
            else if (index === routeData.optimizedWaypoints.length - 1) markerType = 'end';
            
            // Check if this is a rest stop
            const isRestStop = routeData.restStops.some(
              stop => Math.abs(stop.location.lat - waypoint.location.lat) < 0.001 && 
                      Math.abs(stop.location.lng - waypoint.location.lng) < 0.001
            );
            
            if (isRestStop) markerType = 'rest';
            
            return (
              <Marker
                key={`waypoint-${index}`}
                position={waypoint.location}
                icon={getMarkerIcon(markerType)}
                onClick={() => setSelectedMarker(index)}
              />
            );
          })}

          {/* Weather Alert Markers */}
          {routeData.weatherAlerts.map((alert, index) => (
            <Marker
              key={`weather-${index}`}
              position={alert.location}
              icon={getMarkerIcon('weather')}
              onClick={() => setSelectedMarker(1000 + index)} // Offset to distinguish from waypoints
            >
              {selectedMarker === 1000 + index && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <Box sx={{ p: 1, maxWidth: 200 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Weather Alert
                    </Typography>
                    <Typography variant="body2">{alert.condition}</Typography>
                    <Chip 
                      label={alert.severity.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        bgcolor: getSeverityColor(alert.severity),
                        color: 'white',
                        mt: 1
                      }} 
                    />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      {formatTime(alert.timeFrame.start)} - {formatTime(alert.timeFrame.end)}
                    </Typography>
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))}

          {/* Traffic Alert Markers */}
          {routeData.trafficAlerts.map((alert, index) => (
            <Marker
              key={`traffic-${index}`}
              position={alert.location}
              icon={getMarkerIcon('traffic')}
              onClick={() => setSelectedMarker(2000 + index)} // Offset to distinguish from other markers
            >
              {selectedMarker === 2000 + index && (
                <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
                  <Box sx={{ p: 1, maxWidth: 200 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Traffic Alert
                    </Typography>
                    <Typography variant="body2">{alert.description}</Typography>
                    <Typography variant="body2">
                      Delay: {alert.estimatedDelay} minutes
                    </Typography>
                    <Chip 
                      label={alert.severity.toUpperCase()} 
                      size="small" 
                      sx={{ 
                        bgcolor: getSeverityColor(alert.severity),
                        color: 'white',
                        mt: 1
                      }} 
                    />
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))}

          {/* InfoWindow for Waypoints */}
          {selectedMarker !== null && selectedMarker < 1000 && (
            <InfoWindow
              position={routeData.optimizedWaypoints[selectedMarker].location}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <Box sx={{ p: 1, maxWidth: 250 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {selectedMarker === 0 ? 'Starting Point' : 
                   selectedMarker === routeData.optimizedWaypoints.length - 1 ? 'Destination' : 
                   'Waypoint'}
                </Typography>
                <Typography variant="body2">{routeData.optimizedWaypoints[selectedMarker].address}</Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Estimated Arrival: {formatTime(routeData.optimizedWaypoints[selectedMarker].estimatedArrivalTime)}
                </Typography>
                
                {routeData.optimizedWaypoints[selectedMarker].stopDuration && (
                  <Typography variant="caption" display="block">
                    Stop Duration: {routeData.optimizedWaypoints[selectedMarker].stopDuration} minutes
                  </Typography>
                )}
              </Box>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default RouteOptimizationMap;