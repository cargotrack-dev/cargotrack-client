// src/features/Core/types/common.ts
export interface Location {
    name: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    gpsCoordinates?: {
        latitude: number;
        longitude: number;
    };
}