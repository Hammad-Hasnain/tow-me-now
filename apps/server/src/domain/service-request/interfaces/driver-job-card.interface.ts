import { ServiceStatus } from 'src/shared/enums/service-status.enum';

export interface DriverJobCard {
    id: string;
    userName: string;    // Extracted from $userData.name via $ifNull fallback
    vehicle: string;
    model: string;
    fare: number;
    problem: string;
    pickupLoc: {
        latitude: number;
        longitude: number;
        address: string;
    };
    dropoffLoc: {
        latitude: number;
        longitude: number;
        address: string;
    };
    status: ServiceStatus;
}
