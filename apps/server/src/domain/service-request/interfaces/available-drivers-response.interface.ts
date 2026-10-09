import { VehicleType } from 'src/shared/enums/vehicle-type.enum';

export interface AvailableDriverCard {
    driverId: string;
    driverName: string;
    vehicle: VehicleType;
    vehicleNum: string;
    distance: number; // In (KM).
    fare: number;     //  Base Rate + (Distance * Per KM) dynamic cost mapping
}
