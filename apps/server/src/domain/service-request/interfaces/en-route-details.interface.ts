import { ServiceStatus } from 'src/shared/enums/service-status.enum';
import { VehicleType } from 'src/shared/enums/vehicle-type.enum';

export interface EnRouteDetailsResponse {
    id: string;

    // Isolated Nested Driver Details Object
    driver: {
        name: string;
        phoneNum: string;
        vehicleType: VehicleType;
        vehicleNumber: string;
        currentLocation: {
            latitude: number | null;
            longitude: number | null;
            address: string | null;
        };
    } | null;

    // Isolated Nested User Details Object
    user: {
        name: string;
        phoneNum: string;
    };

    // Core Service Request parameters stay at root level
    vehicle: string;
    model: string;
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
    fare: number;
    status: ServiceStatus;
    createdAt: Date;
    updatedAt: Date;
}
