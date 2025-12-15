// src/features/RouteOptimization/utils/routeUtils.ts
import { Location, RouteSegment } from '../types';

/**
 * Calculate the total distance of a route
 */
export const calculateTotalDistance = (segments: RouteSegment[]): number => {
  return segments.reduce((total, segment) => total + segment.distance, 0);
};

/**
 * Calculate the total duration of a route
 */
export const calculateTotalDuration = (segments: RouteSegment[]): number => {
  return segments.reduce((total, segment) => total + segment.duration, 0);
};

/**
 * Format distance in meters to human-readable format
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${distanceInMeters.toFixed(0)} m`;
  }
  
  const kilometers = distanceInMeters / 1000;
  return `${kilometers.toFixed(1)} km`;
};

/**
 * Format duration in seconds to human-readable format
 */
export const formatDuration = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  
  return `${hours} hr ${minutes} min`;
};

/**
 * Get center coordinates for a map from a list of locations
 */
export const getMapCenter = (locations: Location[]) => {
  if (locations.length === 0) {
    return { latitude: 0, longitude: 0 };
  }
  
  const sumLat = locations.reduce((sum, loc) => sum + loc.coordinates.latitude, 0);
  const sumLng = locations.reduce((sum, loc) => sum + loc.coordinates.longitude, 0);
  
  return {
    latitude: sumLat / locations.length,
    longitude: sumLng / locations.length,
  };
};

/**
 * Calculate bounds for a map from a list of locations
 */
export const getMapBounds = (locations: Location[]) => {
  if (locations.length === 0) {
    return null;
  }
  
  let minLat = locations[0].coordinates.latitude;
  let maxLat = locations[0].coordinates.latitude;
  let minLng = locations[0].coordinates.longitude;
  let maxLng = locations[0].coordinates.longitude;
  
  locations.forEach(loc => {
    const { latitude, longitude } = loc.coordinates;
    minLat = Math.min(minLat, latitude);
    maxLat = Math.max(maxLat, latitude);
    minLng = Math.min(minLng, longitude);
    maxLng = Math.max(maxLng, longitude);
  });
  
  return {
    southwest: { latitude: minLat, longitude: minLng },
    northeast: { latitude: maxLat, longitude: maxLng },
  };
};