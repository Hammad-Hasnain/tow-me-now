import { ServiceStatus } from 'src/shared/enums/service-status.enum';

export interface AdminServiceRequestListItem {
    id: string;
    userId: string;
    userName: string;
    userPhone: string;
    driverId: string | null;
    driverName: string;
    driverPhone: string;
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
